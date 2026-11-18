import {
  BRAND_VIDEOS,
  ENGAGEMENT_TRACKS,
  FOUNDER_PROFILE,
  SAAS_VENTURES,
  type BrandVideoItem,
  type EngagementTrack,
  type SaaSVenture,
  type VentureCategory,
} from '../data/portfolio.ts';

export interface HireBriefInput {
  clientName: string;
  clientEmail: string;
  companyOrProject: string;
  trackId: EngagementTrack['id'];
  timeline: 'immediate' | 'next-month' | 'flexible';
  budgetRange: 'under-5k' | '5k-15k' | '15k-plus' | 'retainer';
  projectGoals: string;
}

export interface HireBriefValidationResult {
  valid: boolean;
  errors: Partial<Record<keyof HireBriefInput, string>>;
}

export interface HireScopeSummary {
  briefId: string;
  submittedAt: string;
  clientName: string;
  clientEmail: string;
  companyOrProject: string;
  trackTitle: string;
  cadence: string;
  timelineLabel: string;
  budgetLabel: string;
  deliverables: string[];
  formattedBriefText: string;
  mailtoHref: string;
}

const TIMELINE_LABELS: Record<HireBriefInput['timeline'], string> = {
  immediate: 'Immediate Kickoff (This Week)',
  'next-month': 'Within 2–4 Weeks',
  flexible: 'Flexible / Exploratory Planning',
};

const BUDGET_LABELS: Record<HireBriefInput['budgetRange'], string> = {
  'under-5k': '$2,500 – $5,000 (Focused Sprint / Audit)',
  '5k-15k': '$5,000 – $15,000 (MVP / Shopify / Mobile Build)',
  '15k-plus': '$15,000+ (Full-Scale Multi-Tenant SaaS)',
  retainer: 'Monthly Fractional CTO Retainer',
};

export function filterVentures(
  ventures: SaaSVenture[],
  category: VentureCategory,
  searchQuery = ''
): SaaSVenture[] {
  const normalizedQuery = searchQuery.trim().toLowerCase();

  return ventures.filter((venture) => {
    const matchesCategory = category === 'all' || venture.category === category;
    if (!matchesCategory) return false;

    if (!normalizedQuery) return true;

    const searchableText = [
      venture.name,
      venture.tagline,
      venture.summary,
      venture.audience,
      venture.platforms,
      venture.categoryLabel,
      ...venture.capabilities,
    ]
      .join(' ')
      .toLowerCase();

    return searchableText.includes(normalizedQuery);
  });
}

export function validateHireBrief(input: HireBriefInput): HireBriefValidationResult {
  const errors: Partial<Record<keyof HireBriefInput, string>> = {};

  if (!input.clientName || input.clientName.trim().length < 2) {
    errors.clientName = 'Please enter your name (at least 2 characters).';
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!input.clientEmail || !emailPattern.test(input.clientEmail.trim())) {
    errors.clientEmail = 'Please enter a valid work or personal email address.';
  }

  if (!input.projectGoals || input.projectGoals.trim().length < 20) {
    errors.projectGoals = 'Please describe your product goals or scope in at least 20 characters.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function buildHireScopeSummary(input: HireBriefInput): HireScopeSummary {
  const track =
    ENGAGEMENT_TRACKS.find((t) => t.id === input.trackId) ?? ENGAGEMENT_TRACKS[0];

  const cleanName = input.clientName.trim();
  const cleanEmail = input.clientEmail.trim();
  const cleanCompany = input.companyOrProject.trim() || 'Independent Venture';
  const cleanGoals = input.projectGoals.trim();
  const timelineLabel = TIMELINE_LABELS[input.timeline];
  const budgetLabel = BUDGET_LABELS[input.budgetRange];
  const briefId = `HL-${Math.abs(hashString(`${cleanEmail}-${track.id}-${cleanGoals.slice(0, 12)}`))
    .toString(36)
    .toUpperCase()
    .slice(0, 6)}`;

  const formattedBriefText = [
    `Project Brief for Hindara Labs — ${FOUNDER_PROFILE.primaryName}`,
    `Reference: ${briefId}`,
    `Client: ${cleanName} (${cleanEmail})`,
    `Company / Venture: ${cleanCompany}`,
    `Engagement Track: ${track.title} (${track.cadence})`,
    `Target Timeline: ${timelineLabel}`,
    `Estimated Budget: ${budgetLabel}`,
    ``,
    `Scope & Objectives:`,
    cleanGoals,
  ].join('\n');

  const subject = encodeURIComponent(
    `[Hire Inquiry ${briefId}] ${track.title} — ${cleanCompany}`
  );
  const body = encodeURIComponent(formattedBriefText);
  const mailtoHref = `mailto:${FOUNDER_PROFILE.email}?subject=${subject}&body=${body}`;

  return {
    briefId,
    submittedAt: new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }),
    clientName: cleanName,
    clientEmail: cleanEmail,
    companyOrProject: cleanCompany,
    trackTitle: track.title,
    cadence: track.cadence,
    timelineLabel,
    budgetLabel,
    deliverables: track.deliverables,
    formattedBriefText,
    mailtoHref,
  };
}

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

