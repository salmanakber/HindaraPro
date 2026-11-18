import test from 'node:test';
import assert from 'node:assert/strict';
import { BRAND_VIDEOS, SAAS_VENTURES } from '../data/portfolio.ts';
import {
  buildBrandVideoFocusAction,
  buildHireBriefDraftAction,
  buildHireScopeSummary,
  buildScopeRecommendationAction,
  buildVentureSpotlightAction,
  filterVentures,
  recommendEngagementScope,
  sanitizeSpeechText,
  validateHireBrief,
  type HireBriefInput,
} from './portfolioLogic.ts';
import {
  computeExplodedPosition,
  ECOSYSTEM_NODES,
  getVentureCameraPose,
} from './ecosystem3d.ts';

test('filterVentures returns all 6 SaaS products when category is all and query is empty', () => {
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
});

test('filterVentures filters accurately by category and search keyword', () => {
  const ecom = filterVentures(SAAS_VENTURES, 'ecommerce-shopify', '');
  assert.equal(ecom.length, 3);
  assert.deepEqual(
    ecom.map((v) => v.id),
    ['tidysync', 'stocksentry', 'aftersale']
  );

  const quickbooksSearch = filterVentures(SAAS_VENTURES, 'all', 'QuickBooks');
  assert.equal(quickbooksSearch.length, 1);
  assert.equal(quickbooksSearch[0].id, 'tidyflow');

  const stockSearch = filterVentures(SAAS_VENTURES, 'ecommerce-shopify', 'stockouts');
  assert.equal(stockSearch.length, 0);
  const stockSearchAlt = filterVentures(SAAS_VENTURES, 'ecommerce-shopify', 'stock-outs');
  assert.equal(stockSearchAlt.length, 1);
  assert.equal(stockSearchAlt[0].id, 'stocksentry');
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
  assert.equal(summary.trackTitle, 'React Native & Shopify App Build');
  assert.equal(summary.deliverables.length, 3);
  assert.ok(summary.mailtoHref.startsWith('mailto:hindarapro@gmail.com?subject='));
  assert.ok(summary.formattedBriefText.includes('Suleman Khan'));
  assert.ok(!summary.formattedBriefText.includes('Salman Khan'));
  assert.ok(!summary.formattedBriefText.includes('Salman Akber'));
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

test('assistant tool builders sanitize inputs and resolve real studio records', () => {
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
    ['tidysync', 'aftersale', 'unknown-app', 'tidysync'],
    'Both serve Shopify merchants directly.'
  );
  assert.ok(spotlight);
  assert.equal(spotlight.ventures.length, 2);
  assert.equal(spotlight.ventures[0].url, 'https://sync.tidyflowapp.com/');
  assert.equal(spotlight.ventures[1].url, 'https://aftersale.tidyflowapp.com/');

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

  const videoAction = buildBrandVideoFocusAction('operations-ai');
  assert.equal(videoAction.video.videoUrl, '/videos/operations-ai-tidyflow-tidyagent.mp4');

  const spoken = sanitizeSpeechText(
    '**TidyFlow** (https://tidyflowapp.com/) and Salman Akber lead field ops.'
  );
  assert.ok(!spoken.includes('**'));
  assert.ok(!spoken.includes('https://'));
  assert.ok(spoken.includes('tidyflowapp.com'));
  assert.ok(spoken.includes('Suleman Khan'));
  assert.ok(!spoken.includes('Salman Akber'));
});

test('BRAND_VIDEOS provide unique MP4 reels, captions, posters, and Suleman Khan SEO metadata', () => {
  assert.equal(BRAND_VIDEOS.length, 3);
  const videoUrls = new Set<string>();
  const posterUrls = new Set<string>();
  const captionUrls = new Set<string>();

  for (const video of BRAND_VIDEOS) {
    assert.match(video.videoUrl, /^\/videos\/[a-z0-9-]+\.mp4$/);
    assert.match(video.posterUrl, /^\/videos\/[a-z0-9-]+\.jpg$/);
    assert.match(video.captionsUrl, /^\/videos\/[a-z0-9-]+\.vtt$/);
    assert.match(video.isoDuration, /^PT\d+S$/);
    assert.ok(video.transcript.length > 100);
    assert.ok(!video.transcript.includes('Salman Khan'));
    assert.ok(!video.transcript.includes('Salman Akber'));
    videoUrls.add(video.videoUrl);
    posterUrls.add(video.posterUrl);
    captionUrls.add(video.captionsUrl);
  }

  assert.equal(videoUrls.size, 3);
  assert.equal(posterUrls.size, 3);
  assert.equal(captionUrls.size, 3);
});

