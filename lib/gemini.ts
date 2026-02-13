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

  const prompt = `You are an elite technical writer specializing in creating production-quality GitHub README files for top-tier open-source projects.

REPOSITORY DATA:
- Name: ${repoData.name}
- Owner: ${repoData.owner.login}
- Description: ${repoData.description}
- Language: ${repoData.language}
- Stars: ${repoData.stargazers_count}
- Forks: ${repoData.forks_count}
- Topics: ${topicsStr}
- URL: ${repoData.html_url}

CRITICAL INSTRUCTIONS:
Generate a PREMIUM GitHub README that matches the quality of top repositories like Next.js, Supabase, and Vercel.

EXACT STRUCTURE TO FOLLOW:

# ${repoData.name} 🚀

> [Write a compelling one-line tagline based on the description and language]

---

## 📋 Overview

[Write 2-3 sentences explaining what this project does, why it exists, and who it's for. Be specific and professional. No generic filler.]

## ✨ Features

- **[Feature 1]**: [Brief description]
- **[Feature 2]**: [Brief description]
- **[Feature 3]**: [Brief description]
- **[Feature 4]**: [Brief description]

[Infer features from the language, topics, and description. Be specific, not generic.]

## 🛠️ Tech Stack

- **${repoData.language}** - [Brief reason why]
- **[Related Tech 1]** - [Inferred from topics/language]
- **[Related Tech 2]** - [Inferred from topics/language]

## 📦 Installation

\`\`\`bash
# Clone the repository
git clone ${repoData.html_url}.git
cd ${repoData.name}

# Install dependencies
[Add appropriate install command for ${repoData.language}]
\`\`\`

##  Project Structure

\`\`\`
${repoData.name}/
├── [Infer typical structure for ${repoData.language} projects]
├── [Add 3-5 key directories/files]
└── README.md
\`\`\`

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (\`git checkout -b feature/AmazingFeature\`)
3. Commit your changes (\`git commit -m 'Add some AmazingFeature'\`)
4. Push to the branch (\`git push origin feature/AmazingFeature\`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**${repoData.owner.login}**

- GitHub: [@${repoData.owner.login}](https://github.com/${repoData.owner.login})
- Repository: [${repoData.name}](${repoData.html_url})

---

⭐ Star this repository if you find it helpful!

FORMATTING RULES:
1. Use emojis for section headers (📋 ✨ 🛠️ 📦  🤝 📄 👤)
2. NO badges at the top - start directly with title and tagline
3. NO Usage section - skip usage examples completely
4. Keep descriptions concise and professional
5. Use proper code blocks with language tags
6. Add blank lines between sections
7. Use bold for emphasis in feature lists
8. Infer realistic content based on language and topics
9. NO generic placeholder text
10. NO excessive verbosity
11. Output ONLY markdown, no explanations

OUTPUT REQUIREMENTS:
- Start directly with # ${repoData.name} 🚀
- Do NOT include any badges
- Do NOT include Usage section
- Do NOT wrap in code blocks
- Do NOT add explanatory text
- Must look like a top-tier GitHub README
- Professional, scannable, developer-friendly`;

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
