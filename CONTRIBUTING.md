# Contributing to Career Pages V2

Thank you for your interest in contributing to Career Pages V2! This document provides guidelines and instructions for contributing to this project.

## Table of Contents
- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Contributions](#making-contributions)
- [Pull Request Process](#pull-request-process)
- [Adding New Companies](#adding-new-companies)
- [Style Guide](#style-guide)
- [Community](#community)

## Code of Conduct

By participating in this project, you are expected to uphold our Code of Conduct:
- Be respectful and inclusive
- Exercise consideration and empathy in your speech and actions
- Focus on what is best for the community
- Show courtesy and respect towards other community members

## Getting Started

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/tusharv/career-pages-v2.git
   cd career-pages-v2
   ```
3. Add the upstream remote:
   ```bash
   git remote add upstream https://github.com/tusharv/career-pages-v2.git
   ```

## Development Setup

1. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

2. Create a new branch for your feature:
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Visit [http://localhost:3000](http://localhost:3000) to see your changes

## Making Contributions

### Prerequisites
- Node.js 18.x or higher
- Basic knowledge of:
  - Next.js 14
  - TypeScript
  - Tailwind CSS
  - React

### Development Workflow
1. Make your changes in your feature branch
2. Write meaningful commit messages
3. Keep your changes focused and atomic
4. Add tests if applicable
5. Ensure your code follows the style guide
6. Run linting:
   ```bash
   npm run lint
   # or
   yarn lint
   ```

## Pull Request Process

1. Update your fork to the latest upstream changes:
   ```bash
   git fetch upstream
   git merge upstream/main
   ```

2. Push your changes:
   ```bash
   git push origin feature/your-feature-name
   ```

3. Create a Pull Request (PR) from your fork to our main repository
4. Ensure your PR:
   - Has a clear title and description
   - Includes any relevant issue numbers
   - Has passing CI checks
   - Follows our coding standards
   - Includes appropriate documentation updates

5. Wait for review. We typically review PRs within 1-2 days

## Adding New Companies

When adding new companies to the database:

1. Ensure the company information includes:
   - Company name
   - Career page URL
   - Company logo (if available)
   - Location information (if available)

2. Follow the existing data structure
3. Verify the career page URL is active and correct
4. If adding a logo, use the Google Favicon API:
   ```
   https://www.google.com/s2/favicons?domain={{domain}}&sz={{size}}
   ```

## Style Guide

### Code Style
- Use TypeScript for all new code
- Follow the existing code formatting
- Use meaningful variable and function names
- Add comments for complex logic
- Keep components small and focused
- Use proper TypeScript types (avoid `any`)

### Commit Messages
- Use clear, meaningful commit messages
- Start with a verb in imperative mood
- Keep the first line under 50 characters
- Add detailed description if needed

Example:
```
Add company search by location feature

- Implements location-based filtering
- Adds location dropdown component
- Updates search logic to include location
```

## Community

- For questions or discussions, open an issue
- For bugs, create an issue with a clear description and steps to reproduce
- For feature requests, create an issue with the "enhancement" label

---

Thank you for contributing to Career Pages V2! Your efforts help make job searching easier for everyone.
