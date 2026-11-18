export type VentureCategory = 'all' | 'operations-ai' | 'ecommerce-shopify' | 'scheduling';

export interface SaaSVenture {
  id: string;
  index: string;
  name: string;
  tagline: string;
  summary: string;
  url: string;
  secondaryUrl?: {
    label: string;
    href: string;
  };
  category: Exclude<VentureCategory, 'all'>;
  categoryLabel: string;
  platforms: string;
  audience: string;
  capabilities: string[];
  architectureHighlights: string[];
  previewVariant: 'tidyflow' | 'tidyagent' | 'tidysync' | 'stocksentry' | 'aftersale' | 'slotwise';
  imagePath: string;
  imageAlt: string;
}

export interface PipelineVenture {
  index: string;
  codename: string;
  focus: string;
  description: string;
  stage: string;
}

export interface EngagementTrack {
  id: 'mvp-build' | 'fractional-cto' | 'mobile-shopify';
  index: string;
  title: string;
  cadence: string;
  idealFor: string;
  description: string;
  deliverables: string[];
}

export interface AchievementItem {
  metric: string;
  label: string;
  detail: string;
}

export interface ServiceCapability {
  index: string;
  title: string;
  description: string;
  stack: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface BrandVideoItem {
  id: 'studio-showcase' | 'operations-ai' | 'commerce-scheduling';
  index: string;
  title: string;
  subtitle: string;
  description: string;
  videoUrl: string;
  posterUrl: string;
  captionsUrl: string;
  isoDuration: string;
  displayDuration: string;
  focusLabel: string;
  transcript: string;
}

export const FOUNDER_PROFILE = {
  primaryName: 'Suleman Khan',
  studioName: 'Hindara Labs',
  role: 'Founder & Principal SaaS Architect',
  email: 'hindarapro@gmail.com',
  linkedinUrl: 'https://www.linkedin.com/in/suleman-khan-207a59136',
  domain: 'https://hindaralabs.com',
  portraitPath: '/images/suleman-khan-portrait.png',
  logoPath: '/images/hindara-labs-logo.png',
  bioLead:
    'Suleman Khan is the founder and principal product architect behind Hindara Labs, building and operating six live SaaS businesses.',
  bioExtended:
    'From initial database schema and React Native mobile clients to Shopify App Store approvals and AI operations agents, he designs, owns, and scales profitable B2B SaaS products under the Hindara Labs umbrella — and partners directly with ambitious founders and teams to architect theirs.',
  achievements: [
    {
      metric: '6',
      label: 'Live SaaS Ventures Owned',
      detail: 'TidyFlow, TidyAgent, TidySync, StockSentry, AfterSale OS, and SlotWise running in production.',
    },
    {
      metric: '3',
      label: 'Core Engineering Surfaces',
      detail: 'Multi-tenant Web SaaS, cross-platform React Native iOS/Android, and Shopify App Store ecosystems.',
    },
    {
      metric: '0 → 1',
      label: 'Full-Lifecycle Ownership',
      detail: 'Direct hands-on architecture from schema modeling and billing to distribution and merchant support.',
    },
    {
      metric: '100%',
      label: 'Founder-Led Execution',
      detail: 'Clients work directly with Suleman Khan rather than being handed off to junior layers.',
    },
  ] satisfies AchievementItem[],
};

export const SAAS_VENTURES: SaaSVenture[] = [
  {
    id: 'tidyflow',
    index: '01',
    name: 'TidyFlow',
    tagline: 'End-to-End Field Service & Cleaning Operations Platform',
    summary:
      'Flagship multi-tenant operations SaaS for cleaning and field-service companies. Centralizes recurring job scheduling, crew rotas, GPS-verified check-ins, live timers, photo checklists, payroll reporting, and accounting sync across web and mobile.',
    url: 'https://tidyflowapp.com/',
    category: 'operations-ai',
    categoryLabel: 'Operations SaaS',
    platforms: 'Web · iOS · Android (React Native)',
    audience: 'Cleaning & Field-Service Teams',
    capabilities: [
      'Recurring job dispatch & team rota management',
      'GPS-verified arrival/departure & mobile job timers',
      'Interactive checklists with before & after photo proof',
      'Payroll tracking, revenue analytics & client reports',
      'Automated QuickBooks & Google Sheets synchronization',
      'Multi-location branch & crew permissions',
    ],
    architectureHighlights: [
      'Offline-resilient React Native crew companion app',
      'Real-time job state pipeline with audit timestamps',
      'Two-way accounting & spreadsheet data connectors',
    ],
    previewVariant: 'tidyflow',
    imagePath: '/src/assets/images/tidyflow_operations_showcase_1794986614214.jpg',
    imageAlt: 'TidyFlow tablet dispatch calendar and iOS/Android mobile crew GPS tracker',
  },
  {
    id: 'tidyagent',
    index: '02',
    name: 'TidyAgent',
    tagline: 'Autonomous AI Operations Agent for Service Teams',
    summary:
      'Built to eliminate repetitive operational coordination. TidyAgent handles incoming routine service requests, summarizes field activity, and executes structured workflow actions alongside human dispatchers without replacing oversight.',
    url: 'https://agent.tidyflowapp.com/',
    category: 'operations-ai',
    categoryLabel: 'AI Automation',
    platforms: 'Web · AI Workflow Engine',
    audience: 'Operations Leads & Support Desk',
    capabilities: [
      'Automated triage of routine scheduling & status requests',
      'Context-aware operational summaries & handoffs',
      'Guardrailed tool execution connected to live job data',
      'Human-in-the-loop approval for sensitive changes',
    ],
    architectureHighlights: [
      'Structured function-calling orchestration',
      'Low-latency operational context grounding',
      'Seamless extension of the TidyFlow ecosystem',
    ],
    previewVariant: 'tidyagent',
    imagePath: '/src/assets/images/tidyagent_ai_engine_1794986614907.jpg',
    imageAlt: 'TidyAgent translucent violet crystalline autonomous AI operations core',
  },
  {
    id: 'tidysync',
    index: '03',
    name: 'TidySync',
    tagline: 'Published Shopify Data & Catalog Synchronization App',
    summary:
      'Production Shopify App Store integration built by Hindara Labs to keep merchant store catalogs, orders, and operational spreadsheets continuously aligned without manual CSV exports.',
    url: 'https://sync.tidyflowapp.com/',
    secondaryUrl: {
      label: 'Shopify App Store',
      href: 'https://apps.shopify.com/tidysync',
    },
    category: 'ecommerce-shopify',
    categoryLabel: 'Shopify App',
    platforms: 'Web · Shopify App Store',
    audience: 'Shopify Store Operators',
    capabilities: [
      'Automated catalog, inventory & order synchronization',
      'Verified Shopify OAuth & embedded admin experience',
      'Scheduled sync pipelines eliminating manual CSV work',
      'Merchant-ready billing, webhooks & reliability logs',
    ],
    architectureHighlights: [
      'Shopify GraphQL Admin API & resilient webhook queues',
      'Idempotent background sync workers with retry backoff',
      'Passed Shopify App Store technical & security review',
    ],
    previewVariant: 'tidysync',
    imagePath: '/src/assets/images/shopify_commerce_suite_1794986615081.jpg',
    imageAlt: 'Hindara Labs Shopify e-commerce analytics and real-time synchronization suite',
  },
  {
    id: 'stocksentry',
    index: '04',
    name: 'StockSentry',
    tagline: 'Real-Time Inventory Surveillance & Stock-Out Protection',
    summary:
      'Proactive stock monitoring and inventory defense SaaS for high-velocity sellers. Detects low-stock velocity spikes early, protects active listings from unexpected stock-outs, and surfaces replenishment alerts before revenue is lost.',
    url: 'https://stocksentry.tidyflowapp.com/',
    category: 'ecommerce-shopify',
    categoryLabel: 'E-Commerce Defense',
    platforms: 'Web · E-Commerce Monitoring',
    audience: 'High-Velocity Online Sellers',
    capabilities: [
      'SKU-level stock threshold & velocity monitoring',
      'Early warning alerts before high-converting items sell out',
      'Multi-channel catalog protection & safety buffers',
      'Actionable restock prioritization dashboard',
    ],
    architectureHighlights: [
      'Event-driven inventory delta tracking engine',
      'Configurable per-SKU alert rules & safety thresholds',
      'Zero-lag listing guard workflows for active stores',
    ],
    previewVariant: 'stocksentry',
    imagePath: '/src/assets/images/stocksentry_defense_showcase_1794988132667.jpg',
    imageAlt: 'StockSentry smoked glass inventory shield and SKU surveillance telemetry',
  },
  {
    id: 'aftersale',
    index: '05',
    name: 'AfterSale OS',
    tagline: 'Warranty & After-Sales Claims OS for Shopify Merchants',
    summary:
      'Complete post-purchase infrastructure for Shopify brands. Empowers customers to register purchases, verify warranty coverage, and submit photo-backed claims through a branded portal while merchants govern rules and analytics in one dashboard.',
    url: 'https://aftersale.tidyflowapp.com/',
    category: 'ecommerce-shopify',
    categoryLabel: 'Shopify OS',
    platforms: 'Web · Shopify Embedded Portal',
    audience: 'DTC Brands & Shopify Merchants',
    capabilities: [
      'Configurable warranty rules & automatic eligibility checks',
      'Self-serve customer product registration & portal',
      'Structured warranty claims with media attachments',
      'Automated PDF warranty certificates & status emails',
      'Claim resolution & defect rate analytics dashboard',
    ],
    architectureHighlights: [
      'Order verification linked directly to Shopify fulfillment',
      'Branded white-label customer registration storefront',
      'Automated transactional email & lifecycle state machine',
    ],
    previewVariant: 'aftersale',
    imagePath: '/src/assets/images/aftersale_warranty_showcase_1794988133096.jpg',
    imageAlt: 'AfterSale OS frosted glass warranty registration certificates and merchant portal',
  },
  {
    id: 'slotwise',
    index: '06',
    name: 'SlotWise',
    tagline: 'Embeddable Online Booking Widget & Scheduling Dashboard',
    summary:
      'Lightweight, theme-adaptable appointment scheduling SaaS engineered to drop cleanly into any marketing website. Pairs a fast customer booking widget with an intuitive availability and booking management console.',
    url: 'https://slotwise.hindaralabs.com/',
    category: 'scheduling',
    categoryLabel: 'Scheduling SaaS',
    platforms: 'Web · Embeddable Widget',
    audience: 'Appointment-Based Businesses',
    capabilities: [
      'Drop-in embeddable booking widget for any website',
      'Custom brand color palettes & responsive themes',
      'Real-time slot availability, buffers & team calendars',
      'Centralized appointment confirmation & admin dashboard',
    ],
    architectureHighlights: [
      'Timezone-safe availability calculation engine',
      'Zero-dependency lightweight script embed for host sites',
      'Clean conflict prevention on concurrent slot locks',
    ],
    previewVariant: 'slotwise',
    imagePath: '/src/assets/images/slotwise_booking_studio_1794986615466.jpg',
    imageAlt: 'SlotWise obsidian glass appointment calendar display on brushed aluminum stand',
  },
];

export const PIPELINE_VENTURES: PipelineVenture[] = [
  {
    index: '07',
    codename: 'Merchant Telemetry Suite',
    focus: 'E-Commerce Margin & Ops Intelligence',
    description:
      'Next-wave analytics connecting SKU velocity, after-sales claim ratios, and fulfillment overhead in one unified studio workspace.',
    stage: 'In Active R&D',
  },
  {
    index: '08',
    codename: 'More Ventures in Incubation',
    focus: 'Vertical AI & Automation SaaS',
    description:
      'Hindara Labs continuously validates practical B2B problems and spins out focused software products—expanding our multi-SaaS portfolio.',
    stage: 'Pipeline Open',
  },
];

export const SERVICE_CAPABILITIES: ServiceCapability[] = [
  {
    index: '01',
    title: 'End-to-End SaaS Platforms',
    description:
      'Multi-tenant architecture, role-based access, subscription billing, analytics dashboards, and scalable APIs engineered from zero to production.',
    stack: 'TypeScript · React · Node.js · PostgreSQL / Cloud',
  },
  {
    index: '02',
    title: 'React Native Mobile Apps',
    description:
      'Production iOS and Android applications featuring GPS check-ins, offline-first sync, push notifications, and native camera workflows.',
    stack: 'React Native · Expo · Native Modules · iOS & Android',
  },
  {
    index: '03',
    title: 'Shopify & Webflow Apps',
    description:
      'Public App Store products and bespoke merchant integrations built to pass App Store review, handle high webhook volume, and embed cleanly.',
    stack: 'Shopify API · App Bridge · Webhooks · Webflow',
  },
  {
    index: '04',
    title: 'AI Agents & Business Automation',
    description:
      'Practical AI copilots, structured tool-calling pipelines, and automated accounting/CRM bridges including QuickBooks and Google Sheets.',
    stack: 'LLM Tool Calling · QuickBooks API · Background Queues',
  },
];

export const ENGAGEMENT_TRACKS: EngagementTrack[] = [
  {
    id: 'mvp-build',
    index: '01',
    title: '0 → 1 SaaS Product Build',
    cadence: '4–8 Weeks Target Launch',
    idealFor: 'Founders & Operators',
    description:
      'Take your SaaS concept from technical blueprint to a live multi-tenant web product with authentication, billing, and core workflows ready for paying customers.',
    deliverables: [
      'System architecture & database schema design',
      'Responsive web application + admin console',
      'Auth, billing, transactional emails & deployment',
    ],
  },
  {
    id: 'fractional-cto',
    index: '02',
    title: 'Fractional CTO & Lead Architect',
    cadence: 'Ongoing Monthly Retainer',
    idealFor: 'Funded Startups & Growing Teams',
    description:
      'Bring Suleman Khan directly into your leadership loop to unblock architecture bottlenecks, review codebases, and ship critical features fast.',
    deliverables: [
      'Weekly architecture & roadmap execution sprints',
      'Performance, security & scalability refactoring',
      'Hands-on full-stack shipping & team mentorship',
    ],
  },
  {
    id: 'mobile-shopify',
    index: '03',
    title: 'React Native & Shopify App Build',
    cadence: '3–6 Weeks Fixed Scope',
    idealFor: 'E-Commerce Brands & Field Teams',
    description:
      'Dedicated delivery of cross-platform iOS/Android React Native apps or public/custom Shopify App Store software engineered by the creator of TidySync and AfterSale OS.',
    deliverables: [
      'Production mobile app or Shopify embedded app',
      'App Store / Play Store submission readiness',
      'Third-party API sync (QuickBooks, Sheets, ERPs)',
    ],
  },
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'who-is-founder',
    question: 'Who is the founder behind Hindara Labs?',
    answer:
      'Hindara Labs is founded and led by Suleman Khan, the founder and principal product architect behind TidyFlow, TidyAgent, TidySync, StockSentry, AfterSale OS, and SlotWise.',
  },
  {
    id: 'what-saas-owned',
    question: 'Does Hindara Labs own and operate all six listed SaaS products?',
    answer:
      'Yes. Hindara Labs is the owner and builder behind TidyFlow (tidyflowapp.com), TidyAgent (agent.tidyflowapp.com), TidySync (sync.tidyflowapp.com), StockSentry (stocksentry.tidyflowapp.com), AfterSale OS (aftersale.tidyflowapp.com), and SlotWise (slotwise.hindaralabs.com), with new ventures actively in development.',
  },
  {
    id: 'how-hire-me',
    question: 'How can I hire Suleman Khan for my SaaS or app project?',
    answer:
      'Use the Hire Me project brief builder on this page to choose an engagement model (0→1 SaaS Build, Fractional CTO, or React Native / Shopify App) and send your inquiry directly to hindarapro@gmail.com. Every brief is reviewed personally.',
  },
  {
    id: 'timeline-pricing',
    question: 'What does a typical build timeline and working cadence look like?',
    answer:
      'Focused Shopify apps and React Native MVPs typically ship in 3 to 6 weeks, while full multi-tenant SaaS platforms launch in 4 to 8 weeks. Every build runs with weekly working demos, clean source ownership, and a clear written milestone estimate upfront.',
  },
];

