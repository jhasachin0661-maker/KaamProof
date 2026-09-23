"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  QrCode,
  Calendar,
  Clock,
  Briefcase,
  UserCheck,
  Building2,
  FileText,
  Lock,
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
          const publicUrl = window.location.href;
          const qrDataUrl = await QRCode.toDataURL(publicUrl, { margin: 1, width: 180 });
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

  return (
    <div className="min-h-screen bg-stone-900 text-stone-100 flex flex-col justify-between p-4 sm:p-8 font-sans">
      <div className="max-w-2xl mx-auto w-full">
        {/* Header Branding */}
        <div className="flex items-center justify-between mb-8 border-b border-stone-800 pb-4">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center font-bold text-white text-xl shadow-lg shadow-emerald-900/50">
              क
            </div>
            <div>
              <div className="text-xl font-bold tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                KaamProof
              </div>
              <div className="text-xs text-stone-400">Public Work Verification Registry</div>
            </div>
          </Link>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-stone-800 text-stone-300 border border-stone-700">
            Open Registry
          </span>
        </div>

        {loading ? (
          <div className="bg-stone-800/80 border border-stone-700 rounded-2xl p-12 text-center shadow-xl backdrop-blur-md">
            <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-stone-200">Verifying Cryptographic Registry...</h2>
            <p className="text-sm text-stone-400 mt-1">Comparing SHA-256 canonical hash with tamper-evident state</p>
          </div>
        ) : error || !data?.found ? (
          <div className="bg-stone-800/80 border border-red-500/30 rounded-2xl p-8 text-center shadow-xl">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white">Certificate Not Found</h2>
            <p className="text-stone-400 text-sm mt-2 max-w-md mx-auto">
              Certificate identifier <span className="font-mono text-red-400">{certId}</span> was not located in the
              official KaamProof database. Ensure you scanned an authentic QR code.
            </p>
            <div className="mt-6">
              <Link
                href="/"
                className="inline-block px-5 py-2.5 rounded-xl bg-stone-700 hover:bg-stone-600 text-sm font-semibold text-white transition-colors"
              >
                Return to KaamProof Home
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-stone-800/90 border border-stone-700 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-sm relative overflow-hidden">
            {/* Top verification badge */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-700/80">
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                    data.integrityValid
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                      : "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                  }`}
                >
                  {data.integrityValid ? <ShieldCheck className="w-7 h-7" /> : <AlertTriangle className="w-7 h-7" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold tracking-wider text-emerald-400 uppercase">
                      Official Proof-of-Work
                    </span>
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span className="text-xs text-stone-400 font-mono">{data.certificate?.certificateNumber}</span>
                  </div>
                  <h1 className="text-2xl font-bold text-white mt-0.5">
                    {data.integrityValid ? "Verified Work Record" : "Integrity Warning"}
                  </h1>
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    data.certificate?.certificateStatus === "Fully Confirmed"
                      ? "bg-emerald-950 text-emerald-300 border border-emerald-700"
                      : "bg-amber-950 text-amber-300 border border-amber-700"
                  }`}
                >
                  {data.certificate?.certificateStatus}
                </span>
                <span className="text-[11px] text-stone-400 mt-1">
                  Issued: {new Date(data.certificate?.generatedAt || "").toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Privacy notice banner */}
            <div className="mt-4 p-3 bg-stone-900/60 rounded-xl border border-stone-800 flex items-center gap-2.5 text-xs text-stone-400">
              <Lock className="w-4 h-4 text-stone-400 shrink-0" />
              <span>
                <strong>Privacy Guaranteed:</strong> Worker phone number, residential address, and raw GPS are
                redacted. Only cryptographically verified work metrics are shown publicly.
              </span>
            </div>

            {/* Core Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <div className="p-4 bg-stone-900/40 rounded-xl border border-stone-700/60">
                <div className="flex items-center gap-2 text-xs font-semibold text-stone-400 mb-1">
                  <UserCheck className="w-4 h-4 text-emerald-400" /> Worker Identity
                </div>
                <div className="text-lg font-bold text-white">{data.certificate?.workerDisplayName}</div>
                <div className="text-xs text-stone-400 mt-0.5">{data.certificate?.occupation}</div>
              </div>

              <div className="p-4 bg-stone-900/40 rounded-xl border border-stone-700/60">
                <div className="flex items-center gap-2 text-xs font-semibold text-stone-400 mb-1">
                  <Building2 className="w-4 h-4 text-emerald-400" /> Employer / Household
                </div>
                <div className="text-lg font-bold text-white">{data.certificate?.employerDisplayName}</div>
                <div className="text-xs text-stone-400 mt-0.5">Verified Relationship & Settlement</div>
              </div>
            </div>

            {/* Verified Metrics Row */}
            <div className="grid grid-cols-3 gap-3 mt-4 text-center">
              <div className="p-3 bg-emerald-950/30 rounded-xl border border-emerald-800/40">
                <div className="text-2xl font-black text-emerald-400">{data.certificate?.confirmedWorkdays}</div>
                <div className="text-xs text-stone-400 mt-1">Confirmed Days</div>
              </div>

              <div className="p-3 bg-stone-900/60 rounded-xl border border-stone-700/60">
                <div className="text-2xl font-black text-white">{data.certificate?.confirmedHours}</div>
                <div className="text-xs text-stone-400 mt-1">Confirmed Hours</div>
              </div>

              <div className="p-3 bg-stone-900/60 rounded-xl border border-stone-700/60">
                <div className="text-2xl font-black text-stone-300">{data.certificate?.agreedWageRate}</div>
                <div className="text-xs text-stone-400 mt-1">Agreed Wage</div>
              </div>
            </div>

            {/* Validity Period & QR */}
            <div className="mt-6 pt-6 border-t border-stone-700/80 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-sm text-stone-300 w-full sm:w-auto">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-stone-400" />
                  <span>
                    Period: <strong className="text-white">{data.certificate?.periodStart}</strong> to{" "}
                    <strong className="text-white">{data.certificate?.periodEnd}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-stone-400" />
                  <span>
                    Disputed Sessions:{" "}
                    <strong className="text-amber-400">{data.certificate?.disputedSessionsCount}</strong>
                  </span>
                </div>
                <div className="text-xs text-stone-400 font-mono break-all mt-2 pt-2 border-t border-stone-800">
                  SHA-256 Hash: {data.certificate?.canonicalHash}
                </div>
              </div>

              {qrSrc && (
                <div className="p-2 bg-white rounded-xl shadow-lg shrink-0 flex flex-col items-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={qrSrc} alt="Verification QR Code" className="w-28 h-28" />
                  <span className="text-[10px] font-bold text-stone-800 mt-1 font-mono">SCAN TO VERIFY</span>
                </div>
              )}
            </div>

            {/* Bottom confirmation stamp */}
            <div className="mt-6 pt-4 border-t border-stone-800 flex items-center justify-between text-xs text-stone-400">
              <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <CheckCircle2 className="w-4 h-4" /> Server Timestamps & Mutual Acceptance Enforced
              </span>
              <span>KaamProof v1.0</span>
            </div>
          </div>
        )}

        <div className="mt-6 text-center text-xs text-stone-400">
          Attendance answers: <em>Did you work today?</em> KaamProof answers:{" "}
          <strong>Can you prove your work history after the job is over?</strong>
        </div>
      </div>
    </div>
  );
}
