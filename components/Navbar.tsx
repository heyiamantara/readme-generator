'use client';

import Link from 'next/link';
import { FileText, Menu, X } from 'lucide-react';
import { useState } from 'react';

interface NavbarProps {
  variant?: 'landing' | 'simple';
}

export default function Navbar({ variant = 'landing' }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
    setMobileOpen(false);
  };

  const scrollToCTA = () => {
    document.getElementById('getting-started')?.scrollIntoView({ behavior: 'smooth' });
    setMobileOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-pink-100">
      <div className="max-w-7xl mx-auto px-8 py-5 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center text-white">
            <FileText className="h-5 w-5" />
          </div>
          <span className="text-xl font-semibold tracking-tight text-gray-900">
            ReadmeGen
          </span>
        </Link>

        {variant === 'landing' ? (
          <>
            {/* Desktop */}
            <div className="hidden items-center gap-8 md:flex">
              <button
                onClick={scrollToFeatures}
                className="text-sm text-gray-600 transition-colors hover:text-gray-900"
              >
                Features
              </button>
              <button
                onClick={scrollToCTA}
                className="text-sm text-gray-600 transition-colors hover:text-gray-900"
              >
                Getting Started
              </button>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-600 transition-colors hover:text-gray-900"
              >
                GitHub
              </a>
              <Link
                href="/generate"
                className="bg-gradient-to-r from-pink-500 to-pink-600 text-white px-5 py-2.5 rounded-xl shadow-md shadow-pink-500/20 hover:shadow-pink-500/40 hover:scale-105 transition font-medium text-sm"
              >
                Try It Now
              </Link>
            </div>

            {/* Mobile toggle */}
            <button
              className="md:hidden text-gray-900"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </>
        ) : (
          <Link
            href="/"
            className="text-gray-600 hover:text-pink-600 transition"
          >
            ← Back
          </Link>
        )}
      </div>

      {/* Mobile menu */}
      {variant === 'landing' && mobileOpen && (
        <div className="border-t border-pink-100 bg-white/95 backdrop-blur-xl px-8 py-4 md:hidden animate-fade-in">
          <div className="flex flex-col gap-4">
            <button
              onClick={scrollToFeatures}
              className="text-sm text-gray-600 text-left"
            >
              Features
            </button>
            <button
              onClick={scrollToCTA}
              className="text-sm text-gray-600 text-left"
            >
              Getting Started
            </button>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-600"
            >
              GitHub
            </a>
            <Link
              href="/generate"
              onClick={() => setMobileOpen(false)}
              className="bg-gradient-to-r from-pink-500 to-pink-600 text-white px-5 py-2.5 rounded-xl font-medium text-center text-sm"
            >
              Try It Now
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

