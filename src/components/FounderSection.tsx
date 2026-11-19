import { useState } from 'react';
import { ArrowRight, ArrowUpRight, Mail } from 'lucide-react';
import { FOUNDER_PROFILE } from '../data/portfolio';

interface FounderSectionProps {
  onNavigate: (path: string, hash?: string) => void;
}

export function FounderSection({ onNavigate }: FounderSectionProps) {
  const [portraitFailed, setPortraitFailed] = useState(false);

  return (
    <section
      id="founder"
      className="scroll-mt-20 border-b border-[#e6e2da] bg-white py-16 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 items-stretch gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Portrait Frame */}
          <div className="lg:col-span-5 lg:self-start">
            <div className="overflow-hidden rounded-2xl border border-[#e0dbd0] bg-[#f4f1ea]">
              <div className="relative aspect-[4/4.3] px-4 pt-5">
                {!portraitFailed ? (
                  <img
                    src={FOUNDER_PROFILE.portraitPath}
                    alt={`Portrait of ${FOUNDER_PROFILE.primaryName}, Founder & Principal Architect of Hindara Labs`}
                    referrerPolicy="no-referrer"
                    onError={() => setPortraitFailed(true)}
                    className="h-full w-full object-contain object-bottom"
                  />
                ) : (
                  <div className="flex h-full min-h-[340px] flex-col items-center justify-center p-8 text-center">
                    <span className="font-display text-5xl font-bold text-[#111015]">
                      SK
                    </span>
                    <p className="mt-3 font-display text-lg font-semibold text-[#111015]">
                      {FOUNDER_PROFILE.primaryName}
                    </p>
                  </div>
                )}
              </div>

              <div className="border-t border-[#e0dbd0] bg-white px-6 py-4">
                <p className="font-display text-base font-bold text-[#111015]">
                  {FOUNDER_PROFILE.primaryName}
                </p>
                <p className="mt-0.5 text-xs font-medium text-[#524e4a]">
                  {FOUNDER_PROFILE.role}, {FOUNDER_PROFILE.studioName}
                </p>
              </div>
            </div>
          </div>

          {/* Founder Story & Achievements */}
          <div className="flex flex-col justify-between lg:col-span-7">
            <div>
              <p className="font-mono text-xs font-medium tracking-widest text-[#524e4a] uppercase">
                Founder &amp; Leadership
              </p>
              <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-[#111015] sm:text-4xl">
                {FOUNDER_PROFILE.primaryName} —{' '}
                <span className="font-editorial text-[#5b21b6]">
                  architect &amp; multi-SaaS builder.
                </span>
              </h2>

              <p className="mt-5 text-base leading-relaxed text-[#2d2a27]">
                {FOUNDER_PROFILE.bioLead}
              </p>
              <p className="mt-4 text-base leading-relaxed text-[#524e4a]">
                {FOUNDER_PROFILE.bioExtended}
              </p>

              {/* Achievements Grid */}
              <div className="mt-8 grid grid-cols-1 gap-5 border-t border-[#e6e2da] pt-7 sm:grid-cols-2">
                {FOUNDER_PROFILE.achievements.map((item) => (
                  <div key={item.label} className="space-y-1">
                    <div className="flex items-baseline gap-2.5">
                      <span className="font-mono text-2xl font-bold text-[#5b21b6] tabular-nums">
                        {item.metric}
                      </span>
                      <span className="font-display text-sm font-bold text-[#111015]">
                        {item.label}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed text-[#524e4a]">
                      {item.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-[#e6e2da] pt-6">
              <a
                href="#hire-me"
                className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl bg-[#111015] px-5 py-2.5 text-sm font-semibold text-white whitespace-nowrap shrink-0 transition-colors hover:bg-[#5b21b6]"
              >
                Hire {FOUNDER_PROFILE.primaryName}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
              <a
                href="/about"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('/about');
                }}
                className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-[#d6d0c4] bg-white px-4 py-2.5 text-sm font-semibold text-[#111015] whitespace-nowrap shrink-0 transition-colors hover:border-[#111015]"
              >
                About Our Studio
              </a>
              <a
                href={`mailto:${FOUNDER_PROFILE.email}`}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-[#d6d0c4] bg-white px-4 py-2.5 text-sm font-semibold text-[#111015] whitespace-nowrap shrink-0 transition-colors hover:border-[#111015]"
              >
                <Mail className="h-4 w-4 text-[#5b21b6]" aria-hidden="true" />
                {FOUNDER_PROFILE.email}
              </a>
              <a
                href={FOUNDER_PROFILE.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-[#d6d0c4] bg-white px-4 py-2.5 text-sm font-semibold text-[#111015] whitespace-nowrap shrink-0 transition-colors hover:border-[#111015]"
              >
                LinkedIn
                <ArrowUpRight className="h-4 w-4 text-[#5b21b6]" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
