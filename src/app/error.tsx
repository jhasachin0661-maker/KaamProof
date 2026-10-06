"use client";

import { useEffect } from "react";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Keep the client boundary quiet in production; the server logger owns diagnostics.
  }, []);
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f7f2] px-5 text-[#17211b]">
      <section className="w-full max-w-md rounded-[14px] border border-[#e5e8e2] bg-white p-6 text-center shadow-sm">
        <h1 className="text-xl font-black">KaamProof temporarily unavailable</h1>
        <p className="mt-2 text-sm text-[#4f5b53]">The page could not be loaded. Please try again.</p>
        <button type="button" onClick={reset} className="mt-5 min-h-12 rounded-[10px] bg-[#174d3a] px-5 text-sm font-bold text-white">Try again</button>
      </section>
    </main>
  );
}
