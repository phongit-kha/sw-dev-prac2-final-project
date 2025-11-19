"use client";

import { useRouter } from "next/navigation";
import { Book } from "@interfaces";
import { deleteBook, updateBookStock } from "@/libs/books";
import { useState, useTransition } from "react";
import toast from "react-hot-toast";

interface Props {
  books: Book[];
  token: string;
}

export default function BookManagementTable({ books, token }: Props) {
  const router = useRouter();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

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
    <div className="rounded-3xl border border-slate-100 bg-white">
      {error && (
        <div className="rounded-t-3xl border-b border-rose-100 bg-rose-50 px-6 py-3 text-sm text-rose-500">
          {error}
        </div>
      )}
      <div className="overflow-x-auto px-6 py-4">
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
            {books.map((book) => (
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
      </div>
    </div>
  );
}
