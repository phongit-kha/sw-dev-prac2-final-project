import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { getBooks } from "@/libs/books";
import { attachBookCovers } from "@/libs/bookCovers";
import BooksListClient from "@/component/BooksListClient";

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
      <BooksListClient books={books} />
    </div>
  );
}
