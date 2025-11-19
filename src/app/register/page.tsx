"use client";

import { useState, useTransition } from "react";
import { registerUser } from "@/libs/auth";
import Link from "next/link";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    tel: "",
    password: "",
    role: "member",
  });
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    startTransition(async () => {
      try {
        await registerUser(form);
        setSuccess("Registration successful. You can sign in now.");
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Registration failed";
        setError(
          message.includes("Request rejected")
            ? "Registration failed. Please check your information or try a different email."
            : message
        );
      }
    });
  };

  return (
    <div className="mx-auto max-w-md rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-bold text-slate-900">Create an account</h1>
      <p className="mt-2 text-sm text-slate-500">
        Choose member or admin to simulate both roles.
      </p>
      {error && (
        <p className="mt-4 rounded-2xl bg-rose-50 px-3 py-2 text-sm text-rose-600">
          {error}
        </p>
      )}
      {success && (
        <p className="mt-4 rounded-2xl bg-emerald-50 px-3 py-2 text-sm text-emerald-600">
          {success}
        </p>
      )}
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <label className="text-sm font-semibold text-slate-700">
          Full name
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm"
          />
        </label>
        <label className="text-sm font-semibold text-slate-700">
          Email
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm"
          />
        </label>
        <label className="text-sm font-semibold text-slate-700">
          Phone number
          <input
            name="tel"
            value={form.tel}
            onChange={handleChange}
            required
            className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm"
          />
        </label>
        <label className="text-sm font-semibold text-slate-700">
          Password
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm"
          />
        </label>
        <label className="text-sm font-semibold text-slate-700">
          Role
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm"
          >
            <option value="member">Member</option>
            <option value="admin">Admin</option>
          </select>
        </label>
        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-2xl bg-emerald-500 py-3 text-sm font-semibold text-white hover:bg-emerald-600 disabled:opacity-60"
        >
        {isPending ? "Creating account..." : "Sign up"}
      </button>
      </form>
      <p className="mt-4 text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-emerald-600">
          Go to login
        </Link>
      </p>
    </div>
  );
}
