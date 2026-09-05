# Universal Intelligent AI Agent Rules Generator (`generate-rules`)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js Version](https://img.shields.io/badge/Node.js-%3E%3D18.0.0-339933?logo=node.js&logoColor=white)](package.json)
[![Dependencies](https://img.shields.io/badge/Dependencies-0_External-success)](package.json)
[![GitHub Repository](https://img.shields.io/badge/GitHub-PramudithaN%2Fgenerate--rules-181717?logo=github&logoColor=white)](https://github.com/PramudithaN/generate-rules)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/PramudithaN/generate-rules/pulls)

> An intelligent, zero-dependency Node.js CLI tool that automatically inspects any codebase and generates tailored, high-standard guidelines (`AGENTS.md` and `GEMINI.md`) for AI coding agents such as Antigravity, Gemini Code Assist, Cursor, GitHub Copilot, Claude Code, and OpenAI Codex.

---

## Quick Start for Any Project

You or any collaborator can run this tool inside **any repository** in one command without installing anything:

```bash
npx github:PramudithaN/generate-rules
```

### What Happens Automatically:
1. **Scans the Project**: Detects active languages, frameworks, UI component libraries, ORMs, state management, build tools, and test suites.
2. **Generates Tailored Rules**: Creates `AGENTS.md` and `GEMINI.md` at the root of the project with architecture-specific coding standards, security rules, and verification runbooks.
3. **Protects Git History**: Automatically appends generated rule files and template directories to `.gitignore`.

### How AI Coding Agents Use the Output:
- **Antigravity & Gemini Code Assist**: Automatically discover and ingest `GEMINI.md` and `AGENTS.md` as foundational system guidelines.
- **Cursor, Claude Code & GitHub Copilot**: Parse `AGENTS.md` for project architecture, code conventions, security constraints, and testing runbooks.

---

## Key Features

- **Deep Codebase Inspection**: Automatically detects languages, runtimes, frameworks, state management libraries, ORMs, UI design systems, bundlers, and testing suites.
- **Annotated Directory Mapping**: Generates clean visual tree representations of the project structure with architectural annotations.
- **Tailored Coding Standards**: Emits framework-specific best practices, including Electron process separation and IPC security, Next.js Server/Client component boundaries, Three.js/R3F memory lifecycles, and strict TypeScript, Python, or Rust conventions.
- **Zero-Vulnerability Security Guidelines**: Injects context isolation, sandboxing rules, IPC validation, environment variable safety, and Row-Level Security (RLS) enforcement based on active dependencies.
- **Conventional Commits Specification**: Embeds standard commit conventions and scopes directly into the generated agent prompt.
- **Dynamic Verification Runbook**: Builds repository-specific QA checklists (`npm run lint`, `npx tsc --noEmit`, `npm run build`, `npm test`) tailored to available `package.json` scripts and tools.
- **Custom Template Support**: Allows overriding the default output structure using local `templates/AGENTS.template.md` and `templates/GEMINI.template.md` files.
- **Automated `.gitignore` Protection**: Automatically adds generated agent rule files and templates to `.gitignore`.
- **Zero External Dependencies**: Implemented in pure native Node.js (ES Modules, `node:fs`, `node:path`, `node:url`).

---

## Supported Ecosystem and Technologies

[`generate-rules.mjs`](file:///d:/Pramuditha/Dev%20projects/generate-rules/generate-rules.mjs) detects and tailors instructions for:

| Category | Detected Frameworks and Libraries |
| :--- | :--- |
| **Languages & Runtimes** | TypeScript, JavaScript, Python, Rust, Go |
| **Desktop & Mobile** | Electron, Tauri, React Native, Expo |
| **Full-Stack & Web Frameworks** | Next.js (App Router & Pages Router), Remix, Astro, Nuxt, Svelte / SvelteKit, Vue 3, Angular, SolidJS, React 18 |
| **3D & Creative Tech** | Three.js, React Three Fiber (`@react-three/fiber`), Drei (`@react-three/drei`), PixiJS |
| **UI & Styling** | Tailwind CSS, Shadcn UI, Material UI (MUI), Radix UI, Chakra UI, Ant Design, Emotion, Styled Components |
| **State Management** | Zustand, Redux Toolkit, Jotai, TanStack Query (React Query), Pinia |
| **Backend & ORMs** | NestJS, Express, Fastify, Hono, Prisma ORM, Drizzle ORM, Supabase, Firebase |
| **Testing & Quality** | Vitest, Jest, Playwright, Cypress, ESLint |
| **Bundlers & Monorepos** | Vite, Webpack, Turborepo, Electron Builder |

---

## All Ways to Run

### Method 1: Instant Execution via `npx` (Recommended)

Run directly inside any repository without installing:

```bash
npx github:PramudithaN/generate-rules
```

Or target a specific directory from anywhere:

```bash
npx github:PramudithaN/generate-rules /path/to/target/project
```

### Method 2: Global CLI Installation

Install globally on your machine to use `generate-rules` from any terminal:

```bash
npm install -g github:PramudithaN/generate-rules
```

Once installed, run inside any project folder:

```bash
generate-rules
```

### Method 3: Project `devDependencies` Integration

Install it into an existing repository:

```bash
npm install -D github:PramudithaN/generate-rules
```

Add a convenience script to `package.json`:

```json
{
  "scripts": {
    "generate:rules": "generate-rules"
  }
}
```

Run it whenever your dependencies or project structure change:

```bash
npm run generate:rules
```

### Method 4: Direct Node Execution

Run the standalone script file directly:

```bash
node generate-rules.mjs [optional-target-path]
```

### Method 5: Programmatic API (ES Modules)

Import and invoke the generator function within custom build scripts or tooling:

```javascript
import { generateRules } from 'generate-rules'

// Generate rules for the current working directory
generateRules()

// Or specify a custom target directory
generateRules('/path/to/target/project')
```

---

## Execution Flow

1. **Path Validation**: Canonicalizes and validates the target project path.
2. **Ecosystem & Dependency Analysis**: Inspects `package.json`, `tsconfig.json`, `Cargo.toml`, `pyproject.toml`, `go.mod`, configuration files, and directory layouts to determine the active stack.
3. **Directory Tree Generation**: Walks top-level directories (excluding standard build and cache directories such as `node_modules`, `dist`, and `.git`) and annotates recognized directories.
4. **Rule Formulation**: Formulates tailored guidelines for coding standards, UI/UX conventions, security invariants, and verification runbooks.
5. **File Generation**: Writes `AGENTS.md` and `GEMINI.md` to the root of the target directory.
6. **Git Configuration**: Updates `.gitignore` to ensure generated agent markdown files and templates remain local to the environment.

---

## Custom Templates

To customize the output format while maintaining dynamic variable substitution, create a `templates/` directory in the target repository containing:

- `templates/AGENTS.template.md`
- `templates/GEMINI.template.md`

### Template Placeholders

| Placeholder | Description |
| :--- | :--- |
| `{{PROJECT_NAME}}` | Detected project name or directory base name |
| `{{PROJECT_OVERVIEW}}` | Tech stack summary and project description |
| `{{PROJECT_STRUCTURE}}` | Annotated visual directory tree |
| `{{CODING_STANDARDS}}` | Language-specific guidelines and clean code rules |
| `{{FRAMEWORK_SPECIFIC_RULES}}` | Framework guidelines (Electron, Next.js, UI, Database, etc.) |
| `{{SECURITY_RULES}}` | Context isolation, sandboxing, secrets, and authorization rules |
| `{{VERIFICATION_RUNBOOK}}` | Step-by-step verification checklist (`lint`, `tsc`, `build`, `test`) |

---

## License

This project is licensed under the [MIT License](LICENSE).
