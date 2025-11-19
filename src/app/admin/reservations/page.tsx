import ReservationList from "@/component/ReservationList";
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
    book: attachBookCover(reservation.book, index) ?? reservation.book,
  }));

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-500">
          Admin
        </p>
        <h1 className="text-3xl font-bold text-slate-900">All reservations</h1>
        <p className="text-sm text-slate-500">
          Admins can edit or delete any reservation regardless of owner.
        </p>
      </div>
      <ReservationList
        reservations={reservations}
        token={session.user.token}
        allowEdit
        allowDelete
        title={`Total ${reservations.length} reservations`}
      />
    </div>
  );
}
