import { useState } from 'react';
import { ChevronDown, ChevronUp, Film, MessageSquare, Play } from 'lucide-react';
import { BRAND_VIDEOS, FOUNDER_PROFILE, type BrandVideoItem } from '../data/portfolio';

interface VideoShowcaseSectionProps {
  activeVideoId: BrandVideoItem['id'];
  onSelectVideo: (videoId: BrandVideoItem['id']) => void;
  onAskAiAboutVideo: (video: BrandVideoItem) => void;
}

export function VideoShowcaseSection({
  activeVideoId,
  onSelectVideo,
  onAskAiAboutVideo,
}: VideoShowcaseSectionProps) {
  const [transcriptOpen, setTranscriptOpen] = useState(false);

  const activeVideo =
    BRAND_VIDEOS.find((video) => video.id === activeVideoId) ?? BRAND_VIDEOS[0];

  return (
    <section
      id="brand-films"
      className="scroll-mt-20 border-b border-[#2e2352] bg-[#15102b] py-16 text-white sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-wider text-violet-300 uppercase sm:text-sm">
              Brand Films &amp; Product Reels
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Hindara Labs in motion—
              <span className="font-editorial text-violet-300">
                six SaaS platforms, one studio.
              </span>
            </h2>
            <p className="mt-3 text-base leading-relaxed text-violet-100/80">
              Watch short product reels showcasing the software ecosystem owned and
              engineered by {FOUNDER_PROFILE.primaryName}, from React Native field
              operations and AI agents to Shopify App Store commerce tools.
            </p>
          </div>
          <p className="font-mono text-xs text-violet-300/80 tabular-nums shrink-0">
            03 Studio Reels · 1280×720 HD
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
          {/* Primary 16:9 Cinema Stage */}
          <div className="rounded-3xl border border-[#2e2352] bg-[#1b1438] p-4 sm:p-5 lg:col-span-7">
            <div className="overflow-hidden rounded-2xl border border-[#33275d] bg-[#0e0a1d]">
              <video
                key={activeVideo.id}
                data-testid="brand-video-player"
                controls
                playsInline
                preload="metadata"
                poster={activeVideo.posterUrl}
                aria-label={activeVideo.title}
                className="aspect-video w-full bg-[#0e0a1d] object-cover"
              >
                <source src={activeVideo.videoUrl} type="video/mp4" />
                <track
                  kind="captions"
                  src={activeVideo.captionsUrl}
                  srcLang="en"
                  label="English captions"
                  default
                />
              </video>
            </div>

            <div className="mt-5">
              <p className="font-mono text-xs text-violet-300 tabular-nums">
                Reel {activeVideo.index}
                <span aria-hidden="true" className="mx-2 text-violet-500">
                  ·
                </span>
                {activeVideo.focusLabel}
                <span aria-hidden="true" className="mx-2 text-violet-500">
                  ·
                </span>
                {activeVideo.displayDuration}
              </p>
              <h3 className="mt-1.5 font-display text-xl font-bold text-white">
                {activeVideo.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-violet-100/80">
                {activeVideo.description}
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-[#2e2352] pt-4">
                <button
                  type="button"
                  onClick={() => onAskAiAboutVideo(activeVideo)}
                  className="inline-flex min-h-[40px] items-center gap-2 rounded-xl bg-white px-4 py-2 text-xs font-semibold text-[#15102b] whitespace-nowrap shrink-0 transition-colors hover:bg-violet-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-300"
                >
                  <MessageSquare className="h-3.5 w-3.5 text-[#5b21b6]" aria-hidden="true" />
                  Ask AI About This Reel
                </button>
                <button
                  type="button"
                  data-testid="toggle-video-transcript"
                  onClick={() => setTranscriptOpen((prev) => !prev)}
                  aria-expanded={transcriptOpen}
                  aria-controls={`video-transcript-${activeVideo.id}`}
                  className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-[#3a2e68] bg-[#15102b] px-4 py-2 text-xs font-semibold text-violet-200 whitespace-nowrap shrink-0 transition-colors hover:border-violet-400 hover:text-white"
                >
                  <Film className="h-3.5 w-3.5" aria-hidden="true" />
                  {transcriptOpen ? 'Hide Transcript' : 'Read Video Transcript'}
                  {transcriptOpen ? (
                    <ChevronUp className="h-3.5 w-3.5" aria-hidden="true" />
                  ) : (
                    <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
                  )}
                </button>
              </div>

              {transcriptOpen && (
                <div
                  id={`video-transcript-${activeVideo.id}`}
                  data-testid="video-transcript-panel"
                  className="mt-4 rounded-2xl border border-[#2e2352] bg-[#15102b] p-4 text-xs leading-relaxed text-violet-100/85"
                >
                  <p className="font-mono text-[11px] font-semibold tracking-wider text-violet-300 uppercase">
                    Full Reel Narration &amp; Transcript
                  </p>
                  <p className="mt-2">{activeVideo.transcript}</p>
                </div>
              )}
            </div>
          </div>

          {/* Reel Switcher Playlist */}
          <div
            role="group"
            aria-label="Select Hindara Labs brand film"
            className="space-y-3 lg:col-span-5"
          >
            {BRAND_VIDEOS.map((video) => {
              const selected = video.id === activeVideo.id;
              return (
                <button
                  key={video.id}
                  type="button"
                  data-testid={`video-reel-${video.id}`}
                  onClick={() => onSelectVideo(video.id)}
                  aria-pressed={selected}
                  className={`flex w-full items-start gap-3.5 rounded-2xl border p-3.5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400 ${
                    selected
                      ? 'border-violet-400 bg-[#221a45] shadow-lg'
                      : 'border-[#2e2352] bg-[#1b1438] hover:border-violet-500/50'
                  }`}
                >
                  <div className="relative aspect-video w-28 shrink-0 overflow-hidden rounded-xl border border-[#33275d] bg-[#0e0a1d] sm:w-32">
                    <img
                      src={video.posterUrl}
                      alt={`${video.title} poster frame`}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                    <span
                      aria-hidden="true"
                      className={`absolute right-1.5 bottom-1.5 inline-flex h-6 w-6 items-center justify-center rounded-lg ${
                        selected
                          ? 'bg-[#7c3aed] text-white'
                          : 'bg-[#15102b]/85 text-violet-200'
                      }`}
                    >
                      <Play className="h-3 w-3 fill-current" />
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-[11px] text-violet-300 tabular-nums">
                      {video.index}
                      <span aria-hidden="true" className="mx-1.5 text-violet-500">
                        ·
                      </span>
                      {video.displayDuration}
                    </p>
                    <h3 className="mt-1 font-display text-sm font-bold leading-snug text-white">
                      {video.title}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-xs text-violet-100/70">
                      {video.subtitle}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
