import AdminReservationsManagement from "@/component/AdminReservationsManagement";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { getReservations } from "@/libs/reservations";
import { attachBookCover } from "@/libs/bookCovers";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function AdminReservationsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.token) {
    redirect("/login?callbackUrl=/admin/reservations");
  }
  if (session.user.role !== "admin") {
    redirect("/member/reservations");
  }

  const reservationsRaw = await getReservations(session.user.token);
  const reservations = reservationsRaw.map((reservation, index) => ({
    ...reservation,
    book: reservation.book ? attachBookCover(reservation.book, index) : null,
  }));

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-500">
          Admin Dashboard
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          Reservation Management
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Manage all reservations, filter by status, and search by user or book.
        </p>
      </div>
      <AdminReservationsManagement
        reservations={reservations}
        token={session.user.token}
      />
    </div>
  );
}
