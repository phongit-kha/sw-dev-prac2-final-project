import Image from "next/image";
import type { Book } from "@interfaces";
import Link from "next/link";
import { attachBookCovers } from "@/libs/bookCovers";

interface Props {
  books: Book[];
}

export default function BookHighlight({ books }: Props) {
  const booksWithCover = attachBookCovers(books);
  if (!books.length) {
    return (
      <div className="mx-auto max-w-6xl rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center text-slate-500">
        No books available yet
      </div>
    );
  }

  return (
    <section className="mx-auto mt-12 max-w-6xl px-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">
            Spotlight titles for this week
          </h2>
          <p className="text-slate-500">
            Curated straight from your live catalog.
          </p>
        </div>
        <Link
          href="/member/books"
          className="text-sm font-semibold text-emerald-600 hover:text-emerald-700"
        >
          View all →
        </Link>
      </div>
      <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {booksWithCover.slice(0, 6).map((book) => (
          <article
            key={book._id}
            className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="flex items-start gap-4">
              <div className="relative flex h-20 w-16 items-center justify-center overflow-hidden rounded-2xl bg-slate-100">
                {book.coverPicture ? (
                  <Image
                    src={book.coverPicture}
                    alt={book.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <span className="text-3xl font-black text-slate-400">
                    {book.title.slice(0, 1).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-500">
                  {book.publisher}
                </p>
                <h3 className="text-lg font-semibold text-slate-900">
                  {book.title}
                </h3>
                <p className="text-sm text-slate-500">{book.author}</p>
                <p className="text-xs font-semibold text-slate-500">
                ISBN: {book.ISBN}
                </p>
                <p className="text-xs text-slate-500">
                  {book.availableAmount} copies available
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
