import { NextRequest, NextResponse } from 'next/server';

// Logo color palettes
const colorPalettes = [
  { primary: '#6366f1', secondary: '#8b5cf6', accent: '#ec4899' },
  { primary: '#3b82f6', secondary: '#06b6d4', accent: '#10b981' },
  { primary: '#f59e0b', secondary: '#f97316', accent: '#ef4444' },
  { primary: '#10b981', secondary: '#14b8a6', accent: '#06b6d4' },
  { primary: '#8b5cf6', secondary: '#a855f7', accent: '#d946ef' },
  { primary: '#ef4444', secondary: '#f97316', accent: '#fbbf24' },
];

// Logo templates
function generateLogoSVG(name: string, style: string, palette: typeof colorPalettes[0]): string {
  const initials = name.split(' ').map(w => w[0]?.toUpperCase() || '').join('').slice(0, 2);
  
  const templates: Record<string, string> = {
    modern: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${palette.primary}"/>
            <stop offset="100%" style="stop-color:${palette.secondary}"/>
          </linearGradient>
        </defs>
        <rect width="200" height="200" rx="40" fill="url(#grad)"/>
        <text x="100" y="125" text-anchor="middle" font-family="Arial, sans-serif" font-size="80" font-weight="bold" fill="white">${initials}</text>
      </svg>
    `,
    circle: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${palette.primary}"/>
            <stop offset="50%" style="stop-color:${palette.secondary}"/>
            <stop offset="100%" style="stop-color:${palette.accent}"/>
          </linearGradient>
        </defs>
        <circle cx="100" cy="100" r="95" fill="url(#grad)"/>
        <text x="100" y="125" text-anchor="middle" font-family="Arial, sans-serif" font-size="70" font-weight="bold" fill="white">${initials}</text>
      </svg>
    `,
    hexagon: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${palette.primary}"/>
            <stop offset="100%" style="stop-color:${palette.secondary}"/>
          </linearGradient>
        </defs>
        <polygon points="100,5 185,50 185,150 100,195 15,150 15,50" fill="url(#grad)"/>
        <text x="100" y="120" text-anchor="middle" font-family="Arial, sans-serif" font-size="60" font-weight="bold" fill="white">${initials}</text>
      </svg>
    `,
    minimal: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
        <rect width="200" height="200" fill="white"/>
        <rect x="20" y="20" width="160" height="160" rx="10" fill="none" stroke="${palette.primary}" stroke-width="4"/>
        <text x="100" y="125" text-anchor="middle" font-family="Arial, sans-serif" font-size="70" font-weight="bold" fill="${palette.primary}">${initials}</text>
      </svg>
    `,
    tech: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${palette.primary}"/>
            <stop offset="100%" style="stop-color:${palette.secondary}"/>
          </linearGradient>
        </defs>
        <rect width="200" height="200" fill="#0a0a0a"/>
        <rect x="10" y="10" width="180" height="180" rx="20" fill="none" stroke="url(#grad)" stroke-width="3"/>
        <circle cx="30" cy="30" r="5" fill="${palette.accent}"/>
        <circle cx="170" cy="30" r="5" fill="${palette.accent}"/>
        <circle cx="30" cy="170" r="5" fill="${palette.accent}"/>
        <circle cx="170" cy="170" r="5" fill="${palette.accent}"/>
        <text x="100" y="125" text-anchor="middle" font-family="monospace" font-size="60" font-weight="bold" fill="url(#grad)">${initials}</text>
      </svg>
    `,
  };

  return templates[style] || templates.modern;
}

// Document templates
function generateDocument(type: string, title: string, content: string): string {
  const templates: Record<string, string> = {
    resume: `
# ${title}

## Contact Information
- Email: your.email@example.com
- Phone: +1 (555) 123-4567
- LinkedIn: linkedin.com/in/yourprofile
- GitHub: github.com/yourusername

## Summary
${content || 'A passionate and results-driven professional with expertise in software development, seeking to leverage skills in a challenging role.'}

## Skills
- Programming Languages: JavaScript, TypeScript, Python, Java
- Frameworks: React, Next.js, Node.js, Express
- Databases: PostgreSQL, MongoDB, Redis
- Tools: Git, Docker, AWS, Vercel

## Experience

### Senior Software Engineer | Company Name
**Jan 2022 - Present**
- Developed and maintained web applications using React and Node.js
- Led a team of 5 developers in delivering high-quality software solutions
- Improved application performance by 40% through optimization techniques

### Software Engineer | Previous Company
**Jun 2019 - Dec 2021**
- Built RESTful APIs and microservices architecture
- Collaborated with cross-functional teams to deliver features on time
- Implemented CI/CD pipelines for automated deployment

## Education

### Bachelor of Technology in Computer Science
**University Name | 2015 - 2019**
- GPA: 3.8/4.0
- Relevant Coursework: Data Structures, Algorithms, Database Systems

## Projects
- **Project Name**: Brief description of the project and technologies used
- **Another Project**: Brief description and impact

## Certifications
- AWS Certified Solutions Architect
- Google Cloud Professional Developer
    `,
    cover_letter: `
# Cover Letter

**${title}**

---

Dear Hiring Manager,

${content || `I am writing to express my strong interest in the position at your esteemed organization. With my background in software development and passion for building innovative solutions, I believe I would be a valuable addition to your team.

Throughout my career, I have developed expertise in modern web technologies including React, Node.js, and cloud platforms. I have successfully delivered multiple projects that have positively impacted business outcomes and user experiences.

I am particularly drawn to your company's commitment to innovation and its reputation for fostering professional growth. I am confident that my technical skills, combined with my ability to work collaboratively in team environments, make me an ideal candidate for this role.

I would welcome the opportunity to discuss how my experience and skills can contribute to your team's success. Thank you for considering my application.`}

Sincerely,
[Your Name]
[Your Email]
[Your Phone]
    `,
    business_plan: `
# Business Plan: ${title}

## Executive Summary
${content || 'A comprehensive business plan for a technology startup focused on delivering innovative solutions.'}

## Company Description
- **Business Name**: ${title}
- **Industry**: Technology / SaaS
- **Mission**: To provide innovative solutions that solve real-world problems

## Market Analysis
### Target Market
- Primary: Small to medium businesses
- Secondary: Enterprise clients
- Geographic Focus: Global, starting with North America

### Market Size
- Total Addressable Market (TAM): $XX billion
- Serviceable Addressable Market (SAM): $XX million
- Serviceable Obtainable Market (SOM): $XX million

## Products & Services
1. **Core Product**: Description of main offering
2. **Premium Features**: Advanced capabilities
3. **Enterprise Solutions**: Custom implementations

## Marketing Strategy
- Digital marketing and SEO
- Content marketing and thought leadership
- Partnership and referral programs
- Social media presence

## Financial Projections
| Year | Revenue | Expenses | Profit |
|------|---------|----------|--------|
| Y1   | $XXX    | $XXX     | $XXX   |
| Y2   | $XXX    | $XXX     | $XXX   |
| Y3   | $XXX    | $XXX     | $XXX   |

## Team
- CEO/Founder: [Name]
- CTO: [Name]
- Marketing Lead: [Name]

## Funding Requirements
- Seed Round: $XXX
- Use of Funds: Product development, marketing, hiring
    `,
    readme: `
# ${title}

${content || 'A modern web application built with cutting-edge technologies.'}

## Features

- Feature 1: Description
- Feature 2: Description
- Feature 3: Description

## Tech Stack

- **Frontend**: React, Next.js, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: PostgreSQL
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

\`\`\`bash
# Clone the repository
git clone https://github.com/username/${title.toLowerCase().replace(/\s+/g, '-')}.git

# Navigate to directory
cd ${title.toLowerCase().replace(/\s+/g, '-')}

# Install dependencies
npm install

# Start development server
npm run dev
\`\`\`

## Usage

\`\`\`javascript
// Example code
import { Component } from './component';

const App = () => {
  return <Component />;
};
\`\`\`

## Contributing

1. Fork the repository
2. Create your feature branch (\`git checkout -b feature/amazing\`)
3. Commit your changes (\`git commit -m 'Add amazing feature'\`)
4. Push to the branch (\`git push origin feature/amazing\`)
5. Open a Pull Request

## License

MIT License - see [LICENSE](LICENSE) for details.

## Contact

- Author: [Your Name]
- Email: your.email@example.com
- GitHub: [@yourusername](https://github.com/yourusername)
    `,
  };

  return templates[type] || templates.readme;
}

