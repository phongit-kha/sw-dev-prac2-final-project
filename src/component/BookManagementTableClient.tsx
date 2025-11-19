"use client";

import { useState, useMemo, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Book } from "@interfaces";
import { deleteBook, updateBookStock } from "@/libs/books";
import toast from "react-hot-toast";

interface Props {
  books: Book[];
  token: string;
}

export default function BookManagementTableClient({ books, token }: Props) {
  const router = useRouter();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPublisher, setFilterPublisher] = useState("");
  const [filterAvailable, setFilterAvailable] = useState<"all" | "available" | "unavailable">("all");

  // Get unique publishers for filter
  const publishers = useMemo(() => {
    const uniquePublishers = Array.from(new Set(books.map((book) => book.publisher)));
    return uniquePublishers.sort();
  }, [books]);

  // Filter books based on search and filters
  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      // Search filter
      const matchesSearch =
        searchQuery === "" ||
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.ISBN.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.publisher.toLowerCase().includes(searchQuery.toLowerCase());

      // Publisher filter
      const matchesPublisher = filterPublisher === "" || book.publisher === filterPublisher;

      // Available filter
      const matchesAvailable =
        filterAvailable === "all" ||
        (filterAvailable === "available" && book.availableAmount > 0) ||
        (filterAvailable === "unavailable" && book.availableAmount === 0);

      return matchesSearch && matchesPublisher && matchesAvailable;
    });
  }, [books, searchQuery, filterPublisher, filterAvailable]);

  const handleDelete = (id: string) => {
    setPendingId(id);
    setError(null);
    startTransition(async () => {
      try {
        await deleteBook(token, id);
        toast.success("Book deleted successfully!");
        router.refresh();
      } catch (err) {
        const errorMessage = (err as Error).message;
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setPendingId(null);
      }
    });
  };

  const handleStock = (id: string, current: number, direction: 1 | -1) => {
    const nextValue = Math.max(0, current + direction);
    setPendingId(id);
    setError(null);
    startTransition(async () => {
      try {
        await updateBookStock(token, id, nextValue);
        toast.success(`Stock updated to ${nextValue}`);
        router.refresh();
      } catch (err) {
        const errorMessage = (err as Error).message;
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setPendingId(null);
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
      <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="space-y-4">
          {/* Search Bar */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Search
            </label>
            <input
              type="text"
              placeholder="Search by title, author, ISBN, or publisher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 [&:not(:placeholder-shown)]:border-emerald-500"
            />
          </div>

          {/* Filter Controls */}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Filter by Publisher
              </label>
              <select
                value={filterPublisher}
                onChange={(e) => setFilterPublisher(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              >
                <option value="">All Publishers</option>
                {publishers.map((publisher) => (
                  <option key={publisher} value={publisher}>
                    {publisher}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Filter by Availability
              </label>
              <select
                value={filterAvailable}
                onChange={(e) =>
                  setFilterAvailable(
                    e.target.value as "all" | "available" | "unavailable"
                  )
                }
                className="w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              >
                <option value="all">All Books</option>
                <option value="available">Available Only</option>
                <option value="unavailable">Unavailable Only</option>
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="text-sm text-slate-500">
            Showing {filteredBooks.length} of {books.length} books
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-3xl border border-slate-100 bg-white">
        {error && (
          <div className="rounded-t-3xl border-b border-rose-100 bg-rose-50 px-6 py-3 text-sm text-rose-500">
            {error}
          </div>
        )}
        <div className="overflow-x-auto px-6 py-4">
          {filteredBooks.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              No books found matching your criteria.
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  <th className="pb-3">Book</th>
                  <th className="pb-3">Author</th>
                  <th className="pb-3">ISBN</th>
                  <th className="pb-3">Publisher</th>
                  <th className="pb-3">Available</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBooks.map((book) => (
                  <tr
                    key={book._id}
                    className="border-t border-slate-100 text-slate-600"
                  >
                    <td className="py-4 font-semibold text-slate-900">
                      {book.title}
                    </td>
                    <td className="py-4">{book.author}</td>
                    <td className="py-4">{book.ISBN}</td>
                    <td className="py-4">{book.publisher}</td>
                    <td className="py-4">
                      <div className="inline-flex items-center rounded-full border border-slate-200">
                        <button
                          aria-label={`Decrease stock for ${book.title}`}
                          onClick={() => handleStock(book._id, book.availableAmount, -1)}
                          disabled={isPending}
                          className="px-3 py-1 text-sm font-bold text-slate-500 hover:text-slate-900 hover:cursor-pointer"
                        >
                          -
                        </button>
                        <span className="px-4 text-sm font-semibold text-slate-900">
                          {book.availableAmount}
                        </span>
                        <button
                          aria-label={`Increase stock for ${book.title}`}
                          onClick={() => handleStock(book._id, book.availableAmount, 1)}
                          disabled={isPending}
                          className="px-3 py-1 text-sm font-bold text-slate-500 hover:text-slate-900 hover:cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="py-4 text-right">
                      <button
                        onClick={() => handleDelete(book._id)}
                        disabled={isPending && pendingId === book._id}
                        className="text-sm font-semibold text-rose-500 hover:text-rose-600 hover:cursor-pointer"
                      >
                        {pendingId === book._id ? "Deleting..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

