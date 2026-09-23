"use client";

import React, { useState, useEffect, useSyncExternalStore } from "react";
import {
  Play,
  Square,
  ShieldCheck,
  CheckCircle2,
  Clock,
  MapPin,
  AlertTriangle,
  DollarSign,
  Download,
  Building,
  User,
  Award,
  History,
  Languages,
  AlertCircle,
  HelpCircle,
  PlusCircle,
  ExternalLink,
  Wifi,
  WifiOff,
  Sparkles,
  LogOut,
  KeyRound,
  Mail,
  Phone,
  Lock,
  ArrowRight,
  FileText,
  Share2,
  Copy,
} from "lucide-react";
import QRCode from "qrcode";
import confetti from "canvas-confetti";
import { translations, Lang } from "@/lib/i18n";

import type { UserData, WorkerProfile, Relationship, WorkSession, Payment, Dispute, Certificate, Anomaly, WorkerMetrics } from "@/lib/types";
import { PendingRequests } from "@/components/PendingRequests";
import { ChangePasswordCard } from "@/components/ChangePasswordCard";

const newKey = (prefix: string) => `${prefix}-${crypto.randomUUID()}`;
const subscribeOnline = (cb: () => void) => {
  window.addEventListener("online", cb);
  window.addEventListener("offline", cb);
  return () => {
    window.removeEventListener("online", cb);
    window.removeEventListener("offline", cb);
  };
};

