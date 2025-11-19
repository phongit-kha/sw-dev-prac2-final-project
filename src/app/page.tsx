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
    </div>
  );
}
