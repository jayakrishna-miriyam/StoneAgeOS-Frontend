export function TopBar() {
  return (
    <header className="h-16 border-b border-outline-variant bg-surface-container/60 backdrop-blur-md flex items-center justify-end px-6 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end hidden sm:flex">
            <span className="text-xs font-display font-bold text-primary uppercase tracking-widest">Chief Hunter</span>
            <span className="text-[10px] text-on-surface-variant uppercase tracking-tighter">Level 42 Nomad</span>
          </div>
          <div className="w-10 h-10 rounded-full border-2 border-primary/30 p-0.5 overflow-hidden bg-surface-container">
            <div className="w-full h-full rounded-full bg-primary/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl text-primary">person</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
