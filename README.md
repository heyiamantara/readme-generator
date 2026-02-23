# Readme Generator Project

A premium AI-powered SaaS app that generates professional GitHub README.md files automatically by analyzing any GitHub repository.

## Features

- **Premium SaaS Landing Page**: Beautiful, modern landing page inspired by Linear, Vercel, and Supabase
- **Automatic GitHub Analysis**: Fetches repository data including language, topics, stars, and forks
- **AI-Powered Generation**: Uses Google Gemini AI to create professional README files
- **AI Chat Refinement**: Edit and improve your README using natural language
- **Beautiful UI**: Cute pink professional theme with gradients and animations
- **Export Options**: Copy to clipboard, download as .md, or export as PDF
- **Real-time Preview**: See your README rendered with proper markdown formatting

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- TailwindCSS (with gradients and animations)
- Google Gemini API (gemini-2.5-flash)
- GitHub API
- react-markdown
- html2pdf.js

## Page Structure

/                → Premium Landing Page
/generate        → GitHub URL input page
/preview         → README preview with AI chat

## User Flow

1. **Landing Page** (`/`) - Premium SaaS homepage with hero, features, and CTA
2. **Generate Page** (`/generate`) - Enter GitHub repository URL
3. **Preview Page** (`/preview`) - View, refine, and export README

## Setup

### 1. Install Dependencies

npm install

### 2. Get API Key

Get your Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

### 3. Configure Environment

Create a `.env.local` file:

GEMINI_API_KEY=your_gemini_api_key_here

### 4. Run Development Server

npm run dev

### 5. Open Browser

Go to [http://localhost:3000](http://localhost:3000)

## Usage

### 1. Landing Page

- View premium SaaS landing page
- Click "Get Started" to begin
- Scroll to see features and demo

### 2. Generate README

- Enter GitHub repository URL (e.g., `https://github.com/vercel/next.js`)
- Click "Generate README"
- Wait for AI to analyze and generate
- Automatically redirected to preview page

### 3. Refine with AI Chat

On the preview page, use the chat to refine your README:

Example commands:
- "Add badges"
- "Add Docker setup"
- "Improve description"
- "Add contributing guidelines"
- "Make it more professional"
- "Add installation steps"

### 4. Export Options

- **Copy**: Copy README to clipboard
- **Download .md**: Save as README.md file
- **Export PDF**: Download as PDF document

## Premium Design Features

### Landing Page
- Sticky navbar with blur background
- Gradient text headings
- Hero section with CTA buttons
- Animated demo preview
- Feature cards with hover effects
- Gradient CTA section
- Clean footer

### Generate Page
- Centered layout
- Large input field
- Loading animation
- Info cards

### Preview Page
- Consistent navbar
- Shadow and border styling
- Gradient buttons
- Chat refinement below preview

### Theme
- Background: `bg-gradient-to-b from-pink-50 to-white`
- Accent: `bg-gradient-to-r from-pink-500 to-pink-600`
- Cards: `rounded-2xl shadow-xl border border-pink-100`
- Buttons: Gradient with hover effects
- Text: Gradient clip for headings

## Project Structure

readme-generator/
├── app/
│   ├── api/
│   │   ├── generate/
│   │   │   └── route.ts       # Generate README from GitHub URL
│   │   └── refine/
│   │       └── route.ts       # Refine README with AI
│   ├── generate/
│   │   └── page.tsx           # GitHub URL input page
│   ├── preview/
│   │   └── page.tsx           # Preview page with chat
│   ├── page.tsx               # Premium landing page
│   ├── layout.tsx             # App layout
│   └── globals.css            # Global styles
├── components/
│   └── ChatBox.tsx            # AI chatbox component
├── lib/
│   ├── gemini.ts              # Gemini AI functions
│   └── github.ts              # GitHub API integration
└── .env.local                 # Environment variables

## API Functions

### GitHub Integration (`lib/github.ts`)

- `extractRepoInfo(repoUrl)` - Extracts owner and repo from URL
- `fetchRepoData(repoUrl)` - Fetches repository data from GitHub API

### AI Generation (`lib/gemini.ts`)

- `generateReadmeFromGitHub(repoData)` - Generates README from GitHub data
- `refineReadme(currentReadme, instruction)` - Refines README based on user instruction

## Design Inspiration

This app's design is inspired by premium SaaS products:
- Linear (clean, modern)
- Vercel (gradients, animations)
- Supabase (professional, developer-focused)
- Raycast (polished, attention to detail)

## Features Breakdown

### Premium Landing Page
- Sticky navbar with backdrop blur
- Large gradient hero text
- Dual CTA buttons (primary + secondary)
- Animated demo preview section
- 3 feature cards with hover animations
- Gradient CTA section
- Clean footer

### Generate Page
- Centered form layout
- Large input with validation
- Loading state with spinner
- Error handling
- Info cards below form

### Preview Page
- README preview with markdown rendering
- 3 action buttons (Copy, Download, Export)
- AI chat refinement below
- Consistent navbar

## No Authentication Required

This app requires no signup or login. Users can:
- Generate READMEs instantly
- Refine with AI chat
- Export in multiple formats

All for free, no barriers.

## Rate Limits

- **GitHub API**: 60 requests/hour (unauthenticated)
- **Gemini API**: Depends on your API key tier

## Author

Built with ❤️ using Next.js, Gemini AI, and GitHub API