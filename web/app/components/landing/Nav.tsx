'use client';

import { useState } from 'react';

interface NavLink {
  label: string;
  href: string;
}

const NAV_LINKS: ReadonlyArray<NavLink> = [
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Conditions', href: '#conditions' },
  { label: 'Privacy', href: '#privacy' },
];

// TODO: fill real URL before deploy
const APP_STORE_URL = '#';
// TODO: fill real URL before deploy
const PLAY_STORE_URL = '#';

const storeBadgeClass =
  'inline-flex items-center rounded-[9999px] border border-sage/40 px-4 py-2 text-[13px] text-ink-2 hover:border-eucalyptus/50 hover:text-eucalyptus transition-colors';

export default function Nav() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const closeMenu = (): void => setIsOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-sage/20 bg-cream/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <a
          href="/"
          className="font-sans text-[17px] font-semibold tracking-tight text-ink"
        >
          HormonaIQ
        </a>

        {/* Desktop nav links — center */}
        <nav
          aria-label="Primary"
          className="hidden items-center gap-8 md:flex"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[14px] text-ink-2 transition-colors hover:text-ink"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop CTAs — right */}
        <div className="hidden items-center gap-2 md:flex">
          <a
            href={APP_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Download HormonaIQ on the App Store"
            className={storeBadgeClass}
          >
            App Store
          </a>
          <a
            href={PLAY_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Download HormonaIQ on the Play Store"
            className={storeBadgeClass}
          >
            Play Store
          </a>
        </div>

        {/* Mobile cluster: Download + Hamburger */}
        <div className="flex items-center gap-2 md:hidden">
          <a
            href={APP_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Download HormonaIQ on the App Store"
            className="inline-flex items-center rounded-[9999px] border border-sage/40 px-3 py-1.5 text-[12px] text-ink-2 transition-colors hover:border-eucalyptus/50 hover:text-eucalyptus"
          >
            Download
          </a>
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label="Open navigation"
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            className="inline-flex h-10 w-10 items-center justify-center rounded-[9999px] border border-sage/40 text-ink-2 transition-colors hover:border-eucalyptus/50 hover:text-eucalyptus focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-eucalyptus"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M2 5h14M2 9h14M2 13h14"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {isOpen && (
        <div
          id="mobile-menu"
          role="dialog"
          aria-label="Navigation menu"
          className="flex flex-col gap-5 border-b border-sage/20 bg-cream px-6 py-6 md:hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-eucalyptus-soft">
              Menu
            </span>
            <button
              type="button"
              onClick={closeMenu}
              aria-label="Close navigation"
              className="inline-flex h-9 w-9 items-center justify-center rounded-[9999px] border border-sage/40 text-ink-2 transition-colors hover:border-eucalyptus/50 hover:text-eucalyptus focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-eucalyptus"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M3 3l8 8M11 3l-8 8"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          <nav
            aria-label="Mobile primary"
            className="flex flex-col gap-4"
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className="text-[16px] font-medium text-ink transition-colors hover:text-eucalyptus"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex flex-col gap-2 pt-2">
            <a
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Download HormonaIQ on the App Store"
              className={storeBadgeClass}
            >
              App Store
            </a>
            <a
              href={PLAY_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Download HormonaIQ on the Play Store"
              className={storeBadgeClass}
            >
              Play Store
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
