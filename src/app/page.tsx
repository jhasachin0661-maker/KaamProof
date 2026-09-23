import Link from "next/link";

const steps = [
  ["Connect with employer", "Send a request. The other person must accept before anything is recorded."],
  ["Agree wages", "A versioned wage agreement. Both sides accept; old versions stay on record."],
  ["Record work", "Tap Kaam Shuru / Kaam Khatam. The server stamps the time; location is supporting evidence."],
  ["Confirm payments", "Whoever records a payment can't confirm it — the other side does."],
  ["Generate verified work certificate", "A monthly certificate with a QR code anyone can check, without seeing private data."],
];

const problems = ["Work history", "Working hours", "Agreed wages", "Payments", "Employment history"];

function Section({ id, title, children, tone = "dark" }: { id?: string; title: string; children: React.ReactNode; tone?: "dark" | "light" }) {
  return (
    <section id={id} className={tone === "light" ? "bg-stone-100 text-stone-900" : "bg-stone-950 text-stone-100"}>
      <div className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-8">{title}</h2>
        {children}
      </div>
    </section>
  );
}

export default function Landing() {
  return (
    <main>
      <header className="bg-[#14352a] text-stone-50">
        <nav className="mx-auto max-w-6xl px-5 py-4 flex items-center justify-between" aria-label="Main">
          <span className="text-lg font-black tracking-tight">Kaam<span className="text-lime-300">Proof</span></span>
          <Link href="/app" className="min-h-11 inline-flex items-center px-4 rounded-lg border border-lime-300/60 text-sm font-semibold hover:bg-lime-300 hover:text-stone-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-lime-300">Log in</Link>
        </nav>
        <div className="mx-auto max-w-6xl px-5 pt-14 pb-20 sm:pt-24 sm:pb-28">
          <h1 className="text-4xl sm:text-6xl font-black leading-[1.05] tracking-tight">Work is Real.<br /><span className="text-lime-300">Now It&apos;s Proven.</span></h1>
          <p className="mt-6 max-w-2xl text-lg text-stone-200">KaamProof helps workers maintain verifiable records of their work, wages and achievements.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/app" className="min-h-12 inline-flex items-center px-6 rounded-xl bg-lime-300 text-stone-900 font-bold hover:bg-lime-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white">Get Started</Link>
            <a href="#how" className="min-h-12 inline-flex items-center px-6 rounded-xl border border-stone-300/50 font-semibold hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white">See How It Works</a>
          </div>
        </div>
      </header>

      <Section title="The gap in informal work" tone="light">
        <p className="max-w-3xl text-lg text-stone-700 mb-6">Informal workers often have no portable record of:</p>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {problems.map((p) => (<li key={p} className="rounded-xl bg-white border border-stone-300 p-4 font-semibold">{p}</li>))}
        </ul>
        <p className="mt-6 max-w-3xl text-stone-700">History lives in memory, a notebook or the employer&apos;s phone — and disappears when the job ends.</p>
      </Section>

      <Section title="A worker-owned digital work record">
        <p className="max-w-3xl text-lg text-stone-300">KaamProof keeps an evidence trail — sessions, agreed wages, payments, disputes and audit history — that stays with the worker across employers. It is a <strong>record</strong>, confirmed by both sides. It is not a payment service, an identity check or a substitute for legal advice.</p>
      </Section>

      <Section id="how" title="How it works" tone="light">
        <ol className="grid gap-4 md:grid-cols-5">
          {steps.map(([t, d], i) => (
            <li key={t} className="rounded-2xl bg-white border border-stone-300 p-5">
              <div className="text-sm font-black text-[#14352a]">Step {i + 1}</div>
              <div className="mt-1 font-bold">{t}</div>
              <p className="mt-2 text-sm text-stone-600">{d}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section title="For workers and employers">
        <div className="grid gap-6 md:grid-cols-2">
          <article className="rounded-2xl border border-stone-700 p-6">
            <h3 className="text-xl font-bold text-lime-300">For workers</h3>
            <ul className="mt-3 space-y-2 text-stone-300 list-disc pl-5">
              <li>Large, simple buttons in Hindi and English</li>
              <li>Works with a spotty connection — events queue and sync</li>
              <li>You only ever see your own records</li>
              <li>Export your data or revoke a certificate any time</li>
            </ul>
          </article>
          <article className="rounded-2xl border border-stone-700 p-6">
            <h3 className="text-xl font-bold text-lime-300">For employers</h3>
            <ul className="mt-3 space-y-2 text-stone-300 list-disc pl-5">
              <li>Confirm or dispute sessions for your own workers</li>
              <li>Versioned wage agreements and payment records</li>
              <li>Review signals to prioritise what to check — never a verdict</li>
              <li>Audit trail scoped to your own relationships</li>
            </ul>
          </article>
        </div>
      </Section>

      <Section title="Work Passport & QR verification" tone="light">
        <div className="grid gap-6 md:grid-cols-2">
          <p className="text-stone-700">The <strong>Work Passport</strong> gathers confirmed sessions, hours, employers and certificates in one place. Disputed or pending records are shown separately and never counted as verified.</p>
          <p className="text-stone-700">Each certificate carries a QR code that opens a public check page. It reports <em>Verified</em>, <em>Revoked</em>, <em>Not found</em> or <em>Integrity check failed</em> — without exposing phone numbers, email, location or private notes.</p>
        </div>
      </Section>

      <Section title="Trust & security">
        <ul className="grid gap-3 md:grid-cols-2 text-stone-300">
          <li className="rounded-xl border border-stone-700 p-4">Sessions in HttpOnly cookies; passwords hashed with bcrypt.</li>
          <li className="rounded-xl border border-stone-700 p-4">Every action is authorised on the server; identity is never taken from the request.</li>
          <li className="rounded-xl border border-stone-700 p-4">Work time is measured by the server. GPS is supporting evidence, not proof of presence.</li>
          <li className="rounded-xl border border-stone-700 p-4">Append-only audit log; disputed records are preserved, not deleted.</li>
        </ul>
      </Section>

      <section className="bg-[#14352a] text-stone-50">
        <div className="mx-auto max-w-6xl px-5 py-16 text-center">
          <h2 className="text-3xl font-black">Your work history stays with you.</h2>
          <Link href="/app" className="mt-6 min-h-12 inline-flex items-center px-8 rounded-xl bg-lime-300 text-stone-900 font-bold hover:bg-lime-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white">Get Started</Link>
        </div>
      </section>
      <footer className="bg-stone-950 text-stone-400 text-sm text-center py-6 px-5">KaamProof is a digital work record. It is not legal, court or government proof of employment.</footer>
    </main>
  );
}
