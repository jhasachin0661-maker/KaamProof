import {
  BadgeCheck,
  BriefcaseBusiness,
  Clock3,
  FileCheck2,
  LockKeyhole,
  QrCode,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import Link from "next/link";

const steps = [
  ["Connect", "Worker and employer confirm the work relationship before records start."],
  ["Agree", "Wage terms are accepted by both sides and versioned over time."],
  ["Record", "Start and end work sessions with server timestamps and optional GPS evidence."],
  ["Confirm", "Payments, disputes and approvals stay attached to the same relationship."],
  ["Verify", "Monthly certificates can be checked publicly through a privacy-safe QR page."],
];

const proofCards: Array<{
  title: string;
  text: string;
  Icon: React.ComponentType<{ className?: string }>;
}> = [
  { title: "Work history", text: "Portable timeline across employers", Icon: BriefcaseBusiness },
  { title: "Hours worked", text: "Confirmed sessions, pending items separated", Icon: Clock3 },
  { title: "Wages", text: "Mutual agreement trail with versions", Icon: FileCheck2 },
  { title: "Certificates", text: "Public verification without private data", Icon: QrCode },
];

const trustItems = [
  "HttpOnly sessions and bcrypt password hashing",
  "Server-side authorization for every action",
  "Append-only audit trail for sensitive records",
  "QR verification hides phone, email, location and notes",
];

function Brand() {
  return (
    <Link href="/" className="flex items-center gap-3" aria-label="KaamProof home">
      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-kp-primary text-base font-black text-white shadow-sm">
        KP
      </span>
      <span className="text-lg font-black tracking-tight text-kp-ink">KaamProof</span>
    </Link>
  );
}

function Section({
  id,
  eyebrow,
  title,
  children,
  className = "",
}: {
  id?: string;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`border-t border-sky-100 ${className}`}>
      <div className="mx-auto max-w-6xl px-5 py-14 sm:py-16">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-kp-primary">{eyebrow}</p>
        <h2 className="mt-2 max-w-3xl text-2xl font-black tracking-tight text-kp-ink sm:text-3xl">{title}</h2>
        <div className="mt-8">{children}</div>
      </div>
    </section>
  );
}

