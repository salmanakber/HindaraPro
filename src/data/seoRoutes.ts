export type StudioRoute = '/' | '/projects' | '/about' | '/services' | '/privacy' | '/terms';

export interface RouteSeoMetadata {
  route: StudioRoute;
  title: string;
  description: string;
  keywords: string;
  canonicalUrl: string;
  breadcrumbName: string;
}

const BASE_DOMAIN = 'https://hindaralabs.com';

export function normalizeRoute(pathname: string): StudioRoute {
  const clean = pathname.split('?')[0].toLowerCase().replace(/\/+$/, '') || '/';
  if (clean === '/projects' || clean === '/case-studies' || clean === '/portfolio') {
    return '/projects';
  }
  if (clean === '/about') return '/about';
  if (clean === '/services' || clean === '/hire') return '/services';
  if (clean === '/privacy' || clean === '/privacy-policy') return '/privacy';
  if (clean === '/terms' || clean === '/terms-of-service') return '/terms';
  return '/';
}

export const ROUTE_SEO: Record<StudioRoute, RouteSeoMetadata> = {
  '/': {
    route: '/',
    title: 'Hindara Labs | Suleman Khan – SaaS Studio & Custom Builds',
    description:
      'Hindara Labs is the SaaS studio founded by Suleman Khan (Salman Akber / Salman Khan), owning TidyFlow, TidyAgent (Webflow, Wix & Shopify AI chatbot), TidySync, StockSentry, AfterSale OS & SlotWise. Rated 4.9/5.',
    keywords:
      'Hindara Labs, Suleman Khan, Salman Akber, Salman Khan, SaaS venture studio, custom SaaS development, hire SaaS developer, hire Suleman Khan, TidyFlow, TidyAgent, Webflow AI chatbot, Wix AI chatbot, Shopify AI chatbot, TidySync Shopify app, StockSentry, AfterSale OS, SlotWise booking widget, React Native developer, Shopify app developer, Fractional CTO',
    canonicalUrl: `${BASE_DOMAIN}/`,
    breadcrumbName: 'Home',
  },
  '/projects': {
    route: '/projects',
    title: 'Client Work & SaaS Case Studies | Hindara Labs – Suleman Khan',
    description:
      'Explore Hindara Labs client case studies and 6 live SaaS products built by Suleman Khan (Salman Akber): headless Shopify Plus, HealthTech React Native apps, B2B logistics, and FinTech billing.',
    keywords:
      'Hindara Labs portfolio, Suleman Khan case studies, Salman Akber portfolio, headless Shopify Plus developer, React Native HealthTech app, custom B2B SaaS architecture, Stripe Connect billing portal, QuickBooks sync engineer, Webflow Shopify case study',
    canonicalUrl: `${BASE_DOMAIN}/projects`,
    breadcrumbName: 'Client Work & Case Studies',
  },
  '/services': {
    route: '/services',
    title: 'Hire Suleman Khan | SaaS, Shopify & Webflow/Wix AI Development',
    description:
      'Hire Suleman Khan (Salman Akber) at Hindara Labs for 0-to-1 SaaS MVP builds, Webflow/Wix/Shopify AI chatbots, public Shopify apps, React Native mobile apps, and Fractional CTO retainers.',
    keywords:
      'hire SaaS architect, hire Suleman Khan, hire Salman Akber, custom SaaS MVP agency alternative, Shopify App Store developer, Webflow AI chatbot integration, Wix AI chatbot builder, React Native iOS Android freelancer, Fractional CTO SaaS',
    canonicalUrl: `${BASE_DOMAIN}/services`,
    breadcrumbName: 'Services & Hiring',
  },
  '/about': {
    route: '/about',
    title: 'About Suleman Khan & Engineering Standards | Hindara Labs',
    description:
      'Meet Suleman Khan (also searched as Salman Akber / Salman Khan), Founder & Principal Architect of Hindara Labs, operating 6 live B2B SaaS products with clean TypeScript & PostgreSQL engineering.',
    keywords:
      'Suleman Khan, Salman Akber, Salman Khan, Hindara Labs founder, multi-SaaS entrepreneur, principal software architect, TypeScript PostgreSQL engineer, SaaS studio engineering standards',
    canonicalUrl: `${BASE_DOMAIN}/about`,
    breadcrumbName: 'About Suleman Khan',
  },
  '/privacy': {
    route: '/privacy',
    title: 'Privacy Policy | Hindara Labs – Suleman Khan',
    description:
      'Privacy Policy explaining how Hindara Labs (hindaralabs.com) and Suleman Khan handle project briefs, inquiry emails, and studio communications.',
    keywords: 'Hindara Labs privacy policy, Suleman Khan contact privacy',
    canonicalUrl: `${BASE_DOMAIN}/privacy`,
    breadcrumbName: 'Privacy Policy',
  },
  '/terms': {
    route: '/terms',
    title: 'Terms of Service | Hindara Labs – Suleman Khan',
    description:
      'Terms of Service governing hindaralabs.com, SaaS portfolio previews, and custom engineering engagements with Hindara Labs and Suleman Khan.',
    keywords: 'Hindara Labs terms of service, Suleman Khan studio terms',
    canonicalUrl: `${BASE_DOMAIN}/terms`,
    breadcrumbName: 'Terms of Service',
  },
};

