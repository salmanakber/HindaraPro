import { useState } from 'react';
import { ArrowRight, Check, Minus } from 'lucide-react';
import {
  AGENCY_COMPARISON,
  ENGINEERING_PRINCIPLES,
  FOUNDER_PROFILE,
} from '../data/portfolio';

interface StudioCraftSectionProps {
  onNavigate: (path: string, hash?: string) => void;
}

export function StudioCraftSection({ onNavigate }: StudioCraftSectionProps) {
  const [deskImgFailed, setDeskImgFailed] = useState(false);

  return (
    <section
      id="engineering-craft"
      className="scroll-mt-20 border-b border-[#26252c] bg-[#141418] py-16 text-[#faf9f6] sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="font-mono text-xs font-medium tracking-widest text-neutral-400 uppercase">
              How Hindara Labs Builds
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Principal software craft, backed by six businesses we operate ourselves.
            </h2>
          </div>
          <div className="lg:col-span-5">
            <p className="text-sm leading-relaxed text-neutral-300 sm:text-base">
              Most software agencies only write code for slide decks. {FOUNDER_PROFILE.primaryName}{' '}
              maintains live production databases, App Store apps, and customer webhooks daily across
              Hindara Labs—meaning your build inherits real operational discipline from day one.
            </p>
          </div>
        </div>

        {/* Authentic Studio Architecture Photograph + Engineering Principles */}
        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            {!deskImgFailed ? (
              <div className="overflow-hidden rounded-2xl border border-[#2c2b34] bg-[#1d1d23]">
                <img
                  src={FOUNDER_PROFILE.studioDeskImagePath}
                  alt={FOUNDER_PROFILE.studioDeskImageAlt}
                  referrerPolicy="no-referrer"
                  onError={() => setDeskImgFailed(true)}
                  className="aspect-[16/9] w-full object-cover"
                />
                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#2c2b34] bg-[#19191f] px-5 py-3 text-xs text-neutral-300">
                  <span className="font-medium text-white">
                    Direct Architecture &amp; Production Systems
                  </span>
                  <span className="font-mono text-[11px] text-neutral-400">
                    TypeScript · React Native · PostgreSQL · Shopify GraphQL
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex aspect-[16/9] items-center justify-center rounded-2xl border border-[#2c2b34] bg-[#1c1c22] p-8 text-center">
                <p className="font-display text-lg font-semibold text-white">
                  Hindara Labs Systems Architecture Desk
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-col justify-between space-y-5 lg:col-span-5">
            {ENGINEERING_PRINCIPLES.map((item) => (
              <div
                key={item.number}
                className="border-b border-[#27262e] pb-4 last:border-b-0 last:pb-0"
              >
                <p className="font-mono text-xs font-medium text-violet-300 tabular-nums">
                  {item.number}
                </p>
                <h3 className="mt-1 font-display text-base font-semibold text-white">
                  {item.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-neutral-400">
                  {item.detail}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Studio vs Typical Agency Comparison Table */}
        <div className="mt-14 overflow-hidden rounded-2xl border border-[#2a2932] bg-[#19191f]">
          <div className="flex flex-col gap-3 border-b border-[#2a2932] px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-display text-lg font-bold text-white">
                Direct Founder Studio vs. Traditional Dev Agency
              </h3>
              <p className="mt-1 text-xs text-neutral-400">
                Why founders and e-commerce operators work directly with {FOUNDER_PROFILE.studioName}.
              </p>
            </div>
            <a
              href="/about"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('/about');
              }}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-violet-300 whitespace-nowrap shrink-0 hover:text-white hover:underline"
            >
              Read our engineering standards
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </div>

          <div className="divide-y divide-[#25242c]">
            {AGENCY_COMPARISON.map((row) => (
              <div
                key={row.dimension}
                className="grid grid-cols-1 gap-3 px-6 py-4 md:grid-cols-12 md:items-center md:gap-6"
              >
                <div className="md:col-span-3">
                  <p className="font-mono text-xs font-semibold text-neutral-300">
                    {row.dimension}
                  </p>
                </div>
                <div className="flex items-start gap-2.5 md:col-span-5">
                  <Check
                    className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400"
                    aria-hidden="true"
                  />
                  <p className="text-sm font-medium text-white">{row.hindaraWay}</p>
                </div>
                <div className="flex items-start gap-2.5 md:col-span-4">
                  <Minus
                    className="mt-0.5 h-4 w-4 shrink-0 text-neutral-500"
                    aria-hidden="true"
                  />
                  <p className="text-sm text-neutral-400">{row.typicalAgency}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
