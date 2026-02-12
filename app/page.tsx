'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    features: '',
    techStack: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (response.ok) {
        // Store README in localStorage
        localStorage.setItem('readme', data.readme);
        // Redirect to preview page
        router.push('/preview');
      } else {
        alert(data.error || 'Failed to generate README');
      }
    } catch (error) {
      alert('Error generating README');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-pink-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Title */}
        <h1 className="text-5xl font-bold text-pink-600 text-center mb-12">
          README Generator
        </h1>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-md border border-pink-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-pink-600 font-semibold mb-2">
                Project Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="My Awesome Project"
                required
              />
            </div>

            <div>
              <label className="block text-pink-600 font-semibold mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 h-24"
                placeholder="A brief description of your project..."
                required
              />
            </div>

            <div>
              <label className="block text-pink-600 font-semibold mb-2">
                Features
              </label>
              <textarea
                value={formData.features}
                onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                className="w-full px-4 py-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 h-24"
                placeholder="Feature 1, Feature 2, Feature 3..."
                required
              />
            </div>

            <div>
              <label className="block text-pink-600 font-semibold mb-2">
                Tech Stack
              </label>
              <textarea
                value={formData.techStack}
                onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
                className="w-full px-4 py-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 h-24"
                placeholder="React, Node.js, MongoDB..."
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50"
            >
              {loading ? 'Generating...' : 'Generate README'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