export default function KaamProofApp() {
  const [lang, setLang] = useState<Lang>("hi");
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserData | null>(null);
  const [profile, setProfile] = useState<WorkerProfile | null>(null);
  const [authChecking, setAuthChecking] = useState<boolean>(true);

  // Auth Login / Registration Form State
  const [authMode, setAuthMode] = useState<"login" | "register" | "forgot">("login");
  const [selectedAuthRole, setSelectedAuthRole] = useState<"worker" | "employer">("worker");
  const [authEmail, setAuthEmail] = useState<string>("");
  const [authPassword, setAuthPassword] = useState<string>("");
  const [authName, setAuthName] = useState<string>("");
  const [authSkillOrCompany, setAuthSkillOrCompany] = useState<string>("");
  const [authCity, setAuthCity] = useState<string>("New Delhi");

  // Navigation Tabs
  // For Worker: 'home' | 'history' | 'paisa' | 'passport' | 'disputes' | 'profile'
  // For Employer (who also has Admin access): 'employer_portal' | 'admin_center'
  const [activeTab, setActiveTab] = useState<string>("home");
  const [employerWorkspaceMode, setEmployerWorkspaceMode] = useState<"employer" | "admin">("employer");

  // Core Data
  const [metrics, setMetrics] = useState<WorkerMetrics | null>(null);
  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const [availableEmployers, setAvailableEmployers] = useState<any[]>([]);
  const [sessions, setSessions] = useState<WorkSession[]>([]);
  const [paymentsList, setPaymentsList] = useState<Payment[]>([]);
  const [disputesList, setDisputesList] = useState<Dispute[]>([]);
  const [certificatesList, setCertificatesList] = useState<Certificate[]>([]);
  const [anomaliesList, setAnomaliesList] = useState<Anomaly[]>([]);
  const [auditLogsList, setAuditLogsList] = useState<any[]>([]);

  // Action states
  const [loading, setLoading] = useState<boolean>(false);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [locationStatus, setLocationStatus] = useState<string>("");
  const [offlinePendingQueue, setOfflinePendingQueue] = useState<any[]>([]);
  const isOnline = useSyncExternalStore(subscribeOnline, () => navigator.onLine, () => true);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  // Modals
  const [showNewPaymentModal, setShowNewPaymentModal] = useState<boolean>(false);
  const [showDisputeModal, setShowDisputeModal] = useState<boolean>(false);
  const [showAddEmployerModal, setShowAddEmployerModal] = useState<boolean>(false);
  const [showCertificateModal, setShowCertificateModal] = useState<Certificate | null>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");

  // Form states
  const [paymentAmount, setPaymentAmount] = useState<string>("4500");
  const [paymentMethod, setPaymentMethod] = useState<string>("Direct Bank Transfer");
  const [paymentNote, setPaymentNote] = useState<string>("");
  const [disputeCategory, setDisputeCategory] = useState<string>("wrong_duration");
  const [disputeDesc, setDisputeDesc] = useState<string>("");
  const [selectedExistingEmployerId, setSelectedExistingEmployerId] = useState<string>("");
  const [counterpartyIdentifier, setCounterpartyIdentifier] = useState<string>("");
  const [counterpartyName, setCounterpartyName] = useState<string>("");
  const [newEmployerWage, setNewEmployerWage] = useState<string>("450");
  const [newEmployerRole, setNewEmployerRole] = useState<string>("Domestic Cook & Kitchen Specialist");

  const t = translations[lang];

  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  // Authenticated fetch helper. Identity lives ONLY in the HttpOnly session cookie (never in JS-readable storage).
  // The optional token argument is ignored; it is kept so existing call sites stay simple.
  const authFetch = async (url: string, options: RequestInit = {}, _unused?: string) => {
    void _unused;
    const headers = new Headers(options.headers || {});
    if (options.body && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }
    const res = await fetch(url, { ...options, headers, credentials: "same-origin" });
    if (!res.ok && options.method && options.method !== "GET") {
      try {
        const err = await res.clone().json();
        showToast(err.message_hi || err.message_en || err.error || "Request failed", "error");
      } catch {
        showToast("Request failed", "error");
      }
    }
    return res;
  };

  // `accessToken` is only a non-secret "signed in" marker so existing guards keep working.
  const SESSION_MARKER = "cookie-session";

  async function verifyAndLoadSession() {
    try {
      const res = await fetch("/api/auth/me", { credentials: "same-origin" });
      if (!res.ok) {
        setAccessToken(null);
        setUser(null);
        return;
      }
      const data = await res.json();
      if (data.user) {
        setAccessToken(SESSION_MARKER);
        setUser(data.user);
        setProfile(data.profile);
        restoreOfflineQueue(data.user.id);
        await refreshAllData(SESSION_MARKER, data.user);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAuthChecking(false);
    }
  }

  const refreshAllData = async (token: string, activeUser: UserData) => {
    try {
      setLoading(true);
      const isWorker = activeUser.role === "worker";
      const [mRes, rRes, sRes, pRes, dRes, cRes] = await Promise.all([
        authFetch("/api/metrics", {}, token),
        authFetch("/api/employment", {}, token),
        authFetch("/api/work-sessions", {}, token),
        authFetch("/api/payments", {}, token),
        authFetch("/api/disputes", {}, token),
        authFetch("/api/certificates", {}, token),
      ]);
      if (mRes.ok) setMetrics(await mRes.json());
      if (rRes.ok) setRelationships((await rRes.json()).relationships || []);
      if (sRes.ok) setSessions((await sRes.json()).sessions || []);
      if (pRes.ok) setPaymentsList((await pRes.json()).payments || []);
      if (dRes.ok) setDisputesList((await dRes.json()).disputes || []);
      if (cRes.ok) setCertificatesList((await cRes.json()).certificates || []);

      // Employer-scoped review queue + audit trail (403 for workers, so only requested for employers)
      if (!isWorker) {
        const [aRes, auditRes] = await Promise.all([authFetch("/api/review", {}, token), authFetch("/api/review?type=audit", {}, token)]);
        if (aRes.ok) setAnomaliesList((await aRes.json()).anomalies || []);
        if (auditRes.ok) setAuditLogsList((await auditRes.json()).logs || []);
      }
    } catch (err) {
      console.error("Error refreshing data:", err);
    } finally {
      setLoading(false);
    }
  };

  const startSession = async (data: { user: UserData; profile?: WorkerProfile | null }, welcome: string) => {
    setAccessToken(SESSION_MARKER);
    setUser(data.user);
    setProfile(data.profile ?? null);
    setActiveTab("home");
    setEmployerWorkspaceMode("employer");
    setAuthPassword("");
    restoreOfflineQueue(data.user.id);
    confetti({ particleCount: 55, spread: 70, origin: { y: 0.7 } });
    showToast(welcome, "success");
    await refreshAllData(SESSION_MARKER, data.user);
  };

  // Login / Register (email + password; server sets an HttpOnly cookie)
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (authMode === "forgot") {
      if (!authEmail.trim()) return;
      try {
        setActionLoading(true);
        const r = await fetch("/api/auth/forgot", { method: "POST", credentials: "same-origin", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: authEmail.trim() }) });
        const d = await r.json();
        showToast(d.message_hi || d.message_en || "Request sent", r.ok ? "success" : "error");
        if (r.ok) setAuthMode("login");
      } finally {
        setActionLoading(false);
      }
      return;
    }
    if (!authEmail.trim() || !authPassword) {
      showToast("कृपया ईमेल और पासवर्ड दर्ज करें", "error");
      return;
    }
    try {
      setActionLoading(true);
      const isRegister = authMode === "register";
      const res = await fetch(isRegister ? "/api/auth/register" : "/api/auth/login", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          isRegister
            ? { role: selectedAuthRole, name: authName.trim(), email: authEmail.trim(), password: authPassword, occupationOrCompany: authSkillOrCompany.trim(), locationCity: authCity.trim() }
            : { email: authEmail.trim(), password: authPassword }
        ),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.message_hi || data.message_en || "Failed", "error");
        return;
      }
      await startSession(data, `स्वागत है, ${data.user.name}!`);
    } catch (err) {
      showToast((err as Error).message, "error");
    } finally {
      setActionLoading(false);
    }
  };

  // Logout (revokes the server session and clears the cookie)
  const handleLogout = async () => {
    try {
      await authFetch("/api/auth/logout", { method: "POST" });
    } catch (e) {
      console.error(e);
    } finally {
      setAccessToken(null);
      setUser(null);
      setProfile(null);
      setRelationships([]);
      setSessions([]);
      setPaymentsList([]);
      setDisputesList([]);
      setCertificatesList([]);
      setAnomaliesList([]);
      setAuditLogsList([]);
      setMetrics(null);
      showToast("आप सफलतापूर्वक लॉगआउट हो गए हैं।", "info");
    }
  };

  // Geo-location request
  const captureCurrentGps = (): Promise<{ lat?: number; lon?: number; acc?: number }> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        setLocationStatus("GPS not supported on device.");
        resolve({});
        return;
      }
      setLocationStatus("Fetching verified GPS coordinates...");
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = parseFloat(pos.coords.latitude.toFixed(6));
          const lon = parseFloat(pos.coords.longitude.toFixed(6));
          const acc = parseFloat(pos.coords.accuracy.toFixed(1));
          setLocationStatus(`Location verified: ${lat}, ${lon} (±${acc}m)`);
          resolve({ lat, lon, acc });
        },
        () => {
          setLocationStatus(
            "Location permission unavailable. Session recorded without GPS evidence."
          );
          resolve({});
        },
        { enableHighAccuracy: true, timeout: 7000 }
      );
    });
  };

  // A start that happened offline and has no matching queued end yet (the shift is "open" locally).
  const queuedOpenStart = offlinePendingQueue.find(
    (i) => i.action === "start" && !offlinePendingQueue.some((j) => j.action === "end" && j.startIdempotencyKey === i.idempotencyKey)
  );

  // Start Work Session (KAAM SHURU)
  const handleStartWork = async () => {
    if (!user) return;
    if (!relationships.some((r) => r.status === "active")) {
      setShowAddEmployerModal(true);
      showToast("काम शुरू करने से पहले कृपया अपने नियोक्ता (Employer) को जोड़ें।", "info");
      return;
    }

    try {
      setActionLoading(true);
      const activeRel = relationships.find((r) => r.status === "active");
      if (!activeRel) {
        showToast("कोई सक्रिय नियोक्ता संबंध नहीं है। पहले अनुरोध स्वीकार होना चाहिए।", "info");
        return;
      }
      const coords = await captureCurrentGps();

      const payload = {
        action: "start",
        relationshipId: activeRel.id,
        deviceTimestamp: new Date().toISOString(),
        latitude: coords.lat,
        longitude: coords.lon,
        accuracyMeters: coords.acc,
        locationNote: coords.lat ? "Worker GPS Check-in" : "Without GPS Evidence",
        idempotencyKey: newKey("session"),
      };

      if (!isOnline) {
        setOfflinePendingQueue((prev) => [...prev, payload]);
        showToast(t.offlineNotice, "info");
        return;
      }

      const res = await authFetch("/api/work-sessions", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const resJson = await res.json();
      if (!res.ok) {
        showToast(
          resJson.message_hi || resJson.message_en || resJson.error || "Failed to start",
          "error"
        );
      } else {
        confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 } });
        showToast("काम शुरू दर्ज हो गया! सर्वर टाइमस्टैम्प सुरक्षित कर लिया गया है।", "success");
        await refreshAllData(accessToken!, user);
      }
    } catch (err) {
      showToast((err as Error).message, "error");
    } finally {
      setActionLoading(false);
    }
  };

  // End Work Session (KAAM KHATAM) — works offline too: the end is queued and refers to the shift
  // by its server id, or by the START's idempotency key when that start is itself still queued.
  const handleEndWork = async () => {
    const serverSession = metrics?.activeSession;
    if ((!serverSession && !queuedOpenStart) || !user) {
      showToast("कोई खुला कार्य सत्र नहीं है", "error");
      return;
    }

    try {
      setActionLoading(true);
      const coords = await captureCurrentGps();

      const payload = {
        action: "end",
        ...(serverSession ? { sessionId: serverSession.id } : { startIdempotencyKey: queuedOpenStart!.idempotencyKey }),
        deviceTimestamp: new Date().toISOString(),
        latitude: coords.lat,
        longitude: coords.lon,
        accuracyMeters: coords.acc,
        locationNote: "Worker Shift Conclusion Check-out",
        idempotencyKey: `end-${serverSession ? serverSession.id : queuedOpenStart!.idempotencyKey}`,
      };

      if (!isOnline || !serverSession) {
        const next = [...offlinePendingQueue, payload];
        setOfflinePendingQueue(next);
        if (isOnline) {
          await triggerOfflineSync(next); // the start is only queued locally: flush start → end now
        } else {
          showToast("काम समाप्त ऑफ़लाइन दर्ज हुआ। इंटरनेट आते ही सिंक होगा और समीक्षा हेतु चिह्नित रहेगा।", "info");
        }
        return;
      }

      const res = await authFetch("/api/work-sessions", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const resJson = await res.json();
      if (!res.ok) {
        showToast(resJson.message_hi || resJson.error || "Failed to conclude session", "error");
      } else {
        confetti({ particleCount: 50, spread: 70, origin: { y: 0.8 } });
        showToast(
          `काम समाप्त! सत्र अवधि: ${resJson.session.durationMinutes} मिनट। नियोक्ता की पुष्टि हेतु भेजा गया।`,
          "success"
        );
        await refreshAllData(accessToken!, user);
      }
    } catch (err) {
      showToast((err as Error).message, "error");
    } finally {
      setActionLoading(false);
    }
  };

  // Offline queue: events keep their idempotency key, survive reloads, and are only removed once the
  // server accepted them (or reported a duplicate). Failed events stay queued — never silently lost.
  async function triggerOfflineSync(itemsOverride?: any[]) {
    const items = itemsOverride ?? offlinePendingQueue;
    if (items.length === 0 || !accessToken || !user) return;
    showToast("Syncing offline work records...", "info");
    const remaining: any[] = [];
    let rejected = 0;
    for (const item of items) {
      try {
        const res = await authFetch("/api/work-sessions", {
          method: "POST",
          body: JSON.stringify({ ...item, wasOfflineSynced: true }),
        });
        if (res.ok || res.status === 409) continue; // accepted, or the server already has it (idempotent)
        if (res.status === 400 || res.status === 404) rejected++; // permanently invalid: retrying can never succeed
        else remaining.push(item); // network / 5xx / auth problem: keep for the next attempt
      } catch (e) {
        console.error(e);
        remaining.push(item);
      }
    }
    setOfflinePendingQueue(remaining);
    await refreshAllData(accessToken, user);
    if (rejected > 0) showToast(`${rejected} ऑफ़लाइन रिकॉर्ड सर्वर ने स्वीकार नहीं किए (अमान्य)।`, "error");
    else
      showToast(
        remaining.length === 0 ? "ऑफ़लाइन रिकॉर्ड सिंक हो गए — समीक्षा हेतु चिह्नित।" : `${remaining.length} रिकॉर्ड सिंक नहीं हो पाए; दोबारा प्रयास होगा।`,
        remaining.length === 0 ? "success" : "error"
      );
  }

  // Restore the persisted queue for THIS user only (contains no credentials).
  function restoreOfflineQueue(userId: string) {
    try {
      const raw = localStorage.getItem("kp_offline_queue");
      const saved = raw ? JSON.parse(raw) : null;
      if (saved && saved.userId === userId && Array.isArray(saved.items)) setOfflinePendingQueue(saved.items);
    } catch { /* ignore corrupt storage */ }
  }

  // Restore session on initial mount (cookie is sent automatically)
  useEffect(() => {
    const t = setTimeout(() => void verifyAndLoadSession(), 0);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once on mount
  }, []);

  // When connectivity returns, flush the offline queue
  useEffect(() => {
    const onOnline = () => void triggerOfflineSync();
    window.addEventListener("online", onOnline);
    return () => window.removeEventListener("online", onOnline);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- handler reads latest queue via closure refresh
  }, [offlinePendingQueue, accessToken, user]);

  useEffect(() => {
    if (!user) return;
    try {
      localStorage.setItem("kp_offline_queue", JSON.stringify({ userId: user.id, items: offlinePendingQueue }));
    } catch { /* storage full/blocked */ }
  }, [offlinePendingQueue, user]);


  // Employer Confirm Session
  const handleEmployerConfirm = async (sessionId: string) => {
    if (!user || !accessToken) return;
    try {
      setActionLoading(true);
      const res = await authFetch("/api/work-sessions", {
        method: "POST",
        body: JSON.stringify({
          action: "confirm",
          sessionId,
          employerRemarks: `Confirmed by Employer (${user.name}).`,
        }),
      });
      if (res.ok) {
        showToast("Work session confirmed and verified!", "success");
        await refreshAllData(accessToken, user);
      }
    } catch (e) {
      showToast((e as Error).message, "error");
    } finally {
      setActionLoading(false);
    }
  };

  // Employer Dispute Session
  const handleEmployerDispute = async (sessionId: string) => {
    if (!user || !accessToken) return;
    try {
      setActionLoading(true);
      const res = await authFetch("/api/work-sessions", {
        method: "POST",
        body: JSON.stringify({
          action: "dispute",
          sessionId,
          employerRemarks: "Discrepancy reported in attendance duration.",
        }),
      });
      if (res.ok) {
        showToast("Session marked as Disputed. Audit trail created.", "info");
        await refreshAllData(accessToken, user);
      }
    } catch (e) {
      showToast((e as Error).message, "error");
    } finally {
      setActionLoading(false);
    }
  };

  // Confirm Payment
  const handleConfirmPayment = async (paymentId: string) => {
    if (!user || !accessToken) return;
    try {
      setActionLoading(true);
      const res = await authFetch("/api/payments", {
        method: "POST",
        body: JSON.stringify({
          action: "confirm",
          paymentId,
        }),
      });
      if (res.ok) {
        showToast("Payment receipt mutually confirmed!", "success");
        await refreshAllData(accessToken, user);
      }
    } catch (e) {
      showToast((e as Error).message, "error");
    } finally {
      setActionLoading(false);
    }
  };

  // Create Payment
  const handleCreatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !accessToken || relationships.length === 0) return;

    try {
      setActionLoading(true);
      const activeRel = relationships.find((r) => r.status === "active");
      if (!activeRel) {
        showToast("कोई सक्रिय नियोक्ता संबंध नहीं है। पहले अनुरोध स्वीकार होना चाहिए।", "info");
        return;
      }
      const res = await authFetch("/api/payments", {
        method: "POST",
        body: JSON.stringify({
          relationshipId: activeRel.id,
          idempotencyKey: newKey("pay"),
          amount: paymentAmount,
          paymentMethod,
          referenceNote: paymentNote || "Settlement recorded via KaamProof ledger",
        }),
      });
      if (res.ok) {
        setShowNewPaymentModal(false);
        showToast("Payment record saved successfully!", "success");
        await refreshAllData(accessToken, user);
      }
    } catch (err) {
      showToast((err as Error).message, "error");
    } finally {
      setActionLoading(false);
    }
  };

  // Create Dispute
  const handleCreateDispute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !accessToken || relationships.length === 0) return;

    try {
      setActionLoading(true);
      const activeRel = relationships.find((r) => r.status === "active");
      if (!activeRel) {
        showToast("कोई सक्रिय नियोक्ता संबंध नहीं है। पहले अनुरोध स्वीकार होना चाहिए।", "info");
        return;
      }
      const res = await authFetch("/api/disputes", {
        method: "POST",
        body: JSON.stringify({
          relationshipId: activeRel.id,
          reasonCategory: disputeCategory,
          description: disputeDesc,
        }),
      });
      if (res.ok) {
        setShowDisputeModal(false);
        setDisputeDesc("");
        showToast("विवाद दर्ज हो गया। नियोक्ता की समीक्षा और ऑडिट ट्रेल में जुड़ गया।", "info");
        await refreshAllData(accessToken, user);
      }
    } catch (err) {
      showToast((err as Error).message, "error");
    } finally {
      setActionLoading(false);
    }
  };

  // Generate Certificate
  const handleGenerateCertificate = async () => {
    if (!user || !accessToken || relationships.length === 0) {
      showToast("Please connect with an Employer first to generate a certificate.", "error");
      return;
    }

    try {
      setActionLoading(true);
      const activeRel = relationships.find((r) => r.status === "active");
      if (!activeRel) {
        showToast("कोई सक्रिय नियोक्ता संबंध नहीं है। पहले अनुरोध स्वीकार होना चाहिए।", "info");
        return;
      }
      const res = await authFetch("/api/certificates", {
        method: "POST",
        body: JSON.stringify({
          relationshipId: activeRel.id,
          periodStart: `${new Date().getFullYear()}-01-01`,
          periodEnd: new Date().toISOString().split("T")[0],
        }),
      });
      const resJson = await res.json();
      if (res.ok && resJson.certificate) {
        confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
        showToast("Proof-of-Work Certificate generated & SHA-256 hashed!", "success");
        await refreshAllData(accessToken, user);
        viewCertificate(resJson.certificate);
      }
    } catch (err) {
      showToast((err as Error).message, "error");
    } finally {
      setActionLoading(false);
    }
  };

  const certUrl = (cert: Certificate) => `${window.location.origin}/verify/${cert.certificateNumber}`;

  // Share the PUBLIC verification link (shows no phone/email/location) via the phone's share sheet, else WhatsApp.
  const shareCertificate = async (cert: Certificate) => {
    const url = certUrl(cert);
    const text = `मेरा KaamProof सत्यापित कार्य रिकॉर्ड (${cert.certificateNumber}): ${url}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "KaamProof", text, url });
        return;
      }
    } catch {
      return; // user closed the share sheet
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener");
  };

  const copyCertificateLink = async (cert: Certificate) => {
    try {
      await navigator.clipboard.writeText(certUrl(cert));
      showToast("सत्यापन लिंक कॉपी हो गया।", "success");
    } catch {
      showToast(certUrl(cert), "info");
    }
  };

  const viewCertificate = async (cert: Certificate) => {
    setShowCertificateModal(cert);
    try {
      const publicVerifyUrl = `${window.location.origin}/verify/${cert.certificateNumber}`;
      const qrData = await QRCode.toDataURL(publicVerifyUrl, { margin: 1, width: 200 });
      setQrCodeDataUrl(qrData);
    } catch (e) {
      console.error(e);
    }
  };

  // Connect Worker <-> Employer & Create Mutual Wage Agreement
  const handleCreateEmployerRelationship = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !accessToken) return;
    try {
      setActionLoading(true);
      const res = await authFetch("/api/employment", {
        method: "POST",
        body: JSON.stringify({
          action: "create",
          counterpartyIdentifier: counterpartyIdentifier.trim(),
          roleTitle: newEmployerRole,
          wageAmount: newEmployerWage,
          wageType: "daily",
          jobType: newEmployerRole,
        }),
      });

      if (res.ok) {
        setShowAddEmployerModal(false);
        setCounterpartyIdentifier("");
        setCounterpartyName("");
        showToast("अनुरोध भेजा गया। दूसरे पक्ष के स्वीकार करने पर संबंध सक्रिय होगा।", "success");
        await refreshAllData(accessToken, user);
      }
    } catch (err) {
      showToast((err as Error).message, "error");
    } finally {
      setActionLoading(false);
    }
  };

  // Upgrade Wage Agreement to v2 (Immutable Versioning)
  const handleUpgradeAgreementVersion = async (relationshipId: string, currentAmount: string) => {
    if (!user || !accessToken) return;
    const nextWage = Math.round(parseFloat(currentAmount || "450") + 50).toString();
    try {
      setActionLoading(true);
      const res = await authFetch("/api/employment", {
        method: "POST",
        body: JSON.stringify({
          action: "upgrade_agreement",
          relationshipId,
          wageAmount: nextWage,
          wageType: "daily",
        }),
      });
      if (res.ok) {
        showToast(`नया वेतन प्रस्ताव (₹${nextWage}/day) भेजा गया — दूसरे पक्ष की स्वीकृति के बाद लागू होगा।`, "success");
        await refreshAllData(accessToken, user);
      }
    } catch (err) {
      showToast((err as Error).message, "error");
    } finally {
      setActionLoading(false);
    }
  };

  // Admin / Employer Review Anomaly
  const handleReviewAnomaly = async (anomalyId: string, decision: string) => {
    if (!user || !accessToken) return;
    try {
      setActionLoading(true);
      const res = await authFetch("/api/review", {
        method: "POST",
        body: JSON.stringify({
          anomalyId,
          decision,
          adminNotes: `Reviewed & resolved as ${decision} by ${user.name}`,
        }),
      });
      if (res.ok) {
        showToast(`Anomaly marked as ${decision}`, "success");
        await refreshAllData(accessToken, user);
      }
    } catch (e) {
      showToast((e as Error).message, "error");
    } finally {
      setActionLoading(false);
    }
  };

  // Admin / Employer Resolve Dispute
  const handleAdminResolveDispute = async (disputeId: string) => {
    if (!user || !accessToken) return;
    try {
      setActionLoading(true);
      const res = await authFetch("/api/disputes", {
        method: "POST",
        body: JSON.stringify({
          action: "resolve",
          disputeId,
          resolutionNote: `Mutually resolved & verified by ${user.name}.`,
        }),
      });
      if (res.ok) {
        showToast("Dispute marked as Resolved in PostgreSQL!", "success");
        await refreshAllData(accessToken, user);
      }
    } catch (err) {
      showToast((err as Error).message, "error");
    } finally {
      setActionLoading(false);
    }
  };

  // Accept / reject an employment request sent by the other party
  const handleRespondEmployment = async (relationshipId: string, decision: "accept" | "reject") => {
    if (!user) return;
    const res = await authFetch("/api/employment", { method: "POST", body: JSON.stringify({ action: "respond", relationshipId, decision }) });
    if (res.ok) {
      showToast(decision === "accept" ? "संबंध सक्रिय हो गया।" : "अनुरोध अस्वीकार किया गया।", decision === "accept" ? "success" : "info");
      await refreshAllData(SESSION_MARKER, user);
    }
  };

  // Accept / reject a proposed wage agreement version
  const handleAgreementDecision = async (agreementId: string, action: "accept_agreement" | "reject_agreement") => {
    if (!user) return;
    const res = await authFetch("/api/employment", { method: "POST", body: JSON.stringify({ action, agreementId }) });
    if (res.ok) {
      showToast(action === "accept_agreement" ? "नया वेतन समझौता लागू हुआ।" : "प्रस्ताव अस्वीकार किया गया।", "success");
      await refreshAllData(SESSION_MARKER, user);
    }
  };

  const handleExportData = () => {
    if (!accessToken) return;
    window.open("/api/export", "_blank");
  };

  // ============================================================================
  // AUTHENTICATION SCREEN (SHOWN WHEN USER IS NOT LOGGED IN)
  // ============================================================================
  if (authChecking) {
    return (
      <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col items-center justify-center p-6">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-stone-400 text-sm">सुरक्षित सत्र की जांच हो रही है (Verifying session)...</p>
      </div>
    );
  }

  if (!user || !accessToken) {
    return (
      <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col justify-between font-sans selection:bg-emerald-500 selection:text-white">
        {/* Top Bar */}
        <header className="border-b border-stone-800 bg-stone-900/80 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center font-black text-white text-xl shadow-lg shadow-emerald-950">
              क
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-white">KaamProof</span>
              <span className="block text-xs text-stone-400">
                Worker-Owned Proof-of-Work & Wage Record Platform
              </span>
            </div>
          </div>

          <button
            onClick={() => setLang(lang === "hi" ? "en" : "hi")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 border border-stone-700 text-xs text-emerald-300 font-semibold transition-colors"
          >
            <Languages className="w-4 h-4" />
            <span>{lang === "hi" ? "English" : "हिंदी"}</span>
          </button>
        </header>

        {/* Notification Toast */}
        {notification && (
          <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5">
            <div
              className={`px-4 py-3 rounded-xl shadow-2xl border flex items-center gap-3 text-sm font-medium ${
                notification.type === "success"
                  ? "bg-emerald-900 border-emerald-600 text-emerald-100"
                  : notification.type === "error"
                  ? "bg-red-950 border-red-600 text-red-200"
                  : "bg-stone-900 border-stone-700 text-stone-200"
              }`}
            >
              {notification.type === "success" && (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              )}
              {notification.type === "error" && (
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
              )}
              <span>{notification.message}</span>
            </div>
          </div>
        )}

        {/* Main Login / Registration Card */}
        <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
          <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Info Column */}
            <div className="lg:col-span-5 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800">
                <ShieldCheck className="w-4 h-4" />
                <span>Real OTP & Email Authentication</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight">
                {lang === "hi"
                  ? "अपने काम और वेतन का पक्का डिजिटल प्रमाण बनाएं"
                  : "Own Your Verified Work & Wage History"}
              </h1>

              <p className="text-sm text-stone-400 leading-relaxed">
                {lang === "hi"
                  ? "नया श्रमिक (Worker) या नियोक्ता (Employer) खाता बनाएं। श्रमिक को केवल अपना व्यक्तिगत कार्य एवं वेतन डेटा दिखेगा, जबकि नियोक्ता के पास हाजिरी पुष्टि एवं एडमिन ऑडिट पैनल का पूर्ण अधिकार होगा।"
                  : "Register or sign in with your email and password. Workers only ever see their own records; employers only see their own workers."}
              </p>

              <div className="space-y-3 pt-2">
                <div className="p-3.5 rounded-xl bg-stone-900/70 border border-stone-800 flex items-start gap-3">
                  <User className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <strong className="text-white block">श्रमिक खाता (Worker Account)</strong>
                    <span className="text-stone-400">
                      केवल आपका अपना काम (Kaam Shuru / Khatam), वेतन बहीखाता, वर्क पासपोर्ट और क्यूआर प्रमाणपत्र।
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-stone-900/70 border border-stone-800 flex items-start gap-3">
                  <Building className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <strong className="text-white block">
                      नियोक्ता खाता (Employer)
                    </strong>
                    <span className="text-stone-400">
                      श्रमिकों की हाजिरी पुष्टि, वेतन भुगतान, एआई विसंगति जांच (AI Anomaly Triage) और विवाद समाधान।
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Auth Card */}
            <div className="lg:col-span-7 bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
              {/* Role Selector Toggle */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-stone-400 block mb-2">
                  1. अपनी भूमिका चुनें (Select Your Account Type)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedAuthRole("worker");
                    }}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                      selectedAuthRole === "worker"
                        ? "bg-emerald-950/70 border-emerald-500 text-white shadow-lg shadow-emerald-950/50"
                        : "bg-stone-950 border-stone-800 text-stone-400 hover:border-stone-700"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <User
                        className={`w-5 h-5 ${
                          selectedAuthRole === "worker" ? "text-emerald-400" : "text-stone-500"
                        }`}
                      />
                      {selectedAuthRole === "worker" && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      )}
                    </div>
                    <div className="font-bold text-sm">श्रमिक (Worker)</div>
                    <div className="text-[11px] text-stone-400 mt-0.5">
                      Personal Work & Wage Record
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedAuthRole("employer");
                    }}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                      selectedAuthRole === "employer"
                        ? "bg-emerald-950/70 border-emerald-500 text-white shadow-lg shadow-emerald-950/50"
                        : "bg-stone-950 border-stone-800 text-stone-400 hover:border-stone-700"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <Building
                        className={`w-5 h-5 ${
                          selectedAuthRole === "employer" ? "text-emerald-400" : "text-stone-500"
                        }`}
                      />
                      {selectedAuthRole === "employer" && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      )}
                    </div>
                    <div className="font-bold text-sm">नियोक्ता (Employer)</div>
                    <div className="text-[11px] text-stone-400 mt-0.5">
                      Employer Portal
                    </div>
                  </button>
                </div>
              </div>

              <form onSubmit={handleAuthSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-2" role="tablist">
                  {(["login", "register"] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      role="tab"
                      aria-selected={authMode === m}
                      onClick={() => setAuthMode(m)}
                      className={`py-2.5 rounded-xl text-sm font-bold border ${authMode === m ? "bg-emerald-600 border-emerald-500 text-white" : "bg-stone-950 border-stone-800 text-stone-300"}`}
                    >
                      {m === "login" ? "लॉगिन (Login)" : "नया खाता (Register)"}
                    </button>
                  ))}
                </div>

                {authMode === "register" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="kp-name" className="text-xs font-semibold text-stone-300 block mb-1.5">पूरा नाम (Full Name) *</label>
                      <input id="kp-name" type="text" required minLength={2} maxLength={80} value={authName} onChange={(e) => setAuthName(e.target.value)}
                        className="w-full px-3.5 py-3 rounded-xl bg-stone-950 border border-stone-800 text-white focus:outline-none focus:border-emerald-500 text-sm" />
                    </div>
                    <div>
                      <label htmlFor="kp-occ" className="text-xs font-semibold text-stone-300 block mb-1.5">
                        {selectedAuthRole === "worker" ? "काम / हुनर (Occupation)" : "परिवार / संस्थान का नाम (Household/Firm)"}
                      </label>
                      <input id="kp-occ" type="text" maxLength={120} value={authSkillOrCompany} onChange={(e) => setAuthSkillOrCompany(e.target.value)}
                        className="w-full px-3.5 py-3 rounded-xl bg-stone-950 border border-stone-800 text-white focus:outline-none focus:border-emerald-500 text-sm" />
                    </div>
                  </div>
                )}

                <div>
                  <label htmlFor="kp-email" className="text-xs font-semibold text-stone-300 block mb-1.5">ईमेल (Email) *</label>
                  <input id="kp-email" type="email" required autoComplete="email" value={authEmail} onChange={(e) => setAuthEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-stone-950 border border-stone-800 text-white focus:outline-none focus:border-emerald-500 text-sm" />
                </div>
                {authMode !== "forgot" && (
                <div>
                  <label htmlFor="kp-pass" className="text-xs font-semibold text-stone-300 block mb-1.5">
                    पासवर्ड (Password) * {authMode === "register" && <span className="text-stone-500 font-normal">— कम से कम 10 अक्षर, अक्षर + अंक</span>}
                  </label>
                  <input id="kp-pass" type="password" required minLength={authMode === "register" ? 10 : 1} autoComplete={authMode === "register" ? "new-password" : "current-password"}
                    value={authPassword} onChange={(e) => setAuthPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-stone-950 border border-stone-800 text-white focus:outline-none focus:border-emerald-500 text-sm" />
                </div>
                )}
                {authMode === "login" && (
                  <button type="button" onClick={() => setAuthMode("forgot")} className="text-xs text-emerald-400 underline cursor-pointer min-h-11">पासवर्ड भूल गए? (Forgot password)</button>
                )}
                {authMode === "forgot" && (
                  <button type="button" onClick={() => setAuthMode("login")} className="text-xs text-stone-400 underline cursor-pointer min-h-11">← वापस लॉगिन पर</button>
                )}

                <button type="submit" disabled={actionLoading}
                  className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-black text-sm tracking-wide transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50">
                  <KeyRound className="w-4 h-4" />
                  <span>{actionLoading ? "कृपया प्रतीक्षा करें..." : authMode === "login" ? "लॉगिन करें (Login)" : authMode === "forgot" ? "रीसेट लिंक भेजें (Send reset link)" : "खाता बनाएं (Create account)"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </main>

        <footer className="border-t border-stone-900 bg-stone-950 px-4 py-4 text-center text-xs text-stone-500">
          KaamProof — digital work record. Not legal proof, not a payment service.
        </footer>
      </div>
    );
  }

  // ============================================================================
  // AUTHENTICATED APPLICATION VIEW (STRICTLY SCOPED BY ROLE)
  // ============================================================================
  const isWorker = user.role === "worker";
  const isEmployerOrAdmin = user.role === "employer";

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Top Authenticated Security Bar */}
      <header className="bg-stone-900 border-b border-stone-800 px-4 sm:px-8 py-2 flex flex-wrap items-center justify-between text-xs gap-3">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full font-bold bg-emerald-950 text-emerald-400 border border-emerald-700 uppercase tracking-wider text-[10px] flex items-center gap-1">
            <Lock className="w-3 h-3" />{" "}
            {isWorker ? "WORKER ACCOUNT (ISOLATED DATA)" : "EMPLOYER + ADMIN ACCESS"}
          </span>
          <span className="text-stone-300 font-medium">
            {user.name} ({user.email || user.phone})
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Network status */}
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-stone-950 border border-stone-800">
            {isOnline ? (
              <span className="flex items-center gap-1 text-emerald-400">
                <Wifi className="w-3.5 h-3.5" /> Online
              </span>
            ) : (
              <span className="flex items-center gap-1 text-amber-400">
                <WifiOff className="w-3.5 h-3.5" /> Offline Queue ({offlinePendingQueue.length})
              </span>
            )}
          </div>

          {/* Language Toggle */}
          <button
            onClick={() => setLang(lang === "hi" ? "en" : "hi")}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-stone-800 hover:bg-stone-700 border border-stone-700 text-stone-200 transition-colors font-medium"
          >
            <Languages className="w-3.5 h-3.5" />
            <span>{lang === "hi" ? "English" : "हिंदी"}</span>
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-red-950/80 hover:bg-red-900 border border-red-800 text-red-200 transition-colors font-semibold cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>लॉगआउट (Logout)</span>
          </button>
        </div>
      </header>

      {/* Main Navigation Header */}
      <nav className="bg-stone-900/95 border-b border-stone-800 sticky top-0 z-30 backdrop-blur-md px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center font-black text-white text-xl shadow-lg shadow-emerald-950">
            क
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tight text-white">{t.appName}</span>
              <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-stone-800 text-emerald-400 border border-stone-700">
                {isWorker ? "श्रमिक पोर्टल" : "नियोक्ता पोर्टल"}
              </span>
            </div>
            <p className="text-xs text-stone-400 hidden sm:block">{t.tagline}</p>
          </div>
        </div>

        {/* If Logged-in User is EMPLOYER, allow toggling between Employer Dashboard & Admin Command Center */}
        {isEmployerOrAdmin && (
          <div className="flex items-center bg-stone-950 p-1 rounded-xl border border-stone-800">
            <button
              onClick={() => setEmployerWorkspaceMode("employer")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                employerWorkspaceMode === "employer"
                  ? "bg-emerald-600 text-stone-950 shadow-md"
                  : "text-stone-400 hover:text-stone-200"
              }`}
            >
              <Building className="w-3.5 h-3.5" /> नियोक्ता डैशबोर्ड (Employer Portal)
            </button>

            <button
              onClick={() => setEmployerWorkspaceMode("admin")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                employerWorkspaceMode === "admin"
                  ? "bg-emerald-600 text-stone-950 shadow-md"
                  : "text-stone-400 hover:text-stone-200"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" /> समीक्षा एवं ऑडिट (Review & Audit)
            </button>
          </div>
        )}
      </nav>

      {/* Notification Toast */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5">
          <div
            className={`px-4 py-3 rounded-xl shadow-2xl border flex items-center gap-3 text-sm font-medium ${
              notification.type === "success"
                ? "bg-emerald-900 border-emerald-600 text-emerald-100"
                : notification.type === "error"
                ? "bg-red-950 border-red-600 text-red-200"
                : "bg-stone-900 border-stone-700 text-stone-200"
            }`}
          >
            {notification.type === "success" && (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            )}
            {notification.type === "error" && (
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            )}
            {notification.type === "info" && (
              <HelpCircle className="w-5 h-5 text-amber-400 shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* Main Content Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-stone-400 text-sm">डेटाबेस से आपके व्यक्तिगत रिकॉर्ड लोड हो रहे हैं...</p>
          </div>
        ) : (
          <div>
            <PendingRequests relationships={relationships} isWorker={isWorker} onRespond={handleRespondEmployment} onAgreementDecision={handleAgreementDecision} />
            {!isWorker && (
              <details className="mb-6 rounded-2xl border border-stone-800 bg-stone-900/60 p-4">
                <summary className="cursor-pointer text-sm font-bold text-stone-200">खाता सुरक्षा — पासवर्ड बदलें (Account security)</summary>
                <ChangePasswordCard />
              </details>
            )}
            {/* ================================================================= */}
            {/* 1. WORKER VIEW (STRICTLY ONLY THIS WORKER'S OWN NORMAL DATA)      */}
            {/* ================================================================= */}
            {isWorker && (
              <div className="space-y-6">
                {/* Worker Navigation Bar */}
                <div className="flex items-center justify-between border-b border-stone-800 pb-3 overflow-x-auto gap-2">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    {[
                      { id: "home", label: lang === "hi" ? "होम (Home)" : "Home", icon: Play },
                      {
                        id: "history",
                        label: lang === "hi" ? "मेरी हाजिरी" : "My Work History",
                        icon: History,
                      },
                      {
                        id: "paisa",
                        label: lang === "hi" ? "पैसा एवं भुगतान" : "My Payments",
                        icon: DollarSign,
                      },
                      {
                        id: "passport",
                        label: lang === "hi" ? "वर्क पासपोर्ट" : "Work Passport",
                        icon: Award,
                      },
                      {
                        id: "disputes",
                        label: lang === "hi" ? "शिकायतें" : "Disputes",
                        icon: AlertTriangle,
                      },
                      {
                        id: "profile",
                        label: lang === "hi" ? "मेरी प्रोफाइल" : "My Profile",
                        icon: User,
                      },
                    ].map((tab) => {
                      const Icon = tab.icon;
                      const isActive = activeTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                            isActive
                              ? "bg-emerald-600/20 text-emerald-300 border border-emerald-500/40"
                              : "text-stone-400 hover:text-stone-200 hover:bg-stone-900"
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span>{tab.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={handleExportData}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 border border-stone-800 text-xs text-stone-300 font-medium transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="hidden sm:inline">{t.exportData}</span>
                    <span className="sm:hidden">JSON</span>
                  </button>
                </div>

                {/* If new worker has no employer connected yet, prompt them clearly */}
                {relationships.length === 0 && (
                  <div className="bg-amber-950/40 border border-amber-500/50 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="space-y-1">
                      <h3 className="text-base font-bold text-white">
                        नया खाता तैयार है! काम शुरू करने के लिए अपने नियोक्ता (Employer) को जोड़ें
                      </h3>
                      <p className="text-xs text-stone-300">
                        अपने नियोक्ता का नाम या मोबाइल नंबर दर्ज करके पारस्परिक मजदूरी समझौता (Wage Agreement v1) सक्रिय करें।
                      </p>
                    </div>
                    <button
                      onClick={() => setShowAddEmployerModal(true)}
                      className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-black text-xs shrink-0 flex items-center gap-2 cursor-pointer"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>+ नियोक्ता जोड़ें (Connect Employer)</span>
                    </button>
                  </div>
                )}

                {/* WORKER TAB 1: HOME */}
                {activeTab === "home" && (
                  <div className="space-y-6">
                    {metrics?.activeSession || queuedOpenStart ? (
                      <div className="bg-amber-950/40 border border-amber-600/50 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4 animate-pulse">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                            <Clock className="w-6 h-6 animate-spin" />
                          </div>
                          <div>
                            <div className="text-base font-bold text-white flex items-center gap-2">
                              {t.activeSession}
                              <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                LIVE
                              </span>
                            </div>
                            <div className="text-xs text-stone-400 mt-0.5">
                              शुरू हुआ:{" "}
                              {new Date(
                                metrics?.activeSession?.serverStartReceivedAt ?? queuedOpenStart?.deviceTimestamp
                              ).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}{" "}
                              • {metrics?.activeSession ? "सर्वर टाइमस्टैम्प सत्यापित" : "ऑफ़लाइन — सिंक बाकी, समीक्षा हेतु चिह्नित"}
                            </div>
                          </div>
                        </div>

                        <button
                          disabled={actionLoading}
                          onClick={handleEndWork}
                          className="w-full md:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-black text-lg tracking-wide shadow-xl shadow-red-950 transition-all flex items-center justify-center gap-3 active:scale-95 cursor-pointer disabled:opacity-50"
                        >
                          <Square className="w-6 h-6 fill-current" />
                          <span>{t.endWork} (Kaam Khatam)</span>
                        </button>
                      </div>
                    ) : (
                      <div className="bg-gradient-to-b from-stone-900 to-stone-900/60 border border-stone-800 rounded-3xl p-6 sm:p-10 text-center shadow-2xl">
                        <div className="max-w-xl mx-auto space-y-4">
                          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>प्रमाणित कार्य सत्र (Verified Work Session)</span>
                          </div>

                          <h2 className="text-2xl sm:text-3xl font-black text-white">
                            {lang === "hi" ? "आज का काम दर्ज करें" : "Record Today's Work Shift"}
                          </h2>

                          <p className="text-sm text-stone-400">
                            {t.startWorkDesc}. आपका जीपीएस और सर्वर का वास्तविक समय सुरक्षित रूप से दर्ज होगा।
                          </p>

                          <div className="pt-2">
                            <button
                              disabled={actionLoading}
                              onClick={handleStartWork}
                              className="w-full sm:w-auto px-12 py-5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-stone-950 font-black text-xl tracking-wide shadow-2xl shadow-emerald-900/60 transition-all transform active:scale-95 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-3 mx-auto"
                            >
                              <Play className="w-7 h-7 fill-current" />
                              <span>{t.startWork} (Kaam Shuru)</span>
                            </button>
                          </div>

                          {locationStatus && (
                            <div className="flex items-center justify-center gap-1.5 text-xs text-stone-400 pt-2 font-mono">
                              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                              <span>{locationStatus}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Worker Personal Metrics */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                      <div className="p-4 sm:p-5 rounded-2xl bg-stone-900/80 border border-stone-800">
                        <div className="flex items-center justify-between text-xs font-semibold text-stone-400 mb-2">
                          <span>{t.confirmedDays}</span>
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        </div>
                        <div className="text-2xl sm:text-3xl font-black text-white">
                          {metrics?.confirmedWorkdays ?? 0}{" "}
                          <span className="text-xs font-normal text-stone-400">दिन</span>
                        </div>
                        <div className="text-[11px] text-emerald-400 mt-1 font-medium">
                          {metrics?.confirmedHours ?? 0} घंटे प्रमाणित
                        </div>
                      </div>

                      <div className="p-4 sm:p-5 rounded-2xl bg-stone-900/80 border border-stone-800">
                        <div className="flex items-center justify-between text-xs font-semibold text-stone-400 mb-2">
                          <span>{t.expectedEarnings}</span>
                          <DollarSign className="w-4 h-4 text-emerald-400" />
                        </div>
                        <div className="text-2xl sm:text-3xl font-black text-emerald-400">
                          ₹{(metrics?.expectedEarnings ?? 0).toLocaleString()}
                        </div>
                        <div className="text-[11px] text-stone-400 mt-1">पुष्ट हाजिरी अनुसार</div>
                      </div>

                      <div className="p-4 sm:p-5 rounded-2xl bg-stone-900/80 border border-stone-800">
                        <div className="flex items-center justify-between text-xs font-semibold text-stone-400 mb-2">
                          <span>{t.paidAmount}</span>
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        </div>
                        <div className="text-2xl sm:text-3xl font-black text-white">
                          ₹{(metrics?.paidAmount ?? 0).toLocaleString()}
                        </div>
                        <div className="text-[11px] text-stone-400 mt-1">पारस्परिक पुष्ट भुगतान</div>
                      </div>

                      <div className="p-4 sm:p-5 rounded-2xl bg-stone-900/80 border border-stone-800">
                        <div className="flex items-center justify-between text-xs font-semibold text-stone-400 mb-2">
                          <span>{t.outstandingAmount}</span>
                          <Clock className="w-4 h-4 text-amber-400" />
                        </div>
                        <div className="text-2xl sm:text-3xl font-black text-amber-400">
                          ₹{(metrics?.outstandingAmount ?? 0).toLocaleString()}
                        </div>
                        <div className="text-[11px] text-amber-300 mt-1">देय बकाया राशि</div>
                      </div>
                    </div>

                    {/* Active Employer & Wage Agreement Card */}
                    <div className="bg-stone-900/60 border border-stone-800 rounded-2xl p-5 space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Building className="w-5 h-5 text-emerald-400" />
                          <h3 className="font-bold text-base text-white">
                            मेरे नियोक्ता एवं मजदूरी समझौता ({relationships.length})
                          </h3>
                        </div>
                        <button
                          onClick={() => setShowAddEmployerModal(true)}
                          className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-emerald-400 border border-stone-700 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <PlusCircle className="w-3.5 h-3.5" />
                          <span>+ नया नियोक्ता जोड़ें</span>
                        </button>
                      </div>

                      {relationships.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                          <div className="p-3 rounded-xl bg-stone-950/70 border border-stone-850">
                            <span className="text-xs text-stone-400">नियोक्ता का नाम:</span>
                            <div className="font-semibold text-white mt-0.5">
                              {relationships[0].employerName}
                            </div>
                          </div>
                          <div className="p-3 rounded-xl bg-stone-950/70 border border-stone-850">
                            <span className="text-xs text-stone-400">कार्य का स्वरूप:</span>
                            <div className="font-semibold text-white mt-0.5">
                              {relationships[0].roleTitle}
                            </div>
                          </div>
                          <div className="p-3 rounded-xl bg-stone-950/70 border border-stone-850">
                            <span className="text-xs text-stone-400">
                              तयशुदा मजदूरी दर (v{relationships[0].agreement?.version ?? 1}):
                            </span>
                            <div className="font-semibold text-emerald-400 mt-0.5">
                              ₹{relationships[0].agreement?.wageAmount ?? "450"} /{" "}
                              {relationships[0].agreement?.wageType ?? "daily"}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-stone-400">
                          अभी कोई नियोक्ता जुड़ा नहीं है। ऊपर &ldquo;+ नया नियोक्ता जोड़ें&rdquo; बटन दबाएं।
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* WORKER TAB 2: WORK HISTORY */}
                {activeTab === "history" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-white">
                          मेरी हाजिरी एवं कार्य सत्र (My Work Sessions)
                        </h3>
                        <p className="text-xs text-stone-400">
                          केवल आपके खाते के प्रमाणित कार्य सत्र — सर्वर टाइमस्टैम्प द्वारा सुरक्षित
                        </p>
                      </div>
                      <span className="text-xs font-mono text-stone-400">
                        कुल सत्र: {sessions.length}
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {sessions.length === 0 ? (
                        <div className="p-8 text-center bg-stone-900/40 rounded-2xl border border-stone-800 text-stone-400 text-sm">
                          {t.noRecords}
                        </div>
                      ) : (
                        sessions.map((s) => (
                          <div
                            key={s.id}
                            className="p-4 rounded-xl bg-stone-900/70 border border-stone-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-sm"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-white">
                                  {new Date(s.serverStartReceivedAt).toLocaleDateString([], {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  })}
                                </span>
                                <span
                                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                                    s.status === "confirmed"
                                      ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                                      : s.status === "pending_confirmation"
                                      ? "bg-amber-950 text-amber-400 border border-amber-800"
                                      : "bg-red-950 text-red-400 border border-red-800"
                                  }`}
                                >
                                  {s.status === "confirmed"
                                    ? t.confirmedBadge
                                    : s.status === "pending_confirmation"
                                    ? t.pendingBadge
                                    : t.disputedBadge}
                                </span>
                              </div>
                              <div className="text-xs text-stone-400">
                                नियोक्ता: {s.employerName} • अवधि: {s.durationMinutes ?? 0} मिनट
                              </div>
                            </div>

                            <div className="text-right">
                              <span className="text-base font-bold text-emerald-400">
                                ₹{parseFloat(s.calculatedWage || "450").toFixed(0)}
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* WORKER TAB 3: PAISA */}
                {activeTab === "paisa" && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-white">मेरा वेतन एवं भुगतान बहीखाता</h3>
                        <p className="text-xs text-stone-400">
                          प्राप्त भुगतान की पुष्टि करें या नया भुगतान दावा दर्ज करें
                        </p>
                      </div>
                      <button
                        onClick={() => setShowNewPaymentModal(true)}
                        className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-stone-950 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                      >
                        <PlusCircle className="w-4 h-4" />
                        <span>भुगतान दर्ज करें</span>
                      </button>
                    </div>

                    <div className="space-y-2.5">
                      {paymentsList.length === 0 ? (
                        <div className="p-8 text-center bg-stone-900/40 rounded-2xl border border-stone-800 text-stone-400 text-sm">
                          {t.noRecords}
                        </div>
                      ) : (
                        paymentsList.map((p) => (
                          <div
                            key={p.id}
                            className="p-4 rounded-xl bg-stone-900/70 border border-stone-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-sm"
                          >
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-lg text-emerald-400">
                                  ₹{p.amount}
                                </span>
                                <span className="text-xs text-stone-300">({p.paymentMethod})</span>
                                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                                  {p.status}
                                </span>
                              </div>
                              <div className="text-xs text-stone-400 mt-1">
                                तारीख: {p.paymentDate} • {p.referenceNote}
                              </div>
                            </div>

                            {!p.workerConfirmation ? (
                              <button
                                onClick={() => handleConfirmPayment(p.id)}
                                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-stone-950 text-xs font-bold cursor-pointer"
                              >
                                प्राप्ति की पुष्टि करें (Confirm Receipt)
                              </button>
                            ) : (
                              <div className="flex items-center gap-1 text-xs text-emerald-400 font-semibold">
                                <CheckCircle2 className="w-4 h-4" />
                                <span>पारस्परिक पुष्ट</span>
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* WORKER TAB 4: PASSPORT */}
                {activeTab === "passport" && (
                  <div className="space-y-6">
                    <div className="bg-gradient-to-br from-stone-900 via-stone-900 to-emerald-950/40 border border-emerald-800/40 rounded-3xl p-6 sm:p-8 space-y-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-4">
                        <div>
                          <div className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                            Worker-Owned Portable Work Passport
                          </div>
                          <h2 className="text-2xl font-black text-white">{user.name}</h2>
                          <p className="text-xs text-stone-400">
                            {profile?.occupation} • {profile?.primaryLocation}
                          </p>
                        </div>

                        <button
                          onClick={handleGenerateCertificate}
                          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-stone-950 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <Award className="w-4 h-4" />
                          <span>नया प्रमाणपत्र जारी करें (Generate Certificate)</span>
                        </button>
                      </div>

                      <div className="space-y-2">
                        {certificatesList.length === 0 ? (
                          <div className="p-6 text-center text-xs text-stone-400 bg-stone-950/50 rounded-xl border border-stone-800">
                            अभी कोई प्रमाणपत्र जारी नहीं हुआ है। ऊपर बटन दबाकर अपना पहला प्रमाणपत्र बनाएं।
                          </div>
                        ) : (
                          certificatesList.map((cert) => (
                            <div
                              key={cert.id}
                              className="p-4 rounded-xl bg-stone-950/80 border border-stone-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-sm"
                            >
                              <div>
                                <span className="font-mono font-bold text-emerald-400">
                                  {cert.certificateNumber}
                                </span>
                                <div className="text-xs text-stone-400 mt-1">
                                  नियोक्ता: {cert.employerDisplayName} • पुष्ट दिन:{" "}
                                  {cert.confirmedWorkdays}
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                <button
                                  onClick={() => viewCertificate(cert)}
                                  className="min-h-11 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-xs font-semibold text-white flex items-center gap-1.5 cursor-pointer"
                                >
                                  <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                                  <span>क्यूआर एवं सत्यापन</span>
                                </button>
                                <button
                                  onClick={() => shareCertificate(cert)}
                                  aria-label="Share certificate link"
                                  className="min-h-11 px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-xs font-semibold text-white flex items-center gap-1.5 cursor-pointer"
                                >
                                  <Share2 className="w-3.5 h-3.5" />
                                  <span>शेयर</span>
                                </button>
                                <button
                                  onClick={() => copyCertificateLink(cert)}
                                  aria-label="Copy verification link"
                                  className="min-h-11 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-xs font-semibold text-white flex items-center gap-1.5 cursor-pointer"
                                >
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>लिंक कॉपी</span>
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* WORKER TAB 5: DISPUTES */}
                {activeTab === "disputes" && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-white">मेरी आपत्तियां एवं शिकायतें</h3>
                      <button
                        onClick={() => setShowDisputeModal(true)}
                        className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                      >
                        <AlertTriangle className="w-4 h-4" />
                        <span>आपत्ति दर्ज करें</span>
                      </button>
                    </div>

                    <div className="space-y-3">
                      {disputesList.length === 0 ? (
                        <div className="p-8 text-center bg-stone-900/40 rounded-2xl border border-stone-800 text-stone-400 text-sm">
                          कोई विवाद दर्ज नहीं है।
                        </div>
                      ) : (
                        disputesList.map((d) => (
                          <div
                            key={d.id}
                            className="p-4 rounded-xl bg-stone-900 border border-stone-800 space-y-1 text-sm"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-white">{d.reasonCategory}</span>
                              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800">
                                {d.status}
                              </span>
                            </div>
                            <p className="text-xs text-stone-300">{d.description}</p>
                            {d.resolutionNote && (
                              <p className="text-xs text-emerald-400 pt-1">
                                समाधान: {d.resolutionNote}
                              </p>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* WORKER TAB 6: PROFILE */}
                {activeTab === "profile" && (
                  <div className="bg-stone-900 p-6 rounded-2xl border border-stone-800 max-w-xl space-y-3 text-sm">
                    <h3 className="text-base font-bold text-white">मेरी सत्यापित प्रोफाइल</h3>
                    <div>
                      <span className="text-xs text-stone-400 block">नाम:</span>
                      <span className="font-bold text-white">{user.name}</span>
                    </div>
                    <div>
                      <span className="text-xs text-stone-400 block">पंजीकृत फोन / ईमेल:</span>
                      <span className="font-mono text-emerald-400">
                        {user.email || user.phone}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs text-stone-400 block">पेशा:</span>
                      <span className="text-white">{profile?.occupation}</span>
                    </div>
                    <details className="pt-2">
                      <summary className="cursor-pointer text-xs font-bold text-stone-300">खाता सुरक्षा — पासवर्ड बदलें</summary>
                      <ChangePasswordCard />
                    </details>
                  </div>
                )}
              </div>
            )}

            {/* ================================================================= */}
            {/* 2. EMPLOYER + ADMIN VIEW (FULL EMPLOYER & ADMIN ACCESS)           */}
            {/* ================================================================= */}
            {isEmployerOrAdmin && (
              <div className="space-y-6">
                {employerWorkspaceMode === "employer" ? (
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-4">
                      <div>
                        <h2 className="text-2xl font-black text-white">
                          नियोक्ता डैशबोर्ड ({user.name})
                        </h2>
                        <p className="text-xs text-stone-400">
                          श्रमिक हाजिरी पुष्टि, मजदूरी समझौता संस्करण (Versioning) और भुगतान प्रबंधन
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setShowAddEmployerModal(true)}
                          className="px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-emerald-400 border border-stone-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                        >
                          <PlusCircle className="w-4 h-4" />
                          <span>+ श्रमिक जोड़ें (Onboard Worker)</span>
                        </button>
                        <button
                          onClick={() => setShowNewPaymentModal(true)}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-stone-950 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                        >
                          <DollarSign className="w-4 h-4" />
                          <span>नया भुगतान दर्ज करें</span>
                        </button>
                      </div>
                    </div>

                    {/* Employer Stats */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div className="p-4 rounded-xl bg-stone-900 border border-stone-800">
                        <span className="text-xs text-stone-400 font-medium">पुष्टि हेतु लंबित</span>
                        <div className="text-2xl font-black text-amber-400 mt-1">
                          {sessions.filter((s) => s.status === "pending_confirmation").length}
                        </div>
                      </div>
                      <div className="p-4 rounded-xl bg-stone-900 border border-stone-800">
                        <span className="text-xs text-stone-400 font-medium">पुष्ट कार्य सत्र</span>
                        <div className="text-2xl font-black text-emerald-400 mt-1">
                          {sessions.filter((s) => s.status === "confirmed").length}
                        </div>
                      </div>
                      <div className="p-4 rounded-xl bg-stone-900 border border-stone-800">
                        <span className="text-xs text-stone-400 font-medium">आपत्ति / विवाद सत्र</span>
                        <div className="text-2xl font-black text-red-400 mt-1">
                          {sessions.filter((s) => s.status === "disputed").length}
                        </div>
                      </div>
                      <div className="p-4 rounded-xl bg-stone-900 border border-stone-800">
                        <span className="text-xs text-stone-400 font-medium">सक्रिय कामगार</span>
                        <div className="text-2xl font-black text-white mt-1">
                          {relationships.length}
                        </div>
                      </div>
                    </div>

                    {/* Connected Workers & Versioned Wage Agreements */}
                    <div className="space-y-3">
                      <h3 className="text-base font-bold text-white">
                        जुड़े हुए श्रमिक एवं मजदूरी अनुबंध (Versioned Wage Agreements)
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {relationships.map((rel) => (
                          <div
                            key={rel.id}
                            className="p-4 rounded-xl bg-stone-900/70 border border-stone-800 flex items-center justify-between gap-3 text-sm"
                          >
                            <div>
                              <div className="font-bold text-white">{rel.workerName}</div>
                              <div className="text-xs text-stone-400">
                                पद: {rel.roleTitle} • वर्तमान दर:{" "}
                                <strong className="text-emerald-400">
                                  ₹{rel.agreement?.wageAmount ?? "450"}/day (v
                                  {rel.agreement?.version ?? 1})
                                </strong>
                              </div>
                            </div>
                            <button
                              onClick={() =>
                                handleUpgradeAgreementVersion(
                                  rel.id,
                                  rel.agreement?.wageAmount || "450"
                                )
                              }
                              className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-xs font-semibold text-emerald-300 border border-stone-700 cursor-pointer"
                            >
                              + वेतन संशोधित करें (New Version)
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Pending Confirmation Queue */}
                    <div className="space-y-4">
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <Clock className="w-4 h-4 text-amber-400" />
                        <span>श्रमिक उपस्थिति पुष्टि कतार (Pending Confirmation Queue)</span>
                      </h3>

                      <div className="space-y-3">
                        {sessions.filter((s) => s.status === "pending_confirmation").length ===
                        0 ? (
                          <div className="p-6 rounded-xl bg-stone-900/40 border border-stone-800 text-center text-sm text-stone-400">
                            कोई लंबित सत्र नहीं है। सभी रिकॉर्ड अद्यतन हैं।
                          </div>
                        ) : (
                          sessions
                            .filter((s) => s.status === "pending_confirmation")
                            .map((s) => (
                              <div
                                key={s.id}
                                className="p-5 rounded-xl bg-stone-900/90 border border-amber-600/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-sm"
                              >
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold text-white">
                                      {s.workerName || "श्रमिक"}
                                    </span>
                                    <span className="text-xs px-2 py-0.5 rounded-full bg-amber-950 text-amber-400 border border-amber-800 font-medium">
                                      लंबित पुष्टि (Pending)
                                    </span>
                                  </div>
                                  <div className="text-xs text-stone-400">
                                    तारीख: {new Date(s.serverStartReceivedAt).toLocaleDateString()}{" "}
                                    • अवधि:{" "}
                                    <strong className="text-white">
                                      {s.durationMinutes ?? 0} मिनट
                                    </strong>
                                  </div>
                                </div>

                                <div className="flex items-center gap-3 w-full md:w-auto">
                                  <button
                                    onClick={() => handleEmployerConfirm(s.id)}
                                    disabled={actionLoading}
                                    className="flex-1 md:flex-none px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                                  >
                                    <CheckCircle2 className="w-4 h-4" />
                                    <span>स्वीकार करें (Confirm)</span>
                                  </button>

                                  <button
                                    onClick={() => handleEmployerDispute(s.id)}
                                    disabled={actionLoading}
                                    className="flex-1 md:flex-none px-4 py-2 rounded-xl bg-red-950 hover:bg-red-900 text-red-300 border border-red-800 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                                  >
                                    <AlertTriangle className="w-4 h-4" />
                                    <span>आपत्ति (Dispute)</span>
                                  </button>
                                </div>
                              </div>
                            ))
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* EMPLOYER'S ADMIN & AUDITOR COMMAND CENTER */
                  <div className="space-y-6">
                    <div className="border-b border-stone-800 pb-4">
                      <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                        Employer review & audit — your own workers only
                      </span>
                      <h2 className="text-2xl font-black text-white">
                        समीक्षा संकेत एवं ऑडिट लॉग
                      </h2>
                      <p className="text-xs text-stone-400">
                        समीक्षा संकेत (केवल प्राथमिकता तय करने हेतु — किसी की ईमानदारी का निर्णय नहीं), विवाद और ऑडिट लॉग। नोट: विवाद की समीक्षा नियोक्ता करता है, जो स्वयं एक पक्ष है — यह निष्पक्ष या कानूनी निर्णय नहीं है।
                      </p>
                    </div>

                    {/* AI Anomaly Queue */}
                    <div className="space-y-4">
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <span>एआई विसंगति समीक्षा कतार (AI Anomaly Review Queue)</span>
                      </h3>

                      <div className="space-y-3">
                        {anomaliesList.map((a) => (
                          <div
                            key={a.id}
                            className="p-5 rounded-2xl bg-stone-900/80 border border-stone-800 space-y-3 text-sm"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-800 pb-3">
                              <div className="font-bold text-white">
                                श्रमिक: {a.workerName} | नियोक्ता: {a.employerName}
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs px-2 py-0.5 rounded font-mono font-bold bg-amber-950 text-amber-300 border border-amber-800">
                                  जोखिम स्कोर: {a.riskScore} ({a.reviewPriority})
                                </span>
                                <span className="text-xs px-2 py-0.5 rounded bg-stone-800 text-stone-300 font-mono">
                                  {a.humanReviewStatus}
                                </span>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-1.5">
                              {Array.isArray(a.signalFlags) &&
                                a.signalFlags.map((flag: string, idx: number) => (
                                  <span
                                    key={idx}
                                    className="text-xs px-2.5 py-1 rounded-md bg-stone-950 text-amber-300 border border-stone-800"
                                  >
                                    ⚠ {flag}
                                  </span>
                                ))}
                            </div>

                            {a.humanReviewStatus === "pending_review" && (
                              <div className="flex items-center gap-2 pt-2">
                                <button
                                  onClick={() => handleReviewAnomaly(a.id, "confirmed_normal")}
                                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-bold text-xs cursor-pointer"
                                >
                                  सामान्य माना (Confirm Normal)
                                </button>
                                <button
                                  onClick={() =>
                                    handleReviewAnomaly(a.id, "flagged_investigation")
                                  }
                                  className="px-3 py-1.5 rounded-lg bg-red-950 hover:bg-red-900 text-red-300 border border-red-800 text-xs font-semibold cursor-pointer"
                                >
                                  जांच हेतु भेजा (Escalate)
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Dispute Resolution Queue */}
                    <div className="space-y-3 pt-4">
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-400" />
                        <span>विवाद समाधान कतार (Dispute Resolution Queue)</span>
                      </h3>

                      <div className="space-y-2.5">
                        {disputesList.map((d) => (
                          <div
                            key={d.id}
                            className="p-4 rounded-xl bg-stone-900/80 border border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-white">
                                  {d.workerName} vs {d.employerName}
                                </span>
                                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800">
                                  {d.status}
                                </span>
                              </div>
                              <p className="text-xs text-stone-300">{d.description}</p>
                            </div>

                            {d.status !== "resolved" ? (
                              <button
                                onClick={() => handleAdminResolveDispute(d.id)}
                                disabled={actionLoading}
                                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-bold text-xs shrink-0 cursor-pointer"
                              >
                                समाधान करें (Resolve Dispute)
                              </button>
                            ) : (
                              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1 shrink-0">
                                <CheckCircle2 className="w-4 h-4" /> Resolved
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Audit Logs */}
                    <div className="space-y-3 pt-4">
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span>अपरिवर्तनीय ऑडिट ट्रेल (Immutable Audit Trail)</span>
                      </h3>
                      <div className="space-y-2">
                        {auditLogsList.slice(0, 8).map((log) => (
                          <div
                            key={log.id}
                            className="p-3 rounded-xl bg-stone-900/50 border border-stone-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-1"
                          >
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-emerald-400">
                                {log.action}
                              </span>
                              <span className="text-stone-300">{log.details}</span>
                            </div>
                            <span className="text-[11px] text-stone-400 font-mono">
                              {new Date(log.createdAt).toLocaleTimeString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* MODAL 1: CERTIFICATE PREVIEW & QR */}
      {showCertificateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-700 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-white text-base">Proof-of-Work Certificate</h3>
              </div>
              <button
                onClick={() => setShowCertificateModal(null)}
                className="text-stone-400 hover:text-white text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 text-center space-y-3">
              <span className="text-xs font-mono font-bold text-emerald-400">
                {showCertificateModal.certificateNumber}
              </span>
              <div className="text-xl font-bold text-white">
                {showCertificateModal.workerDisplayName}
              </div>
              <div className="text-xs text-stone-400">
                नियोक्ता: {showCertificateModal.employerDisplayName} • अवधि:{" "}
                {showCertificateModal.periodStart} से {showCertificateModal.periodEnd}
              </div>

              {qrCodeDataUrl && (
                <div className="pt-2 flex flex-col items-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={qrCodeDataUrl}
                    alt="Certificate QR"
                    className="w-36 h-36 bg-white p-1 rounded-xl"
                  />
                  <span className="text-[10px] text-stone-400 font-mono mt-1">
                    स्कैन करके सार्वजनिक सत्यापन करें
                  </span>
                </div>
              )}

              <div className="text-[10px] text-stone-400 font-mono break-all pt-1 border-t border-stone-850">
                SHA-256 Hash: {showCertificateModal.canonicalHash}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <a
                href={`/verify/${showCertificateModal.certificateNumber}`}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-emerald-400 hover:underline flex items-center gap-1 font-medium"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>सार्वजनिक सत्यापन पृष्ठ खोलें (Open Verification Page)</span>
              </a>

              <button
                onClick={() => setShowCertificateModal(null)}
                className="px-4 py-2 rounded-xl bg-stone-800 text-white text-xs font-bold"
              >
                बंद करें
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: RECORD PAYMENT */}
      {showNewPaymentModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreatePayment}
            className="bg-stone-900 border border-stone-700 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h3 className="font-bold text-white text-base">मजदूरी भुगतान दर्ज करें</h3>
              <button
                type="button"
                onClick={() => setShowNewPaymentModal(false)}
                className="text-stone-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div>
                <label className="text-xs text-stone-400 block mb-1">राशि (₹)</label>
                <input
                  type="number"
                  required
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-white font-semibold text-lg"
                />
              </div>

              <div>
                <label className="text-xs text-stone-400 block mb-1">भुगतान का माध्यम</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-white"
                >
                  <option value="Direct Bank Transfer">सीधा बैंक ट्रांसफर (Bank Transfer)</option>
                  <option value="Cash">नकद (Cash)</option>
                  <option value="UPI Voucher">यूपीआई वाउचर</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-stone-400 block mb-1">टिप्पणी</label>
                <input
                  type="text"
                  placeholder="संदर्भ नोट"
                  value={paymentNote}
                  onChange={(e) => setPaymentNote(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-white text-xs"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-800">
              <button
                type="button"
                onClick={() => setShowNewPaymentModal(false)}
                className="px-4 py-2 rounded-xl bg-stone-800 text-xs text-stone-300"
              >
                रद्द करें
              </button>
              <button
                type="submit"
                disabled={actionLoading}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-stone-950 text-xs font-bold"
              >
                दर्ज करें
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 3: RAISE DISPUTE */}
      {showDisputeModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateDispute}
            className="bg-stone-900 border border-stone-700 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h3 className="font-bold text-white text-base">आपत्ति / शिकायत दर्ज करें</h3>
              <button
                type="button"
                onClick={() => setShowDisputeModal(false)}
                className="text-stone-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div>
                <label className="text-xs text-stone-400 block mb-1">श्रेणी</label>
                <select
                  value={disputeCategory}
                  onChange={(e) => setDisputeCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-white text-xs"
                >
                  <option value="wrong_duration">गलत कार्य समय (Wrong Duration)</option>
                  <option value="missing_payment">भुगतान लंबित (Missing Payment)</option>
                  <option value="unagreed_deduction">अनुचित कटौती (Unagreed Deduction)</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-stone-400 block mb-1">विवरण</label>
                <textarea
                  required
                  rows={4}
                  value={disputeDesc}
                  onChange={(e) => setDisputeDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-white text-xs"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-800">
              <button
                type="button"
                onClick={() => setShowDisputeModal(false)}
                className="px-4 py-2 rounded-xl bg-stone-800 text-xs text-stone-300"
              >
                रद्द करें
              </button>
              <button
                type="submit"
                disabled={actionLoading}
                className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 text-xs font-bold"
              >
                सबमिट करें
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 4: CONNECT EMPLOYER OR WORKER & CREATE MUTUAL WAGE AGREEMENT */}
      {showAddEmployerModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateEmployerRelationship}
            className="bg-stone-900 border border-stone-700 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h3 className="font-bold text-white text-base">
                {isWorker
                  ? "नियोक्ता (Employer) जोड़ें एवं अनुबंध बनाएं"
                  : "श्रमिक (Worker) जोड़ें एवं अनुबंध बनाएं"}
              </h3>
              <button
                type="button"
                onClick={() => setShowAddEmployerModal(false)}
                className="text-stone-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-sm">
              {isWorker && availableEmployers.length > 0 && (
                <div>
                  <label className="text-xs text-stone-400 block mb-1">
                    पंजीकृत नियोक्ता चुनें (Or Select Registered Employer)
                  </label>
                  <select
                    value={selectedExistingEmployerId}
                    onChange={(e) => setSelectedExistingEmployerId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-white text-xs"
                  >
                    <option value="">-- नया नियोक्ता नीचे दर्ज करें --</option>
                    {availableEmployers.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.name} ({emp.companyOrHouseholdName})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {!selectedExistingEmployerId && (
                <>
                  <div>
                    <label className="text-xs text-stone-400 block mb-1">
                      {isWorker ? "नियोक्ता का नाम" : "श्रमिक का नाम"} *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={isWorker ? "उदा. शर्मा परिवार" : "उदा. राजू कुमार"}
                      value={counterpartyName}
                      onChange={(e) => setCounterpartyName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-stone-400 block mb-1">
                      कर्मचारी/नियोक्ता का पंजीकृत ईमेल (Registered email)
                    </label>
                    <input
                      type="text"
                      placeholder="उदा. 9811223344 या email@domain.com"
                      value={counterpartyIdentifier}
                      onChange={(e) => setCounterpartyIdentifier(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-white text-xs"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="text-xs text-stone-400 block mb-1">कार्य की भूमिका (Role)</label>
                <input
                  type="text"
                  required
                  value={newEmployerRole}
                  onChange={(e) => setNewEmployerRole(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-white text-xs"
                />
              </div>

              <div>
                <label className="text-xs text-stone-400 block mb-1">दैनिक मजदूरी दर (₹ / दिन)</label>
                <input
                  type="number"
                  required
                  value={newEmployerWage}
                  onChange={(e) => setNewEmployerWage(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-white font-bold"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-800">
              <button
                type="button"
                onClick={() => setShowAddEmployerModal(false)}
                className="px-4 py-2 rounded-xl bg-stone-800 text-xs text-stone-300"
              >
                रद्द करें
              </button>
              <button
                type="submit"
                disabled={actionLoading}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-stone-950 text-xs font-bold"
              >
                अनुबंध सक्रिय करें (Activate Agreement v1)
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-stone-900 bg-stone-950 px-4 py-6 text-center text-xs text-stone-400">
        <p className="max-w-2xl mx-auto">
          Attendance answers: <em>Did you work today?</em> KaamProof answers:{" "}
          <strong className="text-stone-300">
            Can you prove your work history after the job is over?
          </strong>
        </p>
      </footer>
    </div>
  );
}
