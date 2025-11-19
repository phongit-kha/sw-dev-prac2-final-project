"use client";

import { useMemo, useState, useTransition, useEffect } from "react";
import dayjs from "dayjs";
import { Book } from "@interfaces";
import { createReservation } from "@/libs/reservations";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

interface Props {
  books: Book[];
  token: string;
  initialBookId?: string;
}

export default function ReservationForm({
  books,
  token,
  initialBookId,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Filter out books with availableAmount = 0
  const availableBooks = useMemo(() => {
    return books.filter((book) => book.availableAmount > 0);
  }, [books]);

  // Get book ID from URL params or initialBookId prop
  const bookIdFromUrl = searchParams?.get("bookId") || initialBookId;

  const [form, setForm] = useState({
    book: "",
    borrowDate: "",
    pickupDate: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Initialize and update form.book when bookIdFromUrl or availableBooks changes
  useEffect(() => {
    if (availableBooks.length === 0) {
      setForm((prev) => ({ ...prev, book: "" }));
      return;
    }

    // If there's a book ID from URL, try to select it (this handles auto-selection from books page)
    if (bookIdFromUrl) {
      const bookFromUrl = availableBooks.find((b) => b._id === bookIdFromUrl);
      if (bookFromUrl) {
        setForm((prev) => {
          // Only update if different to avoid unnecessary re-renders
          if (prev.book !== bookFromUrl._id) {
            return { ...prev, book: bookFromUrl._id };
          }
          return prev;
        });
        return;
      }
    }

    // Fallback: if current selection is invalid or empty, select first available book
    const currentBookExists =
      form.book && availableBooks.find((b) => b._id === form.book);
    if (!currentBookExists) {
      setForm((prev) => ({ ...prev, book: availableBooks[0]._id }));
    }
  }, [availableBooks, bookIdFromUrl, form.book]);

  // Use availableBooks as bookOptions
  const bookOptions = availableBooks;

  const handleFillAll = () => {
    if (availableBooks.length === 0) return;
    const today = dayjs().startOf("day");
    const borrowDate = today.format("YYYY-MM-DD");
    const pickupDate = today.add(7, "day").format("YYYY-MM-DD");

    setForm({
      book: availableBooks[0]._id,
      borrowDate,
      pickupDate,
    });
    setError(null);
  };

  const handleQuickFill = (days: number) => {
    const today = dayjs().startOf("day");
    const borrowDate = today.format("YYYY-MM-DD");
    const pickupDate = today.add(days, "day").format("YYYY-MM-DD");

    setForm((prev) => ({
      ...prev,
      borrowDate,
      pickupDate,
    }));
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const today = dayjs().startOf("day");
    if (!form.borrowDate || !form.pickupDate) {
      setError("Please select both borrow and pickup dates");
      return;
    }

    const borrow = dayjs(form.borrowDate);
    const pickup = dayjs(form.pickupDate);

    if (borrow.isBefore(today)) {
      setError("Borrow date cannot be earlier than today");
      return;
    }

    if (pickup.isBefore(borrow)) {
      setError("Pick-up date cannot be earlier than borrow date");
      return;
    }

    startTransition(async () => {
      try {
        await createReservation(token, form);
        setForm({ ...form, borrowDate: "", pickupDate: "" });
        toast.success("Reservation created successfully!");
        router.refresh();
      } catch (err) {
        const errorMessage = (err as Error).message;
        setError(errorMessage);
        toast.error(errorMessage);
      }
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm"
    >
      <div>
        <h3 className="text-lg font-semibold text-slate-900">
          Create a reservation
        </h3>
        <p className="text-sm text-slate-500">
          One book per reservation.
        </p>
      </div>
      {error && (
        <div className="rounded-2xl bg-amber-50 px-3 py-2 text-sm text-amber-700">
          {error}
        </div>
      )}
      <label className="text-sm font-semibold text-slate-700">
        Book
        <select
          name="book"
          value={form.book}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, book: e.target.value }))
          }
          className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          disabled={bookOptions.length === 0}
        >
          {bookOptions.length === 0 ? (
            <option value="">No available books</option>
          ) : (
            bookOptions.map((book) => (
              <option key={book._id} value={book._id}>
                {book.title} – {book.availableAmount} copies left
              </option>
            ))
          )}
        </select>
      </label>
      <div className="space-y-3 mt-2">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm font-semibold text-slate-700">
            Borrow date
            <input
              type="date"
              value={form.borrowDate}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, borrowDate: e.target.value }))
              }
              required
              className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </label>
          <label className="text-sm font-semibold text-slate-700">
            Pick-up date
            <input
              type="date"
              value={form.pickupDate}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, pickupDate: e.target.value }))
              }
              required
              className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </label>
          <div className="flex flex-wrap gap-2">
            <span className="text-xs font-medium text-slate-600 self-center">
              Quick fill:
            </span>
            <button
              type="button"
              onClick={handleFillAll}
              disabled={bookOptions.length === 0}
              className="rounded-lg border border-emerald-200 bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-100 hover:cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Fill All
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill(3)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 hover:cursor-pointer transition-colors"
            >
              3 วัน
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill(7)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 hover:cursor-pointer transition-colors"
            >
              7 วัน
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill(14)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 hover:cursor-pointer transition-colors"
            >
              14 วัน
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill(30)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 hover:cursor-pointer transition-colors"
            >
              30 วัน
            </button>
          </div>
        </div>
      </div>
      <button
        type="submit"
        disabled={isPending || bookOptions.length === 0}
        className="w-full rounded-2xl bg-emerald-500 py-3 text-sm font-semibold text-white hover:bg-emerald-600 hover:cursor-pointer disabled:opacity-60"
      >
        {isPending ? "Submitting..." : "Submit request"}
      </button>
    </form>
  );
}
