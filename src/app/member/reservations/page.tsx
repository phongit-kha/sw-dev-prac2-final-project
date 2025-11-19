import ReservationForm from "@/component/ReservationForm";
import ReservationList from "@/component/ReservationList";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { getBooks } from "@/libs/books";
import { getReservations } from "@/libs/reservations";
import { attachBookCover, attachBookCovers } from "@/libs/bookCovers";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function MemberReservationsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.token) {
    redirect("/login?callbackUrl=/member/reservations");
  }
  if (session.user.role !== "member") {
    redirect("/admin/reservations");
  }

  const [reservations, books] = await Promise.all([
    getReservations(session.user.token),
    getBooks(session.user.token),
  ]);
  const booksWithCovers = attachBookCovers(books);
  const reservationsWithCovers = reservations.map((reservation, index) => ({
    ...reservation,
    book: attachBookCover(reservation.book, index) ?? reservation.book,
  }));

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-6">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-500">
          Member
        </p>
        <h1 className="text-3xl font-bold text-slate-900">
          Reservation requests
        </h1>
        <p className="text-sm text-slate-500">
          Limited to 3 active reservations per member. All data comes from
          `/api/v1/reservations`.
        </p>
      </div>
      <ReservationForm books={booksWithCovers} token={session.user.token} />
      <ReservationList
        reservations={reservationsWithCovers}
        token={session.user.token}
        allowEdit
        allowDelete
        title={`My reservations (${reservations.length}/3)`}
      />
    </div>
  );
}
