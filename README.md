# README Generator

A simple, beginner-friendly web app that generates professional GitHub README.md files using the Google Gemini API with AI-powered editing capabilities.

## Features

- Two-page flow: Input form → Preview page
- Generate professional README.md files with AI
- AI-powered chatbox for dynamic README editing
- Beautiful cute pink aesthetic UI
- Copy generated README to clipboard
- Download as README.md file
- Export as PDF
- Real-time markdown preview
- Natural language editing (e.g., "Add Docker setup", "Add badges")
- LocalStorage for README persistence

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- TailwindCSS
- Google Gemini API (gemini-2.5-flash)
- react-markdown
- html2pdf.js

## Setup

1. Clone the repository

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory:
```bash
GEMINI_API_KEY=your_gemini_api_key_here
```

4. Get your Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## App Flow

### Page 1: Input Form (/)

1. Fill in the form with your project details:
   - Project Name
   - Description
   - Features
   - Tech Stack

2. Click "Generate README"

3. README is generated and stored in localStorage

4. Automatically redirected to preview page

### Page 2: Preview Page (/preview)

Layout (vertical):
- README preview card (with rendered markdown)
- Action buttons (Copy, Download .md, Export PDF)
- Chat box BELOW preview (not side-by-side)

## Using the AI Chat

Once on the preview page, use the chatbox to refine your README:

Example commands:
- "Add badges"
- "Add Docker setup"
- "Improve description"
- "Add contributing guidelines"
- "Add installation steps"
- "Make it more professional"
- "Add API documentation"
- "Add Kubernetes deployment"

The AI will modify your README based on your instructions while keeping existing content intact.

## Export Options

- **Copy**: Copy README to clipboard
- **Download .md**: Save as README.md file
- **Export PDF**: Download as PDF document

## Project Structure

```
readme-generator/
├── app/
│   ├── api/
│   │   ├── generate/
│   │   │   └── route.ts       # Generate initial README
│   │   └── refine/
│   │       └── route.ts       # Refine existing README
│   ├── preview/
│   │   └── page.tsx           # Preview page with chat
│   ├── page.tsx               # Input form page
│   ├── layout.tsx             # App layout
│   └── globals.css            # Global styles
├── components/
│   └── ChatBox.tsx            # AI chatbox component
├── lib/
│   └── gemini.ts              # Gemini API functions
└── .env.local                 # Environment variables
```

## How It Works

1. User fills form on home page
2. Form submits to `/api/generate`
3. Gemini generates professional README
4. README stored in localStorage
5. User redirected to `/preview`
6. Preview page loads README from localStorage
7. User can refine README using chatbox
8. Chatbox sends instructions to `/api/refine`
9. Gemini modifies README based on instructions
10. Updated README displayed and saved to localStorage
11. User can copy, download, or export as PDF

## Functions

### `generateReadme(projectInfo)`
Generates initial README from project information using Gemini API.

### `refineReadme(currentReadme, instruction)`
Refines existing README based on user instruction using Gemini API.

## Author

Built with ❤️ using Next.js and Gemini AI