export default function Landing() {
  return (
    <main className="min-h-screen bg-white text-kp-ink">
      <header className="bg-kp-bg">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4" aria-label="Main">
          <Brand />
          <Link
            href="/app"
            className="inline-flex min-h-11 items-center rounded-lg border border-kp-border bg-white px-4 text-sm font-bold text-kp-primary-strong shadow-sm hover:border-kp-primary hover:text-kp-primary"
          >
            Log in
          </Link>
        </nav>

        <div className="mx-auto grid max-w-6xl gap-10 px-5 pb-14 pt-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-end lg:pb-16 lg:pt-16">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-kp-border bg-white px-3 py-1 text-xs font-bold text-kp-primary-strong shadow-sm">
              <ShieldCheck className="h-4 w-4 text-kp-primary" />
              Work records both sides can verify
            </div>
            <h1 className="mt-5 max-w-4xl text-4xl font-black leading-[1.03] tracking-tight text-kp-ink sm:text-6xl">
              Work is real. Now it has a record.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-kp-subtle sm:text-lg">
              KaamProof helps workers and employers maintain a privacy-safe trail of work sessions,
              wage agreements, payments and verified certificates.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/app"
                className="inline-flex min-h-12 items-center gap-2 rounded-lg bg-kp-primary px-6 text-sm font-black text-white shadow-sm hover:bg-kp-primary-strong"
              >
                Get started
                <BadgeCheck className="h-4 w-4" />
              </Link>
              <a
                href="#how"
                className="inline-flex min-h-12 items-center rounded-lg border border-kp-border bg-white px-6 text-sm font-bold text-kp-primary-strong shadow-sm hover:border-kp-primary"
              >
                See how it works
              </a>
            </div>
          </div>

          <div className="rounded-lg border border-kp-border bg-white p-4 shadow-xl shadow-sky-950/10">
            <div className="flex items-center justify-between border-b border-sky-100 pb-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-kp-primary">Work passport</p>
                <p className="text-sm font-semibold text-kp-subtle">Public-safe verification summary</p>
              </div>
              <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-bold text-kp-primary-strong">Verified</span>
            </div>
            <div className="grid grid-cols-2 gap-3 py-4">
              {[
                ["28", "confirmed days"],
                ["224h", "verified hours"],
                ["₹450", "daily wage"],
                ["0", "open disputes"],
              ].map(([value, label]) => (
                <div key={label} className="rounded-lg border border-sky-100 bg-sky-50/70 p-4">
                  <div className="text-2xl font-black text-kp-primary-strong">{value}</div>
                  <div className="mt-1 text-xs font-semibold text-kp-subtle">{label}</div>
                </div>
              ))}
            </div>
            <div className="rounded-lg border border-dashed border-kp-border bg-white p-4">
              <div className="flex items-start gap-3">
                <QrCode className="mt-1 h-9 w-9 text-kp-primary" />
                <div>
                  <p className="font-bold text-kp-ink">QR certificate check</p>
                  <p className="mt-1 text-sm leading-6 text-kp-subtle">
                    Anyone can verify status without seeing phone numbers, private notes or raw GPS.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <Section eyebrow="Problem" title="Informal work records should not disappear when a job ends.">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {proofCards.map(({ title, text, Icon }) => (
            <article key={title} className="rounded-lg border border-sky-100 bg-white p-5 shadow-sm">
              <Icon className="h-5 w-5 text-kp-primary" />
              <h3 className="mt-4 font-black text-kp-ink">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-kp-subtle">{text}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section id="how" eyebrow="Workflow" title="A shared record from relationship request to certificate.">
        <ol className="grid gap-3 md:grid-cols-5">
          {steps.map(([title, text], index) => (
            <li key={title} className="rounded-lg border border-sky-100 bg-sky-50/70 p-4">
              <div className="text-xs font-black uppercase tracking-[0.16em] text-kp-primary">Step {index + 1}</div>
              <div className="mt-3 font-black text-kp-ink">{title}</div>
              <p className="mt-2 text-sm leading-6 text-kp-subtle">{text}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section eyebrow="Roles" title="Built for workers and employers without changing ownership of the record.">
        <div className="grid gap-5 md:grid-cols-2">
          <article className="rounded-lg border border-sky-100 bg-white p-6 shadow-sm">
            <UsersRound className="h-6 w-6 text-kp-primary" />
            <h3 className="mt-4 text-xl font-black">For workers</h3>
            <p className="mt-3 leading-7 text-kp-subtle">
              Track sessions, agreements, payments, disputes and certificates in one portable work passport.
            </p>
          </article>
          <article className="rounded-lg border border-sky-100 bg-white p-6 shadow-sm">
            <BriefcaseBusiness className="h-6 w-6 text-kp-primary" />
            <h3 className="mt-4 text-xl font-black">For employers</h3>
            <p className="mt-3 leading-7 text-kp-subtle">
              Confirm relationships, review signals, settle payments and resolve disputes through scoped access.
            </p>
          </article>
        </div>
      </Section>

      <Section eyebrow="Trust" title="The product is explicit about what it proves and what it does not.">
        <div className="grid gap-3 md:grid-cols-2">
          {trustItems.map((item) => (
            <div key={item} className="flex items-start gap-3 rounded-lg border border-sky-100 bg-sky-50/70 p-4">
              <LockKeyhole className="mt-0.5 h-5 w-5 shrink-0 text-kp-primary" />
              <p className="text-sm font-semibold leading-6 text-kp-primary-strong">{item}</p>
            </div>
          ))}
        </div>
      </Section>

      <section className="bg-kp-primary-strong text-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 px-5 py-12 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-black tracking-tight">Your work history stays with you.</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-sky-100">
              KaamProof is a digital work record, not a court, government employment proof or payment service.
            </p>
          </div>
          <Link
            href="/app"
            className="inline-flex min-h-12 items-center justify-center rounded-lg bg-white px-6 text-sm font-black text-kp-primary-strong hover:bg-sky-50"
          >
            Open KaamProof
          </Link>
        </div>
      </section>
    </main>
  );
}