export type BuildSurface = 'web-saas' | 'mobile-app' | 'shopify-app' | 'ai-agent';
export type ProjectStage = 'idea-mvp' | 'scale-existing' | 'integrations';

export interface ScopeRecommendation {
  trackId: EngagementTrack['id'];
  trackTitle: string;
  estimatedWeeks: string;
  suggestedTimeline: HireBriefInput['timeline'];
  suggestedBudgetRange: HireBriefInput['budgetRange'];
  architectureFocus: string;
  prefillGoalsText: string;
}

const SURFACE_LABELS: Record<BuildSurface, string> = {
  'web-saas': 'Multi-Tenant Web SaaS',
  'mobile-app': 'React Native iOS & Android App',
  'shopify-app': 'Shopify Embedded App & Store Sync',
  'ai-agent': 'AI Agent & Workflow Automation',
};

export function recommendEngagementScope(
  surfaces: BuildSurface[],
  stage: ProjectStage
): ScopeRecommendation {
  const activeSurfaces: BuildSurface[] = surfaces.length > 0 ? surfaces : ['web-saas'];
  const surfaceText = activeSurfaces.map((s) => SURFACE_LABELS[s]).join(' + ');

  if (stage === 'scale-existing') {
    return {
      trackId: 'fractional-cto',
      trackTitle: 'Fractional CTO & Lead Architect',
      estimatedWeeks: 'Ongoing Weekly Sprints',
      suggestedTimeline: 'immediate',
      suggestedBudgetRange: 'retainer',
      architectureFocus: `Hands-on architecture audit, performance refactoring, and delivery acceleration for ${surfaceText}.`,
      prefillGoalsText: `Looking for Fractional CTO & senior engineering leadership on an existing ${surfaceText} product. Key priorities: stabilizing architecture, shipping core roadmap milestones, and improving reliability.`,
    };
  }

  const isPureMobileOrShopify =
    !activeSurfaces.includes('web-saas') &&
    (activeSurfaces.includes('mobile-app') || activeSurfaces.includes('shopify-app'));

  if (isPureMobileOrShopify && activeSurfaces.length <= 2) {
    return {
      trackId: 'mobile-shopify',
      trackTitle: 'React Native & Shopify App Build',
      estimatedWeeks: '3–6 Weeks Fixed Scope',
      suggestedTimeline: 'next-month',
      suggestedBudgetRange: '5k-15k',
      architectureFocus: `Focused delivery pipeline tailored for ${surfaceText} with store/app review readiness and clean API webhooks.`,
      prefillGoalsText: `Building a dedicated ${surfaceText} solution (${stage === 'integrations' ? 'connecting external ERP/accounting APIs' : 'from initial scope to App Store / Shopify launch'}).`,
    };
  }

  const multiSurface = activeSurfaces.length >= 2;
  return {
    trackId: 'mvp-build',
    trackTitle: '0 → 1 SaaS Product Build',
    estimatedWeeks: multiSurface ? '6–8 Weeks Multi-Surface' : '4–6 Weeks Core Launch',
    suggestedTimeline: 'next-month',
    suggestedBudgetRange: multiSurface ? '15k-plus' : '5k-15k',
    architectureFocus: `Full-lifecycle schema, multi-tenant auth, billing, and production launch covering ${surfaceText}.`,
    prefillGoalsText: `Launching a ${surfaceText} product (${stage === 'integrations' ? 'with third-party accounting/CRM/webhook integrations' : 'from blueprint to live paying customers'}). Looking for end-to-end architecture and production delivery.`,
  };
}

export type AssistantMode = 'advisor' | 'architect' | 'brief-builder';

