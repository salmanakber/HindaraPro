import { Fragment, type FormEvent, useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Film,
  Loader2,
  Maximize2,
  MessageSquare,
  Minimize2,
  RotateCcw,
  Send,
  Square,
  Volume2,
  X,
} from 'lucide-react';
import { FOUNDER_PROFILE, type BrandVideoItem } from '../data/portfolio';
import type {
  AssistantMode,
  AssistantToolAction,
  BuildSurface,
  HireBriefInput,
  ProjectStage,
} from '../utils/portfolioLogic';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  toolActions?: AssistantToolAction[];
}

interface ApplyBriefPayload {
  draft: Partial<HireBriefInput>;
  surfaces?: BuildSurface[];
  stage?: ProjectStage;
}

interface StudioChatbotProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  queuedPrompt: { id: number; text: string; ventureId?: string } | null;
  onJumpToHire: () => void;
  onApplyBriefDraft: (payload: ApplyBriefPayload) => void;
  onInspectVenture: (ventureId: string) => void;
  onPlayBrandVideo: (videoId: BrandVideoItem['id']) => void;
}

const MODE_OPTIONS: Array<{ id: AssistantMode; label: string; hint: string }> = [
  {
    id: 'advisor',
    label: 'Advisor',
    hint: 'Portfolio & hiring overview',
  },
  {
    id: 'architect',
    label: 'Architect',
    hint: 'Technical stack & scope',
  },
  {
    id: 'brief-builder',
    label: 'Brief Builder',
    hint: 'Draft & send inquiry',
  },
];

const STARTER_PROMPTS_BY_MODE: Record<AssistantMode, string[]> = {
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

const INITIAL_ASSISTANT_MESSAGE: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content: `Welcome to Hindara Labs. Ask about our six live SaaS products, request an architecture scope estimate, watch a studio brand film, or draft a project brief directly with ${FOUNDER_PROFILE.primaryName}.`,
};

