import { GoogleGenerativeAI } from '@google/generative-ai';

export interface ProjectInfo {
  name: string;
  description: string;
  features: string;
  techStack: string;
}

export async function generateReadme(projectInfo: ProjectInfo): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not set');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const prompt = `You are an expert technical writer specializing in GitHub README files.

Generate a professional, well-formatted GitHub README.md using proper Markdown syntax.

CRITICAL FORMATTING RULES:
- Use # for main title (only one)
- Use ## for section headings
- Use ### for subsections if needed
- Use - or * for bullet points (with space after)
- Use triple backticks (\`\`\`) for code blocks with language tags
- Add blank lines between sections for proper spacing
- Use **bold** for emphasis where appropriate
- Ensure proper indentation and spacing

PROJECT INFORMATION:
- Project Name: ${projectInfo.name}
- Description: ${projectInfo.description}
- Features: ${projectInfo.features}
- Tech Stack: ${projectInfo.techStack}

REQUIRED SECTIONS (in this order):

# ${projectInfo.name}

## Description
[Write a clear, concise description based on the provided description]

## Features
[List each feature as a bullet point using "-"]
- Feature 1
- Feature 2
- etc.

## Tech Stack
[List each technology as a bullet point using "-"]
- Technology 1
- Technology 2
- etc.

## Installation

Provide step-by-step installation instructions with code blocks:

\`\`\`bash
# Example commands
npm install
\`\`\`

## Usage

Provide clear usage instructions with code examples:

\`\`\`bash
# Example usage
npm start
\`\`\`

## Contributing

Add a brief contributing section.

## License

Add a license section (MIT or similar).

## Author

Add author/contact information.

OUTPUT REQUIREMENTS:
- Output ONLY the markdown content
- Do NOT wrap the output in code blocks
- Do NOT add any explanatory text before or after
- Start directly with the # title
- Use proper markdown syntax throughout
- Ensure all sections are well-spaced and formatted
- Make it look professional and GitHub-ready`;

  const result = await model.generateContent(prompt);
  const response = result.response;
  let text = response.text();
  
  // Clean up the response - remove markdown code block wrappers if present
  text = text.trim();
  
  // Remove ```markdown or ``` wrappers
  if (text.startsWith('```markdown')) {
    text = text.replace(/^```markdown\n/, '').replace(/\n```$/, '');
  } else if (text.startsWith('```')) {
    text = text.replace(/^```\n/, '').replace(/\n```$/, '');
  }
  
  text = text.trim();
  
  return text;
}

export async function refineReadme(currentReadme: string, instruction: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not set');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const prompt = `You are a GitHub README editor. You MUST make changes based on the user's request.

USER REQUEST: "${instruction}"

CURRENT README:
${currentReadme}

YOUR TASK:
1. Analyze the user's request: "${instruction}"
2. Make the EXACT changes they asked for
3. Return the COMPLETE modified README

EXAMPLES OF WHAT TO DO:
- "add bullets to features" → Find Features section, format each feature as "- Feature name"
- "add badges" → Add badge images at the top like ![Badge](url)
- "add docker" → Add a new ## Docker section with setup instructions
- "improve description" → Rewrite the description to be more detailed
- "make it professional" → Enhance language, add more sections

FORMATTING RULES:
- Use # for main title
- Use ## for section headings  
- Use - for bullet points
- Use \`\`\` for code blocks
- DO NOT wrap output in code blocks
- Start with # title

YOU MUST MAKE CHANGES. Do not return the same content. Actually implement what the user asked for.

Output the complete updated README now:`;

  const result = await model.generateContent(prompt);
  const response = result.response;
  let text = response.text();
  
  // Clean up the response - remove markdown code block wrappers if present
  text = text.trim();
  
  // Remove ```markdown or ``` wrappers
  if (text.startsWith('```markdown')) {
    text = text.replace(/^```markdown\n/, '').replace(/\n```$/, '');
  } else if (text.startsWith('```')) {
    text = text.replace(/^```\n/, '').replace(/\n```$/, '');
  }
  
  text = text.trim();
  
  console.log('Instruction:', instruction);
  console.log('Original length:', currentReadme.length);
  console.log('Refined length:', text.length);
  console.log('Changed:', currentReadme !== text);
  
  return text;
}