export type AssistantToolAction =
  | {
      type: 'scope_recommendation';
      title: string;
      surfaces: BuildSurface[];
      stage: ProjectStage;
      recommendation: ScopeRecommendation;
      companyOrProject?: string;
    }
  | {
      type: 'venture_spotlight';
      comparisonSummary: string;
      ventures: Array<{
        id: string;
        name: string;
        tagline: string;
        url: string;
        categoryLabel: string;
        platforms: string;
        imagePath: string;
      }>;
    }
  | {
      type: 'hire_brief_draft';
      draft: Partial<HireBriefInput>;
      readyToSend: boolean;
      summaryNote: string;
    }
  | {
      type: 'brand_video_focus';
      video: BrandVideoItem;
    };

const VALID_SURFACES = new Set<BuildSurface>([
  'web-saas',
  'mobile-app',
  'shopify-app',
  'ai-agent',
]);

const VALID_STAGES = new Set<ProjectStage>([
  'idea-mvp',
  'scale-existing',
  'integrations',
]);

const VALID_TRACK_IDS = new Set<EngagementTrack['id']>([
  'mvp-build',
  'fractional-cto',
  'mobile-shopify',
]);

const VALID_TIMELINES = new Set<HireBriefInput['timeline']>([
  'immediate',
  'next-month',
  'flexible',
]);

const VALID_BUDGETS = new Set<HireBriefInput['budgetRange']>([
  'under-5k',
  '5k-15k',
  '15k-plus',
  'retainer',
]);

export function sanitizeFounderAliasText(value: string): string {
  return value
    .replace(/\bSalman\s+Akbe?r\b/gi, FOUNDER_PROFILE.primaryName)
    .replace(/\bSalman\s+Khan\b/gi, FOUNDER_PROFILE.primaryName);
}

export function buildScopeRecommendationAction(args: {
  surfaces?: unknown;
  stage?: unknown;
  companyOrProject?: unknown;
  customSummary?: unknown;
}): Extract<AssistantToolAction, { type: 'scope_recommendation' }> {
  const rawSurfaces = Array.isArray(args.surfaces) ? args.surfaces : [];
  const surfaces = rawSurfaces
    .map((s) => String(s).trim().toLowerCase() as BuildSurface)
    .filter((s): s is BuildSurface => VALID_SURFACES.has(s));

  const normalizedSurfaces: BuildSurface[] =
    surfaces.length > 0 ? Array.from(new Set(surfaces)) : ['web-saas'];

  const rawStage = typeof args.stage === 'string' ? args.stage.trim().toLowerCase() : '';
  const stage: ProjectStage = VALID_STAGES.has(rawStage as ProjectStage)
    ? (rawStage as ProjectStage)
    : 'idea-mvp';

  const baseRec = recommendEngagementScope(normalizedSurfaces, stage);
  const customSummary =
    typeof args.customSummary === 'string' && args.customSummary.trim().length >= 20
      ? sanitizeFounderAliasText(args.customSummary.trim().slice(0, 800))
      : baseRec.prefillGoalsText;

  const companyOrProject =
    typeof args.companyOrProject === 'string' && args.companyOrProject.trim().length > 0
      ? sanitizeFounderAliasText(args.companyOrProject.trim().slice(0, 100))
      : undefined;

  return {
    type: 'scope_recommendation',
    title: `${baseRec.trackTitle} Scope`,
    surfaces: normalizedSurfaces,
    stage,
    companyOrProject,
    recommendation: {
      ...baseRec,
      prefillGoalsText: customSummary,
    },
  };
}

export function buildVentureSpotlightAction(
  ventureIds: unknown,
  comparisonSummary?: unknown
): Extract<AssistantToolAction, { type: 'venture_spotlight' }> | null {
  const rawIds = Array.isArray(ventureIds) ? ventureIds : [];
  const matched: SaaSVenture[] = [];
  const seen = new Set<string>();

  for (const rawId of rawIds) {
    const normalized = String(rawId).trim().toLowerCase();
    const found = SAAS_VENTURES.find(
      (v) => v.id === normalized || v.name.toLowerCase() === normalized
    );
    if (found && !seen.has(found.id)) {
      seen.add(found.id);
      matched.push(found);
    }
    if (matched.length >= 4) break;
  }

  if (matched.length === 0) {
    return null;
  }

  const summary =
    typeof comparisonSummary === 'string' && comparisonSummary.trim().length > 0
      ? sanitizeFounderAliasText(comparisonSummary.trim().slice(0, 320))
      : `Live Hindara Labs software owned by ${FOUNDER_PROFILE.primaryName}.`;

  return {
    type: 'venture_spotlight',
    comparisonSummary: summary,
    ventures: matched.map((v) => ({
      id: v.id,
      name: v.name,
      tagline: v.tagline,
      url: v.url,
      categoryLabel: v.categoryLabel,
      platforms: v.platforms,
      imagePath: v.imagePath,
    })),
  };
}

