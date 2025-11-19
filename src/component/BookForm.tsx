"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createBook } from "@/libs/books";
import toast from "react-hot-toast";

interface Props {
  token: string;
}

const initialState = {
  title: "",
  author: "",
  ISBN: "",
  publisher: "",
  availableAmount: 1,
  coverPicture: "",
};

export default function BookForm({ token }: Props) {
  const router = useRouter();
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      try {
        await createBook(token, {
          ...form,
          availableAmount: Number(form.availableAmount),
        });
        setForm(initialState);
        toast.success("Book created successfully!");
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
          Add a new book
        </h3>
        <p className="text-sm text-slate-500">
          Provide data that matches the p02-library schema.
        </p>
      </div>
      {error && (
        <div className="rounded-2xl bg-rose-50 px-3 py-2 text-sm text-rose-600">
          {error}
        </div>
      )}
      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm font-semibold text-slate-700">
          Title
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
        </label>
        <label className="text-sm font-semibold text-slate-700">
          Author
          <input
            name="author"
            value={form.author}
            onChange={handleChange}
            required
            className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
        </label>
        <label className="text-sm font-semibold text-slate-700">
          ISBN
          <input
            name="ISBN"
            value={form.ISBN}
            onChange={handleChange}
            required
            className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
        </label>
        <label className="text-sm font-semibold text-slate-700">
          Publisher
          <input
            name="publisher"
            value={form.publisher}
            onChange={handleChange}
            required
            className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
        </label>
        <label className="text-sm font-semibold text-slate-700">
          Available amount
          <input
            type="number"
            name="availableAmount"
            value={form.availableAmount}
            min={0}
            onChange={handleChange}
            required
            className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
        </label>
        <label className="text-sm font-semibold text-slate-700">
          Cover image URL
          <input
            name="coverPicture"
            value={form.coverPicture}
            onChange={handleChange}
            required
            className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
        </label>
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-2xl bg-emerald-500 py-3 text-sm font-semibold text-white hover:bg-emerald-600 hover:cursor-pointer disabled:opacity-60"
      >
        {isPending ? "Saving..." : "Add book"}
      </button>
    </form>
  );
}
