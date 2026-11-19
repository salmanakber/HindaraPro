import { useEffect, useState } from 'react';
import {
  SAAS_VENTURES,
  type ClientCaseStudy,
  type SaaSVenture,
} from './data/portfolio';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { PortfolioSection } from './components/PortfolioSection';
import { StudioCraftSection } from './components/StudioCraftSection';
import { ClientShowcaseSection } from './components/ClientShowcaseSection';
import { FounderSection } from './components/FounderSection';
import { ReviewsSection } from './components/ReviewsSection';
import { HireMeSection, type ExternalBriefDraft } from './components/HireMeSection';
import { FaqSection, SiteFooter } from './components/FaqAndFooter';
import { VentureModal } from './components/VentureModal';
import { CaseStudyModal } from './components/CaseStudyModal';
import { PrivacyPolicyPage, TermsOfServicePage } from './components/LegalPages';
import {
  AboutStudioPage,
  ProjectsArchivePage,
  ServicesHirePage,
} from './components/StudioPages';
import {
  buildBreadcrumbJsonLd,
  normalizeRoute,
  ROUTE_SEO,
  type StudioRoute,
} from './data/seoRoutes';
import { StudioChatbot } from './components/StudioChatbot';
import type { BuildSurface, HireBriefInput, ProjectStage } from './utils/portfolioLogic';

function upsertMeta(selector: string, content: string) {
  const el = document.querySelector(selector);
  if (el) {
    el.setAttribute('content', content);
  }
}

export default function App() {
  const [route, setRoute] = useState<StudioRoute>(() =>
    normalizeRoute(window.location.pathname)
  );
  const [selectedVenture, setSelectedVenture] = useState<SaaSVenture | null>(null);
  const [selectedProject, setSelectedProject] = useState<ClientCaseStudy | null>(null);
  const [externalBriefDraft, setExternalBriefDraft] = useState<ExternalBriefDraft | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [queuedPrompt, setQueuedPrompt] = useState<{
    id: number;
    text: string;
    ventureId?: string;
  } | null>(null);

  useEffect(() => {
    const handlePopState = () => {
      setRoute(normalizeRoute(window.location.pathname));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    const meta = ROUTE_SEO[route];
    document.title = meta.title;
    upsertMeta('meta[name="description"]', meta.description);
    upsertMeta('meta[name="keywords"]', meta.keywords);
    upsertMeta('meta[property="og:title"]', meta.title);
    upsertMeta('meta[property="og:description"]', meta.description);
    upsertMeta('meta[property="og:url"]', meta.canonicalUrl);
    upsertMeta('meta[name="twitter:title"]', meta.title);
    upsertMeta('meta[name="twitter:description"]', meta.description);

    const canonicalEl = document.querySelector('link[rel="canonical"]');
    if (canonicalEl) {
      canonicalEl.setAttribute('href', meta.canonicalUrl);
    }

    let breadcrumbScript = document.getElementById('route-breadcrumb-ld');
    if (!breadcrumbScript) {
      breadcrumbScript = document.createElement('script');
      breadcrumbScript.id = 'route-breadcrumb-ld';
      breadcrumbScript.setAttribute('type', 'application/ld+json');
      document.head.appendChild(breadcrumbScript);
    }
    breadcrumbScript.textContent = buildBreadcrumbJsonLd(route);
  }, [route]);

  const navigate = (path: string, hash?: string) => {
    const targetRoute = normalizeRoute(path);
    const nextUrl = hash ? `${targetRoute}${hash}` : targetRoute;
    if (window.location.pathname + window.location.hash !== nextUrl) {
      window.history.pushState({}, '', nextUrl);
    }
    setRoute(targetRoute);
    if (hash) {
      window.setTimeout(() => {
        document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' });
      }, 60);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleInspectById = (ventureId: string) => {
    const match = SAAS_VENTURES.find((v) => v.id === ventureId) ?? null;
    if (match) {
      setSelectedVenture(match);
    }
  };

  const handleOpenChat = (initialPrompt?: string, ventureId?: string) => {
    setChatOpen(true);
    if (initialPrompt && initialPrompt.trim()) {
      setQueuedPrompt({
        id: Date.now(),
        text: initialPrompt.trim(),
        ventureId,
      });
    }
  };

  const handleJumpToHire = () => {
    if (route !== '/') {
      navigate('/', '#hire-me');
    } else {
      document.querySelector('#hire-me')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleApplyBriefDraft = (payload: {
    draft: Partial<HireBriefInput>;
    surfaces?: BuildSurface[];
    stage?: ProjectStage;
  }) => {
    setExternalBriefDraft({
      nonce: Date.now(),
      data: payload.draft,
      surfaces: payload.surfaces,
      stage: payload.stage,
    });
    handleJumpToHire();
  };

  const handleRequestSimilarProject = (project: ClientCaseStudy) => {
    setSelectedProject(null);
    handleApplyBriefDraft({
      draft: {
        trackId: project.category === 'healthtech-mobile' ? 'mobile-shopify' : 'mvp-build',
        projectGoals: `Interested in building a custom system similar to ${project.clientName} (${project.title}). Target stack & capabilities: ${project.stack.slice(0, 3).join(', ')}.`,
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] text-[#111015]">
      <Navbar currentPath={route} onNavigate={navigate} />
      <main>
        {route === '/projects' ? (
          <ProjectsArchivePage
            onNavigate={navigate}
            onSelectVenture={setSelectedVenture}
            onInspectProject={setSelectedProject}
          />
        ) : route === '/about' ? (
          <AboutStudioPage onNavigate={navigate} />
        ) : route === '/services' ? (
          <ServicesHirePage onNavigate={navigate} />
        ) : route === '/privacy' ? (
          <PrivacyPolicyPage onNavigate={navigate} />
        ) : route === '/terms' ? (
          <TermsOfServicePage onNavigate={navigate} />
        ) : (
          <>
            <Hero onInspectVenture={handleInspectById} />
            <PortfolioSection onSelectVenture={setSelectedVenture} />
            <StudioCraftSection onNavigate={navigate} />
            <ClientShowcaseSection
              onInspectProject={setSelectedProject}
              onNavigate={navigate}
            />
            <FounderSection onNavigate={navigate} />
            <ReviewsSection />
            <HireMeSection
              externalBriefDraft={externalBriefDraft}
              onNavigate={navigate}
            />
            <FaqSection />
          </>
        )}
      </main>
      <SiteFooter currentPath={route} onNavigate={navigate} />
      <VentureModal
        venture={selectedVenture}
        onClose={() => setSelectedVenture(null)}
        onAskAi={(venture) => {
          setSelectedVenture(null);
          handleOpenChat(
            `Tell me more about ${venture.name} (${venture.url}) and how Hindara Labs architected it.`,
            venture.id
          );
        }}
      />
      <CaseStudyModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onRequestSimilar={handleRequestSimilarProject}
      />
      <StudioChatbot
        isOpen={chatOpen}
        onOpenChange={setChatOpen}
        queuedPrompt={queuedPrompt}
        onJumpToHire={handleJumpToHire}
        onApplyBriefDraft={handleApplyBriefDraft}
        onInspectVenture={handleInspectById}
        onInspectClientProject={setSelectedProject}
      />
    </div>
  );
}
