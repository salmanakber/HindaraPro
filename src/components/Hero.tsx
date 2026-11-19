import { ArrowRight, Star } from 'lucide-react';
import {
  FOUNDER_PROFILE,
  SAAS_VENTURES,
  STUDIO_RATING_SUMMARY,
} from '../data/portfolio';
import { HindaraEcosystem3D } from './HindaraEcosystem3D';

interface HeroProps {
  onInspectVenture: (ventureId: string) => void;
}

export function Hero({ onInspectVenture }: HeroProps) {
  return (
    <section
      id="top"
      className="border-b border-[#e6e2da] bg-[#faf9f6] pt-8 pb-14 sm:pt-12 sm:pb-18"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left Column: Direct Founder Studio Positioning */}
          <div className="flex flex-col justify-between lg:col-span-5">
            <div>
              <p className="font-mono text-xs font-medium tracking-widest text-[#524e4a] uppercase">
                Hindara Labs · Founded by {FOUNDER_PROFILE.primaryName}
              </p>

              <h1
                className="mt-4 font-display font-bold tracking-tight text-[#111015]"
                style={{ fontSize: 'clamp(2.25rem, 4vw, 3.55rem)', lineHeight: 1.07 }}
              >
                Independent studio building{' '}
                <span className="font-editorial text-[#5b21b6]">
                  software that companies run on.
                </span>
              </h1>

              <p className="mt-5 text-base leading-relaxed text-[#45413d] sm:text-[17px]">
                Hindara Labs owns and operates six live SaaS businesses—including field
                operations platforms, Webflow/Wix/Shopify AI chatbots, Shopify App Store tools,
                and booking software—engineered hands-on by{' '}
                <strong className="font-semibold text-[#111015]">
                  {FOUNDER_PROFILE.primaryName}
                </strong>
                .
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <a
                  href="#hire-me"
                  className="inline-flex min-h-[46px] items-center gap-2 rounded-xl bg-[#111015] px-6 py-3 text-sm font-semibold text-white whitespace-nowrap shrink-0 transition-colors hover:bg-[#5b21b6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5b21b6]"
                >
                  Hire {FOUNDER_PROFILE.primaryName}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
                <a
                  href="#client-work"
                  className="inline-flex min-h-[46px] items-center gap-2 rounded-xl border border-[#d6d0c4] bg-white px-5 py-3 text-sm font-semibold text-[#111015] whitespace-nowrap shrink-0 transition-colors hover:border-[#111015] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5b21b6]"
                >
                  View Client Portfolio
                </a>
              </div>
            </div>

            <div className="mt-9 border-t border-[#e6e2da] pt-5">
              <p className="font-mono text-[11px] font-medium tracking-wider text-[#524e4a] uppercase">
                Inspect live Hindara Labs products
              </p>
              <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm">
                {SAAS_VENTURES.map((venture, idx) => (
                  <span key={venture.id} className="inline-flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => onInspectVenture(venture.id)}
                      className="font-display font-semibold text-[#111015] transition-colors hover:text-[#5b21b6] hover:underline hover:underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5b21b6]"
                    >
                      {venture.name}
                    </button>
                    {idx < SAAS_VENTURES.length - 1 && (
                      <span aria-hidden="true" className="text-[#cbc4b8]">
                        ·
                      </span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Three.js 3D Venture Monument */}
          <div className="lg:col-span-7">
            <HindaraEcosystem3D onInspectVenture={onInspectVenture} />
          </div>
        </div>

        {/* Full-Width 4-Column Studio Proof Strip */}
        <div className="mt-14 grid grid-cols-2 gap-6 border-t border-[#e6e2da] pt-8 md:grid-cols-4">
          <div>
            <p className="font-mono text-2xl leading-none font-semibold text-[#111015] tabular-nums sm:text-3xl">
              6+
            </p>
            <p className="mt-2 text-sm font-medium text-[#524e4a]">
              Live SaaS Products Owned
            </p>
          </div>
          <div>
            <p className="font-mono text-2xl leading-none font-semibold text-[#111015] tabular-nums sm:text-3xl">
              Web · App
            </p>
            <p className="mt-2 text-sm font-medium text-[#524e4a]">
              Shopify · Webflow · Wix · RN
            </p>
          </div>
          <div>
            <a href="#reviews" className="group inline-block">
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-2xl leading-none font-semibold text-[#111015] tabular-nums sm:text-3xl">
                  {STUDIO_RATING_SUMMARY.ratingValue}
                </span>
                <Star className="h-5 w-5 fill-amber-500 text-amber-500" aria-hidden="true" />
              </div>
              <p className="mt-2 text-sm font-medium text-[#524e4a] group-hover:text-[#5b21b6] group-hover:underline">
                {STUDIO_RATING_SUMMARY.reviewCount} Verified 5-Star Reviews
              </p>
            </a>
          </div>
          <div>
            <p className="font-display text-xl leading-none font-bold tracking-tight text-[#111015] sm:text-[23px]">
              {FOUNDER_PROFILE.primaryName}
            </p>
            <p className="mt-2 text-sm font-medium text-[#524e4a]">
              Open for Direct Client Builds
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
