import { type FormEvent, useEffect, useMemo, useState } from 'react';
import { ArrowDownRight, ArrowRight, ArrowUpRight, Check, Copy, Loader2, Mail } from 'lucide-react';
import {
  ENGAGEMENT_TRACKS,
  FOUNDER_PROFILE,
  SERVICE_CAPABILITIES,
  type EngagementTrack,
} from '../data/portfolio';
import {
  recommendEngagementScope,
  validateHireBrief,
  type BuildSurface,
  type HireBriefInput,
  type HireScopeSummary,
  type ProjectStage,
} from '../utils/portfolioLogic';

interface InquirySubmissionState {
  summary: HireScopeSummary;
  emailed: boolean;
  deliveryMethod: 'resend' | 'smtp' | 'saved';
  recipientEmail: string;
}

export interface ExternalBriefDraft {
  nonce: number;
  data: Partial<HireBriefInput>;
  surfaces?: BuildSurface[];
  stage?: ProjectStage;
}

interface HireMeSectionProps {
  externalBriefDraft?: ExternalBriefDraft | null;
  onNavigate?: (path: string, hash?: string) => void;
}

const INITIAL_INPUT: HireBriefInput = {
  clientName: '',
  clientEmail: '',
  companyOrProject: '',
  trackId: 'mvp-build',
  timeline: 'next-month',
  budgetRange: '5k-15k',
  projectGoals: '',
};

const SURFACE_OPTIONS: { id: BuildSurface; label: string }[] = [
  { id: 'web-saas', label: 'Web SaaS Platform' },
  { id: 'mobile-app', label: 'iOS & Android (React Native)' },
  { id: 'shopify-app', label: 'Shopify App / Store Sync' },
  { id: 'ai-agent', label: 'Webflow / Wix / Shopify AI Chatbot' },
];

const STAGE_OPTIONS: { id: ProjectStage; label: string }[] = [
  { id: 'idea-mvp', label: '0 → 1 New Launch' },
  { id: 'integrations', label: 'Integrations & Workflows' },
  { id: 'scale-existing', label: 'Scale Existing Product' },
];

const DELIVERY_BLUEPRINT = [
  {
    step: '01',
    title: 'Architecture & Schema',
    detail: 'Database modeling, multi-tenant boundaries, and written technical milestone plan.',
  },
  {
    step: '02',
    title: 'Core Product & Auth',
    detail: 'Weekly working deployments covering auth, billing, roles, and primary dashboards.',
  },
  {
    step: '03',
    title: 'Mobile, Shopify & AI',
    detail: 'React Native companions, Shopify webhooks, Webflow/Wix AI bots, and QuickBooks sync.',
  },
  {
    step: '04',
    title: 'Launch & Clean Ownership',
    detail: 'Production rollout, telemetry, clean repository handover, and post-launch support.',
  },
];

