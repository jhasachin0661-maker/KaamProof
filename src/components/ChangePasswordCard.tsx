"use client";

import { useState } from "react";

/** Change password while logged in. Other devices are signed out by the server. */
export function ChangePasswordCard() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch("/api/auth/password", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: current, newPassword: next }),
      });
      const data = await res.json();
      if (res.ok) {
        setMsg({ ok: true, text: "पासवर्ड बदल गया। दूसरे डिवाइस लॉगआउट हो गए।" });
        setCurrent("");
        setNext("");
      } else {
        setMsg({ ok: false, text: data.message_hi || data.message_en || "Failed" });
      }
    } finally {
      setBusy(false);
    }
  };

  const input = "w-full px-3.5 py-3 rounded-xl bg-stone-950 border border-stone-800 text-white focus:outline-none focus:border-emerald-500 text-sm";
  return (
    <form onSubmit={submit} className="mt-3 space-y-3 max-w-sm">
      <div>
        <label htmlFor="cp-cur" className="text-xs text-stone-400 block mb-1">मौजूदा पासवर्ड</label>
        <input id="cp-cur" type="password" autoComplete="current-password" required value={current} onChange={(e) => setCurrent(e.target.value)} className={input} />
      </div>
      <div>
        <label htmlFor="cp-new" className="text-xs text-stone-400 block mb-1">नया पासवर्ड (10+ अक्षर, अक्षर + अंक)</label>
        <input id="cp-new" type="password" autoComplete="new-password" required minLength={10} value={next} onChange={(e) => setNext(e.target.value)} className={input} />
      </div>
      <button type="submit" disabled={busy} className="min-h-11 px-5 rounded-xl bg-emerald-600 text-stone-950 font-bold text-xs cursor-pointer disabled:opacity-50">
        {busy ? "..." : "पासवर्ड बदलें"}
      </button>
      {msg && <p role="status" className={`text-xs ${msg.ok ? "text-emerald-400" : "text-red-400"}`}>{msg.text}</p>}
    </form>
  );
}
