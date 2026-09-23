import { pgTable, text, timestamp, uuid, integer, boolean, numeric, jsonb, index, uniqueIndex, check } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    email: text("email").notNull().unique(), // stored lowercase
    passwordHash: text("password_hash").notNull(), // bcrypt; never returned by any API
    phone: text("phone").unique(), // optional contact number
    name: text("name").notNull(),
    role: text("role").notNull().default("worker"), // 'worker' | 'employer' ONLY (enforced by CHECK)
    isActive: boolean("is_active").default(true).notNull(),
    profileCompleted: boolean("profile_completed").default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [check("users_role_check", sql`${t.role} in ('worker','employer')`)]
);

export const authSessions = pgTable("auth_sessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  tokenHash: text("token_hash").notNull().unique(), // SHA-256 of the opaque cookie token
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  revoked: boolean("revoked").default(false).notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const workerProfiles = pgTable("worker_profiles", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull().unique(),
  occupation: text("occupation").notNull(), // 'Domestic Cook', 'Electrician', etc.
  experienceYears: integer("experience_years").default(1),
  primaryLocation: text("primary_location").notNull(),
  bio: text("bio"),
  preferredLang: text("preferred_lang").default("hi"), // 'hi' | 'en'
  upiClaimId: text("upi_claim_id"), // only self-reported display ID, KaamProof does NOT process money
  emergencyContact: text("emergency_contact"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const employerProfiles = pgTable("employer_profiles", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull().unique(),
  companyOrHouseholdName: text("company_or_household_name").notNull(),
  category: text("category").notNull(), // 'Household', 'Small Business', 'Construction Subcontractor'
  addressCity: text("address_city").notNull(),
  contactPerson: text("contact_person"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const employmentRelationships = pgTable("employment_relationships", {
  id: uuid("id").defaultRandom().primaryKey(),
  workerId: uuid("worker_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  employerId: uuid("employer_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  status: text("status").notNull().default("pending"), // 'pending', 'active', 'rejected', 'ended'
  roleTitle: text("role_title").notNull(), // 'Cook & Kitchen Assistant'
  initiatedByRole: text("initiated_by_role").notNull().default("worker"), // who sent the request; the OTHER party must accept
  notes: text("notes"),
  acceptedAt: timestamp("accepted_at", { withTimezone: true }),
  endedAt: timestamp("ended_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
},
(t) => [
  uniqueIndex("uniq_live_relationship").on(t.workerId, t.employerId).where(sql`${t.status} in ('pending','active')`),
  index("idx_rel_employer").on(t.employerId),
]);

export const wageAgreements = pgTable("wage_agreements", {
  id: uuid("id").defaultRandom().primaryKey(),
  relationshipId: uuid("relationship_id").references(() => employmentRelationships.id, { onDelete: "cascade" }).notNull(),
  workerId: uuid("worker_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  employerId: uuid("employer_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  version: integer("version").default(1).notNull(),
  jobType: text("job_type").notNull(),
  wageType: text("wage_type").notNull(), // 'daily' | 'hourly' | 'monthly'
  wageAmount: numeric("wage_amount", { precision: 10, scale: 2 }).notNull(),
  expectedHoursPerDay: numeric("expected_hours_per_day", { precision: 4, scale: 2 }).default("8.00"),
  expectedDaysPerWeek: integer("expected_days_per_week").default(6),
  overtimeRateHourly: numeric("overtime_rate_hourly", { precision: 10, scale: 2 }).default("0.00"),
  paymentFrequency: text("payment_frequency").notNull().default("monthly"), // 'daily', 'weekly', 'monthly'
  paymentMethod: text("payment_method").notNull().default("Direct Cash or Bank Transfer"),
  status: text("status").notNull().default("active"), // 'draft', 'pending_acceptance', 'active', 'superseded', 'cancelled'
  workerAcceptedAt: timestamp("worker_accepted_at", { withTimezone: true }),
  employerAcceptedAt: timestamp("employer_accepted_at", { withTimezone: true }),
  startDate: text("start_date").notNull(),
  endDate: text("end_date"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const workSessions = pgTable("work_sessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  workerId: uuid("worker_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  employerId: uuid("employer_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  relationshipId: uuid("relationship_id").references(() => employmentRelationships.id, { onDelete: "cascade" }).notNull(),
  agreementId: uuid("agreement_id").references(() => wageAgreements.id, { onDelete: "set null" }),
  idempotencyKey: text("idempotency_key").unique(),
  
  // Status: open | pending_confirmation | confirmed | disputed | cancelled
  status: text("status").notNull().default("open"),
  
  // Timestamps
  serverStartReceivedAt: timestamp("server_start_received_at", { withTimezone: true }).defaultNow().notNull(),
  serverEndReceivedAt: timestamp("server_end_received_at", { withTimezone: true }),
  deviceStartTime: timestamp("device_start_time", { withTimezone: true }),
  deviceEndTime: timestamp("device_end_time", { withTimezone: true }),
  durationMinutes: integer("duration_minutes"), // server-calculated
  
  // Start location
  startLatitude: numeric("start_latitude", { precision: 10, scale: 7 }),
  startLongitude: numeric("start_longitude", { precision: 10, scale: 7 }),
  startAccuracyMeters: numeric("start_accuracy_meters", { precision: 8, scale: 2 }),
  startLocationNote: text("start_location_note"),
  
  // End location
  endLatitude: numeric("end_latitude", { precision: 10, scale: 7 }),
  endLongitude: numeric("end_longitude", { precision: 10, scale: 7 }),
  endAccuracyMeters: numeric("end_accuracy_meters", { precision: 8, scale: 2 }),
  endLocationNote: text("end_location_note"),
  
  // Offline sync metadata
  wasOfflineSynced: boolean("was_offline_synced").default(false),
  syncStatus: text("sync_status").default("synced"), // 'synced' | 'needs_review'
  
  // Confirmation / dispute notes
  confirmedAt: timestamp("confirmed_at", { withTimezone: true }),
  employerRemarks: text("employer_remarks"),
  calculatedWage: numeric("calculated_wage", { precision: 10, scale: 2 }).default("0.00"),
  // Persisted wage breakdown (server-calculated from the agreement)
  regularMinutes: integer("regular_minutes"),
  overtimeMinutes: integer("overtime_minutes"),
  baseEarnings: numeric("base_earnings", { precision: 10, scale: 2 }),
  overtimeEarnings: numeric("overtime_earnings", { precision: 10, scale: 2 }),

  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
},
(t) => [
  // DB-level guarantee: at most ONE open work session per worker
  uniqueIndex("uniq_open_session_per_worker").on(t.workerId).where(sql`${t.status} = 'open'`),
  index("idx_sessions_employer_status").on(t.employerId, t.status),
  index("idx_sessions_worker_status").on(t.workerId, t.status),
]);

export const payments = pgTable("payments", {
  id: uuid("id").defaultRandom().primaryKey(),
  workerId: uuid("worker_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  employerId: uuid("employer_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  relationshipId: uuid("relationship_id").references(() => employmentRelationships.id, { onDelete: "cascade" }).notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  paymentDate: text("payment_date").notNull(),
  paymentMethod: text("payment_method").notNull().default("Cash"), // 'Cash', 'Direct Bank', 'UPI Voucher'
  referenceNote: text("reference_note"),
  recordedByRole: text("recorded_by_role").notNull().default("employer"), // 'employer' | 'worker'
  workerConfirmation: boolean("worker_confirmation").default(false),
  employerConfirmation: boolean("employer_confirmation").default(true),
  status: text("status").notNull().default("pending_confirmation"), // 'pending_confirmation' | 'confirmed' | 'disputed'
  idempotencyKey: text("idempotency_key").unique(),
  confirmedAt: timestamp("confirmed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
},
(t) => [index("idx_payments_worker").on(t.workerId), index("idx_payments_employer").on(t.employerId)]);

export const disputes = pgTable("disputes", {
  id: uuid("id").defaultRandom().primaryKey(),
  raisedByUserId: uuid("raised_by_user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  workerId: uuid("worker_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  employerId: uuid("employer_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  sessionId: uuid("session_id").references(() => workSessions.id, { onDelete: "set null" }),
  paymentId: uuid("payment_id").references(() => payments.id, { onDelete: "set null" }),
  agreementId: uuid("agreement_id").references(() => wageAgreements.id, { onDelete: "set null" }),
  reasonCategory: text("reason_category").notNull(), // 'wrong_duration', 'missing_payment', 'unagreed_deduction', 'unconfirmed_session'
  description: text("description").notNull(),
  status: text("status").notNull().default("open"), // 'open', 'under_review', 'resolved', 'rejected'
  resolutionNote: text("resolution_note"),
  resolvedAt: timestamp("resolved_at", { withTimezone: true }),
  resolvedByUserId: uuid("resolved_by_user_id").references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const certificates = pgTable("certificates", {
  id: uuid("id").defaultRandom().primaryKey(),
  certificateNumber: text("certificate_number").notNull().unique(), // e.g. KP-2026-DEL-0492
  workerId: uuid("worker_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  employerId: uuid("employer_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  relationshipId: uuid("relationship_id").references(() => employmentRelationships.id, { onDelete: "cascade" }).notNull(),
  periodStart: text("period_start").notNull(),
  periodEnd: text("period_end").notNull(),
  
  // Aggregate snapshot
  workerDisplayName: text("worker_display_name").notNull(),
  employerDisplayName: text("employer_display_name").notNull(),
  occupation: text("occupation").notNull(),
  confirmedWorkdays: integer("confirmed_workdays").notNull(),
  confirmedHours: numeric("confirmed_hours", { precision: 8, scale: 2 }).notNull(),
  disputedSessionsCount: integer("disputed_sessions_count").default(0),
  agreedWageRate: text("agreed_wage_rate").notNull(),
  totalEarningsExpected: numeric("total_earnings_expected", { precision: 10, scale: 2 }).notNull(),
  totalPaymentsReceived: numeric("total_payments_received", { precision: 10, scale: 2 }).notNull(),
  outstandingAmount: numeric("outstanding_amount", { precision: 10, scale: 2 }).notNull(),
  
  // Integrity & verification
  certificateStatus: text("certificate_status").notNull().default("Fully Confirmed"), // 'Fully Confirmed' | 'Partially Confirmed' | 'Contains Disputed Sessions'
  canonicalHash: text("canonical_hash").notNull(), // SHA-256 hash of snapshot
  verificationUrl: text("verification_url").notNull(),
  isRevoked: boolean("is_revoked").default(false),
  revocationReason: text("revocation_reason"),
  
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const anomalyScores = pgTable("anomaly_scores", {
  id: uuid("id").defaultRandom().primaryKey(),
  sessionId: uuid("session_id").references(() => workSessions.id, { onDelete: "cascade" }).notNull(),
  workerId: uuid("worker_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  employerId: uuid("employer_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  riskScore: numeric("risk_score", { precision: 4, scale: 2 }).notNull(), // 0.00 to 1.00
  reviewPriority: text("review_priority").notNull().default("Normal"), // 'Low' | 'Medium' | 'High'
  signalFlags: jsonb("signal_flags").notNull(), // array of strings e.g. ["Large device-server gap", "Unusual session duration"]
  featuresExtracted: jsonb("features_extracted"), // duration, gap_minutes, accuracy, distance
  humanReviewStatus: text("human_review_status").notNull().default("pending_review"), // 'pending_review' | 'confirmed_normal' | 'flagged_investigation' | 'dismissed'
  adminNotes: text("admin_notes"),
  reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
  reviewedByUserId: uuid("reviewed_by_user_id").references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  actorId: uuid("actor_id").references(() => users.id, { onDelete: "set null" }),
  action: text("action").notNull(), // e.g. 'WORK_SESSION_STARTED', 'WORK_SESSION_ENDED', 'PAYMENT_RECORDED'
  entityType: text("entity_type").notNull(), // 'work_session', 'payment', 'dispute', 'wage_agreement', 'certificate'
  entityId: text("entity_id").notNull(),
  details: text("details"),
  ipAddress: text("ip_address"),
  deviceMetadata: text("device_metadata"),
  actorRole: text("actor_role"),
  // Scope columns so employers only ever see audit rows for their own relationships
  scopeWorkerId: uuid("scope_worker_id"),
  scopeEmployerId: uuid("scope_employer_id"),
  beforeData: jsonb("before_data"),
  afterData: jsonb("after_data"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
},
(t) => [index("idx_audit_employer").on(t.scopeEmployerId, t.createdAt), index("idx_audit_actor").on(t.actorId)]);

export const userConsents = pgTable("user_consents", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  consentType: text("consent_type").notNull(), // 'location_capture' | 'photo_capture' | 'certificate_public_verification' | 'data_processing'
  version: text("version").default("v1.0").notNull(),
  isAccepted: boolean("is_accepted").default(true).notNull(),
  acceptedAt: timestamp("accepted_at", { withTimezone: true }).defaultNow().notNull(),
});

export const attendanceEvents = pgTable("attendance_events", {
  id: uuid("id").defaultRandom().primaryKey(),
  sessionId: uuid("session_id").references(() => workSessions.id, { onDelete: "cascade" }).notNull(),
  workerId: uuid("worker_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  eventType: text("event_type").notNull(), // 'start' | 'end'
  idempotencyKey: text("idempotency_key").unique(),
  deviceTimestamp: timestamp("device_timestamp", { withTimezone: true }),
  serverReceivedAt: timestamp("server_received_at", { withTimezone: true }).defaultNow().notNull(),
  latitude: numeric("latitude", { precision: 10, scale: 7 }),
  longitude: numeric("longitude", { precision: 10, scale: 7 }),
  accuracyMeters: numeric("accuracy_meters", { precision: 8, scale: 2 }),
  capturedOffline: boolean("captured_offline").default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const verificationRecords = pgTable("verification_records", {
  id: uuid("id").defaultRandom().primaryKey(),
  certificateId: uuid("certificate_id").references(() => certificates.id, { onDelete: "set null" }),
  queriedId: text("queried_id").notNull(),
  outcome: text("outcome").notNull(), // 'VERIFIED' | 'NOT_FOUND' | 'REVOKED' | 'INTEGRITY_FAILED'
  integrityOk: boolean("integrity_ok").default(true).notNull(),
  requestIp: text("request_ip"),
  userAgent: text("user_agent"),
  verifiedAt: timestamp("verified_at", { withTimezone: true }).defaultNow().notNull(),
});

// One-time password-reset tokens (only the SHA-256 of the emailed token is stored)
export const passwordResets = pgTable(
  "password_resets",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    tokenHash: text("token_hash").notNull().unique(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    usedAt: timestamp("used_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index("idx_pwreset_user").on(t.userId)]
);
