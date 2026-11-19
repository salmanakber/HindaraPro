import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Mail, Star } from 'lucide-react';
import {
  AGENCY_COMPARISON,
  CLIENT_PROJECTS,
  CLIENT_REVIEWS,
  ENGAGEMENT_TRACKS,
  ENGINEERING_PRINCIPLES,
  FAQ_ITEMS,
  FOUNDER_PROFILE,
  SAAS_VENTURES,
  SERVICE_CAPABILITIES,
  STUDIO_RATING_SUMMARY,
  type ClientCaseStudy,
  type SaaSVenture,
} from '../data/portfolio';

interface StudioPageProps {
  onNavigate: (path: string, hash?: string) => void;
  onSelectVenture?: (venture: SaaSVenture) => void;
  onInspectProject?: (project: ClientCaseStudy) => void;
}

export function ProjectsArchivePage({
  onNavigate,
  onSelectVenture,
  onInspectProject,
}: StudioPageProps) {
  return (
    <div className="bg-[#faf9f6] py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('/');
          }}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#5b21b6] hover:underline"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to Hindara Labs Home
        </a>

        <div className="mt-6 max-w-3xl border-b border-[#e6e2da] pb-8">
          <p className="font-mono text-xs font-medium tracking-widest text-[#524e4a] uppercase">
            Hindara Labs · Case Studies &amp; Owned SaaS Archive
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-[#111015] sm:text-4xl">
            Client Architectures &amp; Six Owned SaaS Products
          </h1>
          <p className="mt-3 text-base leading-relaxed text-[#524e4a]">
            A detailed technical catalog of bespoke client builds and live SaaS businesses founded
            and operated by {FOUNDER_PROFILE.primaryName} under {FOUNDER_PROFILE.studioName}.
          </p>
        </div>

        {/* Full Client Portfolio Builds */}
        <section aria-labelledby="client-archive-heading" className="mt-12">
          <h2
            id="client-archive-heading"
            className="font-display text-2xl font-bold tracking-tight text-[#111015]"
          >
            Featured Client Case Studies
          </h2>
          <div className="mt-6 space-y-10">
            {CLIENT_PROJECTS.map((project) => (
              <article
                key={project.id}
                id={project.slug}
                className="scroll-mt-24 grid grid-cols-1 gap-8 rounded-2xl border border-[#e0dbd0] bg-white p-6 lg:grid-cols-12 lg:p-8"
              >
                <div className="lg:col-span-5">
                  <div className="overflow-hidden rounded-xl border border-[#e6e2da] bg-[#141418]">
                    <img
                      src={project.imagePath}
                      alt={project.imageAlt}
                      referrerPolicy="no-referrer"
                      className="aspect-[4/3] w-full object-cover"
                    />
                  </div>
                  <div className="mt-4 rounded-xl border border-[#e6e2da] bg-[#faf9f6] p-4">
                    <p className="font-mono text-xs font-semibold text-[#5b21b6]">
                      Measured Impact · {project.outcomeMetric}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-[#3f3b37]">
                      {project.outcomeDetail}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col justify-between lg:col-span-7">
                  <div>
                    <p className="font-mono text-xs text-[#524e4a]">
                      <span className="font-semibold text-[#5b21b6]">{project.index}</span>
                      <span className="mx-2 text-[#cbc4b8]">·</span>
                      <span>{project.industry}</span>
                      <span className="mx-2 text-[#cbc4b8]">·</span>
                      <span>Delivered in {project.timeline}</span>
                    </p>
                    <h3 className="mt-2 font-display text-2xl font-bold text-[#111015]">
                      {project.clientName} — {project.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-[#3f3b37]">
                      {project.summary}
                    </p>

                    <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <div>
                        <h4 className="font-display text-xs font-bold uppercase tracking-wider text-[#111015]">
                          Business Challenge
                        </h4>
                        <p className="mt-1.5 text-sm leading-relaxed text-[#524e4a]">
                          {project.challenge}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-display text-xs font-bold uppercase tracking-wider text-[#111015]">
                          System Architecture
                        </h4>
                        <p className="mt-1.5 text-sm leading-relaxed text-[#524e4a]">
                          {project.architectureSolution}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 border-t border-[#efece5] pt-4">
                      <p className="font-mono text-xs text-[#524e4a]">
                        Stack: <span className="text-[#111015]">{project.stack.join(' · ')}</span>
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    {onInspectProject && (
                      <button
                        type="button"
                        onClick={() => onInspectProject(project)}
                        className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg bg-[#111015] px-4 py-2 text-xs font-semibold text-white hover:bg-[#5b21b6]"
                      >
                        Open Architecture Brief
                        <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                    )}
                    <a
                      href="/#hire-me"
                      onClick={(e) => {
                        e.preventDefault();
                        onNavigate('/', '#hire-me');
                      }}
                      className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-[#d6d0c4] bg-white px-4 py-2 text-xs font-semibold text-[#111015] hover:border-[#111015]"
                    >
                      Scope a Similar Build
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Owned SaaS Portfolio Deep Links */}
        <section aria-labelledby="owned-archive-heading" className="mt-16 border-t border-[#e6e2da] pt-12">
          <h2
            id="owned-archive-heading"
            className="font-display text-2xl font-bold tracking-tight text-[#111015]"
          >
            Live SaaS Software Owned by Hindara Labs
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {SAAS_VENTURES.map((venture) => (
              <article
                key={venture.id}
                className="flex flex-col justify-between rounded-2xl border border-[#e0dbd0] bg-white p-5"
              >
                <div>
                  <img
                    src={venture.imagePath}
                    alt={venture.imageAlt}
                    referrerPolicy="no-referrer"
                    className="aspect-[4/3] w-full rounded-xl border border-[#e6e2da] object-cover"
                  />
                  <p className="mt-4 font-mono text-[11px] text-[#5b21b6]">
                    {venture.categoryLabel} · {venture.platforms}
                  </p>
                  <h3 className="mt-1 font-display text-lg font-bold text-[#111015]">
                    {venture.name}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-[#524e4a]">
                    {venture.tagline}
                  </p>
                </div>
                <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-[#efece5] pt-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <a
                      href={venture.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#111015] hover:text-[#5b21b6] hover:underline"
                    >
                      Visit Live App
                      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                    {venture.secondaryUrl && (
                      <a
                        href={venture.secondaryUrl.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#524e4a] hover:text-[#5b21b6] hover:underline"
                      >
                        {venture.secondaryUrl.label}
                        <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </a>
                    )}
                  </div>
                  {onSelectVenture && (
                    <button
                      type="button"
                      onClick={() => onSelectVenture(venture)}
                      className="text-xs font-semibold text-[#5b21b6] hover:underline"
                    >
                      Inspect Specs →
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export function AboutStudioPage({ onNavigate }: StudioPageProps) {
  return (
    <div className="bg-[#faf9f6] py-12 sm:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('/');
          }}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#5b21b6] hover:underline"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to Hindara Labs Home
        </a>

        <div className="mt-6 grid grid-cols-1 gap-10 border-b border-[#e6e2da] pb-12 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <p className="font-mono text-xs font-medium tracking-widest text-[#524e4a] uppercase">
              About Founder &amp; Studio
            </p>
            <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-[#111015] sm:text-4xl">
              {FOUNDER_PROFILE.primaryName} — Founder &amp; Principal SaaS Architect at Hindara Labs
            </h1>
            <p className="mt-4 text-base leading-relaxed text-[#3f3b37]">
              {FOUNDER_PROFILE.bioLead}
            </p>
            <p className="mt-3 text-base leading-relaxed text-[#524e4a]">
              {FOUNDER_PROFILE.bioExtended}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="/#hire-me"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('/', '#hire-me');
                }}
                className="inline-flex min-h-[42px] items-center gap-2 rounded-xl bg-[#5b21b6] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#4c1d95]"
              >
                Hire {FOUNDER_PROFILE.primaryName}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
              <a
                href={`mailto:${FOUNDER_PROFILE.email}`}
                className="inline-flex min-h-[42px] items-center gap-2 rounded-xl border border-[#d6d0c4] bg-white px-4 py-2.5 text-sm font-semibold text-[#111015] hover:border-[#111015]"
              >
                <Mail className="h-4 w-4 text-[#5b21b6]" aria-hidden="true" />
                {FOUNDER_PROFILE.email}
              </a>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="overflow-hidden rounded-2xl border border-[#e0dbd0] bg-white">
              <img
                src={FOUNDER_PROFILE.portraitPath}
                alt={`Portrait of ${FOUNDER_PROFILE.primaryName}, Founder of Hindara Labs`}
                referrerPolicy="no-referrer"
                className="aspect-[4/4.2] w-full bg-[#f4f1ea] object-contain object-bottom px-4 pt-4"
              />
              <div className="border-t border-[#e6e2da] px-5 py-4">
                <p className="font-display text-sm font-bold text-[#111015]">
                  {FOUNDER_PROFILE.primaryName}
                </p>
                <p className="text-xs text-[#524e4a]">
                  {FOUNDER_PROFILE.role} · {FOUNDER_PROFILE.studioName}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Studio Workspace Photo */}
        <div className="mt-12 overflow-hidden rounded-2xl border border-[#e0dbd0] bg-white">
          <img
            src={FOUNDER_PROFILE.studioDeskImagePath}
            alt={FOUNDER_PROFILE.studioDeskImageAlt}
            referrerPolicy="no-referrer"
            className="aspect-[16/9] w-full object-cover"
          />
          <div className="border-t border-[#e6e2da] px-6 py-4">
            <p className="font-display text-sm font-bold text-[#111015]">
              Independent Multi-Product Engineering Standards
            </p>
            <p className="mt-1 text-sm text-[#524e4a]">
              Every product built at Hindara Labs—from TidyFlow GPS crew apps to TidyAgent&apos;s
              Webflow, Wix, and Shopify storefront embeds—is architected for zero-bloat speed,
              clean relational data integrity, and long-term maintainability.
            </p>
          </div>
        </div>

        {/* Principles */}
        <section className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          {ENGINEERING_PRINCIPLES.map((item) => (
            <div
              key={item.number}
              className="rounded-2xl border border-[#e0dbd0] bg-white p-6"
            >
              <p className="font-mono text-xs font-semibold text-[#5b21b6]">{item.number}</p>
              <h2 className="mt-2 font-display text-lg font-bold text-[#111015]">
                {item.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-[#524e4a]">{item.detail}</p>
            </div>
          ))}
        </section>

        {/* Studio Comparison */}
        <section className="mt-12 rounded-2xl border border-[#e0dbd0] bg-white p-6 sm:p-8">
          <h2 className="font-display text-xl font-bold text-[#111015]">
            Why Businesses Partner Directly With Hindara Labs
          </h2>
          <div className="mt-5 divide-y divide-[#efece5]">
            {AGENCY_COMPARISON.map((row) => (
              <div key={row.dimension} className="grid grid-cols-1 gap-3 py-4 md:grid-cols-12">
                <p className="font-mono text-xs font-semibold text-[#524e4a] md:col-span-3">
                  {row.dimension}
                </p>
                <p className="text-sm font-semibold text-[#111015] md:col-span-5">
                  {row.hindaraWay}
                </p>
                <p className="text-sm text-[#6d6861] md:col-span-4">{row.typicalAgency}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export function ServicesHirePage({ onNavigate }: StudioPageProps) {
  return (
    <div className="bg-[#faf9f6] py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('/');
          }}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#5b21b6] hover:underline"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to Hindara Labs Home
        </a>

        <div className="mt-6 flex flex-col gap-6 border-b border-[#e6e2da] pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="font-mono text-xs font-medium tracking-widest text-[#524e4a] uppercase">
              Engineering Services &amp; Hiring Models
            </p>
            <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-[#111015] sm:text-4xl">
              Hire {FOUNDER_PROFILE.primaryName} for SaaS Builds, Shopify &amp; Webflow/Wix AI
            </h1>
            <p className="mt-3 text-base leading-relaxed text-[#524e4a]">
              Work directly with the architect of six live SaaS businesses—across multi-tenant web
              apps, React Native iOS/Android, Shopify App Store products, and Webflow/Wix AI bots.
            </p>
          </div>
          <div className="shrink-0 rounded-xl border border-[#e0dbd0] bg-white px-4 py-3">
            <div className="flex items-center gap-1.5">
              {[0, 1, 2, 3, 4].map((idx) => (
                <Star
                  key={idx}
                  className="h-4 w-4 fill-amber-500 text-amber-500"
                  aria-hidden="true"
                />
              ))}
              <span className="ml-1 font-display text-base font-bold text-[#111015]">
                {STUDIO_RATING_SUMMARY.ratingValue} / 5.0
              </span>
            </div>
            <p className="mt-0.5 font-mono text-[11px] text-[#524e4a]">
              {STUDIO_RATING_SUMMARY.reviewCount} verified client &amp; merchant reviews
            </p>
          </div>
        </div>

        {/* Engagement Tracks */}
        <section className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {ENGAGEMENT_TRACKS.map((track) => (
            <div
              key={track.id}
              className="flex flex-col justify-between rounded-2xl border border-[#e0dbd0] bg-white p-6"
            >
              <div>
                <p className="font-mono text-xs text-[#5b21b6]">
                  {track.index} · {track.cadence}
                </p>
                <h2 className="mt-2 font-display text-xl font-bold text-[#111015]">
                  {track.title}
                </h2>
                <p className="mt-1 font-mono text-xs font-semibold text-[#524e4a]">
                  {track.startingAt} · For {track.idealFor}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-[#524e4a]">
                  {track.description}
                </p>
                <ul className="mt-5 space-y-2 border-t border-[#efece5] pt-4 text-sm text-[#2d2a27]">
                  {track.deliverables.map((d) => (
                    <li key={d} className="flex items-start gap-2">
                      <Check
                        className="mt-0.5 h-4 w-4 shrink-0 text-[#5b21b6]"
                        aria-hidden="true"
                      />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <a
                href="/#hire-me"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('/', '#hire-me');
                }}
                className="mt-6 inline-flex min-h-[42px] items-center justify-center gap-1.5 rounded-xl bg-[#111015] px-4 py-2 text-xs font-semibold text-white hover:bg-[#5b21b6]"
              >
                Start {track.title} Brief
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </div>
          ))}
        </section>

        {/* Core Technical Surfaces */}
        <section className="mt-14">
          <h2 className="font-display text-2xl font-bold text-[#111015]">
            Core Engineering Surfaces
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            {SERVICE_CAPABILITIES.map((cap) => (
              <div
                key={cap.index}
                className="rounded-2xl border border-[#e0dbd0] bg-white p-6"
              >
                <p className="font-mono text-xs font-semibold text-[#5b21b6]">{cap.index}</p>
                <h3 className="mt-1 font-display text-lg font-bold text-[#111015]">
                  {cap.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#524e4a]">{cap.description}</p>
                <p className="mt-4 border-t border-[#efece5] pt-3 font-mono text-xs text-[#6d6861]">
                  {cap.stack}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Reviews Preview + FAQ Summary */}
        <section className="mt-14 grid grid-cols-1 gap-8 border-t border-[#e6e2da] pt-12 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-xl font-bold text-[#111015]">
              Verified Client Reviews
            </h2>
            <div className="mt-4 space-y-4">
              {CLIENT_REVIEWS.slice(0, 2).map((rev) => (
                <div key={rev.id} className="rounded-2xl border border-[#e0dbd0] bg-white p-5">
                  <div className="flex items-center gap-1">
                    {[0, 1, 2, 3, 4].map((idx) => (
                      <Star
                        key={idx}
                        className="h-3.5 w-3.5 fill-amber-500 text-amber-500"
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <p className="mt-2.5 text-sm leading-relaxed text-[#2d2a27]">
                    &ldquo;{rev.quote}&rdquo;
                  </p>
                  <p className="mt-3 text-xs font-semibold text-[#111015]">
                    {rev.authorName} · {rev.companyName}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-[#111015]">
              Common Hiring Questions
            </h2>
            <div className="mt-4 space-y-4">
              {FAQ_ITEMS.slice(0, 3).map((faq) => (
                <div key={faq.id} className="rounded-2xl border border-[#e0dbd0] bg-white p-5">
                  <h3 className="font-display text-sm font-bold text-[#111015]">{faq.question}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-[#524e4a]">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
