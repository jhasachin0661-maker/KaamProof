"use client";

import type { Relationship } from "@/lib/types";

interface Props {
  relationships: Relationship[];
  isWorker: boolean;
  onRespond: (relationshipId: string, decision: "accept" | "reject") => void;
  onAgreementDecision: (agreementId: string, action: "accept_agreement" | "reject_agreement") => void;
}

/** Employment requests and wage proposals waiting for a response (both roles). */
export function PendingRequests({ relationships, isWorker, onRespond, onAgreementDecision }: Props) {
  if (!relationships.some((r) => r.status === "pending" || r.pendingAgreement)) return null;

  return (
    <section aria-label="Pending requests" className="mb-6 space-y-3 rounded-lg border border-amber-200 bg-amber-50 p-4 shadow-sm">
      <h2 className="text-sm font-black text-amber-900">लंबित अनुरोध (Pending requests)</h2>

      {relationships
        .filter((r) => r.status === "pending")
        .map((r) => (
          <div key={r.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-amber-100 bg-white p-3 text-sm">
            <div>
              <div className="font-bold text-slate-950">
                {isWorker ? r.employerName : r.workerName} — {r.roleTitle}
              </div>
              <div className="text-xs font-medium text-slate-600">
                {r.agreement ? `₹${r.agreement.wageAmount}/${r.agreement.wageType} (v${r.agreement.version})` : ""}{" "}
                {r.awaitingMyResponse ? "· आपके उत्तर की प्रतीक्षा" : "· दूसरे पक्ष के उत्तर की प्रतीक्षा"}
              </div>
            </div>
            {r.awaitingMyResponse && (
              <div className="flex gap-2">
                <button onClick={() => onRespond(r.id, "accept")} className="min-h-11 rounded-lg bg-sky-700 px-4 text-xs font-bold text-white hover:bg-sky-800">
                  स्वीकार करें
                </button>
                <button onClick={() => onRespond(r.id, "reject")} className="min-h-11 rounded-lg border border-slate-200 bg-white px-4 text-xs font-bold text-slate-700 hover:border-slate-300">
                  अस्वीकार
                </button>
              </div>
            )}
          </div>
        ))}

      {relationships
        .filter((r) => r.status === "active" && r.pendingAgreement)
        .map((r) => {
          const a = r.pendingAgreement!;
          const mine = (isWorker ? a.workerAcceptedAt : a.employerAcceptedAt) && !(isWorker ? a.employerAcceptedAt : a.workerAcceptedAt);

          return (
            <div key={a.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-amber-100 bg-white p-3 text-sm">
              <div>
                <div className="font-bold text-slate-950">
                  नया वेतन प्रस्ताव v{a.version}: ₹{a.wageAmount}/{a.wageType}
                </div>
                <div className="text-xs font-medium text-slate-600">
                  {isWorker ? r.employerName : r.workerName} · {mine ? "आपने प्रस्ताव भेजा — उत्तर की प्रतीक्षा" : "आपके उत्तर की प्रतीक्षा"}
                </div>
              </div>
              {!mine && (
                <div className="flex gap-2">
                  <button onClick={() => onAgreementDecision(a.id, "accept_agreement")} className="min-h-11 rounded-lg bg-sky-700 px-4 text-xs font-bold text-white hover:bg-sky-800">
                    स्वीकार करें
                  </button>
                  <button onClick={() => onAgreementDecision(a.id, "reject_agreement")} className="min-h-11 rounded-lg border border-slate-200 bg-white px-4 text-xs font-bold text-slate-700 hover:border-slate-300">
                    अस्वीकार
                  </button>
                </div>
              )}
            </div>
          );
        })}
    </section>
  );
}
