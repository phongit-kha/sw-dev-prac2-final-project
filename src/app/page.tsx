import LibraryHero from "@/component/LibraryHero";
import BookHighlight from "@/component/BookHighlight";
import LibraryStats from "@/component/LibraryStats";
import LibraryWorkflow from "@/component/LibraryWorkflow";
import LibraryTestimonials from "@/component/LibraryTestimonials";
import { getBooks } from "@/libs/books";

export default async function HomePage() {
  const books = await getBooks();

  return (
    <div className="space-y-12">
      <LibraryHero totalBooks={books.length} />
      <BookHighlight books={books} />
      <LibraryStats />
      <LibraryWorkflow />
      <LibraryTestimonials />
      <section className="mx-auto max-w-6xl rounded-3xl border border-slate-100 bg-white px-8 py-10 text-slate-600 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">
          Requirement Highlights
        </h2>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <article className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4">
            <h3 className="text-sm font-semibold text-emerald-700">
              User Management
            </h3>
            <p className="mt-2 text-sm">
              Supports admin + member roles, credential-based NextAuth login, and JWT from p02-library.
            </p>
          </article>
          <article className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4">
            <h3 className="text-sm font-semibold text-emerald-700">
              Book Management
            </h3>
            <p className="mt-2 text-sm">
              Everyone can view books, while admins can add, edit, delete, and adjust stock.
            </p>
          </article>
          <article className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4">
            <h3 className="text-sm font-semibold text-emerald-700">
              Reservation Flow
            </h3>
            <p className="mt-2 text-sm">
              Members may create up to 3 reservations with the same borrow/pickup validation rules as the backend.
            </p>
          </article>
        </div>
      </section>
    </div>
  );
}
