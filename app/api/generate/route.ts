import { NextRequest, NextResponse } from 'next/server';
import { generateReadme, ProjectInfo } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const body: ProjectInfo = await request.json();
    
    if (!body.name || !body.description || !body.features || !body.techStack) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    const readme = await generateReadme(body);
    
    return NextResponse.json({ readme });
  } catch (error) {
    console.error('Error generating README:', error);
    return NextResponse.json(
      { error: 'Failed to generate README' },
      { status: 500 }
    );
  }
}
