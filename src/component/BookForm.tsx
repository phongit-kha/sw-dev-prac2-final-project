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

  const handleFillSample = () => {
    const sampleBooks = [
      {
        title: "The Art of Computer Programming",
        author: "Donald E. Knuth",
        ISBN: "978-0201896831",
        publisher: "Addison-Wesley Professional",
        availableAmount: 5,
        coverPicture: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400",
      },
      {
        title: "Clean Code: A Handbook of Agile Software Craftsmanship",
        author: "Robert C. Martin",
        ISBN: "978-0132350884",
        publisher: "Prentice Hall",
        availableAmount: 3,
        coverPicture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
      },
      {
        title: "Design Patterns: Elements of Reusable Object-Oriented Software",
        author: "Gang of Four",
        ISBN: "978-0201633610",
        publisher: "Addison-Wesley Professional",
        availableAmount: 7,
        coverPicture: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400",
      },
    ];
    const randomBook = sampleBooks[Math.floor(Math.random() * sampleBooks.length)];
    setForm(randomBook);
    setError(null);
  };

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
        
        <button
          type="button"
          onClick={handleFillSample}
          className="mt-2 rounded-lg border border-emerald-200 bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-100 hover:cursor-pointer transition-colors"
        >
          Fill Sample Book
        </button>
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
