import { useMemo, useState } from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import {
  CLIENT_PROJECTS,
  type ClientCaseStudy,
  type ClientProjectCategory,
} from '../data/portfolio';
import { filterClientProjects } from '../utils/portfolioLogic';

interface ClientShowcaseSectionProps {
  onInspectProject: (project: ClientCaseStudy) => void;
  onNavigate: (path: string, hash?: string) => void;
}

const PROJECT_FILTERS: Array<{ id: ClientProjectCategory; label: string }> = [
  { id: 'all', label: 'All Builds (4)' },
  { id: 'shopify-commerce', label: 'Shopify & E-Commerce' },
  { id: 'healthtech-mobile', label: 'HealthTech & Mobile' },
  { id: 'b2b-saas', label: 'B2B Logistics & FinTech' },
];

export function ClientShowcaseSection({
  onInspectProject,
  onNavigate,
}: ClientShowcaseSectionProps) {
  const [category, setCategory] = useState<ClientProjectCategory>('all');
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const visibleProjects = useMemo(
    () => filterClientProjects(CLIENT_PROJECTS, category),
    [category]
  );

  return (
    <section
      id="client-work"
      className="scroll-mt-20 border-b border-[#e6e2da] bg-[#f4f1ea] py-16 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="font-mono text-xs font-medium tracking-widest text-[#524e4a] uppercase">
              Selected Client &amp; Custom Builds
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-[#111015] sm:text-4xl">
              Featured client architectures across commerce, health, and B2B operations.
            </h2>
            <p className="mt-3 text-base leading-relaxed text-[#524e4a]">
              Representative systems engineered by Hindara Labs—combining bespoke storefronts,
              React Native apps, Shopify Plus pipelines, and automated invoicing platforms.
            </p>
          </div>

          <a
            href="/projects"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('/projects');
            }}
            className="inline-flex min-h-[42px] items-center gap-2 rounded-xl border border-[#d6d0c4] bg-white px-4 py-2 text-xs font-semibold text-[#111015] whitespace-nowrap shrink-0 transition-colors hover:border-[#111015]"
          >
            View All Case Studies
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </div>

        {/* Category Filter Tabs */}
        <div className="mt-8 flex flex-wrap items-center gap-2 border-y border-[#e2ddd3] py-4">
          {PROJECT_FILTERS.map((tab) => {
            const active = category === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setCategory(tab.id)}
                aria-pressed={active}
                className={`min-h-[38px] rounded-lg px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
                  active
                    ? 'bg-[#111015] text-white'
                    : 'bg-white text-[#524e4a] border border-[#e2ddd3] hover:text-[#111015]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* 2-Column Editorial Case Study Cards */}
        <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2">
          {visibleProjects.map((project) => {
            const imgFailed = Boolean(failedImages[project.id]);
            return (
              <article
                key={project.id}
                className="flex flex-col justify-between overflow-hidden rounded-2xl border border-[#e0dbd0] bg-white transition-all duration-200 hover:border-[#b9b2a5] hover:shadow-md"
              >
                <div>
                  {!imgFailed && (
                    <div className="overflow-hidden border-b border-[#e6e2da] bg-[#141418]">
                      <img
                        src={project.imagePath}
                        alt={project.imageAlt}
                        referrerPolicy="no-referrer"
                        onError={() =>
                          setFailedImages((prev) => ({ ...prev, [project.id]: true }))
                        }
                        className="aspect-[4/3] w-full object-cover transition-transform duration-500 hover:scale-[1.02]"
                      />
                    </div>
                  )}

                  <div className="p-6 sm:p-7">
                    <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs text-[#524e4a]">
                      <span>
                        <strong className="font-semibold text-[#5b21b6]">{project.index}</strong>
                        <span aria-hidden="true" className="mx-2 text-[#cbc4b8]">
                          ·
                        </span>
                        {project.industry}
                      </span>
                      <span className="tabular-nums font-semibold text-[#111015]">
                        {project.outcomeMetric}
                      </span>
                    </div>

                    <h3 className="mt-3 font-display text-xl font-bold tracking-tight text-[#111015] sm:text-2xl">
                      {project.clientName}
                    </h3>
                    <p className="mt-1 text-sm font-semibold text-[#3f3b37]">{project.title}</p>
                    <p className="mt-3 text-sm leading-relaxed text-[#524e4a]">
                      {project.summary}
                    </p>

                    <p className="mt-4 border-t border-[#efece5] pt-3.5 font-mono text-[11px] text-[#524e4a]">
                      {project.stack.slice(0, 4).join(' · ')}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#e6e2da] bg-[#faf9f6] px-6 py-4 sm:px-7">
                  <button
                    type="button"
                    onClick={() => onInspectProject(project)}
                    className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg bg-[#111015] px-4 py-2 text-xs font-semibold text-white whitespace-nowrap shrink-0 transition-colors hover:bg-[#5b21b6]"
                  >
                    Inspect Case Study
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                  <a
                    href={project.previewUrl}
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate('/projects', `#${project.slug}`);
                    }}
                    className="inline-flex min-h-[40px] items-center gap-1 text-xs font-semibold text-[#524e4a] whitespace-nowrap shrink-0 hover:text-[#5b21b6] hover:underline"
                  >
                    {project.liveDemoLabel}
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