export function HireMeSection({ externalBriefDraft, onNavigate }: HireMeSectionProps) {
  const [formInput, setFormInput] = useState<HireBriefInput>(INITIAL_INPUT);
  const [selectedSurfaces, setSelectedSurfaces] = useState<BuildSurface[]>(['web-saas']);
  const [projectStage, setProjectStage] = useState<ProjectStage>('idea-mvp');
  const [scopeAppliedToast, setScopeAppliedToast] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof HireBriefInput, string>>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [submittedState, setSubmittedState] = useState<InquirySubmissionState | null>(null);
  const [copiedBrief, setCopiedBrief] = useState(false);

  useEffect(() => {
    if (!externalBriefDraft) return;
    if (externalBriefDraft.surfaces && externalBriefDraft.surfaces.length > 0) {
      setSelectedSurfaces(externalBriefDraft.surfaces);
    }
    if (externalBriefDraft.stage) {
      setProjectStage(externalBriefDraft.stage);
    }
    setSubmittedState(null);
    setErrors({});
    setSubmitError(null);
    setFormInput((prev) => ({
      ...prev,
      ...externalBriefDraft.data,
    }));
    setScopeAppliedToast(true);
    const timer = window.setTimeout(() => setScopeAppliedToast(false), 3200);
    return () => window.clearTimeout(timer);
  }, [externalBriefDraft]);

  const scopeRecommendation = useMemo(
    () => recommendEngagementScope(selectedSurfaces, projectStage),
    [selectedSurfaces, projectStage]
  );

  const toggleSurface = (surface: BuildSurface) => {
    setScopeAppliedToast(false);
    setSelectedSurfaces((prev) => {
      if (prev.includes(surface)) {
        return prev.length > 1 ? prev.filter((item) => item !== surface) : prev;
      }
      return [...prev, surface];
    });
  };

  const applyRecommendedScope = () => {
    setSubmittedState(null);
    setErrors({});
    setFormInput((prev) => ({
      ...prev,
      trackId: scopeRecommendation.trackId,
      timeline: scopeRecommendation.suggestedTimeline,
      budgetRange: scopeRecommendation.suggestedBudgetRange,
      projectGoals:
        prev.projectGoals.trim().length > 0
          ? prev.projectGoals
          : scopeRecommendation.prefillGoalsText,
    }));
    setScopeAppliedToast(true);
    window.setTimeout(() => setScopeAppliedToast(false), 2600);
  };

  const handleTrackSelect = (trackId: EngagementTrack['id']) => {
    setFormInput((prev) => ({ ...prev, trackId }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError(null);

    const validation = validateHireBrief(formInput);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    setIsSending(true);

    try {
      const response = await fetch('/api/hire-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formInput),
      });

      const payload = await response.json();
      if (!response.ok || !payload.ok) {
        if (payload.errors) {
          setErrors(payload.errors);
        } else {
          setSubmitError('Unable to process inquiry right now. Please try again or email directly.');
        }
        return;
      }

      setSubmittedState({
        summary: payload.summary,
        emailed: Boolean(payload.emailed),
        deliveryMethod: payload.deliveryMethod ?? 'saved',
        recipientEmail: payload.recipientEmail ?? FOUNDER_PROFILE.email,
      });
      setCopiedBrief(false);
    } catch {
      setSubmitError(
        `Network error reaching the inquiry endpoint. Please email ${FOUNDER_PROFILE.email} directly.`
      );
    } finally {
      setIsSending(false);
    }
  };

  const handleCopyBrief = async () => {
    if (!submittedState) return;
    try {
      await navigator.clipboard.writeText(submittedState.summary.formattedBriefText);
      setCopiedBrief(true);
      window.setTimeout(() => setCopiedBrief(false), 2500);
    } catch {
      setCopiedBrief(false);
    }
  };

  const handleReset = () => {
    setSubmittedState(null);
    setFormInput(INITIAL_INPUT);
    setErrors({});
    setSubmitError(null);
  };

  return (
    <>
      {/* Engineering Capabilities Section */}
      <section
        id="capabilities"
        className="scroll-mt-20 border-b border-[#e6e2da] bg-[#f4f1ea] py-16 sm:py-24"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="font-mono text-xs font-medium tracking-widest text-[#524e4a] uppercase">
                Engineering Services
              </p>
              <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-[#111015] sm:text-4xl">
                The exact stack powering six Hindara Labs products—available for your build.
              </h2>
              <p className="mt-3 text-base leading-relaxed text-[#524e4a]">
                Work directly with the founder who architected TidyFlow, TidyAgent, TidySync,
                StockSentry, AfterSale OS, and SlotWise.
              </p>
            </div>
            {onNavigate && (
              <a
                href="/services"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('/services');
                }}
                className="inline-flex min-h-[42px] items-center gap-1.5 rounded-xl border border-[#d6d0c4] bg-white px-4 py-2 text-xs font-semibold text-[#111015] whitespace-nowrap shrink-0 transition-colors hover:border-[#111015]"
              >
                Full Services &amp; Rates Guide
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            )}
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
            {SERVICE_CAPABILITIES.map((cap) => (
              <div
                key={cap.index}
                className="flex flex-col justify-between rounded-2xl border border-[#e0dbd0] bg-white p-6 sm:p-7"
              >
                <div>
                  <h3 className="font-display text-lg font-bold text-[#111015]">
                    <span className="mr-2 font-mono text-sm text-[#5b21b6] tabular-nums">
                      {cap.index}.
                    </span>
                    {cap.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-[#524e4a]">
                    {cap.description}
                  </p>
                </div>
                <p className="mt-5 border-t border-[#efece5] pt-3.5 font-mono text-xs text-[#6d6861]">
                  {cap.stack}
                </p>
              </div>
            ))}
          </div>

          {/* 4-Phase Studio Delivery Blueprint */}
          <div className="mt-10 rounded-2xl border border-[#e0dbd0] bg-white p-6 sm:p-8">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
              <h3 className="font-display text-lg font-bold text-[#111015]">
                How Hindara Labs ships from blueprint to production
              </h3>
              <p className="font-mono text-xs text-[#524e4a]">
                Weekly demos · Direct founder access
              </p>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-6 border-t border-[#efece5] pt-6 sm:grid-cols-2 lg:grid-cols-4">
              {DELIVERY_BLUEPRINT.map((phase) => (
                <div key={phase.step}>
                  <p className="font-mono text-xs font-semibold text-[#5b21b6] tabular-nums">
                    Phase {phase.step}
                  </p>
                  <h4 className="mt-1.5 font-display text-sm font-bold text-[#111015]">
                    {phase.title}
                  </h4>
                  <p className="mt-1.5 text-xs leading-relaxed text-[#524e4a]">
                    {phase.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Strong SEO Hire Me Section */}
      <section
        id="hire-me"
        className="scroll-mt-20 border-b border-[#26252c] bg-[#141418] py-16 text-white sm:py-24"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="max-w-3xl">
            <p className="font-mono text-xs font-medium tracking-widest text-neutral-400 uppercase">
              Hire {FOUNDER_PROFILE.primaryName} · Direct Studio Channel
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Hire a multi-SaaS founder to architect and ship your next product.
            </h2>
            <p className="mt-3 text-base leading-relaxed text-neutral-300">
              Select an engagement model below and submit your project brief. Inquiries are
              delivered straight to {FOUNDER_PROFILE.primaryName} at{' '}
              <a
                href={`mailto:${FOUNDER_PROFILE.email}`}
                className="font-semibold text-white underline decoration-violet-400 underline-offset-4 hover:text-violet-200"
              >
                {FOUNDER_PROFILE.email}
              </a>
              .
            </p>
          </div>

          {/* Interactive Project Scope Configurator */}
          <div
            data-testid="scope-configurator"
            className="mt-9 rounded-2xl border border-[#2a2932] bg-[#19191f] p-6 sm:p-7"
          >
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-center">
              <div className="space-y-4 lg:col-span-7">
                <div>
                  <p className="font-mono text-xs font-semibold tracking-wider text-violet-300 uppercase">
                    Interactive Scope Estimator
                  </p>
                  <p className="mt-1 text-sm text-neutral-300">
                    Select the platforms and current stage you need to preview a tailored
                    engagement track.
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-neutral-200">
                    1. Target Surfaces
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {SURFACE_OPTIONS.map((opt) => {
                      const active = selectedSurfaces.includes(opt.id);
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => toggleSurface(opt.id)}
                          aria-pressed={active}
                          className={`min-h-[38px] rounded-lg border px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
                            active
                              ? 'border-violet-400 bg-[#5b21b6] text-white'
                              : 'border-[#2f2e38] bg-[#141418] text-neutral-300 hover:border-neutral-500'
                          }`}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold text-neutral-200">
                    2. Project Stage
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {STAGE_OPTIONS.map((opt) => {
                      const active = projectStage === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => {
                            setProjectStage(opt.id);
                            setScopeAppliedToast(false);
                          }}
                          aria-pressed={active}
                          className={`min-h-[38px] rounded-lg border px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
                            active
                              ? 'border-white bg-white text-[#111015]'
                              : 'border-[#2f2e38] bg-[#141418] text-neutral-300 hover:border-neutral-500'
                          }`}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-between rounded-xl border border-[#2f2e38] bg-[#141418] p-5 lg:col-span-5">
                <div>
                  <p className="font-mono text-xs text-violet-300 tabular-nums">
                    Recommended · {scopeRecommendation.estimatedWeeks}
                  </p>
                  <h3 className="mt-1.5 font-display text-lg font-bold text-white">
                    {scopeRecommendation.trackTitle}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-neutral-300">
                    {scopeRecommendation.architectureFocus}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={applyRecommendedScope}
                  className="mt-4 inline-flex min-h-[40px] items-center justify-center gap-1.5 rounded-lg bg-white px-4 py-2 text-xs font-semibold text-[#111015] whitespace-nowrap shrink-0 transition-colors hover:bg-neutral-200"
                >
                  {scopeAppliedToast ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-[#5b21b6]" aria-hidden="true" />
                      Applied to Brief Below
                    </>
                  ) : (
                    <>
                      Apply Scope to Hire Brief
                      <ArrowDownRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Engagement Track Selector */}
          <div
            role="group"
            aria-label="Choose an engagement track"
            className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-3"
          >
            {ENGAGEMENT_TRACKS.map((track) => {
              const selected = formInput.trackId === track.id;
              return (
                <button
                  key={track.id}
                  type="button"
                  onClick={() => handleTrackSelect(track.id)}
                  aria-pressed={selected}
                  className={`flex flex-col justify-between rounded-2xl border p-6 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400 ${
                    selected
                      ? 'border-violet-400 bg-[#201c2d]'
                      : 'border-[#2a2932] bg-[#19191f] hover:border-neutral-600'
                  }`}
                >
                  <div>
                    <p className="font-mono text-xs text-violet-300">
                      <span>{track.index}</span>
                      <span aria-hidden="true" className="mx-2 text-neutral-600">
                        ·
                      </span>
                      <span>{track.cadence}</span>
                    </p>
                    <h3 className="mt-2 font-display text-lg font-bold text-white">
                      {track.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-neutral-300">
                      {track.description}
                    </p>
                  </div>
                  <p className="mt-4 border-t border-[#2a2932] pt-3 text-xs font-medium text-neutral-400">
                    Ideal for: <span className="text-white">{track.idealFor}</span>
                  </p>
                </button>
              );
            })}
          </div>

          {/* Interactive Hire Brief Form OR Submitted Confirmation Card */}
          <div className="mt-8 rounded-2xl border border-[#e6e2da] bg-[#faf9f6] p-6 text-[#111015] shadow-2xl sm:p-8">
            {submittedState ? (
              <div data-testid="hire-brief-confirmation">
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#e6e2da] pb-5">
                  <div>
                    <p className="font-mono text-xs font-semibold text-[#5b21b6] tabular-nums">
                      {submittedState.emailed
                        ? `Email Sent · Reference ${submittedState.summary.briefId}`
                        : `Inquiry Recorded · Reference ${submittedState.summary.briefId}`}
                    </p>
                    <h3 className="mt-1 font-display text-2xl font-bold text-[#111015]">
                      {submittedState.emailed
                        ? `Your project brief has been emailed to ${FOUNDER_PROFILE.primaryName}.`
                        : `Your project brief for ${FOUNDER_PROFILE.primaryName} is ready.`}
                    </h3>
                    <p className="mt-1 text-sm text-[#524e4a]">
                      {submittedState.emailed
                        ? `Delivered directly to ${submittedState.recipientEmail} with Reply-To set to ${submittedState.summary.clientEmail}.`
                        : `Saved with reference ${submittedState.summary.briefId}. Click below to send directly via your email client or copy the brief text for ${submittedState.recipientEmail}.`}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="min-h-[40px] rounded-xl border border-[#d6d0c4] bg-white px-4 py-2 text-xs font-semibold text-[#111015] hover:bg-[#f4f1ea]"
                  >
                    Start Another Brief
                  </button>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-2.5 text-sm">
                    <p>
                      <span className="font-semibold text-[#2d2a27]">Client: </span>
                      {submittedState.summary.clientName} ({submittedState.summary.clientEmail})
                    </p>
                    <p>
                      <span className="font-semibold text-[#2d2a27]">Venture: </span>
                      {submittedState.summary.companyOrProject}
                    </p>
                    <p>
                      <span className="font-semibold text-[#2d2a27]">Track: </span>
                      {submittedState.summary.trackTitle} ({submittedState.summary.cadence})
                    </p>
                    <p>
                      <span className="font-semibold text-[#2d2a27]">Timeline: </span>
                      {submittedState.summary.timelineLabel}
                    </p>
                    <p>
                      <span className="font-semibold text-[#2d2a27]">Budget: </span>
                      {submittedState.summary.budgetLabel}
                    </p>
                  </div>

                  <div className="rounded-xl border border-[#e6e2da] bg-white p-4">
                    <h4 className="font-display text-sm font-bold text-[#111015]">
                      Included Track Deliverables
                    </h4>
                    <ul className="mt-2.5 space-y-2 text-sm text-[#2d2a27]">
                      {submittedState.summary.deliverables.map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <Check
                            className="mt-0.5 h-4 w-4 shrink-0 text-[#5b21b6]"
                            aria-hidden="true"
                          />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-[#e6e2da] pt-5">
                  <a
                    href={submittedState.summary.mailtoHref}
                    className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#5b21b6] px-5 py-2.5 text-sm font-semibold text-white whitespace-nowrap shrink-0 transition-colors hover:bg-[#4c1d95]"
                  >
                    <Mail className="h-4 w-4" aria-hidden="true" />
                    {submittedState.emailed ? 'Open Copy in Email App' : 'Send Brief via Email App'}
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </a>
                  <button
                    type="button"
                    onClick={handleCopyBrief}
                    className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-[#d6d0c4] bg-white px-4 py-2.5 text-sm font-semibold text-[#111015] whitespace-nowrap shrink-0 transition-colors hover:bg-[#f4f1ea]"
                  >
                    <Copy className="h-4 w-4" aria-hidden="true" />
                    {copiedBrief ? 'Copied Brief' : 'Copy Project Brief'}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <div className="flex flex-col gap-1 border-b border-[#e6e2da] pb-4 sm:flex-row sm:items-center sm:justify-between">
                  <h3 className="font-display text-xl font-bold text-[#111015]">
                    Send a Hire Inquiry
                  </h3>
                  <p className="text-xs font-medium text-[#524e4a]">
                    Selected track:{' '}
                    <span className="font-semibold text-[#5b21b6]">
                      {ENGAGEMENT_TRACKS.find((t) => t.id === formInput.trackId)?.title}
                    </span>
                  </p>
                </div>

                {submitError && (
                  <p
                    role="alert"
                    className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
                  >
                    {submitError}
                  </p>
                )}

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                  <div>
                    <label
                      htmlFor="hire-name"
                      className="block text-sm font-semibold text-[#111015]"
                    >
                      Your Name
                    </label>
                    <input
                      id="hire-name"
                      type="text"
                      required
                      value={formInput.clientName}
                      onChange={(e) =>
                        setFormInput((prev) => ({
                          ...prev,
                          clientName: e.target.value,
                        }))
                      }
                      placeholder="Alex Rivera"
                      className="mt-1.5 min-h-[42px] w-full rounded-xl border border-[#d6d0c4] bg-white px-3.5 text-sm text-[#111015] focus:border-[#5b21b6] focus:outline-none"
                    />
                    {errors.clientName && (
                      <p role="alert" className="mt-1 text-xs font-medium text-red-600">
                        {errors.clientName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="hire-email"
                      className="block text-sm font-semibold text-[#111015]"
                    >
                      Work Email
                    </label>
                    <input
                      id="hire-email"
                      type="email"
                      required
                      value={formInput.clientEmail}
                      onChange={(e) =>
                        setFormInput((prev) => ({
                          ...prev,
                          clientEmail: e.target.value,
                        }))
                      }
                      placeholder="alex@company.com"
                      className="mt-1.5 min-h-[42px] w-full rounded-xl border border-[#d6d0c4] bg-white px-3.5 text-sm text-[#111015] focus:border-[#5b21b6] focus:outline-none"
                    />
                    {errors.clientEmail && (
                      <p role="alert" className="mt-1 text-xs font-medium text-red-600">
                        {errors.clientEmail}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="hire-company"
                      className="block text-sm font-semibold text-[#111015]"
                    >
                      Company or Venture Name
                    </label>
                    <input
                      id="hire-company"
                      type="text"
                      value={formInput.companyOrProject}
                      onChange={(e) =>
                        setFormInput((prev) => ({
                          ...prev,
                          companyOrProject: e.target.value,
                        }))
                      }
                      placeholder="Optional"
                      className="mt-1.5 min-h-[42px] w-full rounded-xl border border-[#d6d0c4] bg-white px-3.5 text-sm text-[#111015] focus:border-[#5b21b6] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="hire-timeline"
                      className="block text-sm font-semibold text-[#111015]"
                    >
                      Target Timeline
                    </label>
                    <select
                      id="hire-timeline"
                      value={formInput.timeline}
                      onChange={(e) =>
                        setFormInput((prev) => ({
                          ...prev,
                          timeline: e.target.value as HireBriefInput['timeline'],
                        }))
                      }
                      className="mt-1.5 min-h-[42px] w-full rounded-xl border border-[#d6d0c4] bg-white px-3.5 text-sm text-[#111015] focus:border-[#5b21b6] focus:outline-none"
                    >
                      <option value="immediate">Immediate Kickoff (This Week)</option>
                      <option value="next-month">Within 2–4 Weeks</option>
                      <option value="flexible">Flexible / Exploratory Planning</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="hire-budget"
                      className="block text-sm font-semibold text-[#111015]"
                    >
                      Project Budget / Retainer
                    </label>
                    <select
                      id="hire-budget"
                      value={formInput.budgetRange}
                      onChange={(e) =>
                        setFormInput((prev) => ({
                          ...prev,
                          budgetRange: e.target.value as HireBriefInput['budgetRange'],
                        }))
                      }
                      className="mt-1.5 min-h-[42px] w-full rounded-xl border border-[#d6d0c4] bg-white px-3.5 text-sm text-[#111015] focus:border-[#5b21b6] focus:outline-none"
                    >
                      <option value="under-5k">$2,500 – $5,000 (Focused Sprint)</option>
                      <option value="5k-15k">$5,000 – $15,000 (MVP / Shopify / Mobile)</option>
                      <option value="15k-plus">$15,000+ (Full SaaS Platform)</option>
                      <option value="retainer">Monthly Fractional CTO Retainer</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="hire-goals"
                    className="block text-sm font-semibold text-[#111015]"
                  >
                    What are you building?
                  </label>
                  <textarea
                    id="hire-goals"
                    rows={3}
                    required
                    value={formInput.projectGoals}
                    onChange={(e) =>
                      setFormInput((prev) => ({
                        ...prev,
                        projectGoals: e.target.value,
                      }))
                    }
                    placeholder="Share your core product problem, target users, required platforms (Web SaaS, React Native, Shopify, Webflow/Wix AI), or key integrations..."
                    className="mt-1.5 w-full rounded-xl border border-[#d6d0c4] bg-white p-3.5 text-sm text-[#111015] focus:border-[#5b21b6] focus:outline-none"
                  />
                  {errors.projectGoals && (
                    <p role="alert" className="mt-1 text-xs font-medium text-red-600">
                      {errors.projectGoals}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
                  <button
                    type="submit"
                    disabled={isSending}
                    className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-[#111015] px-6 py-2.5 text-sm font-semibold text-white whitespace-nowrap shrink-0 transition-colors hover:bg-[#5b21b6] disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5b21b6]"
                  >
                    {isSending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
                    {isSending ? 'Sending Hire Inquiry...' : 'Send Hire Inquiry & Brief'}
                  </button>
                  <p className="text-xs text-[#524e4a]">
                    Direct email:{' '}
                    <a
                      href={`mailto:${FOUNDER_PROFILE.email}`}
                      className="font-semibold text-[#111015] hover:underline"
                    >
                      {FOUNDER_PROFILE.email}
                    </a>
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
