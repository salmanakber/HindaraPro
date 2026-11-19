import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {
  CLIENT_PROJECTS,
  CLIENT_REVIEWS,
  FAQ_ITEMS,
  SAAS_VENTURES,
  STUDIO_RATING_SUMMARY,
} from '../data/portfolio.ts';
import { applyRouteSeoToHtml, normalizeRoute, ROUTE_SEO } from '../data/seoRoutes.ts';
import {
  ASSISTANT_LANGUAGES,
  buildClientCaseFocusAction,
  buildHireBriefDraftAction,
  buildHireScopeSummary,
  buildScopeRecommendationAction,
  buildVentureSpotlightAction,
  filterClientProjects,
  filterVentures,
  getLocalizedStarterPrompts,
  isRtlText,
  recommendEngagementScope,
  resolveAssistantLanguage,
  sanitizeSpeechText,
  validateHireBrief,
  type HireBriefInput,
} from './portfolioLogic.ts';
import {
  computeExplodedPosition,
  ECOSYSTEM_NODES,
  getVentureCameraPose,
} from './ecosystem3d.ts';

test('filterVentures returns all 6 SaaS products with accurate TidyAgent Webflow/Wix/Shopify copy', () => {
  const result = filterVentures(SAAS_VENTURES, 'all', '');
  assert.equal(result.length, 6);
  assert.deepEqual(
    result.map((v) => v.url),
    [
      'https://tidyflowapp.com/',
      'https://agent.tidyflowapp.com/',
      'https://sync.tidyflowapp.com/',
      'https://stocksentry.tidyflowapp.com/',
      'https://aftersale.tidyflowapp.com/',
      'https://slotwise.hindaralabs.com/',
    ]
  );

  const tidyAgent = result.find((v) => v.id === 'tidyagent');
  assert.ok(tidyAgent);
  assert.ok(tidyAgent.tagline.includes('Webflow'));
  assert.ok(tidyAgent.tagline.includes('Wix'));
  assert.ok(tidyAgent.tagline.includes('Shopify'));
  assert.equal(tidyAgent.secondaryUrl?.href, 'https://apps.shopify.com/tidy-agent');
});

test('filterVentures filters accurately by category and search keyword', () => {
  const ecom = filterVentures(SAAS_VENTURES, 'ecommerce-shopify', '');
  assert.equal(ecom.length, 3);
  assert.deepEqual(
    ecom.map((v) => v.id),
    ['tidysync', 'stocksentry', 'aftersale']
  );

  const webflowSearch = filterVentures(SAAS_VENTURES, 'all', 'Webflow');
  assert.ok(webflowSearch.some((v) => v.id === 'tidyagent'));

  const quickbooksSearch = filterVentures(SAAS_VENTURES, 'all', 'QuickBooks');
  assert.equal(quickbooksSearch.length, 1);
  assert.equal(quickbooksSearch[0].id, 'tidyflow');

  const stockSearchAlt = filterVentures(SAAS_VENTURES, 'ecommerce-shopify', 'stock-outs');
  assert.equal(stockSearchAlt.length, 1);
  assert.equal(stockSearchAlt[0].id, 'stocksentry');
});

test('CLIENT_PROJECTS and filterClientProjects maintain unique slugs, images, and category filters', () => {
  assert.equal(CLIENT_PROJECTS.length, 4);
  const allProjects = filterClientProjects(CLIENT_PROJECTS, 'all');
  assert.equal(allProjects.length, 4);

  const shopifyProjects = filterClientProjects(CLIENT_PROJECTS, 'shopify-commerce');
  assert.equal(shopifyProjects.length, 1);
  assert.equal(shopifyProjects[0].id, 'velora-botanicals');

  const b2bProjects = filterClientProjects(CLIENT_PROJECTS, 'b2b-saas');
  assert.equal(b2bProjects.length, 2);

  for (const proj of CLIENT_PROJECTS) {
    assert.ok(proj.imagePath.startsWith('/src/assets/images/'));
    assert.ok(proj.previewUrl.startsWith('/projects#'));
    assert.ok(!proj.summary.includes('Salman'));
  }
});

test('CLIENT_REVIEWS and STUDIO_RATING_SUMMARY contain valid 5-star review parity with zero alias leaks', () => {
  assert.equal(CLIENT_REVIEWS.length, 4);
  assert.equal(STUDIO_RATING_SUMMARY.ratingValue, '4.9');
  assert.equal(STUDIO_RATING_SUMMARY.bestRating, '5');
  assert.ok(STUDIO_RATING_SUMMARY.reviewCount >= 40);

  for (const rev of CLIENT_REVIEWS) {
    assert.equal(rev.rating, 5);
    assert.ok(!rev.quote.includes('Salman'));
    assert.ok(!rev.authorName.includes('Salman'));
  }
});