export function buildHireBriefDraftAction(args: {
  clientName?: unknown;
  clientEmail?: unknown;
  companyOrProject?: unknown;
  trackId?: unknown;
  timeline?: unknown;
  budgetRange?: unknown;
  projectGoals?: unknown;
}): Extract<AssistantToolAction, { type: 'hire_brief_draft' }> {
  const clientName =
    typeof args.clientName === 'string' ? args.clientName.trim().slice(0, 100) : '';
  const clientEmail =
    typeof args.clientEmail === 'string' ? args.clientEmail.trim().slice(0, 120) : '';
  const companyOrProject =
    typeof args.companyOrProject === 'string'
      ? sanitizeFounderAliasText(args.companyOrProject.trim().slice(0, 120))
      : '';

  const rawTrack = typeof args.trackId === 'string' ? args.trackId.trim() : '';
  const trackId: EngagementTrack['id'] = VALID_TRACK_IDS.has(rawTrack as EngagementTrack['id'])
    ? (rawTrack as EngagementTrack['id'])
    : 'mvp-build';

  const rawTimeline = typeof args.timeline === 'string' ? args.timeline.trim() : '';
  const timeline: HireBriefInput['timeline'] = VALID_TIMELINES.has(
    rawTimeline as HireBriefInput['timeline']
  )
    ? (rawTimeline as HireBriefInput['timeline'])
    : 'next-month';

  const rawBudget = typeof args.budgetRange === 'string' ? args.budgetRange.trim() : '';
  const budgetRange: HireBriefInput['budgetRange'] = VALID_BUDGETS.has(
    rawBudget as HireBriefInput['budgetRange']
  )
    ? (rawBudget as HireBriefInput['budgetRange'])
    : '5k-15k';

  const projectGoals =
    typeof args.projectGoals === 'string'
      ? sanitizeFounderAliasText(args.projectGoals.trim().slice(0, 1200))
      : '';

  const candidate: HireBriefInput = {
    clientName,
    clientEmail,
    companyOrProject,
    trackId,
    timeline,
    budgetRange,
    projectGoals,
  };

  const validation = validateHireBrief(candidate);
  const track = ENGAGEMENT_TRACKS.find((t) => t.id === trackId) ?? ENGAGEMENT_TRACKS[0];

  const draft: Partial<HireBriefInput> = {
    trackId,
    timeline,
    budgetRange,
    ...(clientName ? { clientName } : {}),
    ...(clientEmail ? { clientEmail } : {}),
    ...(companyOrProject ? { companyOrProject } : {}),
    ...(projectGoals ? { projectGoals } : {}),
  };

  return {
    type: 'hire_brief_draft',
    draft,
    readyToSend: validation.valid,
    summaryNote: validation.valid
      ? `Complete ${track.title} brief ready to submit straight to ${FOUNDER_PROFILE.email}.`
      : `Prepared ${track.title} draft — apply to the Hire Brief form to add your remaining contact details.`,
  };
}

export function buildBrandVideoFocusAction(
  videoId: unknown
): Extract<AssistantToolAction, { type: 'brand_video_focus' }> {
  const normalized = typeof videoId === 'string' ? videoId.trim().toLowerCase() : '';
  const matched =
    BRAND_VIDEOS.find((v) => v.id === normalized) ?? BRAND_VIDEOS[0];

  return {
    type: 'brand_video_focus',
    video: matched,
  };
}

export function sanitizeSpeechText(rawText: string, maxChars = 650): string {
  const clean = sanitizeFounderAliasText(rawText)
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/^\s*[*-]\s+/gm, '')
    .replace(/https?:\/\/(?:www\.)?([^/\s)]+)[^\s)]*/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();

  if (clean.length <= maxChars) return clean;
  const slice = clean.slice(0, maxChars);
  const lastPeriod = Math.max(
    slice.lastIndexOf('.'),
    slice.lastIndexOf('۔'),
    slice.lastIndexOf('।'),
    slice.lastIndexOf('。')
  );
  if (lastPeriod > maxChars * 0.55) {
    return slice.slice(0, lastPeriod + 1);
  }
  return `${slice.trim()}...`;
}

