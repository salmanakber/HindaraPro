import { ArrowLeft, Mail } from 'lucide-react';
import { FOUNDER_PROFILE } from '../data/portfolio';

interface LegalPageProps {
  onNavigate: (path: string) => void;
}

export function PrivacyPolicyPage({ onNavigate }: LegalPageProps) {
  return (
    <article className="bg-[#fcfbff] py-14 sm:py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('/');
          }}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#5b21b6] hover:underline"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to Hindara Labs
        </a>

        <header className="mt-6 border-b border-[#e8e2f6] pb-8">
          <p className="text-xs font-semibold tracking-wider text-[#5b21b6] uppercase sm:text-sm">
            Legal &amp; Compliance · Hindara Labs
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-[#15102b] sm:text-4xl">
            Privacy <span className="font-editorial text-[#6d28d9]">Policy</span>
          </h1>
          <p className="mt-3 text-sm text-[#5e567a]">
            Effective Date: November 18, 2026 · Controller: {FOUNDER_PROFILE.studioName} (
            {FOUNDER_PROFILE.primaryName})
          </p>
        </header>

        <div className="mt-8 space-y-8 text-base leading-relaxed text-[#3b3454]">
          <section className="rounded-3xl border border-[#e3dcf5] bg-[#f6f3ff] p-6 sm:p-8">
            <h2 className="font-display text-xl font-bold text-[#15102b]">
              1. Scope &amp; Data Controller
            </h2>
            <p className="mt-3">
              This Privacy Policy describes how <strong>Hindara Labs</strong>, founded and
              operated by <strong>{FOUNDER_PROFILE.primaryName}</strong>, collects, uses,
              and safeguards information submitted through <strong>hindaralabs.com</strong>.
              Each standalone SaaS product owned by Hindara Labs (TidyFlow, TidyAgent,
              TidySync, StockSentry, AfterSale OS, and SlotWise) also maintains its own
              product-specific privacy notice governing workspace and merchant data.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-[#15102b]">
              2. Information You Provide
            </h2>
            <p>
              When you submit a project brief or hire inquiry via our website or send an
              email to{' '}
              <a
                href={`mailto:${FOUNDER_PROFILE.email}`}
                className="font-semibold text-[#5b21b6] hover:underline"
              >
                {FOUNDER_PROFILE.email}
              </a>
              , we collect the contact and project details you voluntarily provide:
            </p>
            <ul className="list-disc space-y-1.5 pl-6 text-sm sm:text-base">
              <li>Your name and work or personal email address.</li>
              <li>Company, brand, or venture name (if provided).</li>
              <li>Selected engagement track, target timeline, budget range, and scope notes.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-[#15102b]">
              3. How We Use Inquiry Information
            </h2>
            <p>
              Information submitted through our Hire Me workflow is used strictly to
              review your software requirements, prepare technical architecture proposals,
              and communicate with you regarding prospective engagements. Hindara Labs does
              not sell, rent, or trade your personal information to third parties or data
              brokers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-[#15102b]">
              4. Cookies, Analytics &amp; Third-Party Links
            </h2>
            <p>
              This studio website operates without invasive cross-site advertising trackers.
              Clicking outbound links to Hindara Labs SaaS products, the Shopify App Store,
              or LinkedIn directs you to external services governed by their respective
              privacy policies.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-[#15102b]">
              5. Data Retention &amp; Your Rights
            </h2>
            <p>
              We retain project inquiry records only for as long as needed to respond to
              your request or maintain active business records. You may request access,
              correction, or deletion of your inquiry data at any time by contacting{' '}
              <a
                href={`mailto:${FOUNDER_PROFILE.email}`}
                className="font-semibold text-[#5b21b6] hover:underline"
              >
                {FOUNDER_PROFILE.email}
              </a>
              .
            </p>
          </section>

          <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-[#e3dcf5] bg-[#15102b] p-6 text-white sm:p-8">
            <div>
              <h2 className="font-display text-lg font-bold">Privacy Questions?</h2>
              <p className="mt-1 text-sm text-violet-200/80">
                Contact {FOUNDER_PROFILE.primaryName} directly regarding privacy or data requests.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={`mailto:${FOUNDER_PROFILE.email}`}
                className="inline-flex min-h-[42px] items-center gap-2 rounded-xl bg-[#7c3aed] px-5 py-2 text-sm font-semibold text-white hover:bg-[#6d28d9]"
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
                {FOUNDER_PROFILE.email}
              </a>
              <a
                href="/terms"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('/terms');
                }}
                className="inline-flex min-h-[42px] items-center rounded-xl border border-violet-400/40 px-4 py-2 text-sm font-semibold text-violet-100 hover:bg-white/10"
              >
                Read Terms of Service →
              </a>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export function TermsOfServicePage({ onNavigate }: LegalPageProps) {
  return (
    <article className="bg-[#fcfbff] py-14 sm:py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('/');
          }}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#5b21b6] hover:underline"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to Hindara Labs
        </a>

        <header className="mt-6 border-b border-[#e8e2f6] pb-8">
          <p className="text-xs font-semibold tracking-wider text-[#5b21b6] uppercase sm:text-sm">
            Legal &amp; Governance · Hindara Labs
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-[#15102b] sm:text-4xl">
            Terms of <span className="font-editorial text-[#6d28d9]">Service</span>
          </h1>
          <p className="mt-3 text-sm text-[#5e567a]">
            Effective Date: November 18, 2026 · Operated by {FOUNDER_PROFILE.studioName} (
            {FOUNDER_PROFILE.primaryName})
          </p>
        </header>

        <div className="mt-8 space-y-8 text-base leading-relaxed text-[#3b3454]">
          <section className="rounded-3xl border border-[#e3dcf5] bg-[#f6f3ff] p-6 sm:p-8">
            <h2 className="font-display text-xl font-bold text-[#15102b]">
              1. Acceptance of Terms
            </h2>
            <p className="mt-3">
              By accessing <strong>hindaralabs.com</strong>, you agree to these Terms of
              Service governing the Hindara Labs studio showcase website, founded and
              operated by <strong>{FOUNDER_PROFILE.primaryName}</strong>.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-[#15102b]">
              2. Intellectual Property &amp; Software Ownership
            </h2>
            <p>
              All trademarks, brand marks, visual renders, 3D assets, copy, and software
              references displayed on this site—including <strong>Hindara Labs</strong>,{' '}
              <strong>TidyFlow</strong>, <strong>TidyAgent</strong>,{' '}
              <strong>TidySync</strong>, <strong>StockSentry</strong>,{' '}
              <strong>AfterSale OS</strong>, and <strong>SlotWise</strong>—are owned by
              Hindara Labs and {FOUNDER_PROFILE.primaryName}. You may not copy, scrape, or
              redistribute site assets or brand marks for commercial misrepresentation.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-[#15102b]">
              3. Client Engagements &amp; Project Briefs
            </h2>
            <p>
              Submitting a project brief through the Hire Me form initiates a non-binding
              project inquiry. All custom SaaS builds, React Native mobile apps, Shopify
              integrations, and Fractional CTO retainers are governed exclusively by a
              separate written Statement of Work (SOW) or Master Services Agreement signed
              by both parties prior to kickoff.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-[#15102b]">
              4. External Product Platforms
            </h2>
            <p>
              Individual Hindara Labs SaaS products operate on their own product domains
              and include dedicated subscription terms, acceptable use policies, and
              service-level documentation specific to those applications.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-[#15102b]">
              5. Disclaimer &amp; Limitation of Liability
            </h2>
            <p>
              This studio website is provided on an "as is" and "as available" basis for
              informational and inquiry purposes. To the fullest extent permitted by law,
              Hindara Labs and {FOUNDER_PROFILE.primaryName} disclaim liability for any
              indirect or incidental damages arising from use of this informational site.
            </p>
          </section>

          <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-[#e3dcf5] bg-[#15102b] p-6 text-white sm:p-8">
            <div>
              <h2 className="font-display text-lg font-bold">Need Clarification?</h2>
              <p className="mt-1 text-sm text-violet-200/80">
                Reach out directly regarding commercial terms or custom build agreements.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={`mailto:${FOUNDER_PROFILE.email}`}
                className="inline-flex min-h-[42px] items-center gap-2 rounded-xl bg-[#7c3aed] px-5 py-2 text-sm font-semibold text-white hover:bg-[#6d28d9]"
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
                {FOUNDER_PROFILE.email}
              </a>
              <a
                href="/privacy"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('/privacy');
                }}
                className="inline-flex min-h-[42px] items-center rounded-xl border border-violet-400/40 px-4 py-2 text-sm font-semibold text-violet-100 hover:bg-white/10"
              >
                Read Privacy Policy →
              </a>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
