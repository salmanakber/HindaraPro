import { useEffect, useState } from 'react';
import { ArrowRight, Check, X } from 'lucide-react';
import type { ClientCaseStudy } from '../data/portfolio';

interface CaseStudyModalProps {
  project: ClientCaseStudy | null;
  onClose: () => void;
  onRequestSimilar: (project: ClientCaseStudy) => void;
}

export function CaseStudyModal({
  project,
  onClose,
  onRequestSimilar,
}: CaseStudyModalProps) {
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    setImgFailed(false);
  }, [project?.id]);

  useEffect(() => {
    if (!project) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="case-study-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#111015]/75 p-4 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[#e6e2da] bg-[#faf9f6] p-6 shadow-2xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-[#e6e2da] pb-4">
          <div>
            <p className="font-mono text-xs text-[#524e4a]">
              <span className="font-semibold text-[#5b21b6]">{project.index}</span>
              <span aria-hidden="true" className="mx-2 text-[#cbc4b8]">
                ·
              </span>
              <span>{project.industry}</span>
              <span aria-hidden="true" className="mx-2 text-[#cbc4b8]">
                ·
              </span>
              <span>{project.timeline}</span>
            </p>
            <h3
              id="case-study-modal-title"
              className="mt-1.5 font-display text-2xl font-bold tracking-tight text-[#111015]"
            >
              {project.clientName}
            </h3>
            <p className="mt-1 text-sm font-medium text-[#524e4a]">{project.title}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={`Close ${project.clientName} case study`}
            className="inline-flex min-h-[40px] min-w-[40px] items-center justify-center rounded-xl border border-[#e6e2da] bg-white text-[#524e4a] transition-colors hover:bg-[#f4f1ea] hover:text-[#111015]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {!imgFailed && (
          <div className="mt-5 overflow-hidden rounded-xl border border-[#e6e2da] bg-[#141418]">
            <img
              src={project.imagePath}
              alt={project.imageAlt}
              referrerPolicy="no-referrer"
              onError={() => setImgFailed(true)}
              className="aspect-[4/3] max-h-[280px] w-full object-cover"
            />
          </div>
        )}

        <div className="mt-5 rounded-xl border border-[#e6e2da] bg-white p-4">
          <p className="font-mono text-xs font-semibold text-[#5b21b6]">
            Verified Outcome · {project.outcomeMetric}
          </p>
          <p className="mt-1 text-sm font-medium text-[#111015]">{project.outcomeDetail}</p>
        </div>

        <div className="mt-5 space-y-4 text-sm leading-relaxed text-[#3f3b37]">
          <div>
            <h4 className="font-display text-sm font-bold text-[#111015]">The Challenge</h4>
            <p className="mt-1">{project.challenge}</p>
          </div>
          <div>
            <h4 className="font-display text-sm font-bold text-[#111015]">
              Architecture &amp; Execution
            </h4>
            <p className="mt-1">{project.architectureSolution}</p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-5 border-t border-[#e6e2da] pt-5 sm:grid-cols-2">
          <div>
            <h4 className="font-display text-sm font-bold text-[#111015]">Shipped Deliverables</h4>
            <ul className="mt-2.5 space-y-2 text-sm text-[#3f3b37]">
              {project.deliverables.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#5b21b6]" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-[#e6e2da] bg-[#f4f1ea] p-4">
            <h4 className="font-display text-sm font-bold text-[#111015]">Technical Stack</h4>
            <ul className="mt-2.5 space-y-1.5 font-mono text-xs text-[#3f3b37]">
              {project.stack.map((tech) => (
                <li key={tech}>— {tech}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[#e6e2da] pt-5">
          <button
            type="button"
            onClick={() => onRequestSimilar(project)}
            className="inline-flex min-h-[42px] items-center gap-2 rounded-xl bg-[#5b21b6] px-5 py-2.5 text-sm font-semibold text-white whitespace-nowrap shrink-0 transition-colors hover:bg-[#4c1d95]"
          >
            Request Similar Build
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
          <a
            href={project.previewUrl}
            onClick={(e) => {
              e.preventDefault();
              onClose();
              window.history.pushState({}, '', project.previewUrl);
              window.dispatchEvent(new PopStateEvent('popstate'));
            }}
            className="text-sm font-semibold text-[#111015] hover:text-[#5b21b6] hover:underline"
          >
            Open full archive page →
          </a>
        </div>
      </div>
    </div>
  );
}
