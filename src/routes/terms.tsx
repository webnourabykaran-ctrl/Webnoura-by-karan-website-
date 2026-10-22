import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2, Shield, Scale, Mail, Clock } from "lucide-react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Sections";
import { SectionLabel, Wordmark } from "@/components/site/primitives";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions | WebNoura by Karan" },
      {
        name: "description",
        content: "Terms and Conditions for web design, development, and digital services provided by WebNoura by Karan.",
      },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  const sections = [
    {
      id: "acceptance",
      title: "1. Acceptance of Terms",
      content: (
        <>
          <p>
            Welcome to <strong>WebNoura by Karan</strong> (&quot;WebNoura&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;). By accessing or using our website (<a href="https://webnoura.com" className="text-accent underline">webnoura.com</a>), engaging our website design and development services, or submitting an enquiry, you agree to be bound by these Terms and Conditions.
          </p>
          <p className="mt-3">
            If you do not agree with any part of these terms, please do not use our website or services. These terms apply to all visitors, clients, and partners who access our services.
          </p>
        </>
      ),
    },
    {
      id: "services",
      title: "2. Services & Scope of Work",
      content: (
        <>
          <p>
            WebNoura provides digital design and development services, including but not limited to:
          </p>
          <ul className="mt-3 space-y-2 list-none pl-1">
            {[
              "Custom website design & responsive user interfaces (UI/UX)",
              "Full-stack website development & deployment",
              "Landing page creation & business portfolio websites",
              "Website maintenance, performance optimization & technical consultations",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2.5 text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-accent shrink-0 mt-1" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3">
            Specific deliverables, project milestones, timelines, and pricing will be explicitly detailed in an individual project proposal or written agreement prior to project commencement.
          </p>
        </>
      ),
    },
    {
      id: "payments",
      title: "3. Quotes, Deposits & Payments",
      content: (
        <>
          <p>
            Unless agreed otherwise in writing:
          </p>
          <ul className="mt-3 space-y-2 list-disc pl-5 text-muted-foreground">
            <li>
              <strong>Upfront Deposit:</strong> A non-refundable advance deposit (typically 30% to 50%) is required before work begins on custom projects.
            </li>
            <li>
              <strong>Milestone &amp; Final Payments:</strong> Remaining balances are due upon completion of designated project phases or before final transfer/live domain deployment of the website files and credentials.
            </li>
            <li>
              <strong>Invoicing:</strong> Payment terms are 7 calendar days from invoice issue date. Work on upcoming phases may be paused until outstanding balances are cleared.
            </li>
          </ul>
        </>
      ),
    },
    {
      id: "responsibilities",
      title: "4. Client Responsibilities & Content",
      content: (
        <>
          <p>
            Timely delivery of high-quality websites depends on collaborative communication. As a client, you agree to:
          </p>
          <ul className="mt-3 space-y-2 list-disc pl-5 text-muted-foreground">
            <li>Provide necessary text, high-resolution imagery, brand logos, and required account access promptly.</li>
            <li>Ensure you possess full legal rights, licenses, or permissions for all materials supplied to us.</li>
            <li>Provide constructive and consolidated feedback within agreed review windows (usually 3–5 business days).</li>
          </ul>
        </>
      ),
    },
    {
      id: "revisions",
      title: "5. Revisions & Scope Adjustments",
      content: (
        <>
          <p>
            Each project proposal includes a defined number of revision rounds (typically 2 to 3 review cycles during the design phase).
          </p>
          <p className="mt-3">
            Requests for substantial structural redesigns after sign-off, or additional features beyond the agreed initial scope, will be quoted and billed as a scope change or at standard hourly rates.
          </p>
        </>
      ),
    },
    {
      id: "ip",
      title: "6. Intellectual Property & Ownership",
      content: (
        <>
          <p>
            <strong>Client Ownership:</strong> Upon receipt of full and final payment, complete ownership rights for the bespoke custom website design and front-facing deliverables are transferred to the client.
          </p>
          <p className="mt-3">
            <strong>Designer Portfolio Rights:</strong> WebNoura by Karan reserves the right to showcase the completed work, screenshots, and visual concepts in our portfolio, case studies, and promotional channels as an example of our expertise.
          </p>
        </>
      ),
    },
    {
      id: "liability",
      title: "7. Warranties & Limitation of Liability",
      content: (
        <>
          <p>
            We strive to craft robust, high-performance, and error-free digital products. We provide a 30-day post-launch warranty to fix bugs or technical glitches directly related to our delivered code.
          </p>
          <p className="mt-3">
            To the maximum extent permitted by law, WebNoura by Karan shall not be liable for indirect, incidental, or consequential damages resulting from third-party hosting downtimes, domain registrar issues, or subsequent code alterations made by external parties.
          </p>
        </>
      ),
    },
    {
      id: "contact",
      title: "8. Governing Law & Contact",
      content: (
        <>
          <p>
            These terms shall be governed by and construed in accordance with the applicable laws. For any questions, clarifications, or contract inquiries regarding these Terms and Conditions, please reach out directly:
          </p>
          <div className="mt-4 flex items-center gap-3 rounded-xl border border-border bg-secondary/50 p-4">
            <Mail className="h-5 w-5 text-accent shrink-0" />
            <div>
              <p className="text-xs font-mono uppercase text-muted-foreground">Direct Email</p>
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
            <SectionLabel>Legal Information</SectionLabel>
          </div>
          <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            Terms &amp; <span className="text-accent">Conditions</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground">
            Clear, transparent guidelines for our website design, development, and digital collaboration.
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

        {/* Bottom Contact Help Box */}
        <div className="mt-16 rounded-2xl border border-accent/30 bg-accent/5 p-8 text-center">
          <Scale className="mx-auto h-8 w-8 text-accent" />
          <h3 className="mt-3 font-display text-lg font-bold">Have Questions About These Terms?</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            We value transparency and mutual trust. If you have any inquiries regarding our contracts or services, feel free to contact us.
          </p>
          <div className="mt-5">
            <a
              href="mailto:webnourabykaran@gmail.com"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-xs font-bold text-primary-foreground transition-transform hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent/20"
            >
              Contact Karan via Email
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
