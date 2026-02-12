'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import html2pdf from 'html2pdf.js';
import ChatBox from '@/components/ChatBox';

export default function PreviewPage() {
  const router = useRouter();
  const [readme, setReadme] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get README from localStorage
    const storedReadme = localStorage.getItem('readme');
    if (storedReadme) {
      setReadme(storedReadme);
    } else {
      // If no README, redirect to home
      router.push('/');
    }
    setLoading(false);
  }, [router]);

  const handleCopy = () => {
    navigator.clipboard.writeText(readme);
    alert('README copied to clipboard!');
  };

  const handleDownload = () => {
    const blob = new Blob([readme], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'README.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportPDF = () => {
    const element = document.getElementById('readme-preview');
    const opt = {
      margin: 1,
      filename: 'README.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
    };
    html2pdf().set(opt).from(element).save();
  };

  const handleBack = () => {
    router.push('/');
  };

  const handleReadmeUpdate = (newReadme: string) => {
    console.log('=== PREVIEW UPDATE ===');
    console.log('Old README length:', readme.length);
    console.log('New README length:', newReadme.length);
    console.log('Content changed:', readme !== newReadme);
    console.log('New README preview:', newReadme.substring(0, 200));
    
    if (readme === newReadme) {
      console.warn('WARNING: README content is identical - no changes made by AI');
    }
    
    setReadme(newReadme);
    // Update localStorage
    localStorage.setItem('readme', newReadme);
    console.log('README updated in state and localStorage');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-pink-50 flex items-center justify-center">
        <div className="text-pink-600 text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pink-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Title */}
        <div className="flex items-center justify-between mb-12">
          <h1 className="text-5xl font-bold text-pink-600">
            README Generator
          </h1>
          <button
            onClick={handleBack}
            className="text-pink-500 hover:text-pink-600 underline"
          >
            ← Back to Form
          </button>
        </div>

        {/* Preview Card */}
        <div className="bg-white rounded-2xl shadow-md border border-pink-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-pink-600 mb-6">Preview</h2>
          
          <div
            id="readme-preview"
            className="prose mb-6 p-6 bg-pink-50 rounded-xl max-h-[600px] overflow-y-auto"
          >
            <ReactMarkdown>{readme}</ReactMarkdown>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleCopy}
              className="flex-1 bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              Copy
            </button>
            <button
              onClick={handleDownload}
              className="flex-1 bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              Download .md
            </button>
            <button
              onClick={handleExportPDF}
              className="flex-1 bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              Export PDF
            </button>
          </div>
        </div>

        {/* ChatBox - BELOW Preview */}
        <ChatBox readme={readme} onReadmeUpdate={handleReadmeUpdate} />
      </div>
    </div>
  );
}
