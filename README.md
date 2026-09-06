# Universal Intelligent AI Agent Rules Generator (`generate-rules`)

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)

> An intelligent, zero-dependency Node.js CLI tool that automatically inspects any codebase and generates tailored, high-standard guidelines (`AGENTS.md` and `GEMINI.md`) for AI coding agents such as Antigravity, Gemini Code Assist, Cursor, GitHub Copilot, Claude Code, and OpenAI Codex.

---

## Quick Start for Any Project

Developers and engineering teams can execute this tool inside **any repository** with a single command without prior installation:

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

- **Deep Codebase Inspection**: Automatically detects languages, runtimes, frameworks, state management libraries, ORMs, AI/LLM SDKs, UI design systems, bundlers, and testing suites.
- **Annotated Directory Mapping**: Generates clean visual tree representations of the project structure with architectural annotations, with built-in symlink loop protection.
- **Tailored Coding Standards**: Emits framework-specific best practices, including Electron process separation and IPC security, Next.js Server/Client component boundaries, Three.js/R3F memory lifecycles, and strict TypeScript, Python, Rust, or Go conventions.
- **Zero-Vulnerability Security Guidelines**: Injects context isolation, sandboxing rules, IPC validation, network resilience / offline handling, cross-platform path safety, environment variable safety, and Row-Level Security (RLS) enforcement.
- **Conventional Commits Specification**: Embeds standard commit conventions and scopes directly into the generated agent prompt.
- **Dynamic Verification Runbook**: Builds repository-specific QA checklists (`npm run lint`, `npx tsc --noEmit`, `npm run build`, `npm test`, `cargo check`, `go vet`) tailored to available project scripts and tools.
- **CLI Flags & Dry-Run Mode**: Supports `--help`, `--version`, `--dry-run` (preview without writing), and `--verbose`.
- **Custom Template Support**: Allows overriding the default output structure using local `templates/AGENTS.template.md` and `templates/GEMINI.template.md` files.
- **Automated `.gitignore` Protection**: Automatically adds generated agent rule files and templates to `.gitignore` with regex-safe pattern matching.
- **Zero External Dependencies**: Implemented in pure native Node.js (ES Modules, `node:fs`, `node:path`, `node:url`).

---

## Supported Ecosystem and Technologies

[`generate-rules.mjs`](file:///d:/Pramuditha/Dev%20projects/generate-rules/generate-rules.mjs) detects and tailors instructions for:

| Category | Detected Frameworks and Libraries |
| :--- | :--- |
| **Languages & Runtimes** | TypeScript, JavaScript, Python, Rust, Go, Java/Kotlin, C# / .NET, PHP, Ruby |
| **Desktop & Mobile** | Electron, Tauri, React Native, Expo, Flutter |
| **Full-Stack & Web Frameworks** | Next.js (App Router & Pages Router), Remix, Astro, Nuxt, Svelte / SvelteKit, Vue 3, Angular, SolidJS, Qwik, React |
| **AI / LLM & Agentic SDKs** | Google Gen AI / Gemini SDK, OpenAI SDK, Anthropic Claude SDK, LangChain, Vercel AI SDK, LlamaIndex, Vector DBs |
| **3D & Creative Tech** | Three.js, React Three Fiber (`@react-three/fiber`), Drei (`@react-three/drei`), PixiJS, Babylon.js |
| **UI & Styling** | Tailwind CSS, Shadcn UI, Material UI (MUI), Radix UI, Chakra UI, Ant Design, Mantine, Emotion, Styled Components |
| **State Management** | Zustand, Redux Toolkit, Jotai, TanStack Query (React Query), SWR, Pinia |
| **Backend & ORMs** | NestJS, Express, Fastify, Hono, Koa, Prisma ORM, Drizzle ORM, TypeORM, Mongoose, Supabase, Firebase, Redis |
| **Testing & Quality** | Vitest, Jest, Playwright, Cypress, ESLint, Biome |
| **Bundlers & DevOps** | Vite, Webpack, Turborepo, Electron Builder, Docker |

---

## All Ways to Run

### Method 1: Instant Execution via `npx` (Recommended)

Execute directly inside any repository without installation:

```bash
npx github:PramudithaN/generate-rules
```

Or target a specific directory from anywhere:

```bash
npx github:PramudithaN/generate-rules /path/to/target/project
```

### Method 2: Global CLI Installation

Install globally to use `generate-rules` across any terminal:

```bash
npm install -g github:PramudithaN/generate-rules
```

Once installed, execute inside any project directory:

```bash
generate-rules
```

### Method 3: Project `devDependencies` Integration

Install into an existing repository:

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

Execute the script whenever project dependencies or directory structures change:

```bash
npm run generate:rules
```

### Method 4: Direct Node Execution

Run the standalone script file directly:

```bash
node generate-rules.mjs [optional-target-path]
```

### CLI Options & Flags

| Flag | Shorthand | Description |
| :--- | :--- | :--- |
| `--help` | `-h` | Display the help menu and usage examples |
| `--version` | `-v` | Display the current version |
| `--dry-run` | `-n` | Preview generated output without writing to disk |
| `--verbose` | | Display detailed inspection logs during execution |

---

### Method 5: Programmatic API (ES Modules)

Import and invoke the generator function within custom build scripts or tooling:

```javascript
import { generateRules } from 'generate-rules'

// Generate rules for the current working directory
generateRules()

// Or specify a custom target directory and options
generateRules('/path/to/target/project', {
  dryRun: false,
  verbose: true
})
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

