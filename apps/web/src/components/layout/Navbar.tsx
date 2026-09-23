"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import { Logo } from "./Logo";

const NAV_LINKS = [
  { href: "/services", label: "Services" },
  { href: "/areas", label: "Areas" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
];

export function Navbar() {
  const menuRef = useRef<HTMLDetailsElement>(null);

  function closeMenu() {
    if (menuRef.current) menuRef.current.open = false;
  }

  return (
    <header className="sticky top-0 z-50 backdrop-blur-sm border-b" style={{ background: "rgba(10,9,0,0.92)", borderColor: "rgba(245,158,11,0.12)" }}>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:z-[60] focus:rounded-lg focus:bg-amber-400 focus:px-4 focus:py-3 focus:font-bold focus:text-black"
      >
        Skip to content
      </a>
      <nav
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link href="/" aria-label="SpeedyVan home" className="shrink-0 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-400">
          <Logo priority />
        </Link>

        {/* Desktop links */}
        <ul className="hidden lg:flex items-center gap-6" role="list">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="rounded text-sm font-semibold text-white/70 hover:text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-400"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <div className="hidden lg:flex items-center gap-3">
          <Link
            href="/auth/login"
            className="rounded text-sm font-semibold text-white/70 hover:text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-400"
          >
            Login
          </Link>
          <a
            href="tel:07909032889"
            aria-label="Call us on 07909 032889"
            data-track-event="nav_call_click"
            data-track-location="desktop_nav"
            className="flex items-center justify-center transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 rounded-full"
          >
            <Image src="/call-icon.png" alt="" width={44} height={44} sizes="44px" />
          </a>
          <Link
            href="/book"
            className="btn-primary text-sm px-4 py-2"
          >
            Book Now
          </Link>
        </div>

        {/* A native disclosure keeps navigation usable before hydration. */}
        <details
          ref={menuRef}
          className="group lg:hidden"
          onKeyDown={(event) => {
            if (event.key === "Escape" && menuRef.current?.open) {
              event.preventDefault();
              closeMenu();
              menuRef.current.querySelector("summary")?.focus();
            }
          }}
          onBlur={(event) => {
            if (
              event.relatedTarget instanceof Node &&
              !event.currentTarget.contains(event.relatedTarget)
            ) {
              closeMenu();
            }
          }}
        >
          <summary
            className="relative z-50 flex flex-col justify-center items-center w-11 h-11 gap-1.5 rounded-lg hover:bg-white/10 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
            aria-label="Navigation menu"
            aria-controls="mobile-menu"
          >
            <span aria-hidden="true" className="block w-5 h-0.5 bg-white transition-transform duration-300 group-open:rotate-45 group-open:translate-y-2" />
            <span aria-hidden="true" className="block w-5 h-0.5 bg-white transition-opacity duration-300 group-open:opacity-0" />
            <span aria-hidden="true" className="block w-5 h-0.5 bg-white transition-transform duration-300 group-open:-rotate-45 group-open:-translate-y-2" />
          </summary>
          <div
            id="mobile-menu"
            className="mobile-nav-menu absolute inset-x-0 top-16 overflow-y-auto overscroll-contain border-b shadow-lg"
            style={{ background: "#1A1200", borderColor: "rgba(245,158,11,0.15)" }}
          >
            <ul className="px-4 py-4 space-y-1" role="list">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="block px-3 py-3 rounded-lg text-base font-semibold text-white/70 hover:bg-white/10 hover:text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400"
                    onClick={closeMenu}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/auth/login"
                  className="block px-3 py-3 rounded-lg text-base font-semibold text-white/70 hover:bg-white/10 hover:text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400"
                  onClick={closeMenu}
                >
                  Login
                </Link>
              </li>
              <li>
                <a
                  href="tel:07909032889"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-amber-500/10 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400"
                  onClick={closeMenu}
                  data-track-event="nav_call_click"
                  data-track-location="mobile_menu"
                >
                  <Image src="/call-icon.png" alt="" width={36} height={36} sizes="36px" aria-hidden="true" />
                  <span className="text-base font-semibold text-amber-400">Call us now</span>
                </a>
              </li>
            </ul>
            <div className="px-4 pb-4">
              <Link
                href="/#get-quote"
                className="btn-primary w-full text-center"
                onClick={closeMenu}
              >
                Get a Quote
              </Link>
            </div>
          </div>
        </details>
      </nav>
    </header>
  );
}
