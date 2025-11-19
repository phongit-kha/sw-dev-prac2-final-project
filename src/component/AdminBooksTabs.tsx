"use client";

import { useState } from "react";
import BookForm from "./BookForm";
import BookManagementTableClient from "./BookManagementTableClient";
import CSVBookUpload from "./CSVBookUpload";
import { Book } from "@interfaces";

interface Props {
  books: Book[];
  token: string;
}

export default function AdminBooksTabs({ books, token }: Props) {
  const [activeTab, setActiveTab] = useState<"add" | "manage">("add");

  return (
    <div className="space-y-6">
      {/* Tabs Navigation */}
      <div className="flex gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab("add")}
          className={`px-6 py-3 text-sm font-semibold transition-colors hover:cursor-pointer ${
            activeTab === "add"
              ? "border-b-2 border-emerald-500 text-emerald-600"
              : "text-slate-600 hover:text-emerald-600"
          }`}
        >
          Add Books
        </button>
        <button
          onClick={() => setActiveTab("manage")}
          className={`px-6 py-3 text-sm font-semibold transition-colors hover:cursor-pointer ${
            activeTab === "manage"
              ? "border-b-2 border-emerald-500 text-emerald-600"
              : "text-slate-600 hover:text-emerald-600"
          }`}
        >
          Manage Books
        </button>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "add" ? (
          <div className="space-y-6">
            <CSVBookUpload token={token} />
            <BookForm token={token} />
          </div>
        ) : (
          <BookManagementTableClient books={books} token={token} />
        )}
      </div>
    </div>
  );
}

