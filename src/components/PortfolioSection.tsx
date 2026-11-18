import { useMemo, useState } from 'react';
import { ArrowUpRight, Eye, Image as ImageIcon, Search, X } from 'lucide-react';
import {
  FOUNDER_PROFILE,
  PIPELINE_VENTURES,
  SAAS_VENTURES,
  type SaaSVenture,
  type VentureCategory,
} from '../data/portfolio';
import { filterVentures } from '../utils/portfolioLogic';
import { VenturePreview } from './VenturePreview';

interface PortfolioSectionProps {
  onSelectVenture: (venture: SaaSVenture) => void;
}

const CATEGORY_TABS: { id: VentureCategory; label: string; count: number }[] = [
  { id: 'all', label: 'All Ventures', count: SAAS_VENTURES.length },
  {
    id: 'operations-ai',
    label: 'Operations & AI',
    count: SAAS_VENTURES.filter((v) => v.category === 'operations-ai').length,
  },
  {
    id: 'ecommerce-shopify',
    label: 'E-Commerce & Shopify',
    count: SAAS_VENTURES.filter((v) => v.category === 'ecommerce-shopify').length,
  },
  {
    id: 'scheduling',
    label: 'Scheduling',
    count: SAAS_VENTURES.filter((v) => v.category === 'scheduling').length,
  },
];

