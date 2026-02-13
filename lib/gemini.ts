import { GoogleGenerativeAI } from '@google/generative-ai';
import { GitHubRepoData } from './github';

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

export async function generateReadmeFromGitHub(repoData: GitHubRepoData): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not set');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const topicsStr = repoData.topics.length > 0 ? repoData.topics.join(', ') : 'None';
  const licenseStr = repoData.license || 'Not specified';

  const prompt = `You are an expert at crafting professional, high-quality GitHub README.md files for open-source projects, similar to those in top repositories like React, TensorFlow, or Next.js. Your goal is to generate a premium, production-level README.md based on the provided repository data. Make it detailed, engaging, modern, and non-generic—tailor it specifically to the project's details without using placeholders or filler text. Use emojis sparingly for visual appeal, ensure excellent Markdown formatting with proper headings, lists, code blocks, and tables where appropriate. Structure it like a top-tier open-source README: visually appealing, informative, and encouraging contributions.

Repository data:
Name: ${repoData.name}
Description: ${repoData.description}
Owner: ${repoData.owner.login}
Repository: ${repoData.name} (full name is ${repoData.owner.login}/${repoData.name})
Stars: ${repoData.stargazers_count}
Forks: ${repoData.forks_count}
Primary Language: ${repoData.language}
Topics: ${topicsStr}
License: ${licenseStr}

Generate a README.md that includes ALL of the following sections in this exact order, expanding each with rich, professional content inferred and expanded from the data (e.g., infer features from description and topics, suggest plausible installation/usage based on language and topics, describe project structure logically):

Title: Start with a large H1 header including the project name and a relevant emoji (choose based on topics/description, e.g., 🚀 for innovative tools).

Badges: Display shields.io-style badges in a single line for: GitHub stars, forks, license, and primary language. Use Markdown image syntax like ![Stars](https://img.shields.io/github/stars/${repoData.owner.login}/${repoData.name}).

Overview: A professional, engaging paragraph or two summarizing the project, its purpose, unique value, and key benefits. Make it compelling and tailored, highlighting what makes this project stand out based on description and topics.

Features: A bulleted list of 5-8 key features, inferred and expanded from description, topics, and language. Use nested sub-bullets (indented with 2 spaces) for sub-details. Use emojis sparingly for visual appeal. Make them specific and benefit-oriented. Format like:
- **Feature Name**: Description of the feature
  - Sub-feature or detail
  - Another sub-feature

Tech Stack: A bulleted list of technologies used, inferred from language and topics (e.g., if ${repoData.language} is JavaScript and topics include "react", list React, Node.js, etc.). DO NOT use tables. Use bullet points with clear formatting. Group by category if helpful, using sub-bullets. Format like:
- **Category Name**:
  - Technology 1 - Brief description
  - Technology 2 - Brief description
Or use numbered lists if sequential order matters. Use emojis/icons sparingly for visual appeal.

Installation: Step-by-step numbered instructions (use numbered list: 1., 2., 3., etc.) assuming common setups (e.g., clone repo, install dependencies via npm/yarn if JS, or pip if Python). Include prerequisites as a bulleted list before the numbered steps. Use code blocks for commands. Add troubleshooting tips as a sub-section with bullet points.

Usage: Provide detailed examples with code snippets in appropriate language blocks. Use numbered steps or bullet points to organize usage examples. Show basic to advanced usage, tailored to the project's likely functionality based on data. Format examples clearly with headings or bullet points.

Project Structure: A tree-like representation (using Markdown code block) of a typical file/directory structure, inferred logically from language and topics. After the tree, explain key files/folders using a bulleted list with brief descriptions. Format like:
- \`folder/file.js\` - Description of what this file does

Contributing: Guidelines for contributing organized with clear subsections. Use numbered lists for sequential steps (like setup process) and bullet points for guidelines, code style rules, etc. Include:
- How to set up dev environment (numbered steps)
- Code style guidelines (bulleted list)
- Pull request process (numbered steps or bullets)
- Call to action encouraging community involvement

License: State the license type with a link if applicable, and include the full license notice if it's standard (e.g., MIT).

Author: Credit the owner with a link to their GitHub profile, and optionally add a contact section.

FORMATTING GUIDELINES:
- DO NOT use Markdown tables - they often render poorly. Use bullet points or numbered lists instead.
- Use bullet points (-) for unordered lists and numbered lists (1., 2., 3.) for sequential steps.
- Use nested bullets (indent with 2 spaces) for sub-items and sub-sections.
- Use **bold** for emphasis on key terms, section names, or technology names.
- Use code backticks for file names, commands, and technology names inline (wrap with backticks).
- Use code blocks for code examples (triple backticks followed by language name).
- Add blank lines between sections for readability.
- Use horizontal rules (---) sparingly, only between major sections if needed.

Output ONLY the complete Markdown content for the README.md file. Do not include any additional text, explanations, or wrappers. Ensure the total length is substantial (at least 800-1500 words) but concise and readable. Use modern open-source styling: clean, scannable, with proper spacing between sections.`;

  const result = await model.generateContent(prompt);
  const response = result.response;
  let text = response.text();
  
  // Clean up the response
  text = text.trim();
  
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
