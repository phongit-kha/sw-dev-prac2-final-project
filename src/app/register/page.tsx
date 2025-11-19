"use client";

import { useState, useTransition } from "react";
import { registerUser } from "@/libs/auth";
import { signIn } from "next-auth/react";
import Link from "next/link";
import toast from "react-hot-toast";
import type { RegisterPayload } from "@interfaces";

export default function RegisterPage() {
  const [form, setForm] = useState<RegisterPayload>({
    name: "",
    email: "",
    tel: "",
    password: "",
    role: "member",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "role" ? (value as RegisterPayload["role"]) : value,
    }));

    // Clear password error when user starts typing
    if (name === "password" || name === "confirmPassword") {
      setPasswordError(null);
    }
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setConfirmPassword(value);
    setPasswordError(null);
    
    // Real-time validation
    if (value && form.password && value !== form.password) {
      setPasswordError("Passwords do not match");
    }
  };

  const validateForm = (): boolean => {
    // Check password match
    if (form.password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return false;
    }

    // Check password length
    if (form.password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return false;
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setPasswordError(null);

    if (!validateForm()) {
      return;
    }

    startTransition(async () => {
      try {
        await registerUser(form);
        toast.success("Registration successful. Signing you in...");

        // Automatically sign in after successful registration
        const res = await signIn("credentials", {
          email: form.email,
          password: form.password,
          redirect: false,
          callbackUrl: "/",
        });

        if (res?.error) {
          const errorMessage =
            "Registration successful but login failed. Please try logging in manually.";
          setError(errorMessage);
          toast.error(errorMessage);
          return;
        }

        // Successfully signed in, redirect to home page
        toast.success("Signed in successfully!");
        window.location.href = "/";
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Registration failed";
        const errorMessage = message.includes("Request rejected")
          ? "Registration failed. Please check your information or try a different email."
          : message;
        setError(errorMessage);
        toast.error(errorMessage);
      }
    });
  };

  return (
    <div className="mx-auto max-w-md rounded-3xl border border-slate-100 bg-white p-8 shadow-lg">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Create an account</h1>
        <p className="mt-2 text-sm text-slate-500">
          Choose member or admin to simulate both roles.
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-600 border border-rose-200">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-600 border border-emerald-200">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Full name <span className="text-rose-500">*</span>
          </label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="Enter your full name"
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm transition-all focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 hover:border-slate-300"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Email <span className="text-rose-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="example@email.com"
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm transition-all focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 hover:border-slate-300"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Phone number <span className="text-rose-500">*</span>
          </label>
          <input
            type="tel"
            name="tel"
            value={form.tel}
            onChange={handleChange}
            required
            placeholder="08X-XXX-XXXX"
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm transition-all focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 hover:border-slate-300"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Password <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              placeholder="At least 6 characters"
              className={`w-full rounded-xl border px-4 py-2.5 pr-10 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/20 hover:border-slate-300 ${
                passwordError
                  ? "border-rose-300 focus:border-rose-500"
                  : "border-slate-200 focus:border-emerald-500"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              {showPassword ? (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Confirm Password <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              required
              placeholder="Re-enter your password"
              className={`w-full rounded-xl border px-4 py-2.5 pr-10 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/20 hover:border-slate-300 ${
                passwordError
                  ? "border-rose-300 focus:border-rose-500"
                  : "border-slate-200 focus:border-emerald-500"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              {showConfirmPassword ? (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>
          </div>
          {passwordError && (
            <p className="mt-1.5 text-sm text-rose-600 flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {passwordError}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Role <span className="text-rose-500">*</span>
          </label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm transition-all focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 hover:border-slate-300 bg-white"
          >
            <option value="member">Member</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full mt-6 rounded-xl bg-emerald-500 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-600 hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]"
        >
          {isPending ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Creating account...
            </span>
          ) : (
            "Sign up"
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
        >
          Go to login
        </Link>
      </p>
    </div>
  );
}