export const BRAND_VIDEOS: BrandVideoItem[] = [
  {
    id: 'studio-showcase',
    index: '01',
    title: 'Hindara Labs — Multi-SaaS Venture Studio Overview',
    subtitle: 'Six live SaaS platforms founded & architected by Suleman Khan',
    description:
      'Brand overview introducing Hindara Labs under founder Suleman Khan, spanning field operations (TidyFlow), autonomous AI (TidyAgent), Shopify commerce (TidySync, StockSentry, AfterSale OS), and online scheduling (SlotWise).',
    videoUrl: '/videos/hindara-labs-studio-showcase.mp4',
    posterUrl: '/videos/hindara-labs-studio-poster.jpg',
    captionsUrl: '/videos/hindara-labs-studio-showcase.vtt',
    isoDuration: 'PT16S',
    displayDuration: '0:16',
    focusLabel: 'All 6 Ventures · Brand Film',
    transcript:
      'Hindara Labs is an independent multi-SaaS venture studio founded and led by Suleman Khan. The portfolio owns and operates six live software platforms: TidyFlow for field-service scheduling and crew GPS tracking, TidyAgent for autonomous AI workflow triage, TidySync for published Shopify catalog synchronization, StockSentry for SKU stock-out surveillance, AfterSale OS for Shopify warranty claims, and SlotWise for embeddable appointment booking. Direct client engineering engagements include 0-to-1 SaaS builds, React Native mobile apps, Shopify App Store software, and Fractional CTO leadership.',
  },
  {
    id: 'operations-ai',
    index: '02',
    title: 'Operations & Autonomous AI — TidyFlow + TidyAgent',
    subtitle: 'Field dispatch, React Native mobile tracking & LLM orchestration',
    description:
      'Architectural showcase of TidyFlow (tidyflowapp.com) and TidyAgent (agent.tidyflowapp.com) demonstrating real-time scheduling, crew GPS verification, QuickBooks sync, and guardrailed AI operations.',
    videoUrl: '/videos/operations-ai-tidyflow-tidyagent.mp4',
    posterUrl: '/videos/operations-ai-poster.jpg',
    captionsUrl: '/videos/operations-ai-tidyflow-tidyagent.vtt',
    isoDuration: 'PT12S',
    displayDuration: '0:12',
    focusLabel: 'Operations & AI Stack',
    transcript:
      'TidyFlow powers cleaning and field-service companies across web, iOS, and Android with recurring job dispatch, GPS arrival verification, photo checklists, payroll insights, and automated QuickBooks and Google Sheets synchronization. Paired with TidyAgent, teams automate repetitive status checks and dispatch triage with human-in-the-loop safety controls—built on TypeScript, React Native, Node.js, and Gemini tool calling by Suleman Khan.',
  },
  {
    id: 'commerce-scheduling',
    index: '03',
    title: 'Shopify Commerce & Scheduling Suite — Sync, Defense, Warranty & Booking',
    subtitle: 'TidySync · StockSentry · AfterSale OS · SlotWise',
    description:
      'Product showcase highlighting Hindara Labs e-commerce and scheduling platforms for Shopify merchants and modern service teams.',
    videoUrl: '/videos/shopify-commerce-scheduling-suite.mp4',
    posterUrl: '/videos/commerce-scheduling-poster.jpg',
    captionsUrl: '/videos/shopify-commerce-scheduling-suite.vtt',
    isoDuration: 'PT12S',
    displayDuration: '0:12',
    focusLabel: 'Shopify & Scheduling Stack',
    transcript:
      'Across e-commerce and service scheduling, Hindara Labs builds focused SaaS software including TidySync (published on the Shopify App Store for catalog and order synchronization), StockSentry (real-time SKU velocity monitoring and stock-out defense), AfterSale OS (branded Shopify warranty registration, PDF certificates, and claims portal), and SlotWise (embeddable appointment booking widget and team availability console).',
  },
];

