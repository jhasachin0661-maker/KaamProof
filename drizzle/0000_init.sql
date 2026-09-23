CREATE TABLE "anomaly_scores" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" uuid NOT NULL,
	"worker_id" uuid NOT NULL,
	"employer_id" uuid NOT NULL,
	"risk_score" numeric(4, 2) NOT NULL,
	"review_priority" text DEFAULT 'Normal' NOT NULL,
	"signal_flags" jsonb NOT NULL,
	"features_extracted" jsonb,
	"human_review_status" text DEFAULT 'pending_review' NOT NULL,
	"admin_notes" text,
	"reviewed_at" timestamp with time zone,
	"reviewed_by_user_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "attendance_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" uuid NOT NULL,
	"worker_id" uuid NOT NULL,
	"event_type" text NOT NULL,
	"idempotency_key" text,
	"device_timestamp" timestamp with time zone,
	"server_received_at" timestamp with time zone DEFAULT now() NOT NULL,
	"latitude" numeric(10, 7),
	"longitude" numeric(10, 7),
	"accuracy_meters" numeric(8, 2),
	"captured_offline" boolean DEFAULT false,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "attendance_events_idempotency_key_unique" UNIQUE("idempotency_key")
);
--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"actor_id" uuid,
	"action" text NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" text NOT NULL,
	"details" text,
	"ip_address" text,
	"device_metadata" text,
	"actor_role" text,
	"scope_worker_id" uuid,
	"scope_employer_id" uuid,
	"before_data" jsonb,
	"after_data" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "auth_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"token_hash" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"revoked" boolean DEFAULT false NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "auth_sessions_token_hash_unique" UNIQUE("token_hash")
);
--> statement-breakpoint
CREATE TABLE "certificates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"certificate_number" text NOT NULL,
	"worker_id" uuid NOT NULL,
	"employer_id" uuid NOT NULL,
	"relationship_id" uuid NOT NULL,
	"period_start" text NOT NULL,
	"period_end" text NOT NULL,
	"worker_display_name" text NOT NULL,
	"employer_display_name" text NOT NULL,
	"occupation" text NOT NULL,
	"confirmed_workdays" integer NOT NULL,
	"confirmed_hours" numeric(8, 2) NOT NULL,
	"disputed_sessions_count" integer DEFAULT 0,
	"agreed_wage_rate" text NOT NULL,
	"total_earnings_expected" numeric(10, 2) NOT NULL,
	"total_payments_received" numeric(10, 2) NOT NULL,
	"outstanding_amount" numeric(10, 2) NOT NULL,
	"certificate_status" text DEFAULT 'Fully Confirmed' NOT NULL,
	"canonical_hash" text NOT NULL,
	"verification_url" text NOT NULL,
	"is_revoked" boolean DEFAULT false,
	"revocation_reason" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "certificates_certificate_number_unique" UNIQUE("certificate_number")
);
--> statement-breakpoint
CREATE TABLE "disputes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"raised_by_user_id" uuid NOT NULL,
	"worker_id" uuid NOT NULL,
	"employer_id" uuid NOT NULL,
	"session_id" uuid,
	"payment_id" uuid,
	"agreement_id" uuid,
	"reason_category" text NOT NULL,
	"description" text NOT NULL,
	"status" text DEFAULT 'open' NOT NULL,
	"resolution_note" text,
	"resolved_at" timestamp with time zone,
	"resolved_by_user_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "employer_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"company_or_household_name" text NOT NULL,
	"category" text NOT NULL,
	"address_city" text NOT NULL,
	"contact_person" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "employer_profiles_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "employment_relationships" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"worker_id" uuid NOT NULL,
	"employer_id" uuid NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"role_title" text NOT NULL,
	"initiated_by_role" text DEFAULT 'worker' NOT NULL,
	"notes" text,
	"accepted_at" timestamp with time zone,
	"ended_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"worker_id" uuid NOT NULL,
	"employer_id" uuid NOT NULL,
	"relationship_id" uuid NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"payment_date" text NOT NULL,
	"payment_method" text DEFAULT 'Cash' NOT NULL,
	"reference_note" text,
	"recorded_by_role" text DEFAULT 'employer' NOT NULL,
	"worker_confirmation" boolean DEFAULT false,
	"employer_confirmation" boolean DEFAULT true,
	"status" text DEFAULT 'pending_confirmation' NOT NULL,
	"idempotency_key" text,
	"confirmed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "payments_idempotency_key_unique" UNIQUE("idempotency_key")
);
--> statement-breakpoint
CREATE TABLE "user_consents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"consent_type" text NOT NULL,
	"version" text DEFAULT 'v1.0' NOT NULL,
	"is_accepted" boolean DEFAULT true NOT NULL,
	"accepted_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"phone" text,
	"name" text NOT NULL,
	"role" text DEFAULT 'worker' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"profile_completed" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_phone_unique" UNIQUE("phone"),
	CONSTRAINT "users_role_check" CHECK ("users"."role" in ('worker','employer'))
);
--> statement-breakpoint
CREATE TABLE "verification_records" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"certificate_id" uuid,
	"queried_id" text NOT NULL,
	"outcome" text NOT NULL,
	"integrity_ok" boolean DEFAULT true NOT NULL,
	"request_ip" text,
	"user_agent" text,
	"verified_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "wage_agreements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"relationship_id" uuid NOT NULL,
	"worker_id" uuid NOT NULL,
	"employer_id" uuid NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"job_type" text NOT NULL,
	"wage_type" text NOT NULL,
	"wage_amount" numeric(10, 2) NOT NULL,
	"expected_hours_per_day" numeric(4, 2) DEFAULT '8.00',
	"expected_days_per_week" integer DEFAULT 6,
	"overtime_rate_hourly" numeric(10, 2) DEFAULT '0.00',
	"payment_frequency" text DEFAULT 'monthly' NOT NULL,
	"payment_method" text DEFAULT 'Direct Cash or Bank Transfer' NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"worker_accepted_at" timestamp with time zone,
	"employer_accepted_at" timestamp with time zone,
	"start_date" text NOT NULL,
	"end_date" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "work_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"worker_id" uuid NOT NULL,
	"employer_id" uuid NOT NULL,
	"relationship_id" uuid NOT NULL,
	"agreement_id" uuid,
	"idempotency_key" text,
	"status" text DEFAULT 'open' NOT NULL,
	"server_start_received_at" timestamp with time zone DEFAULT now() NOT NULL,
	"server_end_received_at" timestamp with time zone,
	"device_start_time" timestamp with time zone,
	"device_end_time" timestamp with time zone,
	"duration_minutes" integer,
	"start_latitude" numeric(10, 7),
	"start_longitude" numeric(10, 7),
	"start_accuracy_meters" numeric(8, 2),
	"start_location_note" text,
	"end_latitude" numeric(10, 7),
	"end_longitude" numeric(10, 7),
	"end_accuracy_meters" numeric(8, 2),
	"end_location_note" text,
	"was_offline_synced" boolean DEFAULT false,
	"sync_status" text DEFAULT 'synced',
	"confirmed_at" timestamp with time zone,
	"employer_remarks" text,
	"calculated_wage" numeric(10, 2) DEFAULT '0.00',
	"regular_minutes" integer,
	"overtime_minutes" integer,
	"base_earnings" numeric(10, 2),
	"overtime_earnings" numeric(10, 2),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "work_sessions_idempotency_key_unique" UNIQUE("idempotency_key")
);
--> statement-breakpoint
CREATE TABLE "worker_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"occupation" text NOT NULL,
	"experience_years" integer DEFAULT 1,
	"primary_location" text NOT NULL,
	"bio" text,
	"preferred_lang" text DEFAULT 'hi',
	"upi_claim_id" text,
	"emergency_contact" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "worker_profiles_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
