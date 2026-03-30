export default function CatalogueFooter() {
  return (
    <footer className="mt-12 pt-7 border-t border-outline-variant/20 flex flex-col md:flex-row md:items-center md:justify-between gap-5 text-xs text-on-surface-variant font-body">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" aria-hidden />
        <span>
          System status: <span className="font-semibold text-on-surface">Operational</span> · Smart Campus API
        </span>
      </div>
      <nav className="flex flex-wrap gap-x-5 gap-y-2">
        <button type="button" className="hover:text-primary transition-colors text-left">
          Privacy
        </button>
        <button type="button" className="hover:text-primary transition-colors text-left">
          Usage logs
        </button>
        <button type="button" className="hover:text-primary transition-colors text-left">
          API docs
        </button>
      </nav>
    </footer>
  );
}
