import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { getBooks } from "@/libs/books";
import { attachBookCovers } from "@/libs/bookCovers";
import Image from "next/image";

export default async function MemberBooksPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.token) {
    redirect("/login?callbackUrl=/member/books");
  }

  const books = attachBookCovers(await getBooks(session.user.token));

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-500">
          Member
        </p>
        <h1 className="text-3xl font-bold text-slate-900">All books</h1>
        <p className="text-sm text-slate-500">
          Data pulled directly from `/api/v1/books`.
        </p>
      </div>
      <div className="grid gap-8 md:grid-cols-2">
        {books.map((book) => (
          <article
            key={book._id}
            className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-lg transition hover:-translate-y-1 hover:shadow-2xl"
          >
            <div className="relative h-60 w-full">
              <Image
                src={book.coverPicture || "/covers/modern-classics.jpg"}
                alt={book.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-800">
                ISBN {book.ISBN}
              </div>
              <div className="absolute bottom-4 right-4 rounded-full bg-emerald-500/90 px-3 py-1 text-xs font-semibold text-white">
                {book.availableAmount} left
              </div>
            </div>
            <div className="space-y-3 px-6 py-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-500">
                  {book.publisher}
                </p>
                <h2 className="text-2xl font-semibold text-slate-900">
                  {book.title}
                </h2>
                <p className="text-sm text-slate-500">by {book.author}</p>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-2 text-sm text-slate-600">
                <span>
                  Updated{" "}
                  {book.updatedAt
                    ? new Date(book.updatedAt).toLocaleDateString()
                    : "-"}
                </span>
                <a
                  href="/member/reservations"
                  className="text-emerald-600 hover:text-emerald-700"
                >
                  Reserve this book →
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