function escapeHtmlAttr(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

export function buildBreadcrumbJsonLd(route: StudioRoute): string {
  const meta = ROUTE_SEO[route];
  const itemListElement =
    route === '/'
      ? [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Hindara Labs',
            item: `${BASE_DOMAIN}/`,
          },
        ]
      : [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Hindara Labs',
            item: `${BASE_DOMAIN}/`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: meta.breadcrumbName,
            item: meta.canonicalUrl,
          },
        ];

  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement,
  });
}

export function applyRouteSeoToHtml(html: string, pathname: string): string {
  const route = normalizeRoute(pathname);
  const meta = ROUTE_SEO[route];
  const safeTitle = escapeHtmlAttr(meta.title);
  const safeDesc = escapeHtmlAttr(meta.description);
  const safeKeywords = escapeHtmlAttr(meta.keywords);
  const safeCanonical = escapeHtmlAttr(meta.canonicalUrl);

  let updated = html;
  updated = updated.replace(/<title>[\s\S]*?<\/title>/i, `<title>${safeTitle}</title>`);
  updated = updated.replace(
    /<meta\s+name="description"\s+content="[\s\S]*?"\s*\/>/i,
    `<meta name="description" content="${safeDesc}" />`
  );
  updated = updated.replace(
    /<meta\s+name="keywords"\s+content="[\s\S]*?"\s*\/>/i,
    `<meta name="keywords" content="${safeKeywords}" />`
  );
  updated = updated.replace(
    /<link\s+rel="canonical"\s+href="[\s\S]*?"\s*\/>/i,
    `<link rel="canonical" href="${safeCanonical}" />`
  );
  updated = updated.replace(
    /<meta\s+property="og:title"\s+content="[\s\S]*?"\s*\/>/i,
    `<meta property="og:title" content="${safeTitle}" />`
  );
  updated = updated.replace(
    /<meta\s+property="og:description"\s+content="[\s\S]*?"\s*\/>/i,
    `<meta property="og:description" content="${safeDesc}" />`
  );
  updated = updated.replace(
    /<meta\s+property="og:url"\s+content="[\s\S]*?"\s*\/>/i,
    `<meta property="og:url" content="${safeCanonical}" />`
  );
  updated = updated.replace(
    /<meta\s+name="twitter:title"\s+content="[\s\S]*?"\s*\/>/i,
    `<meta name="twitter:title" content="${safeTitle}" />`
  );
  updated = updated.replace(
    /<meta\s+name="twitter:description"\s+content="[\s\S]*?"\s*\/>/i,
    `<meta name="twitter:description" content="${safeDesc}" />`
  );

  const breadcrumbScript = `<script id="route-breadcrumb-ld" type="application/ld+json">${buildBreadcrumbJsonLd(route)}</script>`;
  if (/<script id="route-breadcrumb-ld"[\s\S]*?<\/script>/i.test(updated)) {
    updated = updated.replace(
      /<script id="route-breadcrumb-ld"[\s\S]*?<\/script>/i,
      breadcrumbScript
    );
  } else {
    updated = updated.replace('</head>', `    ${breadcrumbScript}\n  </head>`);
  }

  return updated;
}
