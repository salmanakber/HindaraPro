import { useEffect, useState } from 'react';
import {
  SAAS_VENTURES,
  type BrandVideoItem,
  type SaaSVenture,
} from './data/portfolio';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { PortfolioSection } from './components/PortfolioSection';
import { VideoShowcaseSection } from './components/VideoShowcaseSection';
import { FounderSection } from './components/FounderSection';
import { HireMeSection, type ExternalBriefDraft } from './components/HireMeSection';
import { FaqSection, SiteFooter } from './components/FaqAndFooter';
import { VentureModal } from './components/VentureModal';
import { PrivacyPolicyPage, TermsOfServicePage } from './components/LegalPages';
import { StudioChatbot } from './components/StudioChatbot';
import type { BuildSurface, HireBriefInput, ProjectStage } from './utils/portfolioLogic';

function normalizeRoute(pathname: string): '/' | '/privacy' | '/terms' {
  const clean = pathname.toLowerCase().replace(/\/+$/, '') || '/';
  if (clean === '/privacy' || clean === '/privacy-policy') return '/privacy';
  if (clean === '/terms' || clean === '/terms-of-service') return '/terms';
  return '/';
}

export default function App() {
  const [route, setRoute] = useState<'/' | '/privacy' | '/terms'>(() =>
    normalizeRoute(window.location.pathname)
  );
  const [selectedVenture, setSelectedVenture] = useState<SaaSVenture | null>(null);
  const [activeVideoId, setActiveVideoId] = useState<BrandVideoItem['id']>('studio-showcase');
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
    if (route === '/privacy') {
      document.title = 'Privacy Policy | Hindara Labs – Suleman Khan';
    } else if (route === '/terms') {
      document.title = 'Terms of Service | Hindara Labs – Suleman Khan';
    } else {
      document.title = 'Hindara Labs | Suleman Khan – SaaS Venture Studio';
    }
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

  const handlePlayBrandVideo = (videoId: BrandVideoItem['id']) => {
    setActiveVideoId(videoId);
    if (route !== '/') {
      navigate('/', '#brand-films');
    } else {
      document.querySelector('#brand-films')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfbff] text-[#15102b]">
      <Navbar currentPath={route} onNavigate={navigate} />
      <main>
        {route === '/privacy' ? (
          <PrivacyPolicyPage onNavigate={navigate} />
        ) : route === '/terms' ? (
          <TermsOfServicePage onNavigate={navigate} />
        ) : (
          <>
            <Hero onInspectVenture={handleInspectById} />
            <PortfolioSection onSelectVenture={setSelectedVenture} />
            <VideoShowcaseSection
              activeVideoId={activeVideoId}
              onSelectVideo={setActiveVideoId}
              onAskAiAboutVideo={(video) =>
                handleOpenChat(
                  `Tell me about the stack and live products featured in "${video.title}".`
                )
              }
            />
            <FounderSection />
            <HireMeSection externalBriefDraft={externalBriefDraft} />
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
      <StudioChatbot
        isOpen={chatOpen}
        onOpenChange={setChatOpen}
        queuedPrompt={queuedPrompt}
        onJumpToHire={handleJumpToHire}
        onApplyBriefDraft={handleApplyBriefDraft}
        onInspectVenture={handleInspectById}
        onPlayBrandVideo={handlePlayBrandVideo}
      />
    </div>
  );
}
