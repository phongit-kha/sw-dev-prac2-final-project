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
            Library reservation suite
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 lg:text-5xl">
            Manage collections, reservations, and pick-ups without the busywork.
          </h1>
          <p className="text-lg text-slate-600">
            Give patrons real-time availability, automate pick-up scheduling, and keep librarians aligned with the same operational dashboard.
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
          </div>
          <div className="flex gap-8 pt-6 text-sm text-slate-500">
            <div>
              <p className="text-3xl font-bold text-slate-900">{totalBooks}</p>
              <p>titles live in catalog</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-slate-900">3</p>
              <p>reservations per member by policy</p>
            </div>
          </div>
        </div>
        <div className="flex-1">
          <div className="relative grid gap-4 sm:grid-cols-2">
            {[
              { src: "/covers/smart-queue.jpg", label: "Smart Queue" },
              { src: "/covers/digital-shelf.jpg", label: "Digital Shelf" },
              { src: "/covers/pickup-calendar.jpeg", label: "Pick-up Calendar" },
              { src: "/covers/admin-insight.jpeg", label: "Admin Insights" },
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
        </div>
      </div>
    </section>
  );
}
