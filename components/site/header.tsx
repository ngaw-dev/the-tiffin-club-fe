import { Button } from "@/components/ui/button"

export function SiteHeader() {
  return (
    <header className="border-b border-ink/10">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-5 sm:px-8">
        <a
          href="#"
          className="font-display text-2xl font-semibold tracking-tight"
        >
          One Dish<span className="text-ember">.</span>
        </a>
        <nav className="flex items-center gap-6 text-sm font-medium text-stone">
          <a href="#today" className="transition-colors hover:text-ink">
            Today
          </a>
          <a href="#how" className="transition-colors hover:text-ink">
            How it works
          </a>
          <Button
            asChild
            className="h-auto rounded-full bg-ink px-4 py-2 text-sm font-medium text-cream hover:bg-ember"
          >
            <a href="#">Order today&apos;s dish</a>
          </Button>
        </nav>
      </div>
    </header>
  )
}
