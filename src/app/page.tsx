import { ArrowRight, BadgeCheck, BriefcaseBusiness, Check, Clock3, FileCheck2, LockKeyhole, QrCode, ShieldCheck, UsersRound } from "lucide-react";
import Link from "next/link";

const steps = [
  ["01", "Start work", "Open a shared record before the day begins."],
  ["02", "Record work", "Keep sessions, hours and evidence together."],
  ["03", "Confirm payment", "Both sides see the same wage trail."],
  ["04", "Build history", "Carry your verified work passport forward."],
];

const proofCards = [
  { title: "Work history", text: "A portable timeline that does not disappear when a job ends.", Icon: BriefcaseBusiness },
  { title: "Hours & wages", text: "Server-timestamped sessions with pending items kept visible.", Icon: Clock3 },
  { title: "Certificates", text: "A privacy-safe record people can verify without seeing private data.", Icon: QrCode },
];

function Brand() {
  return <Link href="/" className="kp-brand" aria-label="KaamProof home"><span className="kp-brand-mark">KP</span><span>KaamProof</span></Link>;
}

export default function Landing() {
  return (
    <main className="kp-landing">
      <header className="kp-landing-header">
        <nav className="kp-nav" aria-label="Main navigation"><Brand /><div className="kp-nav-links"><a href="#how">How it works</a><a href="#trust">Why KaamProof</a><Link className="kp-nav-login" href="/app">Log in <ArrowRight size={15} /></Link></div></nav>

        <div className="kp-hero">
          <div className="kp-hero-copy">
            <p className="kp-kicker"><ShieldCheck size={16} /> Worker-owned proof of work</p>
            <h1>Work is real.<br /><em>Now it&apos;s proven.</em></h1>
            <p className="kp-hero-lede">A calm, shared record of work, wages, payments and verified history — built for the people whose work is often left undocumented.</p>
            <div className="kp-hero-actions"><Link href="/app" className="kp-button kp-button-primary">Get started <ArrowRight size={18} /></Link><a href="#how" className="kp-button kp-button-secondary">See how it works</a></div>
            <div className="kp-evidence-line"><span><Check size={14} /> Mutual confirmation</span><span><Check size={14} /> Audit history</span><span><Check size={14} /> QR verification</span></div>
          </div>
          <div className="kp-hero-visual">
            <div className="kp-photo kp-photo-hero"><img src="/images/hero-walk-home.png" alt="Worker arriving home after a day of work" /></div>
            <div className="kp-passport-float"><div className="kp-float-top"><span>WORK PASSPORT</span><BadgeCheck size={18} /></div><strong>Verified work history</strong><div className="kp-mini-stats"><span><b>28</b> sessions</span><span><b>224h</b> recorded</span></div><div className="kp-progress"><i /><i /><i /><i /><i /></div></div>
            <span className="kp-hero-note">A record that travels with you</span>
          </div>
        </div>
      </header>

      <section className="kp-section kp-problem"><div className="kp-section-heading"><p className="kp-kicker">The problem</p><h2>Your work should not disappear when the job ends.</h2></div><div className="kp-proof-grid">{proofCards.map(({ title, text, Icon }) => <article className="kp-proof-card" key={title}><Icon size={22} /><h3>{title}</h3><p>{text}</p></article>)}</div></section>

      <section className="kp-story-section"><div className="kp-story-image kp-photo"><img src="/images/shared-pages.png" alt="Two people reviewing shared work records at a table" loading="lazy" /></div><div className="kp-story-copy"><p className="kp-kicker">Trust, made visible</p><h2>One shared record.<br />Fewer difficult conversations.</h2><p>KaamProof gives workers and employers the same source of truth: what was agreed, what happened, what was paid and what still needs attention.</p><div className="kp-check-list"><span><Check size={16} /> Clear before the work starts</span><span><Check size={16} /> Neutral when there is a dispute</span><span><Check size={16} /> Private by default</span></div><Link href="/app" className="kp-text-link">Open your work record <ArrowRight size={16} /></Link></div></section>

      <section id="how" className="kp-section kp-how"><div className="kp-section-heading"><p className="kp-kicker">How it works</p><h2>From today&apos;s work<br />to tomorrow&apos;s proof.</h2></div><ol className="kp-step-grid">{steps.map(([number, title, text]) => <li key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p></li>)}</ol></section>

      <section className="kp-passport-showcase"><div className="kp-passport-image kp-photo"><img src="/images/work-passport.png" alt="Work Passport document showing verified work records" loading="lazy" /></div><div><p className="kp-kicker">The signature record</p><h2>Your work passport belongs to you.</h2><p>Sessions, employers, payments and certificates come together in a history you can carry, understand and share intentionally.</p><div className="kp-passport-pills"><span>Verified sessions</span><span>Employer history</span><span>Payment record</span></div><Link href="/app" className="kp-button kp-button-light">Create your passport <ArrowRight size={18} /></Link></div></section>

      <section id="trust" className="kp-section kp-trust"><div className="kp-section-heading"><p className="kp-kicker">Built for trust</p><h2>Useful proof, without pretending to be something it is not.</h2></div><div className="kp-trust-grid"><div className="kp-trust-list"><p><LockKeyhole size={20} /> Server timestamps for important actions</p><p><UsersRound size={20} /> Mutual confirmation keeps both sides involved</p><p><FileCheck2 size={20} /> Append-only audit trail for sensitive records</p><p><QrCode size={20} /> Public verification hides private details</p></div><div className="kp-certificate-card"><img src="/images/certificate-desk.png" alt="Work certificate on a desk" loading="lazy" /><div><b>Certificate #KP-2026-XXXX</b><span><BadgeCheck size={15} /> Verified work history</span></div></div></div></section>

      <section className="kp-final-cta"><p className="kp-kicker">Keep what you build</p><h2>Make your work<br /><em>impossible to lose.</em></h2><Link href="/app" className="kp-button kp-button-light">Open KaamProof <ArrowRight size={18} /></Link><small>KaamProof is a digital work record — not a court, government employment proof or payment service.</small></section>
      <footer className="kp-footer"><Brand /><span>Work is real. Now it has a record.</span></footer>
    </main>
  );
}
