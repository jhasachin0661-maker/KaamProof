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
  const handleRespondEmployment = onRespond;
  const handleAgreementDecision = onAgreementDecision;
  return (
    <>
                        {relationships.some((r) => r.status === "pending" || r.pendingAgreement) && (
              <section aria-label="Pending requests" className="mb-6 rounded-2xl border border-amber-700/50 bg-amber-950/30 p-4 space-y-3">
                <h2 className="text-sm font-black text-amber-300">लंबित अनुरोध (Pending requests)</h2>
                {relationships.filter((r) => r.status === "pending").map((r) => (
                  <div key={r.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-stone-950 border border-stone-800 p-3 text-sm">
                    <div>
                      <div className="font-bold text-white">{isWorker ? r.employerName : r.workerName} — {r.roleTitle}</div>
                      <div className="text-xs text-stone-400">
                        {r.agreement ? `₹${r.agreement.wageAmount}/${r.agreement.wageType} (v${r.agreement.version})` : ""}{" "}
                        {r.awaitingMyResponse ? "· आपके उत्तर की प्रतीक्षा" : "· दूसरे पक्ष के उत्तर की प्रतीक्षा"}
                      </div>
                    </div>
                    {r.awaitingMyResponse && (
                      <div className="flex gap-2">
                        <button onClick={() => handleRespondEmployment(r.id, "accept")} className="min-h-11 px-4 rounded-xl bg-emerald-600 text-stone-950 font-bold text-xs cursor-pointer">स्वीकार करें</button>
                        <button onClick={() => handleRespondEmployment(r.id, "reject")} className="min-h-11 px-4 rounded-xl bg-stone-800 text-stone-200 font-bold text-xs cursor-pointer">अस्वीकार</button>
                      </div>
                    )}
                  </div>
                ))}
                {relationships.filter((r) => r.status === "active" && r.pendingAgreement).map((r) => {
                  const a = r.pendingAgreement!;
                  const mine = (isWorker ? a.workerAcceptedAt : a.employerAcceptedAt) && !(isWorker ? a.employerAcceptedAt : a.workerAcceptedAt);
                  return (
                    <div key={a.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-stone-950 border border-stone-800 p-3 text-sm">
                      <div>
                        <div className="font-bold text-white">नया वेतन प्रस्ताव v{a.version}: ₹{a.wageAmount}/{a.wageType}</div>
                        <div className="text-xs text-stone-400">{isWorker ? r.employerName : r.workerName} · {mine ? "आपने प्रस्ताव भेजा — उत्तर की प्रतीक्षा" : "आपके उत्तर की प्रतीक्षा"}</div>
                      </div>
                      {!mine && (
                        <div className="flex gap-2">
                          <button onClick={() => handleAgreementDecision(a.id, "accept_agreement")} className="min-h-11 px-4 rounded-xl bg-emerald-600 text-stone-950 font-bold text-xs cursor-pointer">स्वीकार करें</button>
                          <button onClick={() => handleAgreementDecision(a.id, "reject_agreement")} className="min-h-11 px-4 rounded-xl bg-stone-800 text-stone-200 font-bold text-xs cursor-pointer">अस्वीकार</button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </section>
            )}
    </>
  );
}
