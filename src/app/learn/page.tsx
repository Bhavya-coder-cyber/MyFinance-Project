"use client";
import ChatDemo from "@/components/chat-demo";
import { ModeToggle } from "@/components/darkmode";
import Link from "next/link";

export default function Home() {
  return (
    <>
    <nav className="sticky top-0 z-50 shadow-md py-3 px-10 flex items-center justify-between text-xl transition-all duration-500 bg-gray-950 rounded-2xl">
            {/* MyFinance Logo Title */}
            <div
              className="text-2xl font-bold italic font-serif text-white dark:text-white"
            >
              <Link href="/">MyFinance</Link>
            </div>

            {/* Right-side Nav Links */}
            <div className="flex gap-7 w-screen justify-end">
              <Link href="/login" className=" text-white dark:text-white">
                Login
              </Link>
              <Link href="/signup" className=" text-white dark:text-white">
                Register
              </Link>
              <Link href="/learn" className=" text-white dark:text-white">
                Learn
              </Link>
              <Link href="/news" className=" text-white dark:text-white">
                News
              </Link>
              <ModeToggle />
            </div>
          </nav>
    <main className="flex min-h-[88vh] flex-col px-15">
    <ChatDemo />
    </main>
    </>
  )
}