'use client';

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
      // If no README, redirect to generate page
      router.push('/generate');
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

  const handleExportPDF = async () => {
    const element = document.getElementById('readme-preview');
    if (!element) return;
    
    // Dynamically import html2pdf only on client side
    const html2pdf = (await import('html2pdf.js')).default;
    
    const opt = {
      margin: 1,
      filename: 'README.pdf',
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in' as const, format: 'letter' as const, orientation: 'portrait' as const },
    };
    html2pdf().set(opt).from(element).save();
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
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white flex items-center justify-center">
        <div className="text-pink-600 text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b border-pink-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-pink-600 bg-clip-text text-transparent cursor-pointer">
              README Generator
            </h1>
          </Link>
          <Link
            href="/generate"
            className="text-gray-600 hover:text-pink-600 transition-colors"
          >
            ← New README
          </Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Preview Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-pink-100 p-8 mb-8">
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
              className="flex-1 bg-gradient-to-r from-pink-500 to-pink-600 hover:shadow-lg text-white font-semibold py-3 rounded-xl transition-all"
            >
              Copy
            </button>
            <button
              onClick={handleDownload}
              className="flex-1 bg-gradient-to-r from-pink-500 to-pink-600 hover:shadow-lg text-white font-semibold py-3 rounded-xl transition-all"
            >
              Download .md
            </button>
            <button
              onClick={handleExportPDF}
              className="flex-1 bg-gradient-to-r from-pink-500 to-pink-600 hover:shadow-lg text-white font-semibold py-3 rounded-xl transition-all"
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