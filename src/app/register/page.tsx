/*
  Register Page
*/

import Link from "next/link";
import { createUser } from '@/db/fetch_data/users';

export default function Register_Page() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <form className="login w-full max-w-sm space-y-6 rounded-xs border border-black/10 p-8 shadow-sm">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <Link href="/" className="logo-sm"/>
            <h1 className="mb-0">Register</h1>
          </div>
          <p className="text-gray-600">Already have an account? <Link href="/login" className="underline">Sign In</Link></p>
        </div>

        <div className="space-y-2">
          <label className="block font-medium" htmlFor="username">
            Username
          </label>
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
          <label className="block font-medium" htmlFor="password">
            Password
          </label>
          <input
            className="w-full rounded-md border border-gray-300 px-3 py-2"
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
          />
        </div>

        <button
          className="w-full rounded-md bg-blue-600 px-4 py-2 font-medium text-white"
          type="submit"
        >
          Sign up
        </button>
      </form>
    </main>
  );
}
