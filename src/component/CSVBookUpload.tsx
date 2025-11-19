"use client";

import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import { createBook } from "@/libs/books";
import toast from "react-hot-toast";

interface BookData {
  title: string;
  author: string;
  ISBN: string;
  publisher: string;
  availableAmount: number;
  coverPicture: string;
}

interface Props {
  token: string;
}

export default function CSVBookUpload({ token }: Props) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [books, setBooks] = useState<BookData[]>([]);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // Helper function to parse CSV line handling quoted fields
  const parseCSVLine = (line: string): string[] => {
    const result: string[] = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const nextChar = line[i + 1];

      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          // Escaped quote
          current += '"';
          i++; // Skip next quote
        } else {
          // Toggle quote state
          inQuotes = !inQuotes;
        }
      } else if (char === "," && !inQuotes) {
        // End of field
        result.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }

    // Add last field
    result.push(current.trim());
    return result;
  };

  const parseCSV = (csvText: string): BookData[] => {
    const lines = csvText.split("\n").filter((line) => line.trim());
    if (lines.length < 2) {
      throw new Error("CSV file must have at least a header and one data row");
    }

    // Parse header
    const headers = parseCSVLine(lines[0]).map((h) =>
      h.toLowerCase().replace(/\s+/g, "").replace(/"/g, "")
    );

    // Expected columns
    const expectedColumns = [
      "title",
      "author",
      "isbn",
      "publisher",
      "availableamount",
      "coverpicture",
    ];

    // Check if all required columns exist
    const missingColumns = expectedColumns.filter(
      (col) => !headers.includes(col)
    );
    if (missingColumns.length > 0) {
      throw new Error(
        `Missing required columns: ${missingColumns.join(", ")}`
      );
    }

    // Parse data rows
    const parsedBooks: BookData[] = [];
    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i]).map((v) =>
        v.replace(/^"|"$/g, "")
      );
      if (values.length !== headers.length) {
        continue; // Skip malformed rows
      }

      const book: any = {};
      headers.forEach((header, index) => {
        book[header] = values[index];
      });

      // Map to our BookData structure
      const bookData: BookData = {
        title: book.title || "",
        author: book.author || "",
        ISBN: book.isbn || "",
        publisher: book.publisher || "",
        availableAmount: parseInt(book.availableamount || "1", 10) || 1,
        coverPicture: book.coverpicture || "",
      };

      // Validate required fields
      if (
        bookData.title &&
        bookData.author &&
        bookData.ISBN &&
        bookData.publisher &&
        bookData.coverPicture
      ) {
        parsedBooks.push(bookData);
      }
    }

    return parsedBooks;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".csv")) {
      setError("Please upload a CSV file");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const csvText = event.target?.result as string;
        const parsedBooks = parseCSV(csvText);
        if (parsedBooks.length === 0) {
          setError("No valid books found in CSV file");
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
          return;
        }
        setBooks(parsedBooks);
        setError(null);
        toast.success(`Loaded ${parsedBooks.length} book(s) from CSV`);
      } catch (err) {
        const errorMessage = (err as Error).message;
        setError(errorMessage);
        toast.error(errorMessage);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    };
    reader.onerror = () => {
      setError("Error reading file");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    };
    reader.readAsText(file);
  };

  const handleBookChange = (
    index: number,
    field: keyof BookData,
    value: string | number
  ) => {
    setBooks((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleDeleteBook = (index: number) => {
    setBooks((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddAll = () => {
    if (books.length === 0) {
      toast.error("No books to add");
      return;
    }

    startTransition(async () => {
      try {
        let successCount = 0;
        let errorCount = 0;

        for (const book of books) {
          try {
            await createBook(token, {
              ...book,
              availableAmount: Number(book.availableAmount),
            });
            successCount++;
          } catch (err) {
            errorCount++;
            console.error("Error creating book:", err);
          }
        }

        if (successCount > 0) {
          toast.success(`Successfully added ${successCount} book(s)`);
        }
        if (errorCount > 0) {
          toast.error(`Failed to add ${errorCount} book(s)`);
        }

        setBooks([]);
        router.refresh();
      } catch (err) {
        const errorMessage = (err as Error).message;
        setError(errorMessage);
        toast.error(errorMessage);
      }
    });
  };

  const handleClear = () => {
    setBooks([]);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
      <div>
        <h3 className="text-lg font-semibold text-slate-900">
          Upload books from CSV
        </h3>
        <p className="text-sm text-slate-500">
          Upload a CSV file with columns: title, author, ISBN, publisher,
          availableAmount, coverPicture
        </p>
      </div>

      {error && (
        <div className="rounded-2xl bg-rose-50 px-3 py-2 text-sm text-rose-600">
          {error}
        </div>
      )}

      {books.length === 0 ? (
        <div>
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-8 transition-colors hover:border-emerald-400 hover:bg-emerald-50">
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
            />
            <svg
              className="mb-4 h-12 w-12 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p className="text-sm font-semibold text-slate-700">
              Click to upload CSV file
            </p>
            <p className="mt-1 text-xs text-slate-500">
              CSV format: title,author,ISBN,publisher,availableAmount,coverPicture
            </p>
          </label>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-700">
              {books.length} book(s) loaded. Review and edit before submitting.
            </p>
            <button
              type="button"
              onClick={handleClear}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Clear All
            </button>
          </div>

          <div className="max-h-[600px] space-y-4 overflow-y-auto">
            {books.map((book, index) => (
              <div
                key={index}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
              >
                <div className="mb-3 flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-slate-900">
                    Book #{index + 1}
                  </h4>
                  <button
                    type="button"
                    onClick={() => handleDeleteBook(index)}
                    className="text-sm text-rose-600 hover:text-rose-700"
                  >
                    Remove
                  </button>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <label className="text-xs font-semibold text-slate-700">
                    Title
                    <input
                      type="text"
                      value={book.title}
                      onChange={(e) =>
                        handleBookChange(index, "title", e.target.value)
                      }
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                    />
                  </label>
                  <label className="text-xs font-semibold text-slate-700">
                    Author
                    <input
                      type="text"
                      value={book.author}
                      onChange={(e) =>
                        handleBookChange(index, "author", e.target.value)
                      }
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                    />
                  </label>
                  <label className="text-xs font-semibold text-slate-700">
                    ISBN
                    <input
                      type="text"
                      value={book.ISBN}
                      onChange={(e) =>
                        handleBookChange(index, "ISBN", e.target.value)
                      }
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                    />
                  </label>
                  <label className="text-xs font-semibold text-slate-700">
                    Publisher
                    <input
                      type="text"
                      value={book.publisher}
                      onChange={(e) =>
                        handleBookChange(index, "publisher", e.target.value)
                      }
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                    />
                  </label>
                  <label className="text-xs font-semibold text-slate-700">
                    Available Amount
                    <input
                      type="number"
                      value={book.availableAmount}
                      min={0}
                      onChange={(e) =>
                        handleBookChange(
                          index,
                          "availableAmount",
                          parseInt(e.target.value, 10) || 0
                        )
                      }
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                    />
                  </label>
                  <label className="text-xs font-semibold text-slate-700">
                    Cover Picture URL
                    <input
                      type="text"
                      value={book.coverPicture}
                      onChange={(e) =>
                        handleBookChange(index, "coverPicture", e.target.value)
                      }
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                    />
                  </label>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={handleAddAll}
            disabled={isPending || books.length === 0}
            className="w-full rounded-2xl bg-emerald-500 py-3 text-sm font-semibold text-white hover:bg-emerald-600 disabled:opacity-60"
          >
            {isPending
              ? `Adding ${books.length} book(s)...`
              : `Add All ${books.length} Book(s)`}
          </button>
        </div>
      )}
    </div>
  );
}

