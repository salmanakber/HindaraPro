import { ArrowRight } from 'lucide-react';
import { FOUNDER_PROFILE, SAAS_VENTURES } from '../data/portfolio';
import { HindaraEcosystem3D } from './HindaraEcosystem3D';

interface HeroProps {
  onInspectVenture: (ventureId: string) => void;
}

export function Hero({ onInspectVenture }: HeroProps) {
  return (
    <section
      id="top"
      className="relative overflow-hidden border-b border-[#e8e2f6] bg-[#fcfbff] pt-8 pb-14 sm:pt-12 sm:pb-18"
    >
      {/* Subtle studio atmosphere behind hero canvas */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-28 right-0 h-[440px] w-[540px] rounded-full bg-[radial-gradient(circle,rgba(124,58,237,0.12)_0%,rgba(252,251,255,0)_70%)]"
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left Column: Editorial Brand Positioning & Primary Actions */}
          <div className="flex flex-col justify-between lg:col-span-5">
            <div>
              <p className="text-xs font-semibold tracking-wider text-[#5b21b6] uppercase sm:text-sm">
                <span>Hindara Labs</span>
                <span aria-hidden="true" className="mx-2 text-[#c4b5fd]">
                  ·
                </span>
                <span>SaaS Venture Studio</span>
              </p>

              <h1
                className="mt-4 font-display font-bold tracking-tight text-[#15102b]"
                style={{ fontSize: 'clamp(2.3rem, 4.1vw, 3.65rem)', lineHeight: 1.06 }}
              >
                Founders of{' '}
                <span className="font-editorial text-[#6d28d9]">
                  software that businesses run on.
                </span>
              </h1>

              <p className="mt-5 text-base leading-relaxed text-[#4b4466] sm:text-[17px]">
                Hindara Labs owns, engineers, and operates six scalable SaaS products across
                field operations, autonomous AI, Shopify commerce, inventory protection, and
                online scheduling—founded and led by{' '}
                <strong className="font-semibold text-[#15102b]">
                  {FOUNDER_PROFILE.primaryName}
                </strong>
                .
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <a
                  href="#hire-me"
                  className="inline-flex min-h-[46px] items-center gap-2 rounded-xl bg-[#5b21b6] px-6 py-3 text-sm font-semibold text-white whitespace-nowrap shrink-0 shadow-sm transition-colors hover:bg-[#4c1d95] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5b21b6]"
                >
                  Hire {FOUNDER_PROFILE.primaryName}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
                <a
                  href="#portfolio"
                  className="inline-flex min-h-[46px] items-center gap-2 rounded-xl border border-[#dcd4f0] bg-white px-5 py-3 text-sm font-semibold text-[#15102b] whitespace-nowrap shrink-0 transition-colors hover:border-[#7c3aed] hover:bg-[#f6f3ff] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5b21b6]"
                >
                  Explore 6 Live Products
                </a>
              </div>
            </div>

            <div className="mt-9 border-t border-[#e8e2f6] pt-5">
              <p className="text-xs font-semibold tracking-wide text-[#5e567a] uppercase">
                Click to inspect owned SaaS products
              </p>
              <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm">
                {SAAS_VENTURES.map((venture, idx) => (
                  <span key={venture.id} className="inline-flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => onInspectVenture(venture.id)}
                      className="font-display font-semibold text-[#15102b] transition-colors hover:text-[#5b21b6] hover:underline hover:underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5b21b6]"
                    >
                      {venture.name}
                    </button>
                    {idx < SAAS_VENTURES.length - 1 && (
                      <span aria-hidden="true" className="text-[#c4b5fd]">
                        ·
                      </span>
                    )}
                  </span>
                ))}
                <span aria-hidden="true" className="text-[#c4b5fd]">
                  ·
                </span>
                <a
                  href="#pipeline"
                  className="text-xs font-medium text-[#5b21b6] hover:underline"
                >
                  More Coming
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Three.js 3D Venture Monument */}
          <div className="lg:col-span-7">
            <HindaraEcosystem3D onInspectVenture={onInspectVenture} />
          </div>
        </div>

        {/* Full-Width 4-Column Studio Proof Strip */}
        <div className="mt-14 grid grid-cols-2 gap-6 border-t border-[#e8e2f6] pt-8 md:grid-cols-4">
          <div>
            <p className="font-mono text-2xl leading-none font-semibold text-[#15102b] tabular-nums sm:text-3xl">
              6+
            </p>
            <p className="mt-2 text-sm font-medium text-[#524b6b]">
              Live SaaS Products Owned
            </p>
          </div>
          <div>
            <p className="font-mono text-2xl leading-none font-semibold text-[#15102b] tabular-nums sm:text-3xl">
              3
            </p>
            <p className="mt-2 text-sm font-medium text-[#524b6b]">
              Surfaces: Web · Mobile · Shopify
            </p>
          </div>
          <div>
            <p className="font-display text-xl leading-none font-bold tracking-tight text-[#15102b] sm:text-[24px]">
              {FOUNDER_PROFILE.primaryName}
            </p>
            <p className="mt-2 text-sm font-medium text-[#524b6b]">
              Founder &amp; Principal Architect
            </p>
          </div>
          <div>
            <p className="font-mono text-2xl leading-none font-semibold text-[#6d28d9] tabular-nums sm:text-3xl">
              Open
            </p>
            <p className="mt-2 text-sm font-medium text-[#524b6b]">
              Available for Select Client Builds
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
