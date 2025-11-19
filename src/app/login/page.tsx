"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useState, useTransition } from "react";
import toast from "react-hot-toast";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl,
      });
      if (res?.error) {
        const errorMessage = "Invalid email or password";
        setError(errorMessage);
        toast.error(errorMessage);
        return;
      }
      toast.success("Signed in successfully!");
      window.location.href = callbackUrl;
    });
  };

  return (
    <div className="mx-auto max-w-md rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-bold text-slate-900">Sign in</h1>
      
      {error && (
        <p className="mt-4 rounded-2xl bg-rose-50 px-3 py-2 text-sm text-rose-600">
          {error}
        </p>
      )}
      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        <label className="text-sm font-semibold text-slate-700">
          Email
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
        </label>
        <label className="text-sm font-semibold text-slate-700">
          Password
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
        </label>
        <button
          type="submit"
          disabled={isPending}
          className="mt-4 w-full rounded-2xl bg-emerald-500 py-3 text-sm font-semibold text-white hover:bg-emerald-600 hover:cursor-pointer disabled:opacity-60"
        >
          {isPending ? "Signing in..." : "Sign in"}
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-slate-500">
        Don't have an account?{" "}
        <Link href="/register" className="font-semibold text-emerald-600">
          Create one
        </Link>
      </p>
    </div>
  );
}
