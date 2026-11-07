import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";
import {
  formatMenuDate,
  formatMoney,
  formatTime,
  getTodayMenu,
  isOrderingOpen,
  type TodayMenu,
} from "@/lib/api";

const steps = [
  {
    numeral: "01",
    title: "We cook one thing",
    body: "Announced at 9am. Whatever the market gave us and whatever the chef felt like.",
  },
  {
    numeral: "02",
    title: "You claim a portion",
    body: "Reserve online or walk in. When the counter hits zero, it hits zero.",
  },
  {
    numeral: "03",
    title: "Come back tomorrow",
    body: "Missed it? There's a different dish waiting. Regret is part of the flavor profile.",
  },
];

export default function Home() {
  return (
    <>
      <SiteHeader />

      <main className="mx-auto max-w-5xl px-5 sm:px-8">
        {/* Hero */}
        <section className="py-16 text-center sm:py-24">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-ember sm:text-sm">
            No menu &middot; No options &middot; No negotiations
          </p>
          <h1 className="mt-6 font-display text-5xl leading-[1.05] font-semibold text-balance sm:text-6xl lg:text-7xl">
            One dish a day.
            <br />
            <span className="italic text-ember">The restaurant decides.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base text-stone sm:text-lg">
            Every morning our kitchen picks a single dish and makes it until
            it&apos;s gone. You either get it, or you come back tomorrow.
            That&apos;s the whole deal.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              asChild
              className="h-auto w-full rounded-full bg-ember px-7 py-3 font-semibold text-white shadow-soft hover:bg-ink sm:w-auto"
            >
              <a href="#today">See today&apos;s dish</a>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-auto w-full rounded-full border-ink/20 px-7 py-3 font-semibold hover:border-ink sm:w-auto"
            >
              <a href="#how">How it works</a>
            </Button>
          </div>
          <p className="mt-10 font-display text-sm text-stone tabular-nums">
            Daily dish <span className="font-semibold text-ink">No. 042</span>{" "}
            &mdash; 41 sold out, 41 we were right about
          </p>
        </section>

        {/* Today's dish showcase */}
        <section id="today" className="pb-20 sm:pb-28">
          <Suspense fallback={<DishCardFallback />}>
            <TodayShowcase />
          </Suspense>
        </section>

        {/* How it works */}
        <section id="how" className="pb-20 sm:pb-28">
          <h2 className="text-center font-display text-3xl font-semibold sm:text-4xl">
            How it works
          </h2>
          <p className="mx-auto mt-3 max-w-md text-center text-stone">
            Three steps. We&apos;d have made it two, but you have to show up.
          </p>
          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {steps.map((step) => (
              <Card
                key={step.numeral}
                className="gap-0 rounded-2xl border-ink/5 bg-white p-7 shadow-soft transition-transform hover:-translate-y-1"
              >
                <CardHeader className="p-0">
                  <p className="font-display text-sm font-semibold text-ember tabular-nums">
                    {step.numeral}
                  </p>
                  <CardTitle className="mt-2 font-display text-xl font-semibold">
                    {step.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <p className="mt-2 text-sm leading-relaxed text-stone">
                    {step.body}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Manifesto strip */}
        <section className="pb-20 sm:pb-28">
          <div className="rounded-3xl bg-ink px-8 py-12 text-center text-cream sm:px-14 sm:py-16">
            <p className="mx-auto max-w-2xl font-display text-2xl leading-snug italic sm:text-3xl lg:text-4xl">
              &ldquo;A menu is a list of excuses. We serve one dish, done
              properly, until it&apos;s gone.&rdquo;
            </p>
            <p className="mt-5 text-sm tracking-[0.25em] text-cream/60 uppercase">
              The kitchen, every single morning
            </p>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="pb-20 text-center sm:pb-28">
          <h2 className="font-display text-3xl font-semibold sm:text-4xl">
            Tomorrow&apos;s dish: <span className="italic text-ember">unknown</span>
          </h2>
          <p className="mx-auto mt-3 max-w-md text-stone">
            Get one email a morning. The dish, the price, the count.
            That&apos;s it.
          </p>
          <form className="mx-auto mt-7 flex max-w-md flex-col justify-center gap-3 sm:flex-row">
            <Label htmlFor="email" className="sr-only">
              Email address
            </Label>
            <Input
              id="email"
              type="email"
              required
              placeholder="you@example.com"
              className="h-auto flex-1 rounded-full border-ink/20 bg-white px-5 py-3 text-sm focus-visible:border-ember"
            />
            <Button
              type="submit"
              className="h-auto rounded-full bg-ember px-7 py-3 font-semibold text-white hover:bg-ink"
            >
              Wake me up
            </Button>
          </form>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}

async function TodayShowcase() {
  let menu: TodayMenu | null = null;
  let menuError = false;

  try {
    menu = await getTodayMenu();
  } catch {
    menuError = true;
  }

  return menu ? <TodayDishCard menu={menu} /> : <NoDishCard unavailable={menuError} />;
}

function DishCardFallback() {
  return (
    <Card className="overflow-hidden rounded-3xl border-ink/5 bg-white shadow-soft">
      <div className="grid md:grid-cols-2">
        <div className="aspect-[4/3] bg-saffron/15 md:min-h-[420px]" />
        <div className="p-8 sm:p-12">
          <div className="h-4 w-32 rounded bg-sand/70" />
          <div className="mt-4 h-10 w-3/4 rounded bg-sand/70" />
          <div className="mt-6 h-20 rounded bg-sand/40" />
        </div>
      </div>
    </Card>
  );
}

function TodayDishCard({ menu }: { menu: TodayMenu }) {
  const { meal, ordering } = menu;
  const open = isOrderingOpen(ordering);
  const pickupWindow = [
    formatTime(ordering.pickup_window.start),
    formatTime(ordering.pickup_window.end),
  ]
    .filter(Boolean)
    .join("–");

  return (
    <Card className="overflow-hidden rounded-3xl border-ink/5 bg-white shadow-soft">
      <div className="grid md:grid-cols-2">
        <div className="relative aspect-[4/3] bg-saffron/20 md:aspect-auto md:min-h-[420px]">
          {meal.photo_url ? (
            <Image
              src={meal.photo_url}
              alt={meal.name}
              fill
              className="object-cover"
              sizes="(min-width: 768px) 50vw, 100vw"
              priority
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-display text-lg text-stone italic">
                Today&apos;s dish photo
              </span>
            </div>
          )}
          <Badge className="absolute top-4 left-4 rounded-full bg-ink px-3 py-1.5 text-xs font-semibold tracking-wider text-cream uppercase">
            {open ? "Ordering open" : "Ordering closed"}
          </Badge>
        </div>
        <div className="flex flex-col justify-center p-8 sm:p-12">
          <p className="text-xs font-semibold tracking-[0.25em] text-stone uppercase">
            Today, {formatMenuDate(meal.date)}
          </p>
          <h2 className="mt-3 font-display text-3xl leading-tight font-semibold sm:text-4xl lg:text-5xl">
            {meal.name}
          </h2>
          {meal.description && (
            <p className="mt-4 leading-relaxed text-stone">{meal.description}</p>
          )}
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <span className="rounded-full bg-ember/10 px-5 py-2 font-display text-2xl font-semibold text-ember tabular-nums">
              {formatMoney(meal.price)}
            </span>
            <span className="text-sm text-stone">
              Up to{" "}
              <span className="font-semibold text-ink tabular-nums">
                {meal.max_per_order}
              </span>{" "}
              per order
            </span>
          </div>

          {meal.extras.length > 0 && (
            <div className="mt-5">
              <p className="text-xs font-semibold tracking-[0.2em] text-stone uppercase">
                Extras
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {meal.extras.map((extra) => (
                  <span
                    key={extra.id}
                    className="rounded-full border border-ink/10 bg-sand/40 px-3 py-1.5 text-sm text-ink"
                  >
                    {extra.name}{" "}
                    <span className="text-stone tabular-nums">
                      {formatMoney(extra.price)}
                    </span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {open ? (
            <>
              <p className="mt-6 text-sm text-stone">
                Ordering open
                {ordering.pickup_open && pickupWindow
                  ? ` — pickup ${pickupWindow}`
                  : ""}
                {ordering.delivery_open ? " · delivery available" : ""}
                {!ordering.pickup_open && ordering.delivery_open
                  ? " (pickup closed)"
                  : ""}
                {ordering.pickup_open && !ordering.delivery_open
                  ? " (delivery closed)"
                  : ""}
                .
              </p>
              <Button
                asChild
                className="mt-4 h-auto self-start rounded-full bg-ink px-8 py-3.5 font-semibold text-cream hover:bg-ember"
              >
                <Link href="/order">Reserve today&apos;s dish</Link>
              </Button>
            </>
          ) : (
            <>
              <p className="mt-6 text-sm text-stone">
                Ordering closed — back at 9am tomorrow.
              </p>
              <Button
                disabled
                className="mt-4 h-auto self-start rounded-full bg-ink/20 px-8 py-3.5 font-semibold text-stone"
              >
                Reserve today&apos;s dish
              </Button>
            </>
          )}
          <p className="mt-3 text-xs text-stone">
            {pickupWindow ? `Pickup ${pickupWindow}. ` : ""}
            Miss it, and tomorrow&apos;s dish is a mystery too.
          </p>
        </div>
      </div>
    </Card>
  );
}

function NoDishCard({ unavailable }: { unavailable: boolean }) {
  return (
    <Card className="overflow-hidden rounded-3xl border-ink/5 bg-white shadow-soft">
      <div className="grid md:grid-cols-2">
        <div className="relative aspect-[4/3] bg-saffron/15 md:aspect-auto md:min-h-[320px]">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-display text-lg text-stone italic">
              No dish photo today
            </span>
          </div>
        </div>
        <div className="flex flex-col justify-center p-8 sm:p-12">
          <p className="text-xs font-semibold tracking-[0.25em] text-stone uppercase">
            Today
          </p>
          <h2 className="mt-3 font-display text-3xl leading-tight font-semibold sm:text-4xl">
            No dish today — see you at 9am
          </h2>
          <p className="mt-4 leading-relaxed text-stone">
            {unavailable
              ? "We couldn’t reach the kitchen menu right now. Try again in a moment."
              : "The kitchen hasn’t published today’s dish yet. Check back at 9am."}
          </p>
          <Button
            asChild
            variant="outline"
            className="mt-8 h-auto self-start rounded-full border-ink/20 px-8 py-3.5 font-semibold hover:border-ink"
          >
            <a href="#how">How it works</a>
          </Button>
        </div>
      </div>
    </Card>
  );
}
