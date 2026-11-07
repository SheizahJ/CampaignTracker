"use client";

import Link from "next/link";
import { useActionState } from "react";
import { register } from "./createAccount";

export default function RegisterForm() {
  const [error, formAction, isPending] = useActionState(register, "");

  return (
    <form action={formAction} className="login w-full max-w-sm space-y-6 rounded-xs border border-black/10 p-8 shadow-sm">
      <div>
        <div className="mb-2 flex items-center gap-3">
          <span className="logo-sm" />
          <h1 className="mb-0">Register</h1>
        </div>
        <p className="text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="underline">Sign In</Link>
        </p>
      </div>

      {error && <p className="text-red-600" role="alert">{error}</p>}

      <div className="space-y-2">
        <label className="block font-medium" htmlFor="username">Username</label>
        <input
          className="w-full rounded-md border border-gray-300 px-3 py-2"
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block font-medium" htmlFor="password">Password</label>
        <input
          className="w-full rounded-md border border-gray-300 px-3 py-2"
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block font-medium" htmlFor="password">Registration Token</label>
        <input
          className="w-full rounded-md border border-gray-300 px-3 py-2"
          id="register-key"
          name="register-key"
          type="password"
          required
        />
        <p className="text-center text-sm italic opacity-50">Please contact the owner for access...</p>
      </div>

      <button
        className="w-full rounded-md bg-blue-600 px-4 py-2 font-medium text-white"
        type="submit"
        disabled={isPending}
      >
        {isPending ? "Signing up..." : "Sign up"}
      </button>
    </form>
  );
}
