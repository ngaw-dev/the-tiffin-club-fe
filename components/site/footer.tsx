export function SiteFooter() {
  return (
    <footer className="border-t border-ink/10">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-5 py-8 text-sm text-stone sm:flex-row sm:px-8">
        <p className="font-display font-semibold text-ink">
          One Dish<span className="text-ember">.</span>
        </p>
        <p className="tabular-nums">
          No. 042 served today &middot; No. 043 tomorrow
        </p>
        <div className="flex gap-5">
          <a href="#" className="transition-colors hover:text-ink">
            Instagram
          </a>
          <a href="#" className="transition-colors hover:text-ink">
            Contact
          </a>
        </div>
      </div>
    </footer>
  )
}