// Code templates
function generateCode(language: string, type: string, name: string): string {
  const templates: Record<string, Record<string, string>> = {
    react: {
      component: `
import React, { useState } from 'react';

interface ${name}Props {
  title?: string;
  children?: React.ReactNode;
}

export const ${name}: React.FC<${name}Props> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="p-4 rounded-lg border border-gray-200">
      {title && (
        <h2 className="text-xl font-bold mb-4">{title}</h2>
      )}
      <div className="content">
        {children}
      </div>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        {isOpen ? 'Close' : 'Open'}
      </button>
    </div>
  );
};

export default ${name};
      `,
      hook: `
import { useState, useEffect, useCallback } from 'react';

interface Use${name}Options {
  initialValue?: any;
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

export function use${name}(options: Use${name}Options = {}) {
  const [data, setData] = useState(options.initialValue);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async (params?: any) => {
    setLoading(true);
    setError(null);
    
    try {
      // Add your logic here
      const result = await Promise.resolve(params);
      setData(result);
      options.onSuccess?.(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      options.onError?.(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [options]);

  return { data, loading, error, execute };
}
      `,
    },
    node: {
      api: `
const express = require('express');
const router = express.Router();

// GET all ${name}
router.get('/', async (req, res) => {
  try {
    // Add your logic here
    const items = [];
    res.json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET single ${name} by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // Add your logic here
    res.json({ success: true, data: { id } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST create ${name}
router.post('/', async (req, res) => {
  try {
    const data = req.body;
    // Add your logic here
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT update ${name}
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    // Add your logic here
    res.json({ success: true, data: { id, ...data } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE ${name}
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // Add your logic here
    res.json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
      `,
    },
    python: {
      script: `
#!/usr/bin/env python3
"""
${name} - A Python script
"""

import argparse
import logging
from typing import Optional, List, Dict, Any

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class ${name}:
    """Main class for ${name}"""
    
    def __init__(self, config: Optional[Dict[str, Any]] = None):
        self.config = config or {}
        logger.info(f"Initialized ${name}")
    
    def process(self, data: List[Any]) -> List[Any]:
        """Process the input data"""
        results = []
        for item in data:
            # Add your processing logic here
            results.append(item)
        return results
    
    def run(self) -> None:
        """Run the main logic"""
        logger.info("Starting ${name}...")
        # Add your main logic here
        logger.info("Completed ${name}")


def main():
    parser = argparse.ArgumentParser(description='${name} script')
    parser.add_argument('--input', '-i', help='Input file path')
    parser.add_argument('--output', '-o', help='Output file path')
    parser.add_argument('--verbose', '-v', action='store_true', help='Verbose output')
    
    args = parser.parse_args()
    
    if args.verbose:
        logging.getLogger().setLevel(logging.DEBUG)
    
    app = ${name}()
    app.run()


if __name__ == '__main__':
    main()
      `,
    },
  };

  return templates[language]?.[type] || `// Generated code for ${name}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, prompt, name, style, language, documentType, codeType } = body;

    let content = '';
    let filename = '';
    let mimeType = '';

    switch (type) {
      case 'logo':
        const palette = colorPalettes[Math.floor(Math.random() * colorPalettes.length)];
        content = generateLogoSVG(name || prompt || 'Logo', style || 'modern', palette);
        filename = `${(name || 'logo').toLowerCase().replace(/\s+/g, '-')}-logo.svg`;
        mimeType = 'image/svg+xml';
        break;

      case 'document':
        content = generateDocument(documentType || 'readme', name || prompt || 'Document', prompt);
        filename = `${(name || 'document').toLowerCase().replace(/\s+/g, '-')}.md`;
        mimeType = 'text/markdown';
        break;

      case 'code':
        content = generateCode(language || 'react', codeType || 'component', name || 'MyComponent');
        const ext = language === 'python' ? 'py' : language === 'node' ? 'js' : 'tsx';
        filename = `${(name || 'code').toLowerCase().replace(/\s+/g, '-')}.${ext}`;
        mimeType = 'text/plain';
        break;

      default:
        return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    // Convert content to base64 for download
    const base64Content = Buffer.from(content).toString('base64');
    const dataUrl = `data:${mimeType};base64,${base64Content}`;

    return NextResponse.json({
      success: true,
      content,
      filename,
      mimeType,
      downloadUrl: dataUrl,
      preview: content.slice(0, 500),
    });
  } catch (error) {
    console.error('Generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    );
  }
}