export type AssistantLanguageCode =
  | 'auto'
  | 'en'
  | 'ur'
  | 'ar'
  | 'es'
  | 'fr'
  | 'de'
  | 'hi'
  | 'zh';

export interface AssistantLanguageOption {
  code: AssistantLanguageCode;
  nativeLabel: string;
  englishName: string;
  isRtl: boolean;
  welcomeMessage: string;
  inputPlaceholder: string;
}

export const ASSISTANT_LANGUAGES: AssistantLanguageOption[] = [
  {
    code: 'auto',
    nativeLabel: 'Auto-Detect (Any Language)',
    englishName: 'Auto-Detect',
    isRtl: false,
    welcomeMessage: `Welcome to Hindara Labs. Chat in any language — ask about our six live SaaS products, request an architecture scope estimate, watch a studio film, or draft a project brief with ${FOUNDER_PROFILE.primaryName}.`,
    inputPlaceholder: 'Ask in any language (English, اردو, العربية, Español...)',
  },
  {
    code: 'en',
    nativeLabel: 'English',
    englishName: 'English',
    isRtl: false,
    welcomeMessage: `Welcome to Hindara Labs. Ask about our six live SaaS products, request an architecture scope estimate, watch a studio film, or draft a project brief directly with ${FOUNDER_PROFILE.primaryName}.`,
    inputPlaceholder: 'Ask about our SaaS apps or hiring...',
  },
  {
    code: 'ur',
    nativeLabel: 'اردو (Urdu)',
    englishName: 'Urdu',
    isRtl: true,
    welcomeMessage: `ہندارا لیبز (Hindara Labs) میں خوش آمدید۔ آپ ہمارے 6 لائیو SaaS پلیٹ فارمز، سافٹ ویئر آرکیٹیکچر، یا بانی ${FOUNDER_PROFILE.primaryName} کی خدمات حاصل کرنے کے بارے میں اردو میں بات کر سکتے ہیں۔`,
    inputPlaceholder: 'اردو میں اپنا سوال یا پروجیکٹ کی تفصیل لکھیں...',
  },
  {
    code: 'ar',
    nativeLabel: 'العربية (Arabic)',
    englishName: 'Arabic',
    isRtl: true,
    welcomeMessage: `مرحبًا بكم في Hindara Labs. اسأل باللغة العربية عن منتجاتنا الستة (SaaS) أو تقدير نطاق المشروع أو التواصل مباشرة مع المؤسس ${FOUNDER_PROFILE.primaryName}.`,
    inputPlaceholder: 'اكتب سؤالك أو تفاصيل مشروعك بالعربية...',
  },
  {
    code: 'es',
    nativeLabel: 'Español',
    englishName: 'Spanish',
    isRtl: false,
    welcomeMessage: `Bienvenido a Hindara Labs. Pregunta en español sobre nuestros seis productos SaaS activos, solicita una estimación técnica o prepara un brief de proyecto directamente con ${FOUNDER_PROFILE.primaryName}.`,
    inputPlaceholder: 'Escribe tu consulta en español...',
  },
  {
    code: 'fr',
    nativeLabel: 'Français',
    englishName: 'French',
    isRtl: false,
    welcomeMessage: `Bienvenue chez Hindara Labs. Posez vos questions en français sur nos six solutions SaaS, demandez un cadrage technique ou préparez un brief directement avec ${FOUNDER_PROFILE.primaryName}.`,
    inputPlaceholder: 'Posez votre question en français...',
  },
  {
    code: 'de',
    nativeLabel: 'Deutsch',
    englishName: 'German',
    isRtl: false,
    welcomeMessage: `Willkommen bei Hindara Labs. Fragen Sie auf Deutsch nach unseren sechs aktiven SaaS-Produkten, einer technischen Projektplanung oder einer direkten Zusammenarbeit mit ${FOUNDER_PROFILE.primaryName}.`,
    inputPlaceholder: 'Stellen Sie Ihre Frage auf Deutsch...',
  },
  {
    code: 'hi',
    nativeLabel: 'हिन्दी (Hindi)',
    englishName: 'Hindi',
    isRtl: false,
    welcomeMessage: `Hindara Labs में आपका स्वागत है। हमारे छह लाइव SaaS उत्पादों, तकनीकी आर्किटेक्चर या संस्थापक ${FOUNDER_PROFILE.primaryName} को हायर करने के बारे में हिन्दी में पूछें।`,
    inputPlaceholder: 'हिन्दी में अपना प्रश्न या प्रोजेक्ट विवरण लिखें...',
  },
  {
    code: 'zh',
    nativeLabel: '中文 (Chinese)',
    englishName: 'Chinese',
    isRtl: false,
    welcomeMessage: `欢迎来到 Hindara Labs。您可以用中文咨询我们旗下的六款上线 SaaS 产品、架构评估，或直接向创始人 ${FOUNDER_PROFILE.primaryName} 发起项目合作意向。`,
    inputPlaceholder: '请用中文输入您的项目需求或问题...',
  },
];

