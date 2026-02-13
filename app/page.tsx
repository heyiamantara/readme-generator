'use client';

import Link from 'next/link';
import { Sparkles, GitBranch, Bot, FileDown } from 'lucide-react';
import Navbar from '@/components/Navbar';

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-white overflow-hidden">
      <Navbar variant="landing" />

      {/* Hero Section */}
      <section className="relative bg-white overflow-hidden">
        {/* Subtle premium glow effects */}
        <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-pink-100 rounded-full blur-[140px] opacity-20 pointer-events-none" />
        <div className="absolute top-[100px] right-[10%] w-[400px] h-[400px] bg-pink-50 rounded-full blur-[120px] opacity-20 pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 pt-32 pb-24 text-center">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-pink-200 bg-pink-100 px-4 py-1.5 text-sm font-medium text-pink-600 animate-fade-up">
            <Sparkles className="h-3.5 w-3.5" />
            AI-Powered README Generation
          </div>

          {/* Headline */}
          <h1
            className="mb-6 text-5xl font-bold leading-[1.1] tracking-tight text-gray-900 sm:text-6xl md:text-7xl lg:text-8xl animate-fade-up"
            style={{ animationDelay: '0.1s' }}
          >
            Craft Beautiful
            <br />
            <span className="text-gradient-pink">README Files</span>
            <br />
            In Seconds
          </h1>

          {/* Subtext */}
          <p
            className="mx-auto mb-10 max-w-xl text-lg text-gray-600 animate-fade-up"
            style={{ animationDelay: '0.2s' }}
          >
            Transform your GitHub repositories into professionally documented projects using AI-generated README files.
          </p>

          {/* Buttons */}
          <div
            className="flex flex-col items-center justify-center gap-4 sm:flex-row animate-fade-up"
            style={{ animationDelay: '0.3s' }}
          >
            <Link
              href="/generate"
              className="bg-gradient-to-r from-pink-500 to-pink-600 text-white px-8 py-4 rounded-xl font-medium shadow-xl shadow-pink-500/20 hover:shadow-pink-500/40 hover:-translate-y-0.5 hover:scale-[1.02] transition-all duration-200"
            >
              Try It Now
            </Link>
            <button
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              className="border border-pink-200 bg-white px-8 py-4 rounded-xl hover:bg-pink-50 transition-all font-medium text-gray-900"
            >
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-8 py-32">
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-center mb-4 text-gray-900">
            Everything you need
          </h2>
          <p className="text-lg text-gray-600 text-center mb-16">
            Powerful features to create perfect documentation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            {
              icon: GitBranch,
              title: 'Automatic GitHub Analysis',
              description:
                'Simply paste a repository URL and our system automatically analyzes the project structure, dependencies, and codebase to understand your project.',
            },
            {
              icon: Bot,
              title: 'AI-Powered Generation',
              description:
                'Advanced AI models craft comprehensive, well-structured README files tailored to your project\'s unique characteristics and best practices.',
            },
            {
              icon: FileDown,
              title: 'Export to Markdown & PDF',
              description:
                'Download your generated README in Markdown or PDF format, ready to push directly to your repository or share with your team.',
            },
          ].map((feature, i) => (
            <div
              key={feature.title}
              className="group relative bg-white rounded-3xl border border-pink-100 p-10 min-h-[260px] shadow-sm hover:shadow-xl hover:shadow-pink-500/10 hover:-translate-y-1 transition-all duration-300 animate-fade-up before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-b before:from-pink-50 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="relative z-10 w-14 h-14 bg-gradient-to-br from-pink-500 to-pink-600 text-white rounded-xl flex items-center justify-center shadow-md mb-6">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 relative z-10">
                {feature.title}
              </h3>
              <p className="text-base text-gray-600 leading-relaxed relative z-10">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section id="getting-started" className="max-w-4xl mx-auto mt-24 px-8">
        <div className="relative bg-white rounded-3xl border border-pink-200 p-12 text-center shadow-lg">
          {/* Glow effect behind card */}
          <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-pink-200 blur-[120px] opacity-30 rounded-full" />
          
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            Ready to generate your README?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Start creating professional documentation in seconds.
          </p>
          <Link
            href="/generate"
            className="inline-block bg-gradient-to-r from-pink-500 to-pink-600 text-white px-8 py-4 rounded-xl font-medium shadow-lg shadow-pink-500/20 hover:shadow-pink-500/40 hover:-translate-y-0.5 hover:scale-[1.02] transition-all duration-200"
          >
            Get Started
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200/50 py-8 text-center text-sm text-gray-500">
        ReadmeGen © 2026
      </footer>
    </div>
  );
}
