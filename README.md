# Universal Intelligent AI Agent Rules Generator (`generate-rules`)

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Rust](https://img.shields.io/badge/Rust-000000?style=for-the-badge&logo=rust&logoColor=white)
![Go](https://img.shields.io/badge/Go-00ADD8?style=for-the-badge&logo=go&logoColor=white)

> An intelligent, zero-dependency Node.js CLI tool that automatically inspects any codebase and generates tailored, high-standard guidelines (`AGENTS.md` and `GEMINI.md`) for AI coding agents such as Antigravity, Gemini Code Assist, Cursor, GitHub Copilot, Claude Code, and OpenAI Codex.

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

## Installation and Usage

### 1. Direct Execution via Node.js

Run the script directly on the current directory:

```bash
node generate-rules.mjs
```

Or target any external project directory:

```bash
node generate-rules.mjs /path/to/your/project
```

### 2. Integration into Project Scripts

Place [`generate-rules.mjs`](file:///d:/Pramuditha/Dev%20projects/generate-rules/generate-rules.mjs) into your project's `scripts/` folder and add a script entry to `package.json`:

```json
{
  "scripts": {
    "generate:rules": "node scripts/generate-rules.mjs"
  }
}
```

Execute the script whenever dependencies or project structure change:

```bash
npm run generate:rules
```

### 3. Programmatic API (ES Modules)

Import and invoke the generator function within custom build scripts:

```javascript
import { generateRules } from './generate-rules.mjs'

// Generate rules for the current directory
generateRules()

// Or specify a custom root directory
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
