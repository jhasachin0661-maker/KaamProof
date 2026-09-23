"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function ResetForm() {
  const token = useSearchParams().get("token") || "";
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await fetch("/api/auth/reset", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token, password }) });
      const data = await res.json();
      setStatus(res.ok ? { ok: true, text: "पासवर्ड बदल गया। अब लॉगिन करें।" } : { ok: false, text: data.message_hi || data.message_en || "Failed" });
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-5 bg-stone-950 text-stone-100">
      <form onSubmit={submit} className="w-full max-w-sm space-y-4 rounded-2xl border border-stone-800 bg-stone-900 p-6">
        <h1 className="text-xl font-black">नया पासवर्ड सेट करें</h1>
        {!token && <p className="text-sm text-red-400">रीसेट लिंक अमान्य है। ईमेल का लिंक दोबारा खोलें।</p>}
        <div>
          <label htmlFor="np" className="text-xs text-stone-400 block mb-1">नया पासवर्ड (10+ अक्षर, अक्षर + अंक)</label>
          <input id="np" type="password" autoComplete="new-password" required minLength={10} value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3.5 py-3 rounded-xl bg-stone-950 border border-stone-800 text-white focus:outline-none focus:border-emerald-500 text-sm" />
        </div>
        <button type="submit" disabled={busy || !token} className="w-full min-h-12 rounded-xl bg-emerald-500 text-stone-950 font-bold disabled:opacity-50">पासवर्ड बदलें</button>
        {status && <p role="status" className={`text-sm ${status.ok ? "text-emerald-400" : "text-red-400"}`}>{status.text}</p>}
        <Link href="/app" className="block text-center text-xs text-emerald-400 underline min-h-11 leading-[2.75rem]">लॉगिन पर जाएं</Link>
      </form>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetForm />
    </Suspense>
  );
}
