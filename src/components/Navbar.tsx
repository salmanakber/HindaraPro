import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { FOUNDER_PROFILE } from '../data/portfolio';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string, hash?: string) => void;
}

const NAV_LINKS: Array<{ label: string; path: string; hash?: string }> = [
  { label: 'Ventures', path: '/', hash: '#portfolio' },
  { label: 'Client Work', path: '/projects' },
  { label: 'About', path: '/about' },
  { label: 'Services', path: '/services' },
  { label: 'FAQ', path: '/', hash: '#faq' },
];

export function Navbar({ currentPath, onNavigate }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);

  const handleLinkClick = (path: string, hash?: string) => {
    setMobileOpen(false);
    if (path === '/' && hash && currentPath === '/') {
      document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    onNavigate(path, hash);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[#e6e2da] bg-[#faf9f6]/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-8 px-4 py-3.5 sm:px-6">
        {/* Zone 1: Brand Wordmark */}
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            handleLinkClick('/');
          }}
          className="flex items-center gap-2.5 whitespace-nowrap shrink-0 text-base font-bold tracking-tight text-[#111015] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#5b21b6]"
        >
          {!logoFailed ? (
            <img
              src={FOUNDER_PROFILE.logoPath}
              alt="Hindara Labs mark"
              width={30}
              height={30}
              referrerPolicy="no-referrer"
              onError={() => setLogoFailed(true)}
              className="h-7.5 w-7.5 object-contain"
            />
          ) : (
            <span
              aria-hidden="true"
              className="inline-flex h-7.5 w-7.5 items-center justify-center rounded-lg bg-[#111015] text-xs font-bold text-white"
            >
              H
            </span>
          )}
          <span className="font-display">Hindara Labs</span>
        </a>

        {/* Zone 2: Single-line navigation links */}
        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-8 text-sm font-medium text-[#524e4a]"
        >
          {NAV_LINKS.map((link) => {
            const href = link.hash ? `${link.path}${link.hash}` : link.path;
            const isCurrentRoute = !link.hash && currentPath === link.path;
            return (
              <a
                key={href}
                href={href}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(link.path, link.hash);
                }}
                aria-current={isCurrentRoute ? 'page' : undefined}
                className={`whitespace-nowrap shrink-0 py-1 transition-colors hover:text-[#111015] hover:underline hover:underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#5b21b6] ${
                  isCurrentRoute ? 'font-semibold text-[#111015] underline underline-offset-4' : ''
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* Zone 3: Single Primary Action + Mobile Drawer Toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="/#hire-me"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick('/', '#hire-me');
            }}
            className="hidden sm:inline-flex min-h-[42px] items-center justify-center rounded-xl bg-[#111015] px-5 py-2 text-sm font-semibold text-white whitespace-nowrap shrink-0 transition-colors hover:bg-[#5b21b6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5b21b6]"
          >
            Hire Me
          </a>
          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-[#e0dbd0] bg-white text-[#111015] md:hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5b21b6]"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav
          aria-label="Mobile navigation"
          className="border-t border-[#e6e2da] bg-[#faf9f6] px-4 py-4 md:hidden"
        >
          <div className="flex flex-col gap-2">
            {NAV_LINKS.map((link) => {
              const href = link.hash ? `${link.path}${link.hash}` : link.path;
              return (
                <a
                  key={href}
                  href={href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleLinkClick(link.path, link.hash);
                  }}
                  className="flex min-h-[44px] items-center rounded-xl px-3 text-base font-medium text-[#2d2a27] hover:bg-[#f4f1ea] hover:text-[#111015]"
                >
                  {link.label}
                </a>
              );
            })}
            <a
              href="/#hire-me"
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick('/', '#hire-me');
              }}
              className="mt-2 flex min-h-[44px] items-center justify-center rounded-xl bg-[#5b21b6] px-4 text-base font-semibold text-white hover:bg-[#4c1d95]"
            >
              Hire {FOUNDER_PROFILE.primaryName}
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
