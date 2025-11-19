import type { Book } from "@interfaces";

const coverMap: Record<string, string> = {
  "atomic habits": "/covers/modern-classics.jpg",
  "deep work": "/covers/cyber-theory.jpg",
  "design patterns": "/covers/design-forward.jpg",
  "introduction to algorithms": "/covers/cyber-theory.jpg",
  "the psychology of money": "/covers/mindfulness.jpg",
  "zero to one": "/covers/urban-travel.jpg",
  "sapiens": "/covers/cafe-tales.jpg",
};

const fallbackCovers = [
  "/covers/modern-classics.jpg",
  "/covers/design-forward.jpg",
  "/covers/cafe-tales.jpg",
  "/covers/mindfulness.jpg",
  "/covers/urban-travel.jpg",
  "/covers/cyber-theory.jpg",
];

export function attachBookCovers(books: Book[]): Book[] {
  return books.map((book, index) => attachBookCover(book, index));
}

export function attachBookCover(book: Book, index = 0): Book {
  const key = book.title?.toLowerCase();
  const cover =
    book.coverPicture ||
    (key ? coverMap[key] : undefined) ||
    fallbackCovers[index % fallbackCovers.length];
  return { ...book, coverPicture: cover };
}
