import { NextRequest, NextResponse } from 'next/server';
import { refineReadme } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { readme, instruction } = body;
    
    console.log('=== REFINE REQUEST ===');
    console.log('Instruction:', instruction);
    console.log('Current README length:', readme?.length);
    console.log('Current README preview:', readme?.substring(0, 100));
    
    if (!readme || !instruction) {
      return NextResponse.json(
        { error: 'README content and instruction are required' },
        { status: 400 }
      );
    }

    const updatedReadme = await refineReadme(readme, instruction);
    
    console.log('=== REFINE RESPONSE ===');
    console.log('Updated README length:', updatedReadme.length);
    console.log('Updated README preview:', updatedReadme.substring(0, 100));
    console.log('Has changes:', updatedReadme !== readme);
    
    return NextResponse.json({ updatedReadme });
  } catch (error) {
    console.error('=== REFINE ERROR ===');
    console.error('Error refining README:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Failed to refine README: ${errorMessage}` },
      { status: 500 }
    );
  }
}
