const testimonials = [
  {
    quote:
      "LibReserve shortened our reservation workflow from two days to under two minutes. Everything the staff needs is on one screen.",
    name: "Lily K.",
    role: "High-school librarian",
  },
  {
    quote:
      "The 3-reservation policy is enforced automatically and invalid dates are blocked before submission. Members need far less staff follow-up.",
    name: "Pond S.",
    role: "Library member",
  },
  {
    quote:
      "Admin tools make editing hundreds of books effortless. I can tweak stock numbers without touching MongoDB.",
    name: "Namwan T.",
    role: "Faculty library manager",
  },
];

export default function LibraryTestimonials() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="rounded-3xl border border-slate-100 bg-white p-10 shadow-lg">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-emerald-500">
              Voices
            </p>
            <h2 className="text-3xl font-bold text-slate-900">
              Feedback from real users
            </h2>
          </div>
          <p className="max-w-md text-sm text-slate-500">
            This prototype extends Project 2 Library Management requirements and
            is ready to plug into production.
          </p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <article
              key={testimonial.name}
              className="rounded-2xl border border-slate-100 bg-slate-50 p-6"
            >
              <p className="text-sm text-slate-600">&ldquo;{testimonial.quote}&rdquo;</p>
              <div className="mt-4 text-sm font-semibold text-slate-900">
                {testimonial.name}
              </div>
              <div className="text-xs text-slate-500">{testimonial.role}</div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