function normalizeLineMarkdown(rawLine: string): string {
  const bulletMatch = rawLine.match(/^\s*[*-]\s+(.*)$/);
  const baseLine = bulletMatch ? `• ${bulletMatch[1]}` : rawLine;
  return baseLine
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+|mailto:[^\s)]+|#[^\s)]+)\)/g, (_m, label: string, target: string) => {
      if (target.includes('hindarapro@gmail.com')) return 'hindarapro@gmail.com';
      if (target.startsWith('#')) return label;
      return `${label} (${target})`;
    })
    .replace(/https?:\/\/hindarapro@gmail\.com/g, 'hindarapro@gmail.com')
    .replace(/`([^`]+)`/g, '$1');
}

function renderLinksAndEmails(text: string) {
  const urlRegex = /(https?:\/\/[^\s),]+|hindarapro@gmail\.com)/g;
  const parts = text.split(urlRegex);
  return parts.map((part, idx) => {
    if (/^https?:\/\//.test(part)) {
      return (
        <a
          key={idx}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-[#5b21b6] underline underline-offset-2 hover:text-[#4c1d95]"
        >
          {part}
        </a>
      );
    }
    if (part === 'hindarapro@gmail.com') {
      return (
        <a
          key={idx}
          href={`mailto:${part}`}
          className="font-semibold text-[#5b21b6] underline underline-offset-2 hover:text-[#4c1d95]"
        >
          {part}
        </a>
      );
    }
    return <Fragment key={idx}>{part.replace(/\*\*/g, '')}</Fragment>;
  });
}

function renderFormattedText(text: string) {
  return text.split('\n').map((rawLine, lineIdx) => {
    const line = normalizeLineMarkdown(rawLine);
    const boldSegments = line.split(/(\*\*[^*]+\*\*)/g);

    return (
      <Fragment key={lineIdx}>
        {lineIdx > 0 && <br />}
        {boldSegments.map((seg, sIdx) =>
          seg.startsWith('**') && seg.endsWith('**') ? (
            <strong key={sIdx} className="font-semibold text-[#15102b]">
              {renderLinksAndEmails(seg.slice(2, -2))}
            </strong>
          ) : (
            <Fragment key={sIdx}>{renderLinksAndEmails(seg)}</Fragment>
          )
        )}
      </Fragment>
    );
  });
}

export function StudioChatbot({
  isOpen,
  onOpenChange,
  queuedPrompt,
  onJumpToHire,
  onApplyBriefDraft,
  onInspectVenture,
  onPlayBrandVideo,
}: StudioChatbotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_ASSISTANT_MESSAGE]);
  const [mode, setMode] = useState<AssistantMode>('advisor');
  const [expanded, setExpanded] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [contextVentureId, setContextVentureId] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  const [appliedKeys, setAppliedKeys] = useState<Record<string, boolean>>({});
  const [directSendingKey, setDirectSendingKey] = useState<string | null>(null);
  const [directSentMap, setDirectSentMap] = useState<Record<string, string>>({});

  const [ttsLoadingId, setTtsLoadingId] = useState<string | null>(null);
  const [playingMsgId, setPlayingMsgId] = useState<string | null>(null);
  const audioCacheRef = useRef<Map<string, { base64: string; mimeType: string }>>(new Map());
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  const listEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const lastProcessedNonceRef = useRef<number>(0);

  const stopAudioPlayback = () => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current = null;
    }
    setPlayingMsgId(null);
  };

  useEffect(() => {
    if (isOpen) {
      window.setTimeout(() => inputRef.current?.focus(), 80);
    } else {
      stopAudioPlayback();
    }
  }, [isOpen]);

  useEffect(() => {
    listEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, errorText]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onOpenChange(false);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onOpenChange]);

  useEffect(() => {
    return () => stopAudioPlayback();
  }, []);

  const markApplied = (key: string) => {
    setAppliedKeys((prev) => ({ ...prev, [key]: true }));
    window.setTimeout(() => {
      setAppliedKeys((prev) => ({ ...prev, [key]: false }));
    }, 2400);
  };

  const handleToggleVoice = async (msg: ChatMessage) => {
    if (playingMsgId === msg.id) {
      stopAudioPlayback();
      return;
    }

    stopAudioPlayback();
    setErrorText(null);

    const playAudioSource = (base64: string, mimeType: string) => {
      const audio = new Audio(`data:${mimeType};base64,${base64}`);
      audioPlayerRef.current = audio;
      setPlayingMsgId(msg.id);
      audio.onended = () => {
        if (audioPlayerRef.current === audio) {
          audioPlayerRef.current = null;
          setPlayingMsgId(null);
        }
      };
      audio.onerror = () => {
        audioPlayerRef.current = null;
        setPlayingMsgId(null);
        setErrorText('Unable to play synthesized audio in this browser.');
      };
      void audio.play().catch(() => {
        audioPlayerRef.current = null;
        setPlayingMsgId(null);
        setErrorText('Browser blocked audio playback. Click Listen again to play.');
      });
    };

    const cached = audioCacheRef.current.get(msg.id);
    if (cached) {
      playAudioSource(cached.base64, cached.mimeType);
      return;
    }

    setTtsLoadingId(msg.id);
    try {
      const response = await fetch('/api/chat/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: msg.content }),
      });
      const payload = await response.json();
      if (!response.ok || !payload.ok || !payload.audioBase64) {
        setErrorText(payload.error || 'Voice synthesis failed for this reply.');
        return;
      }

      const entry = {
        base64: String(payload.audioBase64),
        mimeType: String(payload.mimeType || 'audio/wav'),
      };
      audioCacheRef.current.set(msg.id, entry);
      playAudioSource(entry.base64, entry.mimeType);
    } catch {
      setErrorText('Network error while generating voice playback.');
    } finally {
      setTtsLoadingId(null);
    }
  };

  const handleSendBriefDirect = async (actionKey: string, draft: Partial<HireBriefInput>) => {
    if (directSendingKey) return;
    setDirectSendingKey(actionKey);
    setErrorText(null);

    try {
      const response = await fetch('/api/hire-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: draft.clientName ?? '',
          clientEmail: draft.clientEmail ?? '',
          companyOrProject: draft.companyOrProject ?? '',
          trackId: draft.trackId ?? 'mvp-build',
          timeline: draft.timeline ?? 'next-month',
          budgetRange: draft.budgetRange ?? '5k-15k',
          projectGoals: draft.projectGoals ?? '',
        }),
      });
      const payload = await response.json();
      if (!response.ok || !payload.ok) {
        setErrorText(
          'Missing or invalid contact details. Click "Apply to Brief Form" to complete submission.'
        );
        return;
      }
      setDirectSentMap((prev) => ({
        ...prev,
        [actionKey]: payload.summary?.briefId || 'SUBMITTED',
      }));
    } catch {
      setErrorText('Network error sending inquiry directly. Please use the Hire Brief section.');
    } finally {
      setDirectSendingKey(null);
    }
  };

  const sendMessage = async (
    rawText: string,
    overrideVentureId?: string,
    overrideMode?: AssistantMode
  ) => {
    const trimmed = rawText.trim();
    if (!trimmed || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmed,
    };

    const nextHistory = [...messages, userMsg];
    setMessages(nextHistory);
    setInputValue('');
    setErrorText(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: overrideMode ?? mode,
          contextVentureId: overrideVentureId ?? contextVentureId,
          messages: nextHistory
            .filter((m) => m.id !== 'welcome')
            .map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const contentType = response.headers.get('content-type') || '';
      if (!response.ok || contentType.includes('application/json')) {
        const payload = await response.json();
        if (!response.ok || !payload.ok || !payload.reply) {
          setErrorText(
            payload.error ||
              'Unable to get a response right now. Please use the Hire Brief or email hindarapro@gmail.com.'
          );
          return;
        }

        setMessages((prev) => [
          ...prev,
          {
            id: `assistant-${Date.now()}`,
            role: 'assistant',
            content: payload.reply,
            toolActions: Array.isArray(payload.toolActions) ? payload.toolActions : undefined,
          },
        ]);
        return;
      }

      if (!response.body) {
        setErrorText('No response stream received. Please try again or email hindarapro@gmail.com.');
        return;
      }

      const assistantId = `assistant-${Date.now()}`;
      setMessages((prev) => [
        ...prev,
        { id: assistantId, role: 'assistant', content: '', toolActions: [] },
      ]);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let sseBuffer = '';

      let receivedContentOrAction = false;
      let receivedError = false;

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        sseBuffer += decoder.decode(value, { stream: true });
        const events = sseBuffer.split('\n\n');
        sseBuffer = events.pop() ?? '';

        for (const rawEvent of events) {
          const dataLine = rawEvent
            .split('\n')
            .find((line) => line.startsWith('data: '));
          if (!dataLine) continue;
          try {
            const parsed = JSON.parse(dataLine.slice(6)) as {
              delta?: string;
              toolActions?: AssistantToolAction[];
              error?: string;
              done?: boolean;
            };
            if (parsed.error) {
              receivedError = true;
              setErrorText(parsed.error);
              setMessages((prev) =>
                prev.filter(
                  (m) =>
                    !(
                      m.id === assistantId &&
                      m.content.trim().length === 0 &&
                      (!m.toolActions || m.toolActions.length === 0)
                    )
                )
              );
            } else if (Array.isArray(parsed.toolActions) && parsed.toolActions.length > 0) {
              receivedContentOrAction = true;
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId
                    ? {
                        ...m,
                        toolActions: [...(m.toolActions ?? []), ...parsed.toolActions!],
                      }
                    : m
                )
              );
            } else if (parsed.delta) {
              receivedContentOrAction = true;
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId ? { ...m, content: m.content + parsed.delta } : m
                )
              );
            }
          } catch {
            // Ignore malformed SSE event line
          }
        }
      }

      if (!receivedContentOrAction && !receivedError) {
        setMessages((prev) =>
          prev.filter(
            (m) =>
              !(
                m.id === assistantId &&
                m.content.trim().length === 0 &&
                (!m.toolActions || m.toolActions.length === 0)
              )
          )
        );
        setErrorText(
          'No response was received from the assistant. Please try again or email hindarapro@gmail.com.'
        );
      }
    } catch {
      setErrorText(
        'Network error reaching the studio assistant. You can submit a Hire Brief below or email hindarapro@gmail.com.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (queuedPrompt && queuedPrompt.id !== lastProcessedNonceRef.current) {
      lastProcessedNonceRef.current = queuedPrompt.id;
      setContextVentureId(queuedPrompt.ventureId);
      onOpenChange(true);
      void sendMessage(queuedPrompt.text, queuedPrompt.ventureId);
    }
  }, [queuedPrompt]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    void sendMessage(inputValue);
  };

  const handleReset = () => {
    stopAudioPlayback();
    setMessages([INITIAL_ASSISTANT_MESSAGE]);
    setContextVentureId(undefined);
    setErrorText(null);
    setInputValue('');
    setDirectSentMap({});
    setAppliedKeys({});
  };

  const renderToolAction = (msgId: string, action: AssistantToolAction, idx: number) => {
    const actionKey = `${msgId}-tool-${idx}`;

    if (action.type === 'scope_recommendation') {
      const applied = Boolean(appliedKeys[actionKey]);
      return (
        <div
          key={actionKey}
          data-testid="chat-tool-scope"
          className="mt-2.5 rounded-2xl border border-[#d6c9f2] bg-white p-3 text-xs text-[#15102b] shadow-xs"
        >
          <p className="font-mono text-[10px] font-semibold tracking-wider text-[#5b21b6] uppercase">
            Scope Estimate · {action.recommendation.estimatedWeeks}
          </p>
          <p className="mt-1 font-display text-sm font-bold text-[#15102b]">
            {action.recommendation.trackTitle}
          </p>
          <p className="mt-1 leading-relaxed text-[#4b4466]">
            {action.recommendation.architectureFocus}
          </p>
          <button
            type="button"
            data-testid="apply-scope-from-chat"
            onClick={() => {
              markApplied(actionKey);
              onApplyBriefDraft({
                surfaces: action.surfaces,
                stage: action.stage,
                draft: {
                  trackId: action.recommendation.trackId,
                  timeline: action.recommendation.suggestedTimeline,
                  budgetRange: action.recommendation.suggestedBudgetRange,
                  projectGoals: action.recommendation.prefillGoalsText,
                  ...(action.companyOrProject
                    ? { companyOrProject: action.companyOrProject }
                    : {}),
                },
              });
            }}
            className="mt-2.5 inline-flex min-h-[34px] items-center gap-1.5 rounded-xl bg-[#5b21b6] px-3 py-1.5 text-[11px] font-semibold text-white whitespace-nowrap shrink-0 transition-colors hover:bg-[#4c1d95]"
          >
            {applied ? (
              <>
                <Check className="h-3.5 w-3.5" aria-hidden="true" />
                Applied to Hire Brief
              </>
            ) : (
              <>
                Apply Scope to Hire Brief
                <ArrowRight className="h-3 w-3" aria-hidden="true" />
              </>
            )}
          </button>
        </div>
      );
    }

    if (action.type === 'venture_spotlight') {
      return (
        <div
          key={actionKey}
          data-testid="chat-tool-ventures"
          className="mt-2.5 space-y-2 rounded-2xl border border-[#d6c9f2] bg-white p-3 text-xs text-[#15102b]"
        >
          <p className="font-mono text-[10px] font-semibold tracking-wider text-[#5b21b6] uppercase">
            Hindara Labs SaaS Match
          </p>
          <p className="leading-relaxed text-[#4b4466]">{action.comparisonSummary}</p>
          <div className="space-y-1.5">
            {action.ventures.map((v) => (
              <div
                key={v.id}
                className="flex items-center justify-between gap-2 rounded-xl border border-[#ebe4fa] bg-[#f8f5ff] px-2.5 py-2"
              >
                <div className="min-w-0">
                  <p className="font-display text-xs font-bold text-[#15102b]">{v.name}</p>
                  <p className="truncate text-[11px] text-[#5e567a]">{v.platforms}</p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => onInspectVenture(v.id)}
                    className="rounded-lg border border-[#d6c9f2] bg-white px-2.5 py-1 text-[11px] font-semibold text-[#15102b] hover:border-[#5b21b6]"
                  >
                    Inspect
                  </button>
                  <a
                    href={v.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Open ${v.name}`}
                    className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-[#15102b] text-white hover:bg-[#5b21b6]"
                  >
                    <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (action.type === 'hire_brief_draft') {
      const applied = Boolean(appliedKeys[actionKey]);
      const sentRef = directSentMap[actionKey];
      const sendingNow = directSendingKey === actionKey;

      return (
        <div
          key={actionKey}
          data-testid="chat-tool-brief"
          className="mt-2.5 rounded-2xl border border-[#d6c9f2] bg-white p-3 text-xs text-[#15102b]"
        >
          <p className="font-mono text-[10px] font-semibold tracking-wider text-[#5b21b6] uppercase">
            Hire Brief Draft
          </p>
          <p className="mt-1 leading-relaxed text-[#4b4466]">{action.summaryNote}</p>
          {action.draft.projectGoals && (
            <p className="mt-2 rounded-xl border border-[#ebe4fa] bg-[#f8f5ff] p-2 text-[11px] text-[#3b3454]">
              {action.draft.projectGoals}
            </p>
          )}
          <div className="mt-2.5 flex flex-wrap items-center gap-2">
            <button
              type="button"
              data-testid="apply-brief-from-chat"
              onClick={() => {
                markApplied(actionKey);
                onApplyBriefDraft({ draft: action.draft });
              }}
              className="inline-flex min-h-[34px] items-center gap-1.5 rounded-xl bg-[#15102b] px-3 py-1.5 text-[11px] font-semibold text-white whitespace-nowrap shrink-0 transition-colors hover:bg-[#5b21b6]"
            >
              {applied ? (
                <>
                  <Check className="h-3.5 w-3.5" aria-hidden="true" />
                  Applied to Brief Form
                </>
              ) : (
                <>
                  Apply to Brief Form
                  <ArrowRight className="h-3 w-3" aria-hidden="true" />
                </>
              )}
            </button>

            {action.readyToSend && !sentRef && (
              <button
                type="button"
                disabled={sendingNow}
                onClick={() => void handleSendBriefDirect(actionKey, action.draft)}
                className="inline-flex min-h-[34px] items-center gap-1.5 rounded-xl bg-[#5b21b6] px-3 py-1.5 text-[11px] font-semibold text-white whitespace-nowrap shrink-0 transition-colors hover:bg-[#4c1d95] disabled:opacity-60"
              >
                {sendingNow && <Loader2 className="h-3 w-3 animate-spin" aria-hidden="true" />}
                Send Brief Now
              </button>
            )}

            {sentRef && (
              <span className="font-mono text-[11px] font-semibold text-emerald-700">
                Sent · Ref {sentRef}
              </span>
            )}
          </div>
        </div>
      );
    }

    if (action.type === 'brand_video_focus') {
      return (
        <div
          key={actionKey}
          data-testid="chat-tool-video"
          className="mt-2.5 rounded-2xl border border-[#d6c9f2] bg-white p-3 text-xs text-[#15102b]"
        >
          <p className="font-mono text-[10px] font-semibold tracking-wider text-[#5b21b6] uppercase">
            Studio Film · {action.video.displayDuration}
          </p>
          <p className="mt-1 font-display text-xs font-bold text-[#15102b]">
            {action.video.title}
          </p>
          <button
            type="button"
            onClick={() => {
              onPlayBrandVideo(action.video.id);
              onOpenChange(false);
            }}
            className="mt-2.5 inline-flex min-h-[34px] items-center gap-1.5 rounded-xl bg-[#5b21b6] px-3 py-1.5 text-[11px] font-semibold text-white whitespace-nowrap shrink-0 hover:bg-[#4c1d95]"
          >
            <Film className="h-3.5 w-3.5" aria-hidden="true" />
            Watch Studio Film
          </button>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="fixed right-4 bottom-4 z-50 sm:right-6 sm:bottom-6">
      {!isOpen ? (
        <button
          type="button"
          data-testid="chatbot-launcher"
          onClick={() => onOpenChange(true)}
          aria-expanded={false}
          aria-controls="hindara-studio-chatbot"
          className="inline-flex min-h-[46px] items-center gap-2.5 rounded-2xl border border-[#2e2352] bg-[#15102b] px-4 py-2.5 text-sm font-semibold text-white shadow-xl whitespace-nowrap shrink-0 transition-all hover:bg-[#5b21b6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5b21b6]"
        >
          <MessageSquare className="h-4 w-4 text-violet-300" aria-hidden="true" />
          <span>Ask Hindara AI</span>
        </button>
      ) : (
        <section
          id="hindara-studio-chatbot"
          role="dialog"
          aria-label="Hindara Labs Studio AI Assistant"
          data-testid="chatbot-panel"
          className={`flex flex-col overflow-hidden rounded-3xl border border-[#d9d0f0] bg-[#fcfbff] shadow-2xl transition-all duration-150 ${
            expanded
              ? 'h-[min(680px,calc(100vh-2rem))] w-[min(540px,calc(100vw-2rem))]'
              : 'h-[min(570px,calc(100vh-2rem))] w-[min(410px,calc(100vw-2rem))]'
          }`}
        >
          {/* Header + Mode Switcher */}
          <div className="border-b border-[#2e2352] bg-[#15102b] px-4 pt-3.5 pb-3 text-white">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="font-display text-sm font-bold tracking-tight">
                  Hindara Studio Assistant
                </p>
                <p className="truncate text-[11px] text-violet-200/80">
                  Architecture scoping, live SaaS &amp; direct voice concierge
                </p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  data-testid="chatbot-expand-toggle"
                  onClick={() => setExpanded((prev) => !prev)}
                  aria-label={expanded ? 'Compact assistant window' : 'Expand assistant window'}
                  className="hidden sm:inline-flex h-8 w-8 items-center justify-center rounded-lg text-violet-200 transition-colors hover:bg-white/10 hover:text-white"
                >
                  {expanded ? (
                    <Minimize2 className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <Maximize2 className="h-4 w-4" aria-hidden="true" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  aria-label="Reset conversation"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-violet-200 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <RotateCcw className="h-4 w-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => onOpenChange(false)}
                  aria-label="Close studio assistant"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-violet-200 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Assistant Specialization Modes */}
            <div
              role="group"
              aria-label="Assistant specialization mode"
              className="mt-2.5 grid grid-cols-3 gap-1.5 rounded-xl bg-[#0e0a1e] p-1"
            >
              {MODE_OPTIONS.map((opt) => {
                const active = mode === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    data-testid={`chat-mode-${opt.id}`}
                    aria-pressed={active}
                    onClick={() => setMode(opt.id)}
                    title={opt.hint}
                    className={`min-h-[30px] rounded-lg px-2 py-1 text-[11px] font-semibold whitespace-nowrap transition-colors ${
                      active
                        ? 'bg-[#5b21b6] text-white shadow-xs'
                        : 'text-violet-200/80 hover:text-white'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-3 overflow-y-auto p-4 text-sm">
            {messages
              .filter(
                (msg) =>
                  msg.content.trim().length > 0 ||
                  (msg.toolActions && msg.toolActions.length > 0)
              )
              .map((msg) => {
                const isPlayingThis = playingMsgId === msg.id;
                const isSynthesizingThis = ttsLoadingId === msg.id;
                const canListen =
                  msg.role === 'assistant' && msg.content.trim().length > 10 && !isLoading;

                return (
                  <div
                    key={msg.id}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[90%] rounded-2xl px-3.5 py-2.5 leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-[#5b21b6] text-white'
                          : 'border border-[#e3dcf5] bg-[#f6f3ff] text-[#15102b]'
                      }`}
                    >
                      {msg.content.trim().length > 0 && (
                        <div>
                          {msg.role === 'assistant'
                            ? renderFormattedText(msg.content)
                            : msg.content}
                        </div>
                      )}

                      {msg.role === 'assistant' &&
                        msg.toolActions?.map((action, idx) =>
                          renderToolAction(msg.id, action, idx)
                        )}

                      {canListen && (
                        <div className="mt-2 flex items-center justify-end border-t border-[#e8e2f6] pt-1.5">
                          <button
                            type="button"
                            data-testid={`chat-listen-${msg.id}`}
                            onClick={() => void handleToggleVoice(msg)}
                            disabled={isSynthesizingThis}
                            className="inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-[11px] font-semibold text-[#5b21b6] transition-colors hover:bg-[#ebe4fa] disabled:opacity-60"
                          >
                            {isSynthesizingThis ? (
                              <>
                                <Loader2 className="h-3 w-3 animate-spin" aria-hidden="true" />
                                Generating Voice...
                              </>
                            ) : isPlayingThis ? (
                              <>
                                <Square className="h-3 w-3 fill-current" aria-hidden="true" />
                                Stop Audio
                              </>
                            ) : (
                              <>
                                <Volume2 className="h-3 w-3" aria-hidden="true" />
                                Listen
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

            {messages.length === 1 && !isLoading && (
              <div className="space-y-1.5 pt-1">
                <p className="text-[11px] font-semibold tracking-wider text-[#5e567a] uppercase">
                  {MODE_OPTIONS.find((m) => m.id === mode)?.hint} · Suggested Prompts
                </p>
                <div className="flex flex-col gap-1.5">
                  {STARTER_PROMPTS_BY_MODE[mode].map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => void sendMessage(prompt)}
                      className="rounded-xl border border-[#dcd4f0] bg-white px-3 py-2 text-left text-xs font-medium text-[#15102b] transition-colors hover:border-[#7c3aed] hover:bg-[#f6f3ff]"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {isLoading &&
            ((messages[messages.length - 1]?.role === 'assistant' &&
              messages[messages.length - 1]?.content.trim().length === 0 &&
              (!messages[messages.length - 1]?.toolActions ||
                messages[messages.length - 1]?.toolActions?.length === 0)) ||
              messages[messages.length - 1]?.role === 'user') ? (
              <div className="flex justify-start">
                <div className="inline-flex items-center gap-2 rounded-2xl border border-[#e3dcf5] bg-[#f6f3ff] px-3.5 py-2.5 text-xs font-medium text-[#524b6b]">
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-[#5b21b6]" aria-hidden="true" />
                  Thinking &amp; running studio tools...
                </div>
              </div>
            ) : null}

            {errorText && (
              <div
                role="alert"
                className="rounded-2xl border border-amber-200 bg-amber-50 p-3 text-xs leading-relaxed text-amber-950"
              >
                {errorText}
              </div>
            )}
            <div ref={listEndRef} />
          </div>

          {/* Input + Direct Hire Link */}
          <div className="border-t border-[#e8e2f6] bg-white p-3">
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <label htmlFor="studio-chat-input" className="sr-only">
                Ask Hindara Labs AI Assistant
              </label>
              <input
                ref={inputRef}
                id="studio-chat-input"
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={
                  mode === 'architect'
                    ? 'Describe platforms & integrations to scope...'
                    : mode === 'brief-builder'
                      ? 'Share timeline, budget, or project goals...'
                      : 'Ask about our SaaS apps or hiring...'
                }
                disabled={isLoading}
                className="min-h-[40px] flex-1 rounded-xl border border-[#dcd4f0] bg-[#fcfbff] px-3 text-sm text-[#15102b] placeholder:text-[#8b83a8] focus:border-[#5b21b6] focus:outline-none disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                aria-label="Send message"
                className="inline-flex min-h-[40px] min-w-[40px] items-center justify-center rounded-xl bg-[#5b21b6] text-white transition-colors hover:bg-[#4c1d95] disabled:opacity-50"
              >
                <Send className="h-4 w-4" aria-hidden="true" />
              </button>
            </form>
            <div className="mt-2 flex items-center justify-between px-1 text-[11px] text-[#5e567a]">
              <span>Direct channel · {FOUNDER_PROFILE.primaryName}</span>
              <button
                type="button"
                onClick={() => {
                  onOpenChange(false);
                  onJumpToHire();
                }}
                className="inline-flex items-center gap-1 font-semibold text-[#5b21b6] hover:underline"
              >
                Open Hire Brief
                <ArrowRight className="h-3 w-3" aria-hidden="true" />
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