function VentureMediaFrame({ venture }: { venture: SaaSVenture }) {
  const [mode, setMode] = useState<'render' | 'ui'>('render');
  const [imgFailed, setImgFailed] = useState(false);

  const showUi = mode === 'ui' || imgFailed;

  return (
    <div className="mt-5">
      <div className="overflow-hidden rounded-2xl border border-[#e3dcf5] bg-[#15102b]">
        {!showUi ? (
          <img
            src={venture.imagePath}
            alt={venture.imageAlt}
            referrerPolicy="no-referrer"
            onError={() => setImgFailed(true)}
            className="aspect-[4/3] w-full object-cover transition-transform duration-500 hover:scale-[1.02]"
          />
        ) : (
          <div className="aspect-[4/3] overflow-y-auto bg-[#fcfbff] p-4 flex flex-col justify-center">
            <VenturePreview variant={venture.previewVariant} />
          </div>
        )}
      </div>

      {!imgFailed && (
        <div className="mt-2.5 flex items-center justify-between text-xs text-[#5e567a]">
          <span className="font-mono text-[11px] truncate">
            {venture.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}
          </span>
          <div className="inline-flex items-center gap-1 rounded-lg border border-[#e3dcf5] bg-white p-0.5">
            <button
              type="button"
              onClick={() => setMode('render')}
              aria-pressed={mode === 'render'}
              className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-semibold transition-colors ${
                mode === 'render'
                  ? 'bg-[#15102b] text-white'
                  : 'text-[#524b6b] hover:text-[#15102b]'
              }`}
            >
              <ImageIcon className="h-3 w-3" aria-hidden="true" />
              Showcase
            </button>
            <button
              type="button"
              onClick={() => setMode('ui')}
              aria-pressed={mode === 'ui'}
              className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-semibold transition-colors ${
                mode === 'ui'
                  ? 'bg-[#15102b] text-white'
                  : 'text-[#524b6b] hover:text-[#15102b]'
              }`}
            >
              <Eye className="h-3 w-3" aria-hidden="true" />
              System UI
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function PortfolioSection({ onSelectVenture }: PortfolioSectionProps) {
  const [activeCategory, setActiveCategory] = useState<VentureCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const visibleVentures = useMemo(
    () => filterVentures(SAAS_VENTURES, activeCategory, searchQuery),
    [activeCategory, searchQuery]
  );

  return (
    <section
      id="portfolio"
      className="scroll-mt-20 border-b border-[#e8e2f6] bg-[#f6f3ff] py-16 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-wider text-[#5b21b6] uppercase sm:text-sm">
              Hindara Labs Venture Portfolio
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-[#15102b] sm:text-4xl">
              Six products.{' '}
              <span className="font-editorial text-[#6d28d9]">One studio.</span>
            </h2>
            <p className="mt-3 text-base leading-relaxed text-[#4b4466]">
              Every product below is a live SaaS business owned and operated by Hindara Labs
              under founder {FOUNDER_PROFILE.primaryName}—built to solve focused commercial
              problems at scale.
            </p>
          </div>

          <p className="font-mono text-xs text-[#5e567a] tabular-nums">
            Showing {visibleVentures.length} of {SAAS_VENTURES.length} live SaaS products
          </p>
        </div>

        {/* Interactive Filter Bar & Search Control */}
        <div className="mt-8 flex flex-col gap-4 border-y border-[#e3dcf5] py-4 md:flex-row md:items-center md:justify-between">
          <div
            role="group"
            aria-label="Filter SaaS portfolio by category"
            className="flex flex-wrap items-center gap-1.5 rounded-xl border border-[#e3dcf5] bg-[#fcfbff] p-1"
          >
            {CATEGORY_TABS.map((tab) => {
              const isActive = activeCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveCategory(tab.id)}
                  aria-pressed={isActive}
                  className={`min-h-[38px] rounded-lg px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap shrink-0 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5b21b6] ${
                    isActive
                      ? 'bg-[#15102b] text-white shadow-xs'
                      : 'text-[#524b6b] hover:bg-[#f6f3ff] hover:text-[#15102b]'
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              );
            })}
          </div>

          <div className="relative w-full md:w-72">
            <label htmlFor="portfolio-search" className="sr-only">
              Search SaaS products by name or capability
            </label>
            <Search
              className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#7e759c]"
              aria-hidden="true"
            />
            <input
              id="portfolio-search"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products or capabilities..."
              className="min-h-[42px] w-full rounded-xl border border-[#dcd4f0] bg-white pr-9 pl-9 text-sm text-[#15102b] placeholder:text-[#8b83a8] focus:border-[#5b21b6] focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Clear portfolio search"
                className="absolute top-1/2 right-2 -translate-y-1/2 rounded p-1 text-[#7e759c] hover:text-[#15102b]"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Venture Cards Grid */}
        {visibleVentures.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-[#e3dcf5] bg-[#fcfbff] p-10 text-center">
            <h3 className="font-display text-lg font-semibold text-[#15102b]">
              No SaaS products match "{searchQuery}"
            </h3>
            <p className="mt-2 text-sm text-[#524b6b]">
              Clear the search filter or switch back to all six Hindara Labs ventures.
            </p>
            <button
              type="button"
              onClick={() => {
                setActiveCategory('all');
                setSearchQuery('');
              }}
              className="mt-5 inline-flex min-h-[42px] items-center rounded-xl bg-[#5b21b6] px-5 py-2 text-sm font-semibold text-white hover:bg-[#4c1d95]"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
            {visibleVentures.map((venture) => (
              <article
                key={venture.id}
                className="flex flex-col justify-between rounded-3xl border border-[#e3dcf5] bg-[#fcfbff] p-6 shadow-xs transition-all duration-200 hover:border-[#c4b5fd] hover:shadow-md sm:p-8"
              >
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-medium text-[#5e567a]">
                    <div>
                      <span className="font-mono font-semibold text-[#5b21b6] tabular-nums">
                        {venture.index}
                      </span>
                      <span aria-hidden="true" className="mx-2 text-[#d4c8f2]">
                        ·
                      </span>
                      <span>{venture.categoryLabel}</span>
                      <span aria-hidden="true" className="mx-2 text-[#d4c8f2]">
                        ·
                      </span>
                      <span>{venture.platforms}</span>
                    </div>
                  </div>

                  <h3 className="mt-3 font-display text-2xl font-bold tracking-tight text-[#15102b]">
                    {venture.name}
                  </h3>
                  <p className="mt-1 text-sm font-semibold text-[#4b4466]">{venture.tagline}</p>

                  <VentureMediaFrame venture={venture} />

                  <p className="mt-4 text-sm leading-relaxed text-[#4b4466]">
                    {venture.summary}
                  </p>

                  <ul className="mt-4 grid grid-cols-1 gap-x-4 gap-y-1.5 text-sm text-[#3b3454] sm:grid-cols-2">
                    {venture.capabilities.slice(0, 4).map((cap) => (
                      <li key={cap} className="leading-snug">
                        <span aria-hidden="true" className="mr-1.5 text-[#6d28d9]">
                          —
                        </span>
                        {cap}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[#e8e2f6] pt-5">
                  <div className="flex flex-wrap items-center gap-3">
                    <a
                      href={venture.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-[42px] items-center gap-1.5 rounded-xl bg-[#15102b] px-4 py-2 text-xs font-semibold text-white whitespace-nowrap shrink-0 transition-colors hover:bg-[#5b21b6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5b21b6]"
                    >
                      Visit {venture.name}
                      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                    {venture.secondaryUrl && (
                      <a
                        href={venture.secondaryUrl.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-[42px] items-center gap-1 text-xs font-semibold text-[#3b3454] whitespace-nowrap shrink-0 hover:text-[#5b21b6] hover:underline"
                      >
                        {venture.secondaryUrl.label}
                        <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </a>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => onSelectVenture(venture)}
                    className="min-h-[40px] px-2 text-xs font-semibold text-[#5b21b6] whitespace-nowrap shrink-0 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5b21b6]"
                  >
                    Inspect Architecture →
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* More Coming / Pipeline Contrast Card */}
        <div
          id="pipeline"
          className="scroll-mt-20 mt-12 rounded-3xl border border-[#2e2352] bg-[#15102b] p-7 text-white shadow-xl sm:p-9"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-baseline sm:justify-between">
            <div>
              <h3 className="font-display text-2xl font-bold tracking-tight text-white">
                More SaaS products{' '}
                <span className="font-editorial text-violet-300">coming soon.</span>
              </h3>
              <p className="mt-1.5 text-sm text-violet-200/80">
                Hindara Labs continuously incubates, builds, and spins out focused vertical
                B2B software businesses.
              </p>
            </div>
            <a
              href="#hire-me"
              className="text-sm font-semibold text-violet-300 whitespace-nowrap shrink-0 hover:text-white hover:underline"
            >
              Co-build a venture with us →
            </a>
          </div>

          <div className="mt-7 grid grid-cols-1 gap-6 md:grid-cols-2">
            {PIPELINE_VENTURES.map((item) => (
              <div key={item.index} className="border-t border-[#2e2352] pt-4">
                <p className="font-mono text-xs text-violet-300/80">
                  <span>{item.index}</span>
                  <span aria-hidden="true" className="mx-2 text-violet-500">
                    ·
                  </span>
                  <span>{item.focus}</span>
                  <span aria-hidden="true" className="mx-2 text-violet-500">
                    ·
                  </span>
                  <span className="font-semibold text-violet-200">{item.stage}</span>
                </p>
                <h4 className="mt-1.5 font-display text-base font-bold text-white">
                  {item.codename}
                </h4>
                <p className="mt-1.5 text-sm leading-relaxed text-violet-100/75">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
