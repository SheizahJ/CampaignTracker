/*
  This page manages the default layout/structure of the website. Try to keep changes to a minimum
*/

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { cookies } from "next/headers";
import Navbar from "@/components/Navbar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Session Zero",
  description: "A campaign tracking site",
  icons: {
    icon: "/session_zero_logo.png", // put the icon.png into public/
  },
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const cookieStore = await cookies();
  const isLoggedIn = cookieStore.has("signed_in");
  const username = cookieStore.get("username")?.value;

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {isLoggedIn && <Navbar username={username} />}
        {children}
      </body>
    </html>
  );
}
