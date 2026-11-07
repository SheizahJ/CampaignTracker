import { cookies } from "next/headers";
import Link from "next/link";
import { logout } from "../app/login/logout";

export default async function Navbar() {
    const username = (await cookies()).get("username")?.value;

    return (
        <nav className="flex items-center justify-between border-b border-black/10 px-4 py-3">
            <div className="flex items-center gap-5 text-sm font-semibold">
                <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-75">
                    <span className="logo-sm" aria-hidden="true" />
                    <h4>Session <br /> -ZERO-</h4>
                </Link>
                <span className="h-7 border-l-2 border-[var(--theme-orange)]" aria-hidden="true" />
                <Link href="/campaigns" className="transition-opacity hover:opacity-75">
                    View Campaigns
                </Link>
            </div>

            <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-[var(--theme-orange)]">Hello, {username}</span>
                <form action={logout} className="flex items-center">
                    <button
                        className="button-light rounded-md px-3 py-1 text-xs text-white transition-colors"
                        type="submit"
                    >
                        Log out
                    </button>
                </form>
            </div>
        </nav>
    );
}
