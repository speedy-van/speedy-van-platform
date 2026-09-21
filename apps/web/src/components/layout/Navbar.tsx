"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Logo } from "./Logo";

const NAV_LINKS = [
  { href: "/#services", label: "Services" },
  { href: "/#areas", label: "Areas" },
  { href: "/pricing", label: "Pricing" },
  { href: "/#how-it-works", label: "How It Works" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-sm border-b" style={{ background: "rgba(10,9,0,0.92)", borderColor: "rgba(245,158,11,0.12)" }}>
      <nav
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link href="/" aria-label="SpeedyVan home">
          <Logo />
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-6" role="list">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-sm font-semibold text-white/60 hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/auth/login"
            className="text-sm font-semibold text-white/60 hover:text-white transition-colors"
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
            <Image src="/call-icon.png" alt="Call us" width={44} height={44} priority />
          </a>
          <Link
            href="/book"
            className="btn-primary text-sm px-4 py-2"
          >
            Book Now
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="md:hidden relative z-50 flex flex-col justify-center items-center w-10 h-10 gap-1.5 rounded-lg hover:bg-white/10 transition-colors"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          <span
            className={`block w-5 h-0.5 bg-white transition-all duration-300 ${
              open ? "rotate-45 translate-y-2" : ""
            }`}
          />
          <span
            className={`block w-5 h-0.5 bg-white transition-all duration-300 ${
              open ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block w-5 h-0.5 bg-white transition-all duration-300 ${
              open ? "-rotate-45 -translate-y-2" : ""
            }`}
          />
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={`md:hidden absolute inset-x-0 top-16 border-b shadow-lg transition-all duration-300 overflow-hidden ${
          open ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        }`}
        style={{ background: "#1A1200", borderColor: "rgba(245,158,11,0.15)" }}
      >
        <ul className="px-4 py-4 space-y-1" role="list">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="block px-3 py-2 rounded-lg text-base font-semibold text-white/60 hover:bg-white/08 hover:text-white transition-colors"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/auth/login"
              className="block px-3 py-2 rounded-lg text-base font-semibold text-white/60 hover:bg-white/08 hover:text-white transition-colors"
              onClick={() => setOpen(false)}
            >
              Login
            </Link>
          </li>
          <li>
            <a
              href="tel:07909032889"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-amber-500/10 transition-colors"
              onClick={() => setOpen(false)}
              data-track-event="nav_call_click"
              data-track-location="mobile_menu"
            >
              <Image src="/call-icon.png" alt="" width={36} height={36} aria-hidden="true" />
              <span className="text-base font-semibold text-amber-400">Call us now</span>
            </a>
          </li>
        </ul>
        <div className="px-4 pb-4">
          <Link
            href="/#get-quote"
            className="btn-primary w-full text-center"
            onClick={() => setOpen(false)}
          >
            Get a Quote
          </Link>
        </div>
      </div>
    </header>
  );
}
