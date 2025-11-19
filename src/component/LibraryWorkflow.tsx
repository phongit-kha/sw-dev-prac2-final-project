const steps = [
  {
    step: "01",
    title: "Browse catalog",
    description:
      "Review every title from the member dashboard with real covers and live availability.",
  },
  {
    step: "02",
    title: "Create request",
    description:
      "Pick borrow/pickup dates and let the system validate them using the same rules as the backend.",
  },
  {
    step: "03",
    title: "Track status",
    description:
      "Monitor approvals, edit or cancel reservations, and stay in sync with admin decisions.",
  },
];

export default function LibraryWorkflow() {
  return (
    <section className="bg-slate-900 py-16 text-white">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.5em] text-emerald-300">
              Flow
            </p>
            <h2 className="text-3xl font-bold">Member workflow</h2>
          </div>
          <p className="max-w-md text-sm text-slate-300">
            Built for mobile with real-time sync via the p02-library backend.
          </p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {steps.map((item) => (
            <article
              key={item.step}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur"
            >
              <span className="text-6xl font-black text-white/30">
                {item.step}
              </span>
              <h3 className="mt-6 text-xl font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-slate-200">{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
