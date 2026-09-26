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

  const input = "w-full rounded-lg border border-sky-100 bg-white px-3.5 py-3 text-sm font-semibold text-slate-950 shadow-sm focus:border-sky-700 focus:outline-none";

  return (
    <form onSubmit={submit} className="mt-3 max-w-sm space-y-3">
      <div>
        <label htmlFor="cp-cur" className="mb-1 block text-xs font-bold text-slate-600">
          मौजूदा पासवर्ड
        </label>
        <input id="cp-cur" type="password" autoComplete="current-password" required value={current} onChange={(e) => setCurrent(e.target.value)} className={input} />
      </div>
      <div>
        <label htmlFor="cp-new" className="mb-1 block text-xs font-bold text-slate-600">
          नया पासवर्ड (10+ अक्षर, अक्षर + अंक)
        </label>
        <input id="cp-new" type="password" autoComplete="new-password" required minLength={10} value={next} onChange={(e) => setNext(e.target.value)} className={input} />
      </div>
      <button type="submit" disabled={busy} className="min-h-11 rounded-lg bg-sky-700 px-5 text-xs font-bold text-white hover:bg-sky-800 disabled:opacity-50">
        {busy ? "..." : "पासवर्ड बदलें"}
      </button>
      {msg && (
        <p role="status" className={`text-xs font-semibold ${msg.ok ? "text-sky-700" : "text-red-600"}`}>
          {msg.text}
        </p>
      )}
    </form>
  );
}
