"use client";

import { Reservation } from "@interfaces";
import dayjs from "dayjs";
import { deleteReservation, updateReservation } from "@/libs/reservations";
import { useRouter } from "next/navigation";
import { useState, useTransition, useMemo } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import {
  Search,
  Filter,
  Calendar,
  User,
  BookOpen,
  CheckCircle2,
  Clock,
  XCircle,
  Pencil,
  Trash2,
  ChevronsUpDown,
} from "lucide-react";

interface Props {
  reservations: Reservation[];
  token: string;
}

type FilterStatus = "all" | "upcoming" | "active" | "past";
type SortField = "borrowDate" | "pickupDate" | "createdAt" | "user" | "book";
type SortOrder = "asc" | "desc";

export default function AdminReservationsManagement({
  reservations,
  token,
}: Props) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftBorrow, setDraftBorrow] = useState("");
  const [draftPickup, setDraftPickup] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Filters and search
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all");
  const [sortField, setSortField] = useState<SortField>("borrowDate");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  // Get reservation status
  const getReservationStatus = (reservation: Reservation) => {
    const today = dayjs().startOf("day");
    const borrowDate = dayjs(reservation.borrowDate).startOf("day");
    const pickupDate = dayjs(reservation.pickupDate).startOf("day");

    if (pickupDate.isBefore(today)) return "past";
    if (borrowDate.isBefore(today) || borrowDate.isSame(today)) return "active";
    return "upcoming";
  };

  // Filter and sort reservations
  const filteredAndSortedReservations = useMemo(() => {
    let filtered = [...reservations];

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (r) => getReservationStatus(r) === statusFilter
      );
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.book?.title?.toLowerCase().includes(query) ||
          r.book?.author?.toLowerCase().includes(query) ||
          r.user.name.toLowerCase().includes(query) ||
          r.user.email.toLowerCase().includes(query)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case "borrowDate":
          aValue = dayjs(a.borrowDate);
          bValue = dayjs(b.borrowDate);
          break;
        case "pickupDate":
          aValue = dayjs(a.pickupDate);
          bValue = dayjs(b.pickupDate);
          break;
        case "createdAt":
          aValue = dayjs(a.createdAt || a.borrowDate);
          bValue = dayjs(b.createdAt || b.borrowDate);
          break;
        case "user":
          aValue = a.user.name.toLowerCase();
          bValue = b.user.name.toLowerCase();
          break;
        case "book":
          aValue = a.book?.title?.toLowerCase() || "";
          bValue = b.book?.title?.toLowerCase() || "";
          break;
        default:
          return 0;
      }

      if (sortField === "user" || sortField === "book") {
        return sortOrder === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return sortOrder === "asc"
        ? aValue.diff(bValue)
        : bValue.diff(aValue);
    });

    return filtered;
  }, [reservations, statusFilter, searchQuery, sortField, sortOrder]);

  // Stats
  const stats = useMemo(() => {
    const today = dayjs().startOf("day");
    return {
      total: reservations.length,
      upcoming: reservations.filter(
        (r) => getReservationStatus(r) === "upcoming"
      ).length,
      active: reservations.filter((r) => getReservationStatus(r) === "active")
        .length,
      past: reservations.filter((r) => getReservationStatus(r) === "past")
        .length,
    };
  }, [reservations]);

  const startEdit = (reservation: Reservation) => {
    setEditingId(reservation._id);
    setDraftBorrow(reservation.borrowDate.split("T")[0]);
    setDraftPickup(reservation.pickupDate.split("T")[0]);
    setError(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraftBorrow("");
    setDraftPickup("");
    setError(null);
  };

  const submitEdit = () => {
    if (!editingId) return;
    const borrow = dayjs(draftBorrow);
    const pickup = dayjs(draftPickup);
    const today = dayjs().startOf("day");

    if (borrow.isBefore(today)) {
      setError("Borrow date cannot be earlier than today");
      return;
    }
    if (pickup.isBefore(borrow)) {
      setError("Pick-up date cannot be earlier than borrow date");
      return;
    }

    setError(null);
    startTransition(async () => {
      try {
        await updateReservation(token, editingId, {
          borrowDate: draftBorrow,
          pickupDate: draftPickup,
        });
        cancelEdit();
        toast.success("Reservation updated successfully!");
        router.refresh();
      } catch (err) {
        const errorMessage = (err as Error).message;
        setError(errorMessage);
        toast.error(errorMessage);
      }
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this reservation?")) return;

    setError(null);
    startTransition(async () => {
      try {
        await deleteReservation(token, id);
        toast.success("Reservation deleted successfully!");
        router.refresh();
      } catch (err) {
        const errorMessage = (err as Error).message;
        setError(errorMessage);
        toast.error(errorMessage);
      }
    });
  };


  const getStatusBadge = (status: string) => {
    const styles = {
      upcoming:
        "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300",
      active:
        "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300",
      past: "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400",
    };

    const icons = {
      upcoming: Clock,
      active: CheckCircle2,
      past: XCircle,
    };

    const labels = {
      upcoming: "Upcoming",
      active: "Active",
      past: "Completed",
    };

    const Icon = icons[status as keyof typeof icons];
    const style = styles[status as keyof typeof styles] || styles.past;

    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${style}`}
      >
        <Icon className="h-3.5 w-3.5" />
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  if (!reservations.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
        <BookOpen className="mx-auto h-12 w-12 text-slate-400" />
        <p className="mt-4 text-lg font-semibold text-slate-900">
          No reservations yet
        </p>
        <p className="mt-2 text-sm text-slate-500">
          Reservations will appear here once members make bookings.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Stats Cards */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">
                {stats.total}
              </p>
            </div>
            <div className="rounded-lg bg-slate-100 p-3">
              <BookOpen className="h-6 w-6 text-slate-600" />
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700">Upcoming</p>
              <p className="mt-1 text-2xl font-bold text-blue-900">
                {stats.upcoming}
              </p>
            </div>
            <div className="rounded-lg bg-blue-100 p-3">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-emerald-700">Active</p>
              <p className="mt-1 text-2xl font-bold text-emerald-900">
                {stats.active}
              </p>
            </div>
            <div className="rounded-lg bg-emerald-100 p-3">
              <CheckCircle2 className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Completed</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">
                {stats.past}
              </p>
            </div>
            <div className="rounded-lg bg-slate-100 p-3">
              <XCircle className="h-6 w-6 text-slate-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by book title, author, user name, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-sm focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          {/* Filter and Sort Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Status Filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as FilterStatus)
                }
                className="appearance-none rounded-lg border border-slate-200 bg-white px-4 py-2.5 pr-10 text-sm font-medium text-slate-700 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              >
                <option value="all">All Status</option>
                <option value="upcoming">Upcoming</option>
                <option value="active">Active</option>
                <option value="past">Completed</option>
              </select>
              <Filter className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <select
                value={sortField}
                onChange={(e) => setSortField(e.target.value as SortField)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              >
                <option value="borrowDate">Borrow Date</option>
                <option value="pickupDate">Pickup Date</option>
                <option value="createdAt">Created At</option>
                <option value="user">User Name</option>
                <option value="book">Book Title</option>
              </select>
              <button
                onClick={() =>
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                }
                className="rounded-lg border border-slate-200 bg-white p-2.5 text-slate-600 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                title={`Sort ${sortOrder === "asc" ? "Descending" : "Ascending"}`}
              >
                <ChevronsUpDown className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="mt-5 border-t border-slate-100 pt-4">
          <p className="text-sm text-slate-600">
            Showing <span className="font-semibold text-slate-900">
              {filteredAndSortedReservations.length}
            </span>{" "}
            of <span className="font-semibold text-slate-900">
              {reservations.length}
            </span>{" "}
            reservation(s)
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-xl bg-rose-50 border border-rose-200 px-5 py-4 text-sm text-rose-700">
          {error}
        </div>
      )}

      {/* Reservations List */}
      <div className="space-y-4">
        {filteredAndSortedReservations.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 bg-white p-12 text-center">
            <Search className="mx-auto h-12 w-12 text-slate-400" />
            <p className="mt-4 text-lg font-semibold text-slate-900">
              No reservations found
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        ) : (
          filteredAndSortedReservations.map((reservation) => {
            const status = getReservationStatus(reservation);
            const isEditing = editingId === reservation._id;

            return (
              <div
                key={reservation._id}
                className={`group rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md ${
                  isEditing ? "ring-2 ring-emerald-500/20" : ""
                }`}
              >
                <div className="p-5">
                  <div className="flex gap-5">
                    {/* Book Cover */}
                    <div className="relative h-28 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100">
                      {reservation.book?.coverPicture ? (
                        <Image
                          src={reservation.book.coverPicture}
                          alt={reservation.book.title || "Book cover"}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <BookOpen className="h-8 w-8 text-slate-400" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            {getStatusBadge(status)}
                          </div>
                          <h3 className="text-lg font-semibold text-slate-900 truncate">
                            {reservation.book?.title || "Unknown Book"}
                          </h3>
                          <p className="text-sm text-slate-600">
                            by {reservation.book?.author || "Unknown Author"}
                          </p>
                        </div>
                        <div className="text-right text-xs text-slate-400 font-mono">
                          #{reservation._id.slice(-8)}
                        </div>
                      </div>

                      {/* Details Grid */}
                      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {/* User Info */}
                        <div className="flex items-start gap-2">
                          <User className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-slate-500">
                              Member
                            </p>
                            <p className="text-sm font-semibold text-slate-900 truncate">
                              {reservation.user.name}
                            </p>
                            <p className="text-xs text-slate-500 truncate">
                              {reservation.user.email}
                            </p>
                          </div>
                        </div>

                        {/* Borrow Date */}
                        <div className="flex items-start gap-2">
                          <Calendar className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-slate-500">
                              Borrow Date
                            </p>
                            {isEditing ? (
                              <input
                                type="date"
                                value={draftBorrow}
                                onChange={(e) => setDraftBorrow(e.target.value)}
                                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2 py-1 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                              />
                            ) : (
                              <p className="text-sm font-semibold text-slate-900">
                                {dayjs(reservation.borrowDate).format(
                                  "DD MMM YYYY"
                                )}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Pickup Date */}
                        <div className="flex items-start gap-2">
                          <Calendar className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-slate-500">
                              Pickup Date
                            </p>
                            {isEditing ? (
                              <input
                                type="date"
                                value={draftPickup}
                                onChange={(e) => setDraftPickup(e.target.value)}
                                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2 py-1 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                              />
                            ) : (
                              <p className="text-sm font-semibold text-slate-900">
                                {dayjs(reservation.pickupDate).format(
                                  "DD MMM YYYY"
                                )}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Created At */}
                        <div className="flex items-start gap-2">
                          <Clock className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-slate-500">
                              Created
                            </p>
                            <p className="text-sm font-semibold text-slate-900">
                              {reservation.createdAt
                                ? dayjs(reservation.createdAt).format(
                                    "DD MMM YYYY"
                                  )
                                : "-"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="mt-5 flex items-center justify-end gap-3">
                        {isEditing ? (
                          <>
                            <button
                              onClick={submitEdit}
                              disabled={isPending}
                              className="flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600 disabled:opacity-50"
                            >
                              <CheckCircle2 className="h-4 w-4" />
                              Save Changes
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => startEdit(reservation)}
                              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                            >
                              <Pencil className="h-4 w-4" />
                              Edit Dates
                            </button>
                            <button
                              onClick={() => handleDelete(reservation._id)}
                              disabled={isPending}
                              className="flex items-center gap-2 rounded-lg bg-rose-500 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-600 disabled:opacity-50"
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

