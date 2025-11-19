import Link from "next/link";

const videoUrl = "https://www.youtube.com/embed/PyMlV5_HRWk";

export default function DemoPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-12 space-y-8">
      <div className="space-y-4 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-emerald-500">
          Product demo
        </p>
        <h1 className="text-4xl font-bold text-slate-900">
          See LibReserve in action
        </h1>
        <p className="text-sm text-slate-500">
          Walk through the full reservation journey, from browsing books to
          approving member requests.
        </p>
      </div>
      <div className="aspect-video overflow-hidden rounded-3xl border border-slate-200 shadow-2xl">
        <iframe
          src={videoUrl}
          title="LibReserve demo video"
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
        <Link
          href="/register"
          className="rounded-full bg-emerald-500 px-6 py-3 font-semibold text-white hover:bg-emerald-600"
        >
          Create an account
        </Link>
        <Link
          href="/member/books"
          className="rounded-full border border-slate-200 px-6 py-3 font-semibold text-slate-700 hover:border-emerald-500 hover:text-emerald-600"
        >
          Explore the catalog
        </Link>
      </div>
    </div>
  );
}
