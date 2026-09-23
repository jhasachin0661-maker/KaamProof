// Shared client-side view types (shape of API responses)
export interface UserData {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  role: "worker" | "employer";
  profileCompleted?: boolean;
}

export interface WorkerProfile {
  occupation: string;
  experienceYears: number;
  primaryLocation: string;
  bio?: string;
  upiClaimId?: string;
}

export interface Relationship {
  id: string;
  workerId: string;
  employerId: string;
  workerName: string;
  workerPhone?: string;
  employerName: string;
  employerPhone?: string;
  roleTitle: string;
  status: string;
  initiatedByRole?: string;
  awaitingMyResponse?: boolean;
  pendingAgreement?: {
    id: string;
    version: number;
    wageAmount: string;
    wageType: string;
    workerAcceptedAt?: string | null;
    employerAcceptedAt?: string | null;
  } | null;
  agreement?: {
    id: string;
    version: number;
    wageAmount: string;
    wageType: string;
    jobType: string;
  };
  agreementHistory?: Array<{
    id: string;
    version: number;
    wageAmount: string;
    wageType: string;
    status: string;
    startDate: string;
  }>;
}

export interface WorkSession {
  id: string;
  workerId: string;
  employerId: string;
  workerName?: string;
  employerName?: string;
  status: "open" | "pending_confirmation" | "confirmed" | "disputed" | "cancelled";
  serverStartReceivedAt: string;
  serverEndReceivedAt?: string;
  durationMinutes?: number;
  startLatitude?: string;
  startLongitude?: string;
  startAccuracyMeters?: string;
  startLocationNote?: string;
  employerRemarks?: string;
  calculatedWage?: string;
  wasOfflineSynced?: boolean;
}

export interface Payment {
  id: string;
  workerId: string;
  employerId: string;
  amount: string;
  paymentDate: string;
  paymentMethod: string;
  referenceNote?: string;
  workerConfirmation: boolean;
  employerConfirmation: boolean;
  status: string;
}

export interface Dispute {
  id: string;
  workerName: string;
  employerName: string;
  raisedByName: string;
  reasonCategory: string;
  description: string;
  status: string;
  resolutionNote?: string;
  createdAt: string;
}

export interface Certificate {
  id: string;
  certificateNumber: string;
  workerDisplayName: string;
  employerDisplayName: string;
  periodStart: string;
  periodEnd: string;
  confirmedWorkdays: number;
  confirmedHours: string;
  agreedWageRate: string;
  certificateStatus: string;
  canonicalHash: string;
}

export interface Anomaly {
  id: string;
  workerName: string;
  employerName: string;
  riskScore: string;
  reviewPriority: string;
  signalFlags: string[];
  humanReviewStatus: string;
  adminNotes?: string;
  durationMinutes?: number;
}

export interface WorkerMetrics {
  confirmedWorkdays: number;
  confirmedHours: string;
  expectedEarnings: number;
  paidAmount: number;
  outstandingAmount: number;
  pendingCount: number;
  disputedCount: number;
  activeSession: WorkSession | null;
  totalSessions?: number;
  confirmedCount?: number;
  totalDisbursed?: number;
  activeWorkersCount?: number;
  overview?: {
    activeWorkers: number;
    pendingRequests: number;
    todaySessions: number;
    pendingConfirmations: number;
    pendingPayments: number;
    openDisputes: number;
    certificatesIssued: number;
    anomalyReviews: number;
  };
}
