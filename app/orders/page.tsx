"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";
import {
  formatMoney,
  formatOrderedAt,
  type ApiErrorEnvelope,
  type OrderSummary,
} from "@/lib/api";

type LookupState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "not-found"; message: string }
  | { status: "success"; order: OrderSummary };

export default function OrdersPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [state, setState] = useState<LookupState>({ status: "idle" });

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = orderNumber.trim();
    if (!value) return;

    setState({ status: "loading" });
    try {
      const response = await fetch(`/api/orders/${encodeURIComponent(value)}`, {
        headers: { Accept: "application/json" },
      });
      const json = (await response.json()) as
        | { data?: OrderSummary }
        | ApiErrorEnvelope;

      if (!response.ok) {
        const envelope = json as ApiErrorEnvelope;
        if (response.status === 404) {
          setState({
            status: "not-found",
            message: envelope.message || "Order not found.",
          });
          return;
        }
        setState({
          status: "error",
          message: envelope.message || "Could not load that order.",
        });
        return;
      }

      const data = (json as { data?: OrderSummary }).data;
      if (!data) {
        setState({ status: "error", message: "Unexpected response." });
        return;
      }
      setState({ status: "success", order: data });
    } catch {
      setState({ status: "error", message: "Could not reach the server." });
    }
  }

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-5 py-12 sm:px-8 sm:py-16">
        <h1 className="font-display text-4xl font-semibold sm:text-5xl">
          Find your order
        </h1>
        <p className="mt-3 max-w-xl text-stone">
          Enter the order number from your confirmation to see its status and
          details.
        </p>

        <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-3 sm:flex-row">
          <div className="flex-1">
            <Label htmlFor="order-number" className="sr-only">
              Order number
            </Label>
            <Input
              id="order-number"
              value={orderNumber}
              onChange={(event) => setOrderNumber(event.target.value)}
              placeholder="e.g. TB-000123"
              autoComplete="off"
              className="h-12 rounded-xl border-ink/15 bg-white px-4 text-base focus-visible:border-ember focus-visible:ring-ember/20"
            />
          </div>
          <Button
            type="submit"
            disabled={state.status === "loading"}
            className="h-12 rounded-full bg-ember px-7 font-semibold text-white hover:bg-ink"
          >
            {state.status === "loading" ? "Looking up…" : "Look up order"}
          </Button>
        </form>

        {state.status === "not-found" && (
          <Card className="mt-8 rounded-2xl border-ink/10 bg-sand/40 shadow-card">
            <CardContent className="p-6 text-stone">{state.message}</CardContent>
          </Card>
        )}

        {state.status === "error" && (
          <Card className="mt-8 rounded-2xl border-destructive/20 bg-white shadow-card">
            <CardContent className="p-6 text-sm text-destructive">
              {state.message}
            </CardContent>
          </Card>
        )}

        {state.status === "success" && <OrderCard order={state.order} />}
      </main>
      <SiteFooter />
    </>
  );
}

function OrderCard({ order }: { order: OrderSummary }) {
  return (
    <Card className="mt-8 overflow-hidden rounded-3xl border-ink/5 bg-white shadow-soft">
      <CardHeader className="gap-2 border-b border-ink/5 p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-3">
          <CardTitle className="font-display text-2xl font-semibold tabular-nums">
            {order.order_number}
          </CardTitle>
          <Badge className="rounded-full bg-ink px-3 py-1 text-[11px] font-semibold tracking-wider text-cream uppercase">
            {order.status}
          </Badge>
          <Badge
            variant="secondary"
            className="rounded-full px-3 py-1 text-[11px] font-semibold tracking-wider uppercase"
          >
            {order.fulfilment_type}
          </Badge>
        </div>
        <p className="text-sm text-stone">
          Ordered {formatOrderedAt(order.ordered_at)}
        </p>
      </CardHeader>
      <CardContent className="space-y-6 p-6 sm:p-8">
        <dl className="grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="font-medium text-stone">Name</dt>
            <dd className="mt-0.5 text-ink">{order.customer_name}</dd>
          </div>
          <div>
            <dt className="font-medium text-stone">Email</dt>
            <dd className="mt-0.5 text-ink">{order.customer_email}</dd>
          </div>
          <div>
            <dt className="font-medium text-stone">Phone</dt>
            <dd className="mt-0.5 text-ink">{order.customer_phone}</dd>
          </div>
          <div>
            <dt className="font-medium text-stone">Payment</dt>
            <dd className="mt-0.5 text-ink">{order.payment_method ?? "—"}</dd>
          </div>
          {order.delivery_address && (
            <div className="sm:col-span-2">
              <dt className="font-medium text-stone">Delivery address</dt>
              <dd className="mt-0.5 text-ink">{order.delivery_address}</dd>
            </div>
          )}
        </dl>

        <div className="overflow-hidden rounded-2xl border border-ink/10">
          <table className="w-full text-sm">
            <thead className="bg-sand/50 text-left text-stone">
              <tr>
                <th className="px-4 py-3 font-medium">Item</th>
                <th className="px-4 py-3 font-medium text-right">Qty</th>
                <th className="px-4 py-3 font-medium text-right">Unit</th>
                <th className="px-4 py-3 font-medium text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, index) => (
                <tr key={`${item.name}-${index}`} className="border-t border-ink/5">
                  <td className="px-4 py-3">
                    <span className="font-medium text-ink">{item.name}</span>
                    <span className="ml-2 text-xs text-stone uppercase">
                      {item.item_type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    {item.quantity}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    {formatMoney(item.unit_price)}
                  </td>
                  <td className="px-4 py-3 text-right font-medium tabular-nums">
                    {formatMoney(item.line_total)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-ink/10 bg-sand/30">
                <td colSpan={3} className="px-4 py-3 font-semibold text-ink">
                  Order total
                </td>
                <td className="px-4 py-3 text-right font-display text-lg font-semibold text-ember tabular-nums">
                  {formatMoney(order.order_total)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
