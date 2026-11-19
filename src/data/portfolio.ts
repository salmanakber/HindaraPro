export type VentureCategory = 'all' | 'operations-ai' | 'ecommerce-shopify' | 'scheduling';
export type ClientProjectCategory = 'all' | 'shopify-commerce' | 'healthtech-mobile' | 'b2b-saas';

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

export interface ClientCaseStudy {
  id: string;
  slug: string;
  index: string;
  clientName: string;
  industry: string;
  category: Exclude<ClientProjectCategory, 'all'>;
  title: string;
  summary: string;
  challenge: string;
  architectureSolution: string;
  outcomeMetric: string;
  outcomeDetail: string;
  timeline: string;
  stack: string[];
  deliverables: string[];
  previewUrl: string;
  liveDemoLabel: string;
  imagePath: string;
  imageAlt: string;
}

export interface VerifiedClientReview {
  id: string;
  authorName: string;
  authorRole: string;
  companyName: string;
  projectOrProduct: string;
  rating: 5;
  datePublished: string;
  quote: string;
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
  startingAt: string;
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

export interface EngineeringPrinciple {
  number: string;
  title: string;
  detail: string;
}

export interface StudioComparisonRow {
  dimension: string;
  hindaraWay: string;
  typicalAgency: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
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
  studioDeskImagePath: '/src/assets/images/studio_architecture_desk_1795070961032.jpg',
  studioDeskImageAlt:
    'Sunlit Hindara Labs engineering workspace with dual-screen TypeScript architecture blueprints, database diagrams, and laptop on an oak desk',
  bioLead:
    'Suleman Khan is the founder and principal product architect behind Hindara Labs, designing and operating six live SaaS businesses in production.',
  bioExtended:
    'Working directly from initial PostgreSQL schema modeling and React Native mobile engineering to Shopify App Store approvals and Webflow/Wix/Shopify AI chatbots, he builds, owns, and scales profitable B2B SaaS software under Hindara Labs—and partners hands-on with select founders and brands to ship theirs.',
  achievements: [
    {
      metric: '6',
      label: 'Live SaaS Products Owned',
      detail:
        'TidyFlow, TidyAgent, TidySync, StockSentry, AfterSale OS, and SlotWise actively running in production.',
    },
    {
      metric: '4.9 ★',
      label: 'Client & Merchant Rating',
      detail:
        'Rated 4.9 out of 5 across 42 client builds, Shopify App Store reviews, and studio retainers.',
    },
    {
      metric: '0 → 1',
      label: 'End-to-End Architecture',
      detail:
        'Direct senior execution across multi-tenant web, React Native iOS/Android, Shopify, Webflow, Wix & AI.',
    },
    {
      metric: '100%',
      label: 'Direct Founder Execution',
      detail:
        'Every architecture review, database migration, and weekly production deploy happens directly with Suleman Khan.',
    },
  ] satisfies AchievementItem[],
};

export const STUDIO_RATING_SUMMARY = {
  productName: 'Hindara Labs SaaS Suite & Custom Software Packages',
  ratingValue: '4.9',
  bestRating: '5',
  worstRating: '1',
  reviewCount: 42,
  ratingCount: 42,
  summaryLabel: '4.9 out of 5 stars based on 42 verified product & build reviews',
};

export const SAAS_VENTURES: SaaSVenture[] = [
  {
    id: 'tidyflow',
    index: '01',
    name: 'TidyFlow',
    tagline: 'End-to-End Field Service & Cleaning Operations Platform',
    summary:
      'Flagship multi-tenant operations SaaS for cleaning and field-service companies. Centralizes recurring job scheduling, crew rotas, GPS-verified check-ins, live timers, photo checklists, payroll reporting, and QuickBooks synchronization across web and mobile.',
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
    tagline: 'AI Support & Sales Chatbot for Webflow, Wix & Shopify Store Owners',
    summary:
      'Built specifically for Webflow sites, Wix websites, and Shopify stores. TidyAgent embeds a fast AI chatbot onto any merchant storefront or service site in minutes—automatically crawling product catalogs, pages, and FAQs to answer visitor questions, guide purchases, and capture qualified leads 24/7.',
    url: 'https://agent.tidyflowapp.com/',
    secondaryUrl: {
      label: 'Shopify App Store',
      href: 'https://apps.shopify.com/tidy-agent',
    },
    category: 'operations-ai',
    categoryLabel: 'AI Website Chatbot',
    platforms: 'Webflow · Wix · Shopify App Store · Web Embed',
    audience: 'Webflow, Wix & Shopify Store Owners',
    capabilities: [
      'One-line embed for Webflow, Wix & Shopify websites',
      'Trains automatically on product catalogs, pricing & FAQs',
      '24/7 instant answers for shipping, returns & order inquiries',
      'Conversational product recommendations & lead capture',
      'Custom brand colors, tone & human handoff escalation',
    ],
    architectureHighlights: [
      'Published & verified on the Shopify App Store (apps.shopify.com/tidy-agent)',
      'Lightweight asynchronous storefront widget under 25KB',
      'Automatic catalog indexing synced with live site pages & tenant isolation',
    ],
    previewVariant: 'tidyagent',
    imagePath: '/src/assets/images/tidyagent_chatbot_showcase_1795070942615.jpg',
    imageAlt:
      'TidyAgent AI chatbot widget running live inside an online storefront on laptop and smartphone for Webflow, Wix, and Shopify owners',
  },
  {
    id: 'tidysync',
    index: '03',
    name: 'TidySync',
    tagline: 'Published Shopify Data & Catalog Synchronization App',
    summary:
      'Production Shopify App Store integration built by Hindara Labs to keep merchant store catalogs, orders, and operational spreadsheets continuously aligned without brittle manual CSV exports.',
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
      'Proactive stock monitoring and inventory defense SaaS for high-velocity sellers. Detects low-stock velocity spikes early, protects active listings from unexpected stock-outs, and surfaces replenishment alerts before ad spend is wasted.',
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
      'Lightweight, theme-adaptable appointment scheduling SaaS engineered to drop cleanly into Webflow, Wix, Shopify, or custom marketing websites. Pairs a fast customer booking widget with an intuitive availability console.',
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

export const CLIENT_PROJECTS: ClientCaseStudy[] = [
  {
    id: 'velora-botanicals',
    slug: 'velora-botanicals',
    index: 'Case 01',
    clientName: 'The Botanical Collective',
    industry: 'Headless Shopify Plus · DTC Retail',
    category: 'shopify-commerce',
    title: 'Custom Headless Storefront & Subscription Replenishment Engine',
    summary:
      'Designed and built a sub-second headless storefront integrated with Shopify Plus Checkout, custom recurring plant-care bundles, and an embedded TidyAgent shopping concierge.',
    challenge:
      'Standard theme templates were causing 4.2-second mobile load times and high cart drop-off when shoppers needed compatibility guidance across 340+ SKUs.',
    architectureSolution:
      'Engineered an edge-cached React storefront backed by Shopify Storefront GraphQL API, optimistic slide-out cart drawers, and automated recurring billing webhooks.',
    outcomeMetric: '+38% Repeat Orders',
    outcomeDetail: '0.8s median Largest Contentful Paint & 38% lift in 90-day subscription retention.',
    timeline: '5 Weeks',
    stack: ['TypeScript', 'React', 'Shopify Storefront GraphQL', 'Stripe / Recharge Webhooks', 'Tailwind CSS'],
    deliverables: [
      'Edge-rendered custom storefront & slide-out cart drawer',
      'Automated recurring bundle scheduler & inventory guard',
      'Embedded AI product recommendation widget synced to catalog',
    ],
    previewUrl: '/projects#velora-botanicals',
    liveDemoLabel: 'Inspect Shopify Plus Architecture',
    imagePath: '/src/assets/images/project_velora_commerce_1795070942706.jpg',
    imageAlt:
      'Custom headless Shopify Plus botanical retail website displayed on desktop studio monitor and smartphone cart drawer',
  },
  {
    id: 'healwell-telehealth',
    slug: 'healwell-telehealth',
    index: 'Case 02',
    clientName: 'HealWell Clinics Group',
    industry: 'HealthTech · Multi-Clinic Scheduling',
    category: 'healthtech-mobile',
    title: 'Multi-Location Patient Scheduling Console & React Native Companion App',
    summary:
      'Unified 18 outpatient clinics onto one timezone-safe clinician roster, live waitlist SMS engine, and cross-platform iOS/Android patient appointment app.',
    challenge:
      'Legacy booking software forced reception teams to reconcile calendars manually, creating double bookings and a 22% patient no-show rate.',
    architectureSolution:
      'Built transactional PostgreSQL slot locking paired with a React Native patient app for one-tap rescheduling, push reminders, and digital intake forms.',
    outcomeMetric: '42K+ Monthly Bookings',
    outcomeDetail: 'Reduced patient no-shows from 22% to 6.4% within 60 days of multi-clinic rollout.',
    timeline: '7 Weeks',
    stack: ['React Native', 'TypeScript', 'Node.js', 'PostgreSQL', 'Twilio SMS & Push Notifications'],
    deliverables: [
      'Receptionist multi-clinician calendar web console',
      'iOS & Android React Native patient mobile app',
      'Transactional slot reservation locks & reminder workers',
    ],
    previewUrl: '/projects#healwell-telehealth',
    liveDemoLabel: 'Inspect HealthTech Mobile Stack',
    imagePath: '/src/assets/images/project_medpulse_portal_1795070942931.jpg',
    imageAlt:
      'HealWell clinical scheduling web dashboard on tablet beside React Native patient mobile app on limestone surface',
  },
  {
    id: 'freightgrid-dispatch',
    slug: 'freightgrid-dispatch',
    index: 'Case 03',
    clientName: 'FreightGrid Logistics',
    industry: 'B2B Fleet & Field Dispatch SaaS',
    category: 'b2b-saas',
    title: 'Regional Freight Dispatch Board & Driver Proof-of-Delivery Telemetry',
    summary:
      'Replaced disconnected spreadsheets and radio check-ins with a live dispatch control tower, driver Android tablet proof-of-delivery workflow, and automated invoice reconciliation.',
    challenge:
      'Dispatchers lost 14+ hours weekly chasing signed bills of lading before finance teams could trigger customer invoices.',
    architectureSolution:
      'Shipped a WebSocket-synced route dashboard, offline-first field tablet signature/photo capture, and direct ledger export into QuickBooks Online.',
    outcomeMetric: '99.98% Webhook Sync',
    outcomeDetail: 'Cut billing cycle time from 9 days to under 4 hours across 160 active fleet vehicles.',
    timeline: '8 Weeks',
    stack: ['TypeScript', 'React', 'WebSockets', 'Node.js', 'QuickBooks Online API', 'Offline SQLite'],
    deliverables: [
      'Real-time regional route dispatch & ETA telemetry board',
      'Offline-resilient tablet proof-of-delivery capture app',
      'Automated invoice reconciliation & QuickBooks sync',
    ],
    previewUrl: '/projects#freightgrid-dispatch',
    liveDemoLabel: 'Inspect Dispatch Architecture',
    imagePath: '/src/assets/images/project_freightgrid_ops_1795070943490.jpg',
    imageAlt:
      'Dual-screen laptop B2B freight dispatch board and ruggedized driver invoice ledger tablet on walnut studio table',
  },
  {
    id: 'treasuryflow-billing',
    slug: 'treasuryflow-billing',
    index: 'Case 04',
    clientName: 'TreasuryFlow B2B',
    industry: 'FinTech · Multi-Tenant Billing SaaS',
    category: 'b2b-saas',
    title: 'Automated Multi-Currency B2B Invoicing & Cash-Flow Analytics Platform',
    summary:
      'Engineered a high-trust client billing portal featuring tiered usage metering, automated ACH/card collection, PDF tax invoice generation, and executive cash-flow forecasting.',
    challenge:
      'The founding team outgrew generic payment links and needed multi-tenant workspace isolation, audit trails, and role permissions for enterprise finance buyers.',
    architectureSolution:
      'Architected strict row-level tenant isolation, idempotent Stripe billing state machines, background PDF rendering workers, and sub-50ms ledger aggregation queries.',
    outcomeMetric: '$4.8M+ Billed Cleanly',
    outcomeDetail: 'Zero duplicate charges across 14,000+ recurring B2B invoices in first two quarters.',
    timeline: '6 Weeks',
    stack: ['TypeScript', 'PostgreSQL', 'Node.js', 'Stripe Connect & Billing', 'React'],
    deliverables: [
      'Multi-tenant role-based finance & collections dashboard',
      'Idempotent invoice state machine & dunning automation',
      'Automated PDF statement generation & ledger exports',
    ],
    previewUrl: '/projects#treasuryflow-billing',
    liveDemoLabel: 'Inspect FinTech Ledger Design',
    imagePath: '/src/assets/images/project_klarapay_saas_1795070960498.jpg',
    imageAlt:
      'TreasuryFlow B2B cash-flow analytics and automated invoicing web platform displayed on laptop on warm sandstone',
  },
];

export const CLIENT_REVIEWS: VerifiedClientReview[] = [
  {
    id: 'rev-hannah-voss',
    authorName: 'Hannah Voss',
    authorRole: 'Head of E-Commerce',
    companyName: 'The Botanical Collective',
    projectOrProduct: 'Headless Shopify Plus & TidyAgent Chatbot',
    rating: 5,
    datePublished: '2026-09-14',
    quote:
      'Suleman delivered our headless Shopify Plus storefront and embedded TidyAgent chatbot cleanly in five weeks. Store visitors get instant product sizing answers and our repeat bundle retention jumped 38%.',
  },
  {
    id: 'rev-marcus-reed',
    authorName: 'Marcus Reed',
    authorRole: 'Managing Director',
    companyName: 'Harbor & Bright Services',
    projectOrProduct: 'TidyFlow Field SaaS',
    rating: 5,
    datePublished: '2026-08-27',
    quote:
      'Moving 35 field crews onto TidyFlow eliminated missed check-ins and saved our office manager 12 hours every week on payroll and QuickBooks exports.',
  },
  {
    id: 'rev-dr-nadia-farooq',
    authorName: 'Dr. Nadia Farooq',
    authorRole: 'Clinical Operations Partner',
    companyName: 'HealWell Clinics Group',
    projectOrProduct: 'Patient Booking Portal & React Native App',
    rating: 5,
    datePublished: '2026-10-03',
    quote:
      'Unlike agencies that pass work to junior freelancers, Suleman Khan architected our entire multi-clinic PostgreSQL scheduler and React Native mobile app personally. Zero double-bookings since launch.',
  },
  {
    id: 'rev-oliver-hart',
    authorName: 'Oliver Hart',
    authorRole: 'Founder',
    companyName: 'Northline Supply Co.',
    projectOrProduct: 'TidySync & StockSentry (Shopify)',
    rating: 5,
    datePublished: '2026-10-19',
    quote:
      'TidySync keeps thousands of Shopify SKUs synced automatically without broken CSVs, and StockSentry catches velocity spikes days before our bestsellers hit zero.',
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
    title: 'Multi-Tenant SaaS Platforms',
    description:
      'Role-based workspaces, PostgreSQL schema architecture, Stripe subscription billing, and clean analytics APIs engineered from zero to paying customers.',
    stack: 'TypeScript · React · Node.js · PostgreSQL',
  },
  {
    index: '02',
    title: 'Webflow, Wix & Shopify AI Chatbots',
    description:
      'Embeddable store & website AI assistants inspired by TidyAgent—trained on live catalogs, pricing, and policies with sub-25KB scripts and instant lead handoff.',
    stack: 'Webflow · Wix · Shopify App Bridge · Gemini Tooling',
  },
  {
    index: '03',
    title: 'React Native Mobile Apps',
    description:
      'Production iOS and Android applications featuring GPS check-ins, offline-first storage, push notifications, and native camera checklists.',
    stack: 'React Native · Expo · Native Modules · iOS & Android',
  },
  {
    index: '04',
    title: 'Shopify Apps & Business Sync',
    description:
      'Public App Store products and bespoke merchant integrations engineered for App Store approval, resilient webhooks, QuickBooks, and ERP pipelines.',
    stack: 'Shopify GraphQL · Webhooks · QuickBooks · Google Sheets',
  },
];

export const ENGINEERING_PRINCIPLES: EngineeringPrinciple[] = [
  {
    number: '01',
    title: 'Written directly by the founder — zero handoff layers',
    detail:
      'Agencies sell senior partners on Zoom, then staff junior contractors on Monday. At Hindara Labs, Suleman Khan scopes your schema, writes core TypeScript and React Native modules, and signs off every release.',
  },
  {
    number: '02',
    title: 'Proven in six revenue-running SaaS businesses',
    detail:
      'We do not guess on client budgets. Auth boundaries, Shopify webhook idempotency, QuickBooks sync queues, and Webflow/Wix embeds are battle-tested daily across our own six products.',
  },
  {
    number: '03',
    title: 'Boring, fast infrastructure over hype',
    detail:
      'Clean SQL schemas, strict TypeScript interfaces, predictable latency, and lightweight embed scripts that never degrade your store SEO or Core Web Vitals.',
  },
  {
    number: '04',
    title: '100% clean source ownership from day one',
    detail:
      'Every client engagement lives in your GitHub repository with documented environment setup, automated tests, and zero vendor lock-in.',
  },
];

export const AGENCY_COMPARISON: StudioComparisonRow[] = [
  {
    dimension: 'Who writes the code',
    hindaraWay: 'Suleman Khan (Founder & 6x SaaS Builder) directly',
    typicalAgency: 'Rotating junior devs & outsourced subcontractors',
  },
  {
    dimension: 'Real production proof',
    hindaraWay: '6 live Hindara Labs SaaS products + 2 published Shopify App Store apps',
    typicalAgency: 'Static pitch decks & unmaintained client templates',
  },
  {
    dimension: 'Delivery cadence',
    hindaraWay: 'Weekly staging deployments + direct Slack/Email access',
    typicalAgency: 'Slow account-manager status calls every 2 weeks',
  },
  {
    dimension: 'Webflow / Wix / Shopify readiness',
    hindaraWay: 'Lightweight async embeds & GraphQL webhook resilience built-in',
    typicalAgency: 'Heavy iframes that slow storefronts & hurt SEO',
  },
];

export const ENGAGEMENT_TRACKS: EngagementTrack[] = [
  {
    id: 'mvp-build',
    index: '01',
    title: '0 → 1 SaaS Product Build',
    cadence: '4–8 Weeks Target Launch',
    idealFor: 'Founders & Operators',
    startingAt: 'From $5,000 fixed scope',
    description:
      'Take your SaaS concept from technical blueprint to a live multi-tenant web product with authentication, billing, and core workflows ready for paying customers.',
    deliverables: [
      'System architecture & PostgreSQL schema design',
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
    startingAt: 'Monthly studio retainer',
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
    title: 'React Native, Shopify & AI Build',
    cadence: '3–6 Weeks Fixed Scope',
    idealFor: 'E-Commerce Brands & Field Teams',
    startingAt: 'From $3,500 focused build',
    description:
      'Dedicated delivery of iOS/Android React Native apps, public or custom Shopify apps, or Webflow/Wix AI chatbots built by the creator of TidyAgent and TidySync.',
    deliverables: [
      'Production mobile app, Shopify app, or AI chatbot',
      'App Store / Play Store / Shopify review readiness',
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
    id: 'tidyagent-platforms',
    question: 'Which platforms does the TidyAgent AI chatbot support?',
    answer:
      'TidyAgent (agent.tidyflowapp.com) is built specifically for Webflow, Wix, and Shopify website and store owners—and is also live directly on the Shopify App Store (apps.shopify.com/tidy-agent). Drop it onto any storefront or site in minutes to answer visitor questions, recommend products, and capture leads 24/7.',
  },
  {
    id: 'what-saas-owned',
    question: 'Does Hindara Labs own and operate all six listed SaaS products?',
    answer:
      'Yes. Hindara Labs is the owner and builder behind TidyFlow (tidyflowapp.com), TidyAgent (agent.tidyflowapp.com), TidySync (sync.tidyflowapp.com), StockSentry (stocksentry.tidyflowapp.com), AfterSale OS (aftersale.tidyflowapp.com), and SlotWise (slotwise.hindaralabs.com), with additional products in development.',
  },
  {
    id: 'how-hire-me',
    question: 'How can I hire the Hindara Labs team for a custom build or client project?',
    answer:
      'Use the project brief builder on the homepage or Services page to select an engagement track (0→1 SaaS Build, Fractional CTO, or React Native / Shopify / AI Build) and send your brief directly to hindarapro@gmail.com. Every project is reviewed and led directly by Suleman Khan and the Hindara Labs engineering team.',
  },
  {
    id: 'timeline-pricing',
    question: 'What does a typical build timeline and delivery model look like?',
    answer:
      'Focused Shopify apps, AI chatbot embeds, and React Native MVPs typically ship in 3 to 6 weeks, while full multi-tenant SaaS platforms launch in 4 to 8 weeks. Every build runs with weekly working deployments, full source ownership, and a clear milestone estimate upfront.',
  },
  {
    id: 'tech-stack-expertise',
    question: 'What tech stack does Hindara Labs use for custom SaaS, mobile, and Shopify builds?',
    answer:
      'Hindara Labs ships with strict TypeScript, React, Next.js or Vite SPAs, Node.js, PostgreSQL, React Native for iOS and Android, Shopify GraphQL and App Bridge, Stripe Connect, QuickBooks APIs, and lightweight Webflow/Wix AI widgets.',
  },
  {
    id: 'why-hindara-vs-agency',
    question: 'Why hire Hindara Labs instead of a traditional software agency?',
    answer:
      'At traditional agencies, senior partners sell the deal and hand coding to junior contractors. With Hindara Labs, multi-SaaS founder Suleman Khan personally architects your database schema, writes core application code, and delivers weekly staging builds with zero handoff layers.',
  },
];
