"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { logout } from "../app/login/logout";
import Notifications from "./Notifications";

type NavbarProps = {
    username?: string;
};

const navigationLinks = [
    { href: "/campaigns", label: "View Campaigns" },
    { href: "/character", label: "My Characters" },
];

export default function Navbar({ username }: NavbarProps) {
    const pathname = usePathname();
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const hasNotifications = true;
    const notificationsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function closeNotifications(event: MouseEvent) {
            if (
                notificationsRef.current &&
                !notificationsRef.current.contains(event.target as Node)
            ) {
                setNotificationsOpen(false);
            }
        }

        document.addEventListener("mousedown", closeNotifications);
        return () => document.removeEventListener("mousedown", closeNotifications);
    }, []);

    return (
        <nav className="flex items-center justify-between border-b border-black/10 px-4 py-3">
            <div className="flex items-center gap-5 text-sm font-semibold">
                <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-75">
                    <span className="logo-sm" aria-hidden="true" />
                    <h4>Session <br /> -ZERO-</h4>
                </Link>
                <span className="h-7 border-l-2 border-[var(--theme-orange)]" aria-hidden="true" />
                {navigationLinks.map(({ href, label }) => {
                    const isActive = pathname === href || pathname.startsWith(`${href}/`);

                    return (
                        <Link
                            key={label}
                            href={href}
                            className={`transition-opacity hover:opacity-75 ${
                                isActive ? "border-b-1 border-current" : ""
                            }`}
                            aria-current={isActive ? "page" : undefined}
                        >
                            {label}
                        </Link>
                    );
                })}
            </div>

            <div className="flex items-center gap-3">
                <div ref={notificationsRef} className="relative">
                    <button
                        className="relative flex h-8 w-8 items-center justify-center rounded-md bg-[var(--theme-orange)] transition-colors hover:bg-[#bd7d0f]"
                        type="button"
                        aria-label="Notifications"
                        aria-expanded={notificationsOpen}
                        onClick={() => setNotificationsOpen(!notificationsOpen)}
                    >
                        <Image src="/notification_icon.png" alt="" width={24} height={24} />
                        {hasNotifications && (
                            <span
                                className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-red-600"
                                aria-label="New notification"
                            />
                        )}
                    </button>
                    {notificationsOpen && (
                        <Notifications />
                    )}
                </div>

                <div className="flex flex-col items-stretch gap-1">
                    <span className="text-sm font-bold uppercase text-[var(--theme-orange)]">
                        {username && username.length > 10 ? `${username.slice(0, 10)}...` : username}
                    </span>
                    <form action={logout} className="flex w-full items-center">
                        <button
                            className="no-bg w-full px-0 py-0 text-center text-xs text-[var(--theme-orange)] underline transition-opacity hover:opacity-75"
                            type="submit"
                        >
                            Sign out
                        </button>
                    </form>
                </div>
            </div>
        </nav>
    );
}
