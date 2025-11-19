import type { Book } from "@interfaces";

const coverMap: Record<string, string> = {};

const fallbackCover = "/images/book-cover.jpg";

export function attachBookCovers(books: Book[]): Book[] {
  return books.map((book, index) => attachBookCover(book, index)!);
}

export function attachBookCover(book: Book | null | undefined, index = 0): Book | null {
  if (!book) {
    return null;
  }
  const key = book.title?.toLowerCase();
  const cover =
    book.coverPicture ||
    (key ? coverMap[key] : undefined) ||
    fallbackCover;
  return { ...book, coverPicture: cover };
}