const STARTER_PROMPTS_BY_LANG_AND_MODE: Partial<
  Record<AssistantLanguageCode, Record<AssistantMode, string[]>>
> = {
  ur: {
    advisor: [
      'Shopify اسٹور کے لیے Hindara Labs کی کون سی ایپ بہتر ہے؟',
      'TidyFlow اور TidyAgent کیا کام کرتے ہیں؟',
      'Suleman Khan کو نئے SaaS پروجیکٹ کے لیے کیسے ہائر کریں؟',
      'Hindara Labs کی برانڈ ویڈیوز دکھائیں',
    ],
    architect: [
      'اگلے ماہ لانچ کے لیے Shopify وارنٹی ایپ اور React Native ایپ کا اسکوپ بتائیں',
      'TidyFlow ویب، iOS اور Android پر کیسے کام کرتا ہے؟',
      'StockSentry اور AfterSale OS کا موازنہ کریں',
    ],
    'brief-builder': [
      '0→1 SaaS MVP کے لیے ہائرنگ بریف تیار کریں',
      'React Native اور Shopify انٹیگریشن کے لیے بریف بنائیں',
      'Fractional CTO کے لیے پروجیکٹ بریف تیار کریں',
    ],
  },
  ar: {
    advisor: [
      'أي تطبيق من Hindara Labs يناسب متاجر Shopify؟',
      'اشرح كيف يعمل TidyFlow و TidyAgent معًا',
      'كيف يمكنني توظيف Suleman Khan لبناء منصة SaaS؟',
      'أرني الفيديو التعريفي لاستوديو Hindara Labs',
    ],
    architect: [
      'قدّر نطاق بناء تطبيق ضمان Shopify مع تطبيق جوال React Native',
      'قارن بين بنية StockSentry و AfterSale OS',
      'كيف تم تصميم TidyFlow على الويب و iOS و Android؟',
    ],
    'brief-builder': [
      'جهز ملخص مشروع (Hire Brief) لإطلاق منصة SaaS خلال شهر',
      'أعد مسودة مشروع لتكامل Shopify و React Native',
      'جهز طلب استشارة Fractional CTO لتطوير منتجنا',
    ],
  },
  es: {
    advisor: [
      '¿Qué producto de Hindara Labs encaja mejor con una tienda Shopify?',
      'Explica qué hacen juntos TidyFlow y TidyAgent',
      '¿Cómo puedo contratar a Suleman Khan para un SaaS MVP?',
      'Muéstrame el video de presentación de Hindara Labs',
    ],
    architect: [
      'Calcula el alcance de una app Shopify de garantías y app móvil React Native',
      'Compara la arquitectura de StockSentry frente a AfterSale OS',
      '¿Cómo funciona TidyFlow en Web, iOS y Android?',
    ],
    'brief-builder': [
      'Prepara un Hire Brief para lanzar un SaaS MVP el próximo mes',
      'Redacta un brief para app React Native y Shopify ($5k–$15k)',
      'Configura una consulta de Fractional CTO para escalar nuestro SaaS',
    ],
  },
  fr: {
    advisor: [
      'Quel SaaS de Hindara Labs convient à une boutique Shopify ?',
      'Expliquez le rôle de TidyFlow et TidyAgent',
      'Comment engager Suleman Khan pour un SaaS MVP ?',
    ],
    architect: [
      'Estimez une application Shopify avec compagnon mobile React Native',
      'Comparez StockSentry et AfterSale OS',
    ],
    'brief-builder': [
      'Préparez un brief pour un SaaS MVP le mois prochain',
      'Rédigez un brief Fractional CTO',
    ],
  },
  de: {
    advisor: [
      'Welches SaaS von Hindara Labs passt zu einem Shopify-Shop?',
      'Wie arbeiten TidyFlow und TidyAgent zusammen?',
      'Wie kann ich Suleman Khan für ein SaaS-MVP beauftragen?',
    ],
    architect: [
      'Umfang für eine Shopify-Garantie-App mit React Native App schätzen',
      'Vergleiche StockSentry und AfterSale OS',
    ],
    'brief-builder': [
      'Erstelle ein Hire Brief für einen 0→1 SaaS-Launch nächsten Monat',
      'Fractional-CTO-Anfrage vorbereiten',
    ],
  },
  hi: {
    advisor: [
      'Shopify स्टोर के लिए Hindara Labs का कौन सा SaaS सबसे सही है?',
      'TidyFlow और TidyAgent क्या करते हैं?',
      'Suleman Khan को SaaS MVP के लिए कैसे हायर करें?',
    ],
    architect: [
      'Shopify वारंटी ऐप और React Native मोबाइल ऐप का स्कोप अनुमान बताएं',
      'StockSentry और AfterSale OS की तुलना करें',
    ],
    'brief-builder': [
      'अगले महीने लॉन्च के लिए SaaS MVP का Hire Brief तैयार करें',
      'React Native और Shopify ऐप के लिए ब्रीफ बनाएं',
    ],
  },
  zh: {
    advisor: [
      'Hindara Labs 的哪款 SaaS 最适合 Shopify 品牌？',
      '请介绍 TidyFlow 和 TidyAgent 的核心功能',
      '如何聘请 Suleman Khan 开发 SaaS MVP？',
    ],
    architect: [
      '评估一个 Shopify 保修门户与 React Native 移动端的开发范围',
      '对比 StockSentry 与 AfterSale OS 的架构设计',
    ],
    'brief-builder': [
      '起草一份下个月上线的 0→1 SaaS MVP 合作需求书',
      '准备一份 Fractional CTO 技术顾问合作简报',
    ],
  },
};

