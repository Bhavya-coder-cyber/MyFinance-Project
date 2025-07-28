"use client";
import React from "react";

export default function ComingSoon() {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen"
      style={{ fontFamily: "inherit" }}
    >
      <div className="shadow-xl rounded-xl p-10 md:p-16 flex flex-col items-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 shadow-2xl">
          🚧 Coming Soon 🚧
        </h1>
        <p className="text-xl md:text-2xl mb-6 text-gray-500 text-center max-w-xl">
          We’re building something amazing! This page will be available soon.<br />
          Stay tuned for updates.
        </p>
      </div>
      <p className="mt-6 text-sm text-gray-400 font-mono">© {new Date().getFullYear()} MyFinance</p>
    </div>
  );
}
