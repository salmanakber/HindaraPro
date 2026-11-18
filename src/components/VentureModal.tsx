import { useEffect, useState } from 'react';
import { ArrowUpRight, Check, MessageSquare, X } from 'lucide-react';
import type { SaaSVenture } from '../data/portfolio';
import { VenturePreview } from './VenturePreview';

interface VentureModalProps {
  venture: SaaSVenture | null;
  onClose: () => void;
  onAskAi: (venture: SaaSVenture) => void;
}

export function VentureModal({ venture, onClose, onAskAi }: VentureModalProps) {
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    setImgFailed(false);
  }, [venture?.id]);

  useEffect(() => {
    if (!venture) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [venture, onClose]);

  if (!venture) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="venture-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#15102b]/75 p-4 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-[#e3dcf5] bg-[#fcfbff] p-6 shadow-2xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-[#e8e2f6] pb-4">
          <div>
            <p className="font-mono text-xs text-[#5e567a]">
              <span>{venture.index}</span>
              <span aria-hidden="true" className="mx-2 text-[#c4b5fd]">
                ·
              </span>
              <span className="text-[#5b21b6] font-semibold">{venture.categoryLabel}</span>
              <span aria-hidden="true" className="mx-2 text-[#c4b5fd]">
                ·
              </span>
              <span>{venture.platforms}</span>
            </p>
            <h3
              id="venture-modal-title"
              className="mt-1.5 font-display text-2xl font-bold tracking-tight text-[#15102b]"
            >
              {venture.name}
            </h3>
            <p className="mt-1 text-sm font-medium text-[#524b6b]">{venture.tagline}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={`Close ${venture.name} architecture details`}
            className="inline-flex min-h-[40px] min-w-[40px] items-center justify-center rounded-xl border border-[#e3dcf5] bg-white text-[#524b6b] transition-colors hover:bg-[#f6f3ff] hover:text-[#15102b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5b21b6]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* High-craft studio render inside inspection modal */}
        {!imgFailed && (
          <div className="mt-5 overflow-hidden rounded-2xl border border-[#e3dcf5] bg-[#15102b]">
            <img
              src={venture.imagePath}
              alt={venture.imageAlt}
              referrerPolicy="no-referrer"
              onError={() => setImgFailed(true)}
              className="aspect-[4/3] max-h-[260px] w-full object-cover"
            />
          </div>
        )}

        <p className="mt-5 text-base leading-relaxed text-[#3b3454]">{venture.summary}</p>

        <div className="mt-5">
          <VenturePreview variant={venture.previewVariant} />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <h4 className="font-display text-sm font-semibold text-[#15102b]">
              Core Product Capabilities
            </h4>
            <ul className="mt-3 space-y-2 text-sm text-[#4b4466]">
              {venture.capabilities.map((cap) => (
                <li key={cap} className="flex items-start gap-2">
                  <Check
                    className="mt-0.5 h-4 w-4 shrink-0 text-[#5b21b6]"
                    aria-hidden="true"
                  />
                  <span>{cap}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-[#e3dcf5] bg-[#f6f3ff] p-4">
            <h4 className="font-display text-sm font-semibold text-[#15102b]">
              Engineering Highlights
            </h4>
            <ul className="mt-3 space-y-2.5 text-sm text-[#3b3454]">
              {venture.architectureHighlights.map((item) => (
                <li
                  key={item}
                  className="border-b border-[#e3dcf5] pb-2 last:border-b-0 last:pb-0"
                >
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-[#5e567a]">
              Target users: <span className="font-semibold text-[#15102b]">{venture.audience}</span>
            </p>
          </div>
        </div>

        <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-[#e8e2f6] pt-5">
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={venture.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[42px] items-center gap-2 rounded-xl bg-[#5b21b6] px-5 py-2.5 text-sm font-semibold text-white whitespace-nowrap shrink-0 transition-colors hover:bg-[#4c1d95]"
            >
              Launch {venture.name}
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
            {venture.secondaryUrl && (
              <a
                href={venture.secondaryUrl.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[42px] items-center gap-1.5 rounded-xl border border-[#dcd4f0] bg-white px-4 py-2.5 text-sm font-semibold text-[#15102b] whitespace-nowrap shrink-0 transition-colors hover:bg-[#f6f3ff]"
              >
                {venture.secondaryUrl.label}
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => onAskAi(venture)}
              className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-[#dcd4f0] bg-[#f6f3ff] px-3.5 py-2 text-xs font-semibold text-[#5b21b6] whitespace-nowrap shrink-0 transition-colors hover:border-[#7c3aed] hover:bg-white"
            >
              <MessageSquare className="h-3.5 w-3.5" aria-hidden="true" />
              Ask AI about {venture.name}
            </button>
            <a
              href="#hire-me"
              onClick={onClose}
              className="text-sm font-semibold text-[#5b21b6] hover:underline whitespace-nowrap shrink-0"
            >
              Build something similar →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