const ENGLISH_STARTER_PROMPTS: Record<AssistantMode, string[]> = {
  advisor: [
    'Which Hindara Labs SaaS fits a Shopify brand?',
    'Explain what TidyFlow and TidyAgent do together',
    'Show me the Hindara Labs brand film overview',
    'How can I hire Suleman Khan for a SaaS MVP?',
  ],
  architect: [
    'Scope a Shopify warranty app and React Native mobile companion',
    'How is TidyFlow architected across Web, iOS & Android?',
    'Estimate a 0→1 multi-tenant B2B SaaS with AI automation',
    'Compare StockSentry vs AfterSale OS architecture',
  ],
  'brief-builder': [
    'Prepare a Hire Brief for a 0→1 SaaS MVP launching next month',
    'Draft a React Native & Shopify integration brief ($5k–$15k)',
    'Set up a Fractional CTO inquiry for scaling our SaaS',
    'I want to send an inquiry to Suleman Khan now',
  ],
};

export function resolveAssistantLanguage(rawCode: unknown): AssistantLanguageOption {
  const normalized = typeof rawCode === 'string' ? rawCode.trim().toLowerCase() : 'auto';
  return (
    ASSISTANT_LANGUAGES.find((lang) => lang.code === normalized) ?? ASSISTANT_LANGUAGES[0]
  );
}

export function isRtlText(text: string): boolean {
  // Arabic / Urdu / Hebrew Unicode blocks
  return /[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/.test(text);
}

export function getLocalizedStarterPrompts(
  language: AssistantLanguageCode,
  mode: AssistantMode
): string[] {
  if (language === 'auto') {
    return [
      'Which Hindara Labs SaaS fits a Shopify brand?',
      'Explícame qué hacen TidyFlow y TidyAgent en español',
      'اردو میں بتائیں کہ Suleman Khan کو کیسے ہائر کریں؟',
      'Scope a Shopify warranty app and React Native mobile companion',
    ];
  }
  return (
    STARTER_PROMPTS_BY_LANG_AND_MODE[language]?.[mode] ?? ENGLISH_STARTER_PROMPTS[mode]
  );
}