ALTER TABLE "anomaly_scores" ADD CONSTRAINT "anomaly_scores_session_id_work_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."work_sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "anomaly_scores" ADD CONSTRAINT "anomaly_scores_worker_id_users_id_fk" FOREIGN KEY ("worker_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "anomaly_scores" ADD CONSTRAINT "anomaly_scores_employer_id_users_id_fk" FOREIGN KEY ("employer_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "anomaly_scores" ADD CONSTRAINT "anomaly_scores_reviewed_by_user_id_users_id_fk" FOREIGN KEY ("reviewed_by_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attendance_events" ADD CONSTRAINT "attendance_events_session_id_work_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."work_sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attendance_events" ADD CONSTRAINT "attendance_events_worker_id_users_id_fk" FOREIGN KEY ("worker_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_actor_id_users_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "auth_sessions" ADD CONSTRAINT "auth_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "certificates" ADD CONSTRAINT "certificates_worker_id_users_id_fk" FOREIGN KEY ("worker_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "certificates" ADD CONSTRAINT "certificates_employer_id_users_id_fk" FOREIGN KEY ("employer_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "certificates" ADD CONSTRAINT "certificates_relationship_id_employment_relationships_id_fk" FOREIGN KEY ("relationship_id") REFERENCES "public"."employment_relationships"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "disputes" ADD CONSTRAINT "disputes_raised_by_user_id_users_id_fk" FOREIGN KEY ("raised_by_user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "disputes" ADD CONSTRAINT "disputes_worker_id_users_id_fk" FOREIGN KEY ("worker_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "disputes" ADD CONSTRAINT "disputes_employer_id_users_id_fk" FOREIGN KEY ("employer_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "disputes" ADD CONSTRAINT "disputes_session_id_work_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."work_sessions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "disputes" ADD CONSTRAINT "disputes_payment_id_payments_id_fk" FOREIGN KEY ("payment_id") REFERENCES "public"."payments"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "disputes" ADD CONSTRAINT "disputes_agreement_id_wage_agreements_id_fk" FOREIGN KEY ("agreement_id") REFERENCES "public"."wage_agreements"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "disputes" ADD CONSTRAINT "disputes_resolved_by_user_id_users_id_fk" FOREIGN KEY ("resolved_by_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "employer_profiles" ADD CONSTRAINT "employer_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "employment_relationships" ADD CONSTRAINT "employment_relationships_worker_id_users_id_fk" FOREIGN KEY ("worker_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "employment_relationships" ADD CONSTRAINT "employment_relationships_employer_id_users_id_fk" FOREIGN KEY ("employer_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_worker_id_users_id_fk" FOREIGN KEY ("worker_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_employer_id_users_id_fk" FOREIGN KEY ("employer_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_relationship_id_employment_relationships_id_fk" FOREIGN KEY ("relationship_id") REFERENCES "public"."employment_relationships"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_consents" ADD CONSTRAINT "user_consents_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "verification_records" ADD CONSTRAINT "verification_records_certificate_id_certificates_id_fk" FOREIGN KEY ("certificate_id") REFERENCES "public"."certificates"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wage_agreements" ADD CONSTRAINT "wage_agreements_relationship_id_employment_relationships_id_fk" FOREIGN KEY ("relationship_id") REFERENCES "public"."employment_relationships"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wage_agreements" ADD CONSTRAINT "wage_agreements_worker_id_users_id_fk" FOREIGN KEY ("worker_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wage_agreements" ADD CONSTRAINT "wage_agreements_employer_id_users_id_fk" FOREIGN KEY ("employer_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "work_sessions" ADD CONSTRAINT "work_sessions_worker_id_users_id_fk" FOREIGN KEY ("worker_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "work_sessions" ADD CONSTRAINT "work_sessions_employer_id_users_id_fk" FOREIGN KEY ("employer_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "work_sessions" ADD CONSTRAINT "work_sessions_relationship_id_employment_relationships_id_fk" FOREIGN KEY ("relationship_id") REFERENCES "public"."employment_relationships"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "work_sessions" ADD CONSTRAINT "work_sessions_agreement_id_wage_agreements_id_fk" FOREIGN KEY ("agreement_id") REFERENCES "public"."wage_agreements"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "worker_profiles" ADD CONSTRAINT "worker_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_audit_employer" ON "audit_logs" USING btree ("scope_employer_id","created_at");--> statement-breakpoint
CREATE INDEX "idx_audit_actor" ON "audit_logs" USING btree ("actor_id");--> statement-breakpoint
CREATE UNIQUE INDEX "uniq_live_relationship" ON "employment_relationships" USING btree ("worker_id","employer_id") WHERE "employment_relationships"."status" in ('pending','active');--> statement-breakpoint
CREATE INDEX "idx_rel_employer" ON "employment_relationships" USING btree ("employer_id");--> statement-breakpoint
CREATE INDEX "idx_payments_worker" ON "payments" USING btree ("worker_id");--> statement-breakpoint
CREATE INDEX "idx_payments_employer" ON "payments" USING btree ("employer_id");--> statement-breakpoint
CREATE UNIQUE INDEX "uniq_open_session_per_worker" ON "work_sessions" USING btree ("worker_id") WHERE "work_sessions"."status" = 'open';--> statement-breakpoint
CREATE INDEX "idx_sessions_employer_status" ON "work_sessions" USING btree ("employer_id","status");--> statement-breakpoint
CREATE INDEX "idx_sessions_worker_status" ON "work_sessions" USING btree ("worker_id","status");