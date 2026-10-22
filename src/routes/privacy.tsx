import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2, Shield, Lock, Eye, Mail, Clock } from "lucide-react";
import { Footer } from "@/components/site/Sections";
import { SectionLabel, Wordmark } from "@/components/site/primitives";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy | WebNoura by Karan" },
      {
        name: "description",
        content: "Privacy Policy explaining how WebNoura by Karan collects, uses, and protects your personal information.",
      },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  const sections = [
    {
      id: "overview",
      title: "1. Overview & Commitment",
      content: (
        <>
          <p>
            At <strong>WebNoura by Karan</strong> (&quot;WebNoura&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), we take your privacy seriously. This Privacy Policy outlines how we collect, store, protect, and use personal information gathered through our website (<a href="https://webnoura.com" className="text-accent underline">webnoura.com</a>) and during our client engagements.
          </p>
          <p className="mt-3">
            We do not sell, rent, or trade your personal information to third-party advertisers or data brokers under any circumstances.
          </p>
        </>
      ),
    },
    {
      id: "collection",
      title: "2. Information We Collect",
      content: (
        <>
          <p>We may collect information in the following situations:</p>
          <ul className="mt-3 space-y-2 list-none pl-1">
            {[
              "Contact & Enquiry Data: When you submit our project enquiry form, we collect your name, email address, business/brand name, project type, estimated budget, and project requirements.",
              "Direct Communications: When you contact us via email, WhatsApp, or Instagram, we retain those messages to respond to your inquiry and provide ongoing support.",
              "Technical & Usage Analytics: Standard non-identifying server logs, device types, browser types, and approximate geographic location to ensure site security and optimize performance.",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2.5 text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-accent shrink-0 mt-1" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </>
      ),
    },
    {
      id: "usage",
      title: "3. How We Use Your Information",
      content: (
        <>
          <p>We use the data we collect solely for legitimate business purposes:</p>
          <ul className="mt-3 space-y-2 list-disc pl-5 text-muted-foreground">
            <li>To review your website design/development project requirements and provide accurate proposals.</li>
            <li>To communicate project milestones, deliverables, and revision cycles during an active engagement.</li>
            <li>To issue invoices, process payments, and maintain business records.</li>
            <li>To continuously optimize website speed, security, and responsive layout performance.</li>
          </ul>
        </>
      ),
    },
    {
      id: "third-party",
      title: "4. Third-Party Services & Integrations",
      content: (
        <>
          <p>
            To deliver modern web experiences, we may utilize trusted third-party service providers:
          </p>
          <ul className="mt-3 space-y-2 list-disc pl-5 text-muted-foreground">
            <li>
              <strong>Supabase Database:</strong> For secure storage and processing of project enquiry submissions.
            </li>
            <li>
              <strong>Hosting &amp; CDN Providers:</strong> Such as Cloudflare, Vercel, or Netlify, which maintain technical security logs to prevent DDoS attacks and ensure high uptime.
            </li>
            <li>
              <strong>Email &amp; Communication Platforms:</strong> Such as Gmail and WhatsApp for professional correspondence.
            </li>
          </ul>
          <p className="mt-3">
            Each third-party service provider operates under its respective privacy terms and maintains industry-standard encryption protocols.
          </p>
        </>
      ),
    },
    {
      id: "security",
      title: "5. Data Security & Retention",
      content: (
        <>
          <p>
            We implement appropriate technical and organizational safeguards to protect your personal information against unauthorized access, alteration, or disclosure. All web traffic is encrypted using modern HTTPS (SSL/TLS) protocols.
          </p>
          <p className="mt-3">
            We retain personal information only for as long as necessary to fulfill the purposes for which it was gathered, comply with tax/legal obligations, or resolve disputes.
          </p>
        </>
      ),
    },
    {
      id: "cookies",
      title: "6. Cookies & Local Storage",
      content: (
        <>
          <p>
            Our website uses minimal, essential cookies and browser storage strictly required for site navigation, theme preferences, and security. We do not use intrusive third-party cross-site tracking cookies.
          </p>
          <p className="mt-3">
            You can configure your browser to block or alert you about cookies; however, certain site features may not function as intended without them.
          </p>
        </>
      ),
    },
    {
      id: "rights",
      title: "7. Your Rights & Choices",
      content: (
        <>
          <p>Depending on your jurisdiction, you may have the right to:</p>
          <ul className="mt-3 space-y-2 list-disc pl-5 text-muted-foreground">
            <li>Request a copy of the personal information we hold about you.</li>
            <li>Request correction of inaccurate or outdated information.</li>
            <li>Request deletion of your enquiry data from our active records.</li>
            <li>Opt out of any marketing or follow-up communications at any time.</li>
          </ul>
          <p className="mt-3">
            To exercise any of these rights, please contact us at <a href="mailto:webnourabykaran@gmail.com" className="text-accent underline">webnourabykaran@gmail.com</a>.
          </p>
        </>
      ),
    },
    {
      id: "contact",
      title: "8. Contact Us",
      content: (
        <>
          <p>
            If you have any questions or concerns regarding this Privacy Policy or how your data is handled, please contact Karan directly:
          </p>
          <div className="mt-4 flex items-center gap-3 rounded-xl border border-border bg-secondary/50 p-4">
            <Mail className="h-5 w-5 text-accent shrink-0" />
            <div>
              <p className="text-xs font-mono uppercase text-muted-foreground">Email Inquiries</p>
              <a href="mailto:webnourabykaran@gmail.com" className="text-sm font-semibold hover:text-accent">
                webnourabykaran@gmail.com
              </a>
            </div>
          </div>
        </>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top Bar Navigation */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:h-20 md:px-8">
          <Link to="/" aria-label="WebNoura home">
            <Wordmark />
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-4 py-2 text-xs font-semibold tracking-wide text-foreground transition-colors hover:border-accent hover:text-accent"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Home
          </Link>
        </div>
      </header>

      {/* Hero Header */}
      <section className="relative overflow-hidden border-b border-border py-16 md:py-24">
        <div className="bg-grid absolute inset-0 opacity-40" aria-hidden />
        <div className="bg-spot absolute inset-0" aria-hidden />

        <div className="relative mx-auto max-w-4xl px-5 text-center md:px-8">
          <div className="flex justify-center">
            <SectionLabel>Your Privacy Matters</SectionLabel>
          </div>
          <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            Privacy <span className="text-accent">Policy</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground">
            How we protect, manage, and respect your personal information when working with WebNoura by Karan.
          </p>
          <div className="mt-6 flex items-center justify-center gap-2 text-xs font-mono text-muted-foreground">
            <Clock className="h-3.5 w-3.5 text-accent" />
            <span>Effective Date: October 2026</span>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <main className="mx-auto max-w-4xl px-5 py-16 md:px-8 md:py-24">
        <div className="space-y-12">
          {sections.map((section) => (
            <div
              key={section.id}
              id={section.id}
              className="rounded-2xl border border-border bg-card p-6 md:p-8 transition-colors hover:border-accent/40"
            >
              <h2 className="font-display text-xl font-bold tracking-tight text-foreground md:text-2xl">
                {section.title}
              </h2>
              <div className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
                {section.content}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Security Assurance Box */}
        <div className="mt-16 rounded-2xl border border-accent/30 bg-accent/5 p-8 text-center">
          <Shield className="mx-auto h-8 w-8 text-accent" />
          <h3 className="mt-3 font-display text-lg font-bold">Committed to Transparency</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Your data is never sold or shared for unauthorized purposes. Reach out any time if you wish to inspect or delete your records.
          </p>
          <div className="mt-5">
            <a
              href="mailto:webnourabykaran@gmail.com"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-xs font-bold text-primary-foreground transition-transform hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent/20"
            >
              Email Us About Privacy
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
