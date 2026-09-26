"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  QrCode,
  Calendar,
  Building2,
  FileText,
  Lock,
  UserCheck,
} from "lucide-react";
import QRCode from "qrcode";
import Link from "next/link";

interface CertData {
  certificateNumber: string;
  workerDisplayName: string;
  employerDisplayName: string;
  occupation: string;
  periodStart: string;
  periodEnd: string;
  confirmedWorkdays: number;
  confirmedHours: string;
  disputedSessionsCount: number;
  agreedWageRate: string;
  certificateStatus: string;
  generatedAt: string;
  canonicalHash: string;
}

export default function VerifyPage({ params }: { params: Promise<{ certificateId: string }> }) {
  const [certId, setCertId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<{
    found: boolean;
    integrityValid: boolean;
    isRevoked: boolean;
    certificate?: CertData;
  } | null>(null);
  const [qrSrc, setQrSrc] = useState<string>("");

  const fetchCertificate = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/verify/${id}`);
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Certificate record could not be found");
        setData(null);
      } else {
        setData(json);
        if (json.found && json.certificate) {
          const qrDataUrl = await QRCode.toDataURL(window.location.href, { margin: 1, width: 180 });
          setQrSrc(qrDataUrl);
        }
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    params.then((p) => {
      setCertId(p.certificateId);
      void fetchCertificate(p.certificateId);
    });
  }, [params]);

  const statusIsConfirmed = data?.certificate?.certificateStatus === "Fully Confirmed";

  return (
    <div className="min-h-screen bg-kp-bg px-4 py-5 text-kp-ink sm:px-8 sm:py-8">
      <div className="mx-auto max-w-3xl">
        <header className="mb-6 flex items-center justify-between border-b border-kp-border pb-4">
          <Link href="/" className="flex items-center gap-3 rounded-lg" aria-label="KaamProof home">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-kp-primary text-sm font-black text-white shadow-sm">
              KP
            </span>
            <span>
              <span className="block text-xl font-black tracking-tight text-kp-ink">KaamProof</span>
              <span className="block text-xs font-semibold text-kp-subtle">Public Work Verification Registry</span>
            </span>
          </Link>
          <span className="rounded-full border border-kp-border bg-white px-3 py-1 text-xs font-bold text-kp-primary-strong">
            Open Registry
          </span>
        </header>

        {loading ? (
          <section className="rounded-lg border border-kp-border bg-white p-10 text-center shadow-xl shadow-sky-950/10">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-kp-primary border-t-transparent" />
            <h1 className="text-lg font-black text-kp-ink">Verifying registry record</h1>
            <p className="mt-2 text-sm leading-6 text-kp-subtle">Comparing the canonical hash with the public certificate state.</p>
          </section>
        ) : error || !data?.found ? (
          <section className="rounded-lg border border-red-200 bg-white p-8 text-center shadow-xl shadow-red-950/5">
            <XCircle className="mx-auto mb-4 h-16 w-16 text-red-600" />
            <h1 className="text-2xl font-black text-kp-ink">Certificate not found</h1>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-kp-subtle">
              Certificate identifier <span className="font-mono font-bold text-red-700">{certId}</span> was not located in
              the KaamProof database. Ensure you scanned an authentic QR code.
            </p>
            <Link
              href="/"
              className="mt-6 inline-flex min-h-11 items-center rounded-lg bg-kp-primary px-5 text-sm font-black text-white hover:bg-kp-primary-strong"
            >
              Return home
            </Link>
          </section>
        ) : (
          <section className="overflow-hidden rounded-lg border border-kp-border bg-white shadow-xl shadow-sky-950/10">
            <div className="flex flex-col gap-4 border-b border-sky-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <div className="flex items-start gap-4">
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border ${
                    data.integrityValid
                      ? "border-sky-200 bg-sky-50 text-kp-primary"
                      : "border-amber-200 bg-amber-50 text-amber-700"
                  }`}
                >
                  {data.integrityValid ? <ShieldCheck className="h-7 w-7" /> : <AlertTriangle className="h-7 w-7" />}
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-kp-primary">Official proof-of-work</p>
                  <h1 className="mt-1 text-2xl font-black tracking-tight text-kp-ink">
                    {data.integrityValid ? "Verified work record" : "Integrity warning"}
                  </h1>
                  <p className="mt-1 break-all font-mono text-xs font-semibold text-kp-subtle">
                    {data.certificate?.certificateNumber}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end">
                <span
                  className={`rounded-full border px-3 py-1 text-xs font-black uppercase tracking-[0.12em] ${
                    statusIsConfirmed
                      ? "border-sky-200 bg-sky-50 text-kp-primary-strong"
                      : "border-amber-200 bg-amber-50 text-amber-800"
                  }`}
                >
                  {data.certificate?.certificateStatus}
                </span>
                <span className="text-xs font-semibold text-kp-subtle">
                  Issued {new Date(data.certificate?.generatedAt || "").toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="p-5 sm:p-6">
              <div className="flex items-start gap-3 rounded-lg border border-sky-100 bg-sky-50/70 p-4 text-sm leading-6 text-kp-subtle">
                <Lock className="mt-0.5 h-5 w-5 shrink-0 text-kp-primary" />
                <span>
                  <strong className="text-kp-primary-strong">Privacy notice:</strong> phone number, residential address,
                  raw GPS and private notes are redacted from this public page.
                </span>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <InfoCard icon={<UserCheck className="h-4 w-4" />} label="Worker identity" value={data.certificate?.workerDisplayName} note={data.certificate?.occupation} />
                <InfoCard icon={<Building2 className="h-4 w-4" />} label="Employer / household" value={data.certificate?.employerDisplayName} note="Verified relationship and settlement" />
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <Metric value={data.certificate?.confirmedWorkdays} label="Confirmed days" tone="primary" />
                <Metric value={data.certificate?.confirmedHours} label="Confirmed hours" />
                <Metric value={data.certificate?.agreedWageRate} label="Agreed wage" />
              </div>

              <div className="mt-6 flex flex-col gap-6 border-t border-sky-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-3 text-sm text-kp-subtle">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-kp-primary" />
                    <span>
                      Period: <strong className="text-kp-ink">{data.certificate?.periodStart}</strong> to{" "}
                      <strong className="text-kp-ink">{data.certificate?.periodEnd}</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-kp-primary" />
                    <span>
                      Disputed sessions: <strong className="text-amber-700">{data.certificate?.disputedSessionsCount}</strong>
                    </span>
                  </div>
                  <p className="break-all border-t border-sky-100 pt-3 font-mono text-xs">SHA-256: {data.certificate?.canonicalHash}</p>
                </div>

                {qrSrc && (
                  <div className="flex shrink-0 flex-col items-center rounded-lg border border-sky-100 bg-white p-3 shadow-sm">
                    <QrCode className="mb-2 h-5 w-5 text-kp-primary" />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={qrSrc} alt="Verification QR Code" className="h-28 w-28" />
                    <span className="mt-2 text-[10px] font-black uppercase tracking-[0.12em] text-kp-primary-strong">Scan to verify</span>
                  </div>
                )}
              </div>

              <div className="mt-6 flex flex-col gap-3 border-t border-sky-100 pt-4 text-xs font-semibold text-kp-subtle sm:flex-row sm:items-center sm:justify-between">
                <span className="flex items-center gap-2 text-kp-primary-strong">
                  <CheckCircle2 className="h-4 w-4 text-kp-primary" />
                  Server timestamps and mutual acceptance enforced
                </span>
                <span>KaamProof v2.0</span>
              </div>
            </div>
          </section>
        )}

        <p className="mt-6 text-center text-xs leading-6 text-kp-subtle">
          Attendance answers: <em>Did you work today?</em> KaamProof answers:{" "}
          <strong className="text-kp-primary-strong">Can you prove your work history after the job is over?</strong>
        </p>
      </div>
    </div>
  );
}

function InfoCard({ icon, label, value, note }: { icon: React.ReactNode; label: string; value?: string; note?: string }) {
  return (
    <div className="rounded-lg border border-sky-100 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-kp-subtle">
        <span className="text-kp-primary">{icon}</span>
        {label}
      </div>
      <div className="mt-2 text-lg font-black text-kp-ink">{value}</div>
      {note && <div className="mt-1 text-xs font-semibold text-kp-subtle">{note}</div>}
    </div>
  );
}

function Metric({ value, label, tone = "neutral" }: { value?: string | number; label: string; tone?: "neutral" | "primary" }) {
  return (
    <div className={`rounded-lg border p-4 text-center ${tone === "primary" ? "border-kp-border bg-sky-50" : "border-sky-100 bg-white"}`}>
      <div className="text-2xl font-black text-kp-primary-strong">{value}</div>
      <div className="mt-1 text-xs font-bold text-kp-subtle">{label}</div>
    </div>
  );
}