test('validateHireBrief rejects empty or invalid inputs and accepts complete briefs', () => {
  const invalidInput: HireBriefInput = {
    clientName: 'A',
    clientEmail: 'not-an-email',
    companyOrProject: '',
    trackId: 'mvp-build',
    timeline: 'immediate',
    budgetRange: '5k-15k',
    projectGoals: 'Too short',
  };

  const invalidResult = validateHireBrief(invalidInput);
  assert.equal(invalidResult.valid, false);
  assert.ok(invalidResult.errors.clientName);
  assert.ok(invalidResult.errors.clientEmail);
  assert.ok(invalidResult.errors.projectGoals);

  const validInput: HireBriefInput = {
    ...invalidInput,
    clientName: 'Alex Rivera',
    clientEmail: 'alex@acme-ops.io',
    companyOrProject: 'Acme Ops',
    projectGoals: 'Build a multi-tenant field logistics dashboard with React Native mobile sync.',
  };

  const validResult = validateHireBrief(validInput);
  assert.equal(validResult.valid, true);
  assert.deepEqual(validResult.errors, {});
});

test('buildHireScopeSummary generates structured brief details and mailto URI', () => {
  const input: HireBriefInput = {
    clientName: 'Maya Lin',
    clientEmail: 'maya@brandforge.co',
    companyOrProject: 'BrandForge Retail',
    trackId: 'mobile-shopify',
    timeline: 'next-month',
    budgetRange: '5k-15k',
    projectGoals: 'Launch an embedded Shopify warranty & returns app with automated email updates.',
  };

  const summary = buildHireScopeSummary(input);
  assert.ok(summary.briefId.startsWith('HL-'));
  assert.equal(summary.trackTitle, 'React Native, Shopify & AI Build');
  assert.equal(summary.deliverables.length, 3);
  assert.ok(summary.mailtoHref.startsWith('mailto:hindarapro@gmail.com?subject='));
  assert.ok(summary.formattedBriefText.includes('Suleman Khan'));
  assert.ok(!summary.formattedBriefText.includes('Salman'));
  assert.ok(summary.formattedBriefText.includes('BrandForge Retail'));
});

test('ecosystem3d positions all 6 ventures in distinct orbital coordinates and resolves camera poses', () => {
  assert.equal(ECOSYSTEM_NODES.length, 6);
  const exploded = computeExplodedPosition([2, 1, -2], [0.5, 0.75, -0.5], 1);
  assert.deepEqual(exploded, [2.5, 1.75, -2.5]);
  const clamped = computeExplodedPosition([2, 1, -2], [0.5, 0.75, -0.5], 5);
  assert.deepEqual(clamped, [2.5, 1.75, -2.5]);

  const overview = getVentureCameraPose(null);
  assert.equal(overview.node, null);
  assert.equal(overview.cameraPos.length, 3);

  const tidyflowPose = getVentureCameraPose('tidyflow');
  assert.ok(tidyflowPose.node);
  assert.equal(tidyflowPose.node.domainLabel, 'tidyflowapp.com');
});

test('recommendEngagementScope selects optimal engagement track and budget from surfaces and stage', () => {
  const cto = recommendEngagementScope(['web-saas', 'ai-agent'], 'scale-existing');
  assert.equal(cto.trackId, 'fractional-cto');
  assert.equal(cto.suggestedBudgetRange, 'retainer');

  const shopify = recommendEngagementScope(['shopify-app'], 'idea-mvp');
  assert.equal(shopify.trackId, 'mobile-shopify');
  assert.equal(shopify.suggestedBudgetRange, '5k-15k');

  const multiMvp = recommendEngagementScope(['web-saas', 'mobile-app'], 'idea-mvp');
  assert.equal(multiMvp.trackId, 'mvp-build');
  assert.equal(multiMvp.suggestedBudgetRange, '15k-plus');
});

test('assistant tool builders sanitize inputs and resolve real studio and case records', () => {
  const scopeAction = buildScopeRecommendationAction({
    surfaces: ['shopify-app', 'mobile-app', 'invalid-surface'],
    stage: 'idea-mvp',
    companyOrProject: 'Kite Commerce',
    customSummary: 'Build a Shopify warranty portal with React Native barcode scanning.',
  });
  assert.equal(scopeAction.type, 'scope_recommendation');
  assert.deepEqual(scopeAction.surfaces, ['shopify-app', 'mobile-app']);
  assert.equal(scopeAction.recommendation.trackId, 'mobile-shopify');
  assert.equal(scopeAction.companyOrProject, 'Kite Commerce');

  const spotlight = buildVentureSpotlightAction(
    ['tidysync', 'tidyagent', 'unknown-app', 'tidysync'],
    'Fits Shopify and Webflow store automation.'
  );
  assert.ok(spotlight);
  assert.equal(spotlight.ventures.length, 2);
  assert.equal(spotlight.ventures[0].url, 'https://sync.tidyflowapp.com/');
  assert.equal(spotlight.ventures[1].url, 'https://agent.tidyflowapp.com/');

  const incompleteBrief = buildHireBriefDraftAction({
    trackId: 'fractional-cto',
    projectGoals: 'Short note',
  });
  assert.equal(incompleteBrief.readyToSend, false);
  assert.equal(incompleteBrief.draft.trackId, 'fractional-cto');

  const readyBrief = buildHireBriefDraftAction({
    clientName: 'Dana Park',
    clientEmail: 'dana@northstar.io',
    companyOrProject: 'Northstar Ops',
    trackId: 'mvp-build',
    timeline: 'immediate',
    budgetRange: '15k-plus',
    projectGoals: 'Build a multi-tenant AI scheduling SaaS with QuickBooks sync and mobile GPS.',
  });
  assert.equal(readyBrief.readyToSend, true);

  const caseAction = buildClientCaseFocusAction('healwell-telehealth');
  assert.equal(caseAction.project.id, 'healwell-telehealth');
  assert.equal(caseAction.project.previewUrl, '/projects#healwell-telehealth');

  const spoken = sanitizeSpeechText(
    '**TidyFlow** (https://tidyflowapp.com/) and Salman Akber lead field ops.'
  );
  assert.ok(!spoken.includes('**'));
  assert.ok(!spoken.includes('https://'));
  assert.ok(spoken.includes('tidyflowapp.com'));
  assert.ok(spoken.includes('Suleman Khan'));
  assert.ok(!spoken.includes('Salman Akber'));
});

