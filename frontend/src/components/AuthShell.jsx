export default function AuthShell({ title, subtitle, children, wide = false }) {
  return (
    <div className="grid min-h-[calc(100vh-220px)] lg:grid-cols-2">
      <div
        className="relative hidden min-h-[420px] bg-cover bg-center lg:block"
        style={{ backgroundImage: "url('/images/hero.jpg')" }}
      >
        <div className="absolute inset-0 bg-navy-950/55" />
        <div className="relative z-10 flex h-full flex-col justify-end p-10 text-white">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-white/80">HomeLuxe</p>
          <h2 className="mt-3 max-w-md text-4xl font-extrabold leading-tight">Find your perfect home.</h2>
          <p className="mt-3 max-w-sm text-sm text-white/80">
            Browse verified listings, apply online, and manage rentals in one place.
          </p>
        </div>
      </div>
      <div className="flex items-center justify-center px-4 py-12">
        <div className={`w-full ${wide ? "max-w-xl" : "max-w-md"}`}>
          <p className="eyebrow">HomeLuxe</p>
          <h1 className="mt-2 text-3xl font-extrabold text-navy-900">{title}</h1>
          <p className="mt-2 text-slate-500">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
