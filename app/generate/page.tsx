'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';

export default function GeneratePage() {
  const router = useRouter();
  const [repoUrl, setRepoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repoUrl }),
      });

      const data = await response.json();
      
      if (response.ok) {
        // Store README in localStorage
        localStorage.setItem('readme', data.readme);
        // Redirect to preview page
        router.push('/preview');
      } else {
        setError(data.error || 'Failed to generate README');
      }
    } catch (error) {
      setError('Error connecting to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Subtle premium glow */}
      <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-pink-100 rounded-full blur-[140px] opacity-20 pointer-events-none" />

      <Navbar variant="simple" />

      {/* Main Hero Section */}
      <div className="max-w-3xl mx-auto text-center pt-20 pb-10 px-6 relative z-10">
        <h1 className="text-5xl font-bold tracking-tight mb-4">
          Generate{' '}
          <span className="bg-gradient-to-r from-pink-500 to-pink-600 bg-clip-text text-transparent">
            README
          </span>
        </h1>
        <p className="text-lg text-gray-600 mb-10">
          Enter any GitHub repository URL to get started
        </p>

        {/* Premium Input Card */}
        <div className="bg-white rounded-3xl border border-pink-100 shadow-xl shadow-pink-500/5 p-8 hover:shadow-pink-500/10 transition">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-900 font-semibold mb-3 text-base">
                GitHub Repository URL
              </label>
              <input
                type="url"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none text-base transition-all"
                placeholder="https://github.com/readmegen/readmegen"
                required
              />
              <p className="text-sm text-gray-500 mt-2">
                Example: https://github.com/readmegen/readmegen
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 bg-gradient-to-r from-pink-500 to-pink-600 text-white py-4 rounded-xl font-medium shadow-lg shadow-pink-500/20 hover:shadow-pink-500/40 hover:-translate-y-0.5 hover:scale-[1.01] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:scale-100"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating README...
                </span>
              ) : (
                'Generate README'
              )}
            </button>
          </form>
        </div>

        {/* Feature Cards */}
        <div className="max-w-5xl mx-auto mt-16 grid md:grid-cols-3 gap-6 px-6">
          <div className="bg-white rounded-2xl border border-pink-100 p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition text-center">
            <div className="text-3xl mb-2">⚡</div>
            <p className="text-sm text-gray-600">Fast generation in seconds</p>
          </div>
          <div className="bg-white rounded-2xl border border-pink-100 p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition text-center">
            <div className="text-3xl mb-2">🤖</div>
            <p className="text-sm text-gray-600">AI-powered content creation</p>
          </div>
          <div className="bg-white rounded-2xl border border-pink-100 p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition text-center">
            <div className="text-3xl mb-2">✏️</div>
            <p className="text-sm text-gray-600">Refine with AI chat after</p>
          </div>
        </div>
      </div>
    </div>
  );
}
