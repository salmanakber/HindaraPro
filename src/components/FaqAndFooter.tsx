import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { FAQ_ITEMS, FOUNDER_PROFILE, SAAS_VENTURES } from '../data/portfolio';

interface FooterProps {
  currentPath: string;
  onNavigate: (path: string, hash?: string) => void;
}

export function FaqSection() {
  const [openFaqId, setOpenFaqId] = useState<string | null>(FAQ_ITEMS[0].id);

  return (
    <section id="faq" className="scroll-mt-20 border-b border-[#e8e2f6] bg-[#fcfbff] py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="text-xs font-semibold tracking-wider text-[#5b21b6] uppercase sm:text-sm">
              FAQ
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-[#15102b] sm:text-4xl">
              Questions about Hindara Labs &amp;{' '}
              <span className="font-editorial text-[#6d28d9]">hiring.</span>
            </h2>
            <p className="mt-3 text-base text-[#4b4466]">
              Clarity on product ownership, working directly with {FOUNDER_PROFILE.primaryName},
              and how client builds run.
            </p>
          </div>

          <div className="space-y-3 lg:col-span-7">
            {FAQ_ITEMS.map((item) => {
              const isOpen = openFaqId === item.id;
              return (
                <div
                  key={item.id}
                  className="rounded-2xl border border-[#e3dcf5] bg-[#f6f3ff]"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqId(isOpen ? null : item.id)}
                    aria-expanded={isOpen}
                    className="flex min-h-[54px] w-full items-center justify-between gap-4 px-5 py-4 text-left font-display text-base font-semibold text-[#15102b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5b21b6]"
                  >
                    <span>{item.question}</span>
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 text-[#5b21b6] transition-transform duration-150 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                  {isOpen && (
                    <div className="rounded-b-2xl border-t border-[#e3dcf5] bg-white px-5 py-4 text-sm leading-relaxed text-[#4b4466]">
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export function SiteFooter({ currentPath, onNavigate }: FooterProps) {
  const handleAnchor = (hash: string) => {
    if (currentPath !== '/') {
      onNavigate('/', hash);
    } else {
      document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="border-t border-[#e8e2f6] bg-[#f6f3ff] py-12 text-sm text-[#4b4466]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-display text-base font-bold text-[#15102b]">
              Hindara Labs
            </p>
            <p className="mt-2 leading-relaxed">
              Multi-SaaS venture studio owned and led by{' '}
              <strong className="font-semibold text-[#15102b]">
                {FOUNDER_PROFILE.primaryName}
              </strong>
              .
            </p>
          </div>

          <div>
            <h3 className="font-display text-xs font-bold uppercase tracking-wider text-[#15102b]">
              Owned SaaS Products
            </h3>
            <ul className="mt-3 space-y-2">
              {SAAS_VENTURES.map((v) => (
                <li key={v.id}>
                  <a
                    href={v.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#5b21b6] hover:underline"
                  >
                    {v.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-xs font-bold uppercase tracking-wider text-[#15102b]">
              Studio &amp; Hiring
            </h3>
            <ul className="mt-3 space-y-2">
              <li>
                <a
                  href="/#portfolio"
                  onClick={(e) => {
                    e.preventDefault();
                    handleAnchor('#portfolio');
                  }}
                  className="hover:text-[#5b21b6] hover:underline"
                >
                  Venture Portfolio
                </a>
              </li>
              <li>
                <a
                  href="/#brand-films"
                  onClick={(e) => {
                    e.preventDefault();
                    handleAnchor('#brand-films');
                  }}
                  className="hover:text-[#5b21b6] hover:underline"
                >
                  Studio Brand Films
                </a>
              </li>
              <li>
                <a
                  href="/#founder"
                  onClick={(e) => {
                    e.preventDefault();
                    handleAnchor('#founder');
                  }}
                  className="hover:text-[#5b21b6] hover:underline"
                >
                  Founder — {FOUNDER_PROFILE.primaryName}
                </a>
              </li>
              <li>
                <a
                  href="/#capabilities"
                  onClick={(e) => {
                    e.preventDefault();
                    handleAnchor('#capabilities');
                  }}
                  className="hover:text-[#5b21b6] hover:underline"
                >
                  Engineering Capabilities
                </a>
              </li>
              <li>
                <a
                  href="/#hire-me"
                  onClick={(e) => {
                    e.preventDefault();
                    handleAnchor('#hire-me');
                  }}
                  className="font-semibold text-[#5b21b6] hover:underline"
                >
                  Hire Me — Start a Brief
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-xs font-bold uppercase tracking-wider text-[#15102b]">
              Direct Contact &amp; Legal
            </h3>
            <ul className="mt-3 space-y-2">
              <li>
                <a
                  href={`mailto:${FOUNDER_PROFILE.email}`}
                  className="hover:text-[#5b21b6] hover:underline"
                >
                  {FOUNDER_PROFILE.email}
                </a>
              </li>
              <li>
                <a
                  href={FOUNDER_PROFILE.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#5b21b6] hover:underline"
                >
                  LinkedIn — {FOUNDER_PROFILE.primaryName}
                </a>
              </li>
              <li>
                <a
                  href="/privacy"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('/privacy');
                  }}
                  className={`hover:text-[#5b21b6] hover:underline ${
                    currentPath === '/privacy' ? 'font-semibold text-[#5b21b6]' : ''
                  }`}
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="/terms"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('/terms');
                  }}
                  className={`hover:text-[#5b21b6] hover:underline ${
                    currentPath === '/terms' ? 'font-semibold text-[#5b21b6]' : ''
                  }`}
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-[#e3dcf5] pt-6 text-xs text-[#5e567a] sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Hindara Labs · {FOUNDER_PROFILE.primaryName}. All rights reserved.</p>
          <p>More SaaS products coming soon.</p>
        </div>
      </div>
    </footer>
  );
}
