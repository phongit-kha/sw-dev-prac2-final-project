const metrics = [
  {
    value: "4,200+",
    label: "Active members",
    description: "Real-time reservation updates with automated email reminders.",
  },
  {
    value: "1,500",
    label: "Books ready to reserve",
    description: "English & Thai editions with curated cover art for every title.",
  },
  {
    value: "24/7",
    label: "Always available",
    description: "Members can submit requests any time without waiting in line.",
  },
];

const partners = ["Chula", "CMU", "KU", "KMITL", "PSU"];

export default function LibraryStats() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="grid gap-10 rounded-3xl border border-slate-100 bg-white/70 p-10 backdrop-blur">
        <div className="grid gap-8 md:grid-cols-3">
          {metrics.map((metric) => (
            <article key={metric.label} className="space-y-2">
              <p className="text-4xl font-bold text-slate-900">{metric.value}</p>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-500">
                {metric.label}
              </p>
              <p className="text-sm text-slate-500">{metric.description}</p>
            </article>
          ))}
        </div>
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 px-6 py-4 text-center text-sm text-slate-500">
          Trusted by{" "}
          {partners.map((partner, index) => (
            <span key={partner} className="font-semibold text-slate-700">
              {partner}
              {index < partners.length - 1 ? " • " : ""}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
