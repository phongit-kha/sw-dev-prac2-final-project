"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Book } from "@interfaces";

interface Props {
  books: Book[];
}

export default function BooksListClient({ books }: Props) {
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

  return (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <svg
              className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="ค้นหาหนังสือ ชื่อผู้แต่ง ISBN หรือสำนักพิมพ์..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-12 pr-4 py-3 text-sm transition-all focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          {/* Filter Controls */}
          <div className="flex flex-wrap gap-3">
            <div className="flex-1 min-w-[200px]">
              <select
                value={filterPublisher}
                onChange={(e) => setFilterPublisher(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm transition-all focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              >
                <option value="">ทุกสำนักพิมพ์</option>
                {publishers.map((publisher) => (
                  <option key={publisher} value={publisher}>
                    {publisher}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1 min-w-[200px]">
              <select
                value={filterAvailable}
                onChange={(e) =>
                  setFilterAvailable(
                    e.target.value as "all" | "available" | "unavailable"
                  )
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm transition-all focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              >
                <option value="all">ทุกเล่ม</option>
                <option value="available">มีให้ยืม</option>
                <option value="unavailable">หมดแล้ว</option>
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">
              พบ <span className="font-semibold text-slate-900">{filteredBooks.length}</span> เล่ม จากทั้งหมด <span className="font-semibold text-slate-900">{books.length}</span> เล่ม
            </span>
            {(searchQuery || filterPublisher || filterAvailable !== "all") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setFilterPublisher("");
                  setFilterAvailable("all");
                }}
                className="text-emerald-600 hover:text-emerald-700 font-medium"
              >
                ล้างตัวกรอง
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Books Grid */}
      {filteredBooks.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-16 text-center">
          <svg
            className="mx-auto h-16 w-16 text-slate-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
          <p className="mt-4 text-slate-500 text-lg">ไม่พบหนังสือที่ตรงกับเงื่อนไข</p>
          <p className="mt-2 text-sm text-slate-400">ลองเปลี่ยนคำค้นหาหรือตัวกรองดูนะครับ</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredBooks.map((book) => {
            const isAvailable = book.availableAmount > 0;
            
            return (
              <article
                key={book._id}
                className={`group relative overflow-hidden rounded-xl border bg-white transition-all duration-300 ${
                  isAvailable
                    ? "border-slate-200 shadow-sm hover:border-emerald-300 hover:shadow-md"
                    : "border-slate-200 opacity-75"
                }`}
              >
                <div className="flex gap-3 p-3">
                  {/* Book Cover - Smaller */}
                  <div className="relative h-24 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-slate-100 to-slate-200">
                    <Image
                      src={book.coverPicture || "/covers/modern-classics.jpg"}
                      alt={book.title}
                      fill
                      className={`object-cover transition-transform duration-300 ${
                        isAvailable ? "group-hover:scale-105" : ""
                      }`}
                      sizes="64px"
                    />
                  </div>

                  {/* Book Info */}
                  <div className="flex-1 min-w-0 space-y-1.5">
                    {/* Publisher */}
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-600 truncate">
                      {book.publisher}
                    </p>

                    {/* Title */}
                    <h3 className="line-clamp-2 text-sm font-bold text-slate-900 leading-tight">
                      {book.title}
                    </h3>

                    {/* Author */}
                    <p className="text-xs text-slate-600 truncate">
                      โดย {book.author}
                    </p>

                    {/* Availability & ISBN Row */}
                    <div className="flex items-center justify-between gap-2 pt-1">
                      {/* Availability Badge */}
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                          isAvailable
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {isAvailable ? (
                          <>
                            <svg
                              className="h-2.5 w-2.5"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                            {book.availableAmount} เล่ม
                          </>
                        ) : (
                          <>
                            <svg
                              className="h-2.5 w-2.5"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                clipRule="evenodd"
                              />
                            </svg>
                            หมดแล้ว
                          </>
                        )}
                      </span>

                      {/* ISBN - Compact */}
                      <span className="text-[10px] text-slate-400 truncate">
                        ISBN: {book.ISBN}
                      </span>
                    </div>

                    {/* Action Button */}
                    {isAvailable ? (
                      <Link
                        href={`/member/reservations?bookId=${book._id}`}
                        className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-white transition-all hover:bg-emerald-600 active:scale-[0.98]"
                      >
                        <svg
                          className="h-3 w-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                          />
                        </svg>
                        จองหนังสือ
                      </Link>
                    ) : (
                      <button
                        disabled
                        className="mt-2 flex w-full cursor-not-allowed items-center justify-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-400"
                      >
                        <svg
                          className="h-3 w-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                        ไม่สามารถจองได้
                      </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