test('multilingual assistant configuration supports RTL, auto-detect, localized prompts, and Unicode TTS text', () => {
  assert.ok(ASSISTANT_LANGUAGES.length >= 9);
  assert.equal(resolveAssistantLanguage('unknown-code').code, 'auto');

  const urdu = resolveAssistantLanguage('ur');
  assert.equal(urdu.isRtl, true);
  assert.equal(urdu.englishName, 'Urdu');

  const spanish = resolveAssistantLanguage('es');
  assert.equal(spanish.isRtl, false);
  assert.equal(spanish.englishName, 'Spanish');

  assert.equal(isRtlText('السلام علیکم'), true);
  assert.equal(isRtlText('Hola desde Hindara Labs'), false);

  const urduPrompts = getLocalizedStarterPrompts('ur', 'advisor');
  assert.ok(urduPrompts.length >= 3);
  assert.ok(urduPrompts.some((p) => isRtlText(p)));

  const autoPrompts = getLocalizedStarterPrompts('auto', 'advisor');
  assert.ok(autoPrompts.length >= 3);

  const urduSpeech = sanitizeSpeechText(
    '**TidyFlow** (https://tidyflowapp.com/) فیلڈ سروس کے لیے بہترین ہے۔'
  );
  assert.ok(urduSpeech.includes('فیلڈ سروس'));
  assert.ok(urduSpeech.includes('tidyflowapp.com'));
  assert.ok(!urduSpeech.includes('**'));
});

test('applyRouteSeoToHtml injects unique canonical, OG/Twitter tags, BreadcrumbList, and Google Rich Results compliance', () => {
  assert.equal(normalizeRoute('/hire'), '/services');
  assert.equal(normalizeRoute('/case-studies/'), '/projects');

  const rawHtml = fs.readFileSync('index.html', 'utf-8');
  const servicesHtml = applyRouteSeoToHtml(rawHtml, '/services');
  assert.ok(
    servicesHtml.includes(
      `<title>${ROUTE_SEO['/services'].title.replaceAll('&', '&amp;')}</title>`
    )
  );
  assert.ok(servicesHtml.includes('<link rel="canonical" href="https://hindaralabs.com/services" />'));
  assert.ok(servicesHtml.includes('<meta property="og:url" content="https://hindaralabs.com/services" />'));
  assert.ok(servicesHtml.includes('id="route-breadcrumb-ld"'));

  const projectsHtml = applyRouteSeoToHtml(rawHtml, '/projects');
  assert.ok(projectsHtml.includes('<link rel="canonical" href="https://hindaralabs.com/projects" />'));
  assert.ok(projectsHtml.includes('Webflow AI chatbot') || rawHtml.includes('Webflow AI chatbot'));

  // Validate JSON-LD Product & SoftwareApplication nodes include offers + aggregateRating (required by Google Rich Results)
  const ldMatch = rawHtml.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  assert.ok(ldMatch);
  const parsed = JSON.parse(ldMatch[1]) as { '@graph': Array<Record<string, unknown>> };
  const productNode = parsed['@graph'].find((n) => n['@type'] === 'Product');
  assert.ok(productNode);
  assert.ok(productNode.offers);
  assert.ok(productNode.aggregateRating);
  assert.equal((productNode.review as unknown[]).length, CLIENT_REVIEWS.length);

  const softwareNodes = parsed['@graph'].filter((n) => n['@type'] === 'SoftwareApplication');
  assert.equal(softwareNodes.length, 6);
  for (const sw of softwareNodes) {
    assert.ok(sw.offers, `Missing offers on SoftwareApplication ${String(sw.name)}`);
  }

  const profService = parsed['@graph'].find((n) => n['@type'] === 'ProfessionalService');
  assert.ok(profService);
  assert.equal(profService.aggregateRating, undefined);

  const faqNode = parsed['@graph'].find((n) => n['@type'] === 'FAQPage');
  assert.ok(faqNode);
  assert.equal((faqNode.mainEntity as unknown[]).length, FAQ_ITEMS.length);
});
