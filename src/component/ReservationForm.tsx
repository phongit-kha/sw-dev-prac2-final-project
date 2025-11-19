"use client";

import { useMemo, useState, useTransition } from "react";
import dayjs from "dayjs";
import { Book } from "@interfaces";
import { createReservation } from "@/libs/reservations";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface Props {
  books: Book[];
  token: string;
}

export default function ReservationForm({ books, token }: Props) {
  const router = useRouter();
  const [form, setForm] = useState({
    book: books[0]?._id ?? "",
    borrowDate: "",
    pickupDate: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const bookOptions = useMemo(() => books, [books]);

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
          One book per reservation. Members can have up to 3 active requests.
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
          className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm"
        >
          {bookOptions.map((book) => (
            <option key={book._id} value={book._id}>
              {book.title} – {book.availableAmount} copies left
            </option>
          ))}
        </select>
      </label>
      <div className="grid gap-4 mt-2 md:grid-cols-2">
        <label className="text-sm font-semibold text-slate-700">
          Borrow date
          <input
            type="date"
            value={form.borrowDate}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, borrowDate: e.target.value }))
            }
            required
            className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm"
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
            className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm"
          />
        </label>
      </div>
      <button
        type="submit"
        disabled={isPending || bookOptions.length === 0}
        className="w-full rounded-2xl bg-emerald-500 py-3 text-sm font-semibold text-white hover:bg-emerald-600 disabled:opacity-60"
      >
        {isPending ? "Submitting..." : "Submit request"}
      </button>
    </form>
  );
}
