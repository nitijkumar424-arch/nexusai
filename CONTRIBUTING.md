# Contributing to Nexus AI

First off, thank you for considering contributing to Nexus AI! 🎉

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Pull Request Process](#pull-request-process)
- [Style Guidelines](#style-guidelines)

## Code of Conduct

This project and everyone participating in it is governed by our commitment to providing a welcoming and inclusive environment. Please be respectful and constructive in all interactions.

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Git
- A code editor (VS Code recommended)

### Development Setup

1. **Fork the repository**
   
   Click the "Fork" button on GitHub to create your own copy.

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/nexusai.git
   cd nexusai
   ```

3. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/nitijkumar424-arch/nexusai.git
   ```

4. **Install dependencies**
   ```bash
   npm install
   ```

5. **Set up environment**
   ```bash
   cp .env.example .env.local
   # Add your API keys to .env.local
   ```

6. **Start development server**
   ```bash
   npm run dev
   ```

## Making Changes

### Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

### Branch Naming Convention

- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `test/` - Adding or updating tests

### Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Formatting
- `refactor` - Code restructuring
- `test` - Adding tests
- `chore` - Maintenance

**Examples:**
```
feat(chat): add voice input support
fix(api): handle rate limit errors gracefully
docs(readme): update installation instructions
```

## Pull Request Process

1. **Update your fork**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Push your changes**
   ```bash
   git push origin feature/your-feature-name
   ```

3. **Create Pull Request**
   - Go to GitHub and click "New Pull Request"
   - Fill out the PR template
   - Link any related issues

4. **Review Process**
   - Maintainers will review your PR
   - Address any feedback
   - Once approved, your PR will be merged

### PR Checklist

- [ ] Code follows the style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated if needed
- [ ] No console errors or warnings
- [ ] Responsive design maintained

## Style Guidelines

### TypeScript

- Use TypeScript for all new code
- Define proper types, avoid `any`
- Use interfaces for object shapes

```typescript
// Good
interface User {
  id: string;
  name: string;
  email: string;
}

// Avoid
const user: any = { ... };
```

### React Components

- Use functional components with hooks
- Use named exports
- Keep components focused and small

```typescript
// Good
export function ChatMessage({ message }: ChatMessageProps) {
  return <div>{message.content}</div>;
}
```

### Styling

- Use Tailwind CSS classes
- Follow the existing design system
- Use `cn()` utility for conditional classes

```typescript
import { cn } from '@/lib/utils';

<div className={cn(
  "base-styles",
  isActive && "active-styles"
)} />
```

### File Organization

```
components/
├── feature-name/
│   ├── component-name.tsx
│   ├── sub-component.tsx
│   └── index.ts
```

## Questions?

Feel free to open an issue for any questions or concerns. We're here to help!

---

Thank you for contributing! 🚀
