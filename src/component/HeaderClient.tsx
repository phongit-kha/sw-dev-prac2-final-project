"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { BookOpen, ChevronDown, LogOut, UserRound } from "lucide-react";
import { useMemo, useState } from "react";

const sharedLinks = [{ href: "/demo", label: "Product Demo" }];
const guestLinks: { href: string; label: string }[] = [];

const memberLinks = [
  { href: "/member/books", label: "Books" },
  { href: "/member/reservations", label: "My reservations" },
  ...sharedLinks,
];

const adminLinks = [
  { href: "/admin/books", label: "Manage books" },
  { href: "/admin/reservations", label: "All reservations" },
  ...sharedLinks,
];

export default function HeaderClient() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const role = session?.user?.role === "admin" ? "admin" : "member";

  const links = useMemo(() => {
    if (!session) return guestLinks;
    return role === "admin" ? adminLinks : memberLinks;
  }, [session, role]);

  return (
    <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
      <Link href="/" className="flex items-center gap-3 text-xl font-bold">
        <div className="rounded-full bg-emerald-500 p-2 text-white">
          <BookOpen className="h-6 w-6" />
        </div>
        <span>LibReserve</span>
      </Link>

      <div className="hidden items-center gap-6 md:flex">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`text-sm font-semibold ${
              pathname.startsWith(link.href)
                ? "text-emerald-600"
                : "text-slate-600 hover:text-emerald-600"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>

      {session ? (
        <div className="relative">
          <button
            onClick={() => setOpen((prev) => !prev)}
            className="flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5 text-sm font-semibold text-slate-700 hover:border-emerald-400"
          >
            <UserRound className="h-4 w-4" />
            {session.user?.name ?? "User"}
            <ChevronDown className="h-4 w-4" />
          </button>
          {open && (
            <div className="absolute right-0 mt-2 w-48 rounded-2xl border border-slate-100 bg-white p-2 shadow-xl">
              <Link
                href="/profile"
                onClick={() => setOpen(false)}
                className="block rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
              >
                My profile
              </Link>
              <Link
                href="/api/auth/signout"
                className="mt-1 flex items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50"
                onClick={() => setOpen(false)}
              >
                Sign out
                <LogOut className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="flex gap-3">
          <Link
            href="/login"
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:border-emerald-500 hover:text-emerald-600"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600"
          >
            Register
          </Link>
        </div>
      )}
    </nav>
  );
}
