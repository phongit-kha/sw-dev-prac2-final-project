import BookForm from "@/component/BookForm";
import BookManagementTable from "@/component/BookManagementTable";
import CSVBookUpload from "@/component/CSVBookUpload";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { getBooks } from "@/libs/books";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function AdminBooksPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.token) {
    redirect("/login?callbackUrl=/admin/books");
  }
  if (session.user.role !== "admin") {
    redirect("/member/books");
  }

  const books = await getBooks(session.user.token);

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-500">
          Admin
        </p>
        <h1 className="text-3xl font-bold text-slate-900">Manage books</h1>
        <p className="text-sm text-slate-500">
          Create, edit, delete titles via the `/api/v1/books` endpoints.
        </p>
      </div>
      <CSVBookUpload token={session.user.token} />
      <BookForm token={session.user.token} />
      <BookManagementTable books={books} token={session.user.token} />
    </div>
  );
}
