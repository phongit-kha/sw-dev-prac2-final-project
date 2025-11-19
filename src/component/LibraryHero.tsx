import Link from "next/link";
import Image from "next/image";

interface Props {
  totalBooks: number;
}

export default function LibraryHero({ totalBooks }: Props) {
  return (
    <section className="bg-gradient-to-br from-emerald-50 via-white to-teal-50 py-20">
      <div className="mx-auto flex max-w-7xl flex-col gap-12 px-6 lg:flex-row lg:items-center">
        <div className="flex-1 space-y-6">
          <p className="inline-flex items-center rounded-full bg-white px-4 py-1 text-xs font-semibold text-emerald-600 shadow">
            Unified library reservation platform
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 lg:text-5xl">
            Discover, reserve, and manage every book in one place.
          </h1>
          <p className="text-lg text-slate-600">
            Access the entire collection, schedule pick-ups in advance, and keep
            members + admins synchronized in real time through the p02-library
            API.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/register"
              className="rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-100 hover:bg-emerald-600"
            >
              Get started
            </Link>
            <Link
              href="/login"
              className="rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 hover:border-emerald-500 hover:text-emerald-600"
            >
              Sign in
            </Link>
            <Link
              href="/demo"
              className="rounded-full bg-white/80 px-6 py-3 text-sm font-semibold text-emerald-600 shadow hover:bg-white"
            >
              Watch product video
            </Link>
          </div>
          <div className="flex gap-8 pt-6 text-sm text-slate-500">
            <div>
              <p className="text-3xl font-bold text-slate-900">{totalBooks}</p>
              <p>books synced with backend</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-slate-900">3</p>
              <p>active reservations per member</p>
            </div>
          </div>
        </div>
        <div className="flex-1">
          <div className="relative grid gap-4 sm:grid-cols-2">
            {[
              { src: "/covers/modern-classics.jpg", label: "Smart Queue" },
              { src: "/covers/design-forward.jpg", label: "Digital Shelf" },
              { src: "/covers/mindfulness.jpg", label: "Pick-up Calendar" },
              { src: "/covers/urban-travel.jpg", label: "Admin Insights" },
            ].map(({ src, label }, index) => (
              <div
                key={src}
                className={`relative h-48 rounded-3xl border border-white/70 shadow-2xl shadow-emerald-50 ${
                  index % 2 === 1 ? "translate-y-6" : ""
                }`}
              >
                <Image
                  src={src}
                  alt="book cover preview"
                  fill
                  className="rounded-3xl object-cover"
                />
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-3 left-4 text-sm font-semibold text-white">
                  {label}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-3xl border border-emerald-100 bg-white/90 p-6 shadow-2xl shadow-emerald-50 backdrop-blur">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-500">
                  Live sync
                </p>
                <p className="text-xl font-bold text-slate-900">
                  p02-library API
                </p>
              </div>
              <span className="rounded-full bg-emerald-600/10 px-3 py-1 text-xs font-semibold text-emerald-700">
                connected :5004
              </span>
            </div>
            <div className="mt-4 rounded-2xl bg-slate-900 p-4 text-xs text-emerald-100">
              <p className="font-mono text-slate-300">
                POST /api/v1/reservations
              </p>
              <pre className="mt-3 font-mono text-slate-200">
                {`{
  "borrowDate": "2025-02-01",
  "pickupDate": "2025-02-02",
  "book": "<BOOK_ID>"
}`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
