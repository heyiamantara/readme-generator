import { NextRequest, NextResponse } from 'next/server';
import { generateReadmeFromGitHub } from '@/lib/gemini';
import { fetchRepoData } from '@/lib/github';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { repoUrl } = body;
    
    if (!repoUrl) {
      return NextResponse.json(
        { error: 'GitHub repository URL is required' },
        { status: 400 }
      );
    }

    console.log('Fetching repo data for:', repoUrl);
    
    // Fetch repository data from GitHub
    const repoData = await fetchRepoData(repoUrl);
    
    console.log('Repo data fetched:', repoData.name);
    
    // Generate README using Gemini
    const readme = await generateReadmeFromGitHub(repoData);
    
    console.log('README generated, length:', readme.length);
    
    return NextResponse.json({ readme });
  } catch (error) {
    console.error('Error generating README:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate README';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
