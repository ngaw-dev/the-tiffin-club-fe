"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  formatMoney,
  isOrderingOpen,
  type ApiErrorEnvelope,
  type OrderSummary,
  type TodayMenu,
} from "@/lib/api";

type FieldErrors = Record<string, string[]>;

const fieldClassName =
  "h-12 rounded-xl border-ink/15 bg-white px-4 text-base focus-visible:border-ember focus-visible:ring-ember/20";

function fieldError(errors: FieldErrors | null, name: string): string | null {
  const messages = errors?.[name];
  return messages?.[0] ?? null;
}

export function OrderForm({ menu }: { menu: TodayMenu }) {
  const { meal, ordering } = menu;
  const open = isOrderingOpen(ordering);
  const [quantity, setQuantity] = useState(1);
  const [extraQuantities, setExtraQuantities] = useState<Record<number, boolean>>(
    {},
  );
  const [fulfilmentType, setFulfilmentType] = useState<"pickup" | "delivery">(
    ordering.pickup_open ? "pickup" : "delivery",
  );
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card_on_handover">(
    "cash",
  );
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<FieldErrors | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [result, setResult] = useState<OrderSummary | null>(null);

  const total = useMemo(() => {
    let amount = Number(meal.price) * quantity;
    for (const extra of meal.extras) {
      if (extraQuantities[extra.id]) amount += Number(extra.price);
    }
    return amount;
  }, [extraQuantities, meal.extras, meal.price, quantity]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setErrors(null);
    setMessage(null);

    const items: Array<{ item_type: string; extra_id?: number; quantity: number }> = [
      { item_type: "meal", quantity },
    ];
    for (const extra of meal.extras) {
      if (extraQuantities[extra.id]) {
        items.push({ item_type: "extra", extra_id: extra.id, quantity: 1 });
      }
    }

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          items,
          fulfilment_type: fulfilmentType,
          customer_name: customerName,
          customer_email: customerEmail,
          customer_phone: customerPhone,
          delivery_address:
            fulfilmentType === "delivery" ? deliveryAddress : undefined,
          payment_method: paymentMethod,
        }),
      });
      const json = (await response.json()) as
        | { data?: OrderSummary }
        | ApiErrorEnvelope;

      if (!response.ok) {
        const envelope = json as ApiErrorEnvelope;
        if (response.status === 429) {
          setMessage("Too many attempts, try again shortly.");
        } else if (response.status === 422) {
          setErrors(envelope.errors ?? null);
          setMessage(envelope.message || "Please check the form.");
        } else {
          setMessage(envelope.message || "Could not place your order.");
        }
        return;
      }

      const data = (json as { data?: OrderSummary }).data;
      if (!data) {
        setMessage("Unexpected response from the server.");
        return;
      }
      setResult(data);
    } catch {
      setMessage("Could not reach the server.");
    } finally {
      setSubmitting(false);
    }
  }

  if (result) {
    return (
      <Card className="mt-8 overflow-hidden rounded-3xl border-ink/5 bg-white shadow-soft">
        <CardContent className="space-y-4 p-8">
          <Badge className="rounded-full bg-ember/10 px-3 py-1 text-xs font-semibold tracking-wider text-ember uppercase">
            Order placed
          </Badge>
          <h2 className="font-display text-3xl font-semibold">
            Order{" "}
            <span className="text-ember tabular-nums">{result.order_number}</span>
          </h2>
          <p className="text-stone">
            We&apos;ve received your order for{" "}
            <span className="font-medium text-ink">{meal.name}</span>. Total{" "}
            <span className="font-medium tabular-nums text-ink">
              {formatMoney(result.order_total)}
            </span>
            .
          </p>
          <p className="text-sm text-stone">
            Keep your order number handy — you can look it up on the{" "}
            <a href="/orders" className="font-medium text-ember hover:text-ink">
              order lookup
            </a>{" "}
            page.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!open) {
    return (
      <Card className="mt-8 rounded-2xl border-ink/10 bg-sand/40 shadow-card">
        <CardContent className="p-6 text-stone">
          Ordering is closed right now. Check back at 9am tomorrow.
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-6">
      {message && (
        <div className="rounded-xl border border-destructive/20 bg-white px-4 py-3 text-sm text-destructive">
          {message}
        </div>
      )}

      <Card className="rounded-2xl border-ink/5 bg-white shadow-card">
        <CardContent className="space-y-5 p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-display text-xl font-semibold">{meal.name}</p>
              <p className="mt-1 text-sm text-stone">{formatMoney(meal.price)} each</p>
            </div>
            <div className="w-28">
              <Label htmlFor="quantity" className="text-sm font-semibold">
                Quantity
              </Label>
              <Input
                id="quantity"
                type="number"
                min={1}
                max={meal.max_per_order}
                value={quantity}
                onChange={(event) =>
                  setQuantity(
                    Math.min(
                      meal.max_per_order,
                      Math.max(1, Number(event.target.value) || 1),
                    ),
                  )
                }
                className={`${fieldClassName} mt-1.5 tabular-nums`}
              />
            </div>
          </div>

          {meal.extras.length > 0 && (
            <fieldset className="space-y-3">
              <legend className="text-sm font-semibold">Extras</legend>
              {meal.extras.map((extra) => (
                <label
                  key={extra.id}
                  className="flex cursor-pointer items-center gap-3 rounded-xl border border-ink/10 bg-sand/20 px-4 py-3"
                >
                  <input
                    type="checkbox"
                    checked={Boolean(extraQuantities[extra.id])}
                    onChange={(event) =>
                      setExtraQuantities((current) => ({
                        ...current,
                        [extra.id]: event.target.checked,
                      }))
                    }
                    className="size-4 accent-[var(--color-ember)]"
                  />
                  <span className="flex-1 text-sm text-ink">{extra.name}</span>
                  <span className="text-sm text-stone tabular-nums">
                    {formatMoney(extra.price)}
                  </span>
                </label>
              ))}
            </fieldset>
          )}

          <p className="text-sm text-stone">
            Estimated total{" "}
            <span className="font-display text-lg font-semibold text-ember tabular-nums">
              {formatMoney(total)}
            </span>
          </p>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-ink/5 bg-white shadow-card">
        <CardContent className="space-y-5 p-6">
          <fieldset className="space-y-3">
            <legend className="text-sm font-semibold">Fulfilment</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-ink/10 px-4 py-3">
                <input
                  type="radio"
                  name="fulfilment"
                  value="pickup"
                  checked={fulfilmentType === "pickup"}
                  onChange={() => setFulfilmentType("pickup")}
                  disabled={!ordering.pickup_open}
                  className="accent-[var(--color-ember)]"
                />
                <span className={!ordering.pickup_open ? "text-stone" : "text-ink"}>
                  Pickup {!ordering.pickup_open ? "(closed)" : ""}
                </span>
              </label>
              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-ink/10 px-4 py-3">
                <input
                  type="radio"
                  name="fulfilment"
                  value="delivery"
                  checked={fulfilmentType === "delivery"}
                  onChange={() => setFulfilmentType("delivery")}
                  disabled={!ordering.delivery_open}
                  className="accent-[var(--color-ember)]"
                />
                <span className={!ordering.delivery_open ? "text-stone" : "text-ink"}>
                  Delivery {!ordering.delivery_open ? "(closed)" : ""}
                </span>
              </label>
            </div>
            {fieldError(errors, "fulfilment_type") && (
              <p className="text-sm text-destructive">
                {fieldError(errors, "fulfilment_type")}
              </p>
            )}
          </fieldset>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label htmlFor="customer_name" className="text-sm font-semibold">
                Name
              </Label>
              <Input
                id="customer_name"
                value={customerName}
                onChange={(event) => setCustomerName(event.target.value)}
                required
                className={`${fieldClassName} mt-1.5`}
              />
              {fieldError(errors, "customer_name") && (
                <p className="mt-1 text-sm text-destructive">
                  {fieldError(errors, "customer_name")}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="customer_email" className="text-sm font-semibold">
                Email
              </Label>
              <Input
                id="customer_email"
                type="email"
                value={customerEmail}
                onChange={(event) => setCustomerEmail(event.target.value)}
                required
                className={`${fieldClassName} mt-1.5`}
              />
              {fieldError(errors, "customer_email") && (
                <p className="mt-1 text-sm text-destructive">
                  {fieldError(errors, "customer_email")}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="customer_phone" className="text-sm font-semibold">
                Phone
              </Label>
              <Input
                id="customer_phone"
                type="tel"
                value={customerPhone}
                onChange={(event) => setCustomerPhone(event.target.value)}
                required
                className={`${fieldClassName} mt-1.5`}
              />
              {fieldError(errors, "customer_phone") && (
                <p className="mt-1 text-sm text-destructive">
                  {fieldError(errors, "customer_phone")}
                </p>
              )}
            </div>
            {fulfilmentType === "delivery" && (
              <div className="sm:col-span-2">
                <Label htmlFor="delivery_address" className="text-sm font-semibold">
                  Delivery address
                </Label>
                <Input
                  id="delivery_address"
                  value={deliveryAddress}
                  onChange={(event) => setDeliveryAddress(event.target.value)}
                  required={fulfilmentType === "delivery"}
                  className={`${fieldClassName} mt-1.5`}
                />
                {fieldError(errors, "delivery_address") && (
                  <p className="mt-1 text-sm text-destructive">
                    {fieldError(errors, "delivery_address")}
                  </p>
                )}
              </div>
            )}
            <div className="sm:col-span-2">
              <Label htmlFor="payment_method" className="text-sm font-semibold">
                Payment method
              </Label>
              <select
                id="payment_method"
                value={paymentMethod}
                onChange={(event) =>
                  setPaymentMethod(
                    event.target.value as "cash" | "card_on_handover",
                  )
                }
                className={`${fieldClassName} mt-1.5 w-full`}
              >
                <option value="cash">Cash</option>
                <option value="card_on_handover">Card on handover</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {fieldError(errors, "items") && (
        <p className="text-sm text-destructive">{fieldError(errors, "items")}</p>
      )}

      <Button
        type="submit"
        disabled={submitting}
        className="h-12 w-full rounded-full bg-ember px-8 font-semibold text-white hover:bg-ink sm:w-auto"
      >
        {submitting ? "Placing order…" : "Place order"}
      </Button>
    </form>
  );
}
