"use client";

import { Reservation } from "@interfaces";
import dayjs from "dayjs";
import { deleteReservation, updateReservation } from "@/libs/reservations";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import Image from "next/image";
import toast from "react-hot-toast";

interface Props {
  reservations: Reservation[];
  token: string;
  allowEdit?: boolean;
  allowDelete?: boolean;
  title?: string;
}

export default function ReservationList({
  reservations,
  token,
  allowEdit = true,
  allowDelete = true,
  title = "Reservation list",
}: Props) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftBorrow, setDraftBorrow] = useState("");
  const [draftPickup, setDraftPickup] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const startEdit = (reservation: Reservation) => {
    setEditingId(reservation._id);
    setDraftBorrow(reservation.borrowDate.split("T")[0]);
    setDraftPickup(reservation.pickupDate.split("T")[0]);
    setError(null);
  };

  const handleQuickFillDates = (days: number) => {
    const today = dayjs().startOf("day");
    const borrowDate = today.format("YYYY-MM-DD");
    const pickupDate = today.add(days, "day").format("YYYY-MM-DD");
    setDraftBorrow(borrowDate);
    setDraftPickup(pickupDate);
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

  const handleDelete = (id: string) => {
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

  if (!reservations.length) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-10 text-center text-slate-500">
        No reservations yet
      </div>
    );
  }

  return (
    <section className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        <p className="text-sm text-slate-500">
          Includes populated user and book data straight from the backend.
        </p>
      </div>
      {error && (
        <div className="rounded-2xl bg-rose-50 px-3 py-2 text-sm text-rose-600">
          {error}
        </div>
      )}
      <div className="space-y-4">
        {reservations.map((reservation) => {
          const title = reservation.book?.title ?? "Unknown title";
          const author = reservation.book?.author ?? "Unknown author";
          const publisher = reservation.book?.publisher ?? "Unknown publisher";
          const isEditing = editingId === reservation._id;
          return (
            <article
              key={reservation._id}
              className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-lg"
            >
              <div className="grid gap-6 p-6 md:grid-cols-[200px_1fr]">
                <div className="relative h-56 w-full rounded-2xl bg-slate-100">
                  <Image
                    src={reservation.book?.coverPicture || "/images/book-cover.jpg"}
                    alt={reservation.book?.title || "Book cover"}
                    fill
                    className="rounded-2xl object-cover"
                  />
                </div>
                <div className="space-y-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-500">
                        {publisher}
                      </p>
                      <h4 className="text-2xl font-semibold text-slate-900">
                        {title}
                      </h4>
                      <p className="text-sm text-slate-500">
                        by {author} • member {reservation.user.name}
                      </p>
                    </div>
                    <div className="text-right text-xs uppercase tracking-widest text-slate-400">
                      #{reservation._id.slice(-6)}
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-xs font-semibold text-slate-500">
                        Borrow date
                      </p>
                      {isEditing && allowEdit ? (
                        <>
                          <input
                            type="date"
                            value={draftBorrow}
                            onChange={(e) => setDraftBorrow(e.target.value)}
                            className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                          />
                          {isEditing && (
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleQuickFillDates(7)}
                                className="rounded-lg border border-emerald-200 bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-100 hover:cursor-pointer transition-colors"
                              >
                                +7 วัน
                              </button>
                            </div>
                          )}
                        </>
                      ) : (
                        <p className="text-lg font-semibold text-slate-900">
                          {dayjs(reservation.borrowDate).format("DD MMM YYYY")}
                        </p>
                      )}
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-xs font-semibold text-slate-500">
                        Pickup date
                      </p>
                      {isEditing && allowEdit ? (
                        <input
                          type="date"
                          value={draftPickup}
                          onChange={(e) => setDraftPickup(e.target.value)}
                          className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                        />
                      ) : (
                        <p className="text-lg font-semibold text-slate-900">
                          {dayjs(reservation.pickupDate).format("DD MMM YYYY")}
                        </p>
                      )}
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">
                      <p className="text-xs font-semibold text-slate-500">
                        created at
                      </p>
                      <p className="text-lg font-semibold text-slate-900">
                        {reservation.createdAt
                          ? dayjs(reservation.createdAt).format("DD MMM YYYY")
                          : "-"}
                      </p>
                      <p className="text-xs text-slate-400">
                        {reservation.user.email}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {(allowEdit || allowDelete) && (
                <div className="mt-4 flex flex-wrap gap-3 justify-end px-6 pb-6">
                  {allowEdit && (
                    <>
                      {isEditing ? (
                        <>
                          <button
                            onClick={submitEdit}
                            disabled={isPending}
                            className="rounded-full bg-emerald-500 px-6 py-2 text-sm font-semibold text-white hover:bg-emerald-600 hover:cursor-pointer"
                          >
                            Save
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="rounded-full border border-slate-200 px-6 py-2 text-sm font-semibold text-slate-600 hover:cursor-pointer"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => startEdit(reservation)}
                          className="rounded-full border border-slate-200 px-6 py-2 text-sm font-semibold text-slate-600 hover:border-emerald-400 hover:cursor-pointer"
                        >
                          Edit dates
                        </button>
                      )}
                    </>
                  )}
                  {allowDelete && (
                    <button
                      onClick={() => handleDelete(reservation._id)}
                      disabled={isPending}
                      className="rounded-full bg-rose-500 px-6 py-2 text-sm font-semibold text-white hover:bg-rose-600 hover:cursor-pointer"
                    >
                      Delete
                    </button>
                  )}
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
