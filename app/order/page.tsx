import Link from "next/link";
import { Suspense } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";
import { getTodayMenu } from "@/lib/api";
import { OrderForm } from "./order-form";

export default function OrderPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-2xl px-5 py-12 sm:px-8 sm:py-16">
        <h1 className="font-display text-4xl font-semibold sm:text-5xl">
          Reserve today&apos;s dish
        </h1>
        <Suspense
          fallback={
            <Card className="mt-8 rounded-2xl border-ink/10 bg-white shadow-card">
              <CardContent className="p-6 text-stone">Loading today’s menu…</CardContent>
            </Card>
          }
        >
          <OrderContent />
        </Suspense>
      </main>
      <SiteFooter />
    </>
  );
}

async function OrderContent() {
  let menu = null;
  let error = false;
  try {
    menu = await getTodayMenu();
  } catch {
    error = true;
  }

  if (!menu) {
    return (
      <>
        <p className="mt-3 text-stone">Today’s order window needs a published dish.</p>
        <Card className="mt-8 rounded-2xl border-ink/10 bg-sand/40 shadow-card">
          <CardContent className="space-y-3 p-6 text-stone">
            <p>
              {error
                ? "We couldn’t load today’s menu right now. Please try again shortly."
                : "No dish has been published for today. Check back at 9am."}
            </p>
            <Link href="/" className="inline-block font-medium text-ember hover:text-ink">
              Back to home
            </Link>
          </CardContent>
        </Card>
      </>
    );
  }

  return (
    <>
      <p className="mt-3 text-stone">You’re ordering {menu.meal.name}.</p>
      <OrderForm menu={menu} />
    </>
  );
}
