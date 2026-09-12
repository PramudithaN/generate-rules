#!/usr/bin/env node

/**
 * Universal Intelligent AI Agent Rules Generator
 *
 * Dynamically analyzes ANY codebase (Electron, Next.js, React, Vue, Svelte, Angular,
 * Solid, React Native, Expo, Node/Express/Nest/Fastify/Hono, Python/FastAPI/Django,
 * Rust, Go, Java/Kotlin, C#, PHP, Three.js, AI/LLM SDKs, Docker, Turborepo, etc.)
 * and automatically crafts tailored, high-standard AGENTS.md and GEMINI.md guidelines.
 *
 * Usage Options:
 *
 * 1. Instant execution in any repository (No installation required):
 *    npx github:PramudithaN/generate-rules
 *    npx github:PramudithaN/generate-rules /path/to/target/project
 *
 * 2. Global CLI command:
 *    npm install -g github:PramudithaN/generate-rules
 *    generate-rules [target-directory] [options]
 *
 * 3. Project devDependency:
 *    npm install -D github:PramudithaN/generate-rules
 *    npx generate-rules
 *
 * 4. Direct Node execution:
 *    node generate-rules.mjs [optional-target-path] [options]
 *
 * 5. Programmatic ES Module API:
 *    import { generateRules } from 'generate-rules'
 *    generateRules('/path/to/target/project', { dryRun: false, verbose: true })
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const PKG_VERSION = '1.0.0'

// ── Utility Helpers ──────────────────────────────────────────────────────────

/**
 * Safely escapes special regex characters in a string.
 */
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * Normalizes string line endings to standard Unix LF (\n).
 */
function normalizeLineEndings(content) {
  return content.replace(/\r\n/g, '\n')
}

/**
 * Safely reads and parses a JSON file, stripping UTF-8 BOM if present.
 */
function safeReadJson(filePath) {
  try {
    if (!fs.existsSync(filePath)) return null
    let raw = fs.readFileSync(filePath, 'utf8')
    if (raw.charCodeAt(0) === 0xfeff) {
      raw = raw.slice(1)
    }
    return JSON.parse(raw)
  } catch {
    return null
  }
}

/**
 * Safely validates and canonicalizes a directory path.
 * Checks for illegal control characters, null bytes, symlink traversal,
 * and verifies directory existence and permissions.
 */
export function getValidatedDirectory(inputPath, fallbackDir = process.cwd()) {
  const rawPath = inputPath && typeof inputPath === 'string' && inputPath.trim() !== ''
    ? inputPath.trim()
    : fallbackDir

  // Reject dangerous characters or null bytes
  if (rawPath.includes('\0')) {
    throw new Error('Invalid path: Contains illegal null byte character.')
  }

  // Resolve absolute path
  const resolvedPath = path.resolve(process.cwd(), rawPath)

  // Verify existence
  if (!fs.existsSync(resolvedPath)) {
    throw new Error(`Target path does not exist: ${resolvedPath}`)
  }

  // Canonicalize symlinks safely
  let canonicalPath = resolvedPath
  try {
    canonicalPath = fs.realpathSync(resolvedPath)
  } catch (err) {
    throw new Error(`Unable to resolve canonical path for: ${resolvedPath} (${err.message})`)
  }

  const stat = fs.statSync(canonicalPath)
  if (!stat.isDirectory()) {
    throw new Error(`Target path is not a directory: ${canonicalPath}`)
  }

  // Verify directory is readable and accessible
  try {
    fs.accessSync(canonicalPath, fs.constants.R_OK)
  } catch {
    throw new Error(`Directory is not readable or permission is denied: ${canonicalPath}`)
  }

  return canonicalPath
}

// ── Directory Scanner & Tree Visualizer ──────────────────────────────────────

const DEFAULT_IGNORED_DIRS = new Set([
  'node_modules', '.git', 'dist', 'dist-electron', 'dist-ssr',
  'build', 'release', 'out', '.next', '.nuxt', '.svelte-kit', '.astro',
  '.cache', '.turbo', '.vscode', '.idea', 'coverage', '__pycache__',
  '.pytest_cache', '.mypy_cache', '.venv', 'venv', 'env', '.env',
  'target', 'vendor', '.gemini', '.antigravity', '.yarn', '.pnpm-store',
  'tmp', 'temp', 'logs',
])

/**
 * Recursively generates an annotated visual directory tree.
 * Protects against symlink loops with cycle tracking and handles permissions safely.
 */
function generateDirectoryTree(
  dir,
  prefix = '',
  depth = 0,
  maxDepth = 2,
  visitedPaths = new Set(),
  ignoredDirs = DEFAULT_IGNORED_DIRS
) {
  if (depth > maxDepth) return []

  let realCurrentDir
  try {
    realCurrentDir = fs.realpathSync(dir)
  } catch {
    return []
  }

  if (visitedPaths.has(realCurrentDir)) {
    return [] // Prevent infinite circular symlink recursion
  }
  visitedPaths.add(realCurrentDir)

  let entries = []
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true })
  } catch {
    return []
  }

  const lines = []
  const filtered = entries
    .filter(e => !ignoredDirs.has(e.name) && !e.name.startsWith('.DS_Store') && !e.name.startsWith('._'))
    .sort((a, b) => {
      if (a.isDirectory() && !b.isDirectory()) return -1
      if (!a.isDirectory() && b.isDirectory()) return 1
      return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
    })

  for (let i = 0; i < filtered.length; i++) {
    const entry = filtered[i]
    const isLast = i === filtered.length - 1
    const pointer = isLast ? '└── ' : '├── '
    const nextPrefix = prefix + (isLast ? '    ' : '│   ')

    // Contextual annotations across common architectures
    let annotation = ''
    const lowerName = entry.name.toLowerCase()

    if (lowerName === 'electron') annotation = '                 # Electron Main & Preload Processes'
    else if (lowerName === 'src' || lowerName === 'source') annotation = '                      # Application Source Code'
    else if (lowerName === 'app') annotation = '                      # Application Core / App Router'
    else if (lowerName === 'pages') annotation = '                    # Page Views & Route Handlers'
    else if (lowerName === 'components') annotation = '           # Reusable UI & View Components'
    else if (lowerName === 'hooks') annotation = '                # Custom React / Composition Hooks'
    else if (lowerName === 'services' || lowerName === 'api') annotation = '             # API Clients & Service Integrations'
    else if (lowerName === 'lib' || lowerName === 'utils' || lowerName === 'helpers') annotation = '                  # Helper Libraries & Shared Utilities'
    else if (lowerName === 'types' || lowerName === 'typings') annotation = '                # Type Definitions & Contracts'
    else if (lowerName === 'constants') annotation = '            # System Constants & Registries'
    else if (lowerName === 'assets' || lowerName === 'public' || lowerName === 'static') annotation = '                   # Static Assets, Media & Icons'
    else if (lowerName === 'store' || lowerName === 'stores') annotation = '                # State Management Stores'
    else if (lowerName === 'prisma') annotation = '                   # Prisma ORM Schema & Migrations'
    else if (lowerName === 'drizzle') annotation = '                  # Drizzle ORM Schema & Migrations'
    else if (lowerName === 'tests' || lowerName === '__tests__' || lowerName === 'spec') annotation = '            # Automated Test Suites & Specs'
    else if (lowerName === 'controllers') annotation = '            # Request Controllers'
    else if (lowerName === 'models') annotation = '                 # Data Models & Schemas'
    else if (lowerName === 'routes' || lowerName === 'router') annotation = '                 # Endpoint Route Definitions'
    else if (lowerName === 'middleware' || lowerName === 'middlewares') annotation = '             # Middleware & Interceptors'
    else if (lowerName === 'crates') annotation = '                 # Rust Workspace Sub-crates'
    else if (lowerName === 'cmd' || lowerName === 'internal' || lowerName === 'pkg') annotation = '                      # Go Architecture Packages'
    else if (lowerName === 'scripts') annotation = '                  # Build, Migration & Tooling Scripts'
    else if (lowerName === 'docker' || lowerName === '.github') annotation = '                  # CI/CD & Container Orchestration'

    lines.push(`${prefix}${pointer}${entry.name}${annotation}`)

    if (entry.isDirectory()) {
      const childPath = path.join(dir, entry.name)
      lines.push(...generateDirectoryTree(childPath, nextPrefix, depth + 1, maxDepth, visitedPaths, ignoredDirs))
    }
  }

  return lines
}

// ── Deep Codebase & Tech Stack Analyzer ─────────────────────────────────────

function analyzeCodebase(rootDir) {
  // Read package.json if available
  const pkgPath = path.join(rootDir, 'package.json')
  const pkg = safeReadJson(pkgPath) || {}

  const allDeps = {
    ...(pkg.dependencies || {}),
    ...(pkg.devDependencies || {}),
    ...(pkg.peerDependencies || {}),
    ...(pkg.optionalDependencies || {}),
  }

  const scripts = pkg.scripts || {}

  // 1. Languages & Runtimes
  const hasTs = fs.existsSync(path.join(rootDir, 'tsconfig.json')) || !!allDeps['typescript']
  const hasPy = fs.existsSync(path.join(rootDir, 'pyproject.toml')) ||
                fs.existsSync(path.join(rootDir, 'requirements.txt')) ||
                fs.existsSync(path.join(rootDir, 'Pipfile')) ||
                fs.existsSync(path.join(rootDir, 'setup.py'))
  const hasRust = fs.existsSync(path.join(rootDir, 'Cargo.toml'))
  const hasGo = fs.existsSync(path.join(rootDir, 'go.mod'))
  const hasJava = fs.existsSync(path.join(rootDir, 'pom.xml')) || fs.existsSync(path.join(rootDir, 'build.gradle')) || fs.existsSync(path.join(rootDir, 'build.gradle.kts'))
  const hasCSharp = fs.existsSync(path.join(rootDir, '*.csproj')) || fs.existsSync(path.join(rootDir, '*.sln'))
  const hasPhp = fs.existsSync(path.join(rootDir, 'composer.json'))
  const hasRuby = fs.existsSync(path.join(rootDir, 'Gemfile'))

  // 2. Desktop & Mobile Frameworks
  const isElectron = !!allDeps['electron'] || fs.existsSync(path.join(rootDir, 'electron'))
  const isTauri = !!allDeps['@tauri-apps/api'] || fs.existsSync(path.join(rootDir, 'src-tauri'))
  const isReactNative = !!allDeps['react-native'] || !!allDeps['expo']
  const isExpo = !!allDeps['expo']
  const isFlutter = fs.existsSync(path.join(rootDir, 'pubspec.yaml'))

  // 3. Web & Full-Stack Frameworks
  const isNext = !!allDeps['next']
  const isNextAppRouter = isNext && (fs.existsSync(path.join(rootDir, 'app')) || fs.existsSync(path.join(rootDir, 'src/app')))
  const isRemix = !!allDeps['@remix-run/react']
  const isAstro = !!allDeps['astro']
  const isNuxt = !!allDeps['nuxt']
  const isSvelteKit = !!allDeps['@sveltejs/kit'] || !!allDeps['svelte']
  const isVue = !!allDeps['vue'] || isNuxt
  const isAngular = !!allDeps['@angular/core']
  const isSolid = !!allDeps['solid-js']
  const isQwik = !!allDeps['@builder.io/qwik']
  const isReact = !!allDeps['react'] || isNext || isRemix || isReactNative

  // 4. AI / LLM / Agentic SDKs
  const hasGoogleAI = !!allDeps['@google/genai'] || !!allDeps['@google/generative-ai']
  const hasOpenAI = !!allDeps['openai']
  const hasAnthropic = !!allDeps['@anthropic-ai/sdk']
  const hasLangChain = !!allDeps['langchain'] || !!allDeps['@langchain/core'] || !!allDeps['@langchain/community']
  const hasVercelAI = !!allDeps['ai']
  const hasLlamaIndex = !!allDeps['llamaindex']
  const hasVectorDB = !!allDeps['@pinecone-database/pinecone'] || !!allDeps['chromadb'] || !!allDeps['@qdrant/js-client-rest']

  // 5. 3D & Creative Tech
  const isThree = !!allDeps['three'] || !!allDeps['@react-three/fiber']
  const isR3F = !!allDeps['@react-three/fiber']
  const isDrei = !!allDeps['@react-three/drei']
  const isPixi = !!allDeps['pixi.js']
  const isBabylon = !!allDeps['@babylonjs/core']

  // 6. UI Libraries & Styling
  const isTailwind = !!allDeps['tailwindcss'] ||
    fs.existsSync(path.join(rootDir, 'tailwind.config.js')) ||
    fs.existsSync(path.join(rootDir, 'tailwind.config.ts')) ||
    fs.existsSync(path.join(rootDir, 'tailwind.config.mjs'))
  const isShadcn = isTailwind && fs.existsSync(path.join(rootDir, 'components.json'))
  const isMui = !!allDeps['@mui/material'] || !!allDeps['@emotion/react']
  const isRadix = Object.keys(allDeps).some(k => k.startsWith('@radix-ui/'))
  const isChakra = !!allDeps['@chakra-ui/react']
  const isAntd = !!allDeps['antd']
  const isMantine = !!allDeps['@mantine/core']
  const isEmotion = !!allDeps['@emotion/styled'] || !!allDeps['@emotion/react']
  const isStyledComponents = !!allDeps['styled-components']

  // 7. State Management & Data Fetching
  const isRedux = !!allDeps['@reduxjs/toolkit'] || !!allDeps['redux']
  const isZustand = !!allDeps['zustand']
  const isJotai = !!allDeps['jotai']
  const isTanstackQuery = !!allDeps['@tanstack/react-query'] || !!allDeps['react-query']
  const isSwr = !!allDeps['swr']
  const isPinia = !!allDeps['pinia']

  // 8. Backend & Database
  const isNest = !!allDeps['@nestjs/core']
  const isExpress = !!allDeps['express']
  const isFastify = !!allDeps['fastify']
  const isHono = !!allDeps['hono']
  const isKoa = !!allDeps['koa']
  const isPrisma = !!allDeps['@prisma/client'] || fs.existsSync(path.join(rootDir, 'prisma'))
  const isDrizzle = !!allDeps['drizzle-orm'] || fs.existsSync(path.join(rootDir, 'drizzle'))
  const isTypeOrm = !!allDeps['typeorm']
  const isMongoose = !!allDeps['mongoose']
  const isSupabase = !!allDeps['@supabase/supabase-js']
  const isFirebase = !!allDeps['firebase'] || !!allDeps['firebase-admin']
  const isRedis = !!allDeps['ioredis'] || !!allDeps['redis']

  // 9. Validation & Security Utilities
  const isZod = !!allDeps['zod']
  const isValibot = !!allDeps['valibot']
  const isTypeBox = !!allDeps['@sinclair/typebox']
  const isHelmet = !!allDeps['helmet']
  const isDomPurify = !!allDeps['dompurify'] || !!allDeps['isomorphic-dompurify']

  // 10. Testing & Quality Tools
  const isVitest = !!allDeps['vitest']
  const isJest = !!allDeps['jest']
  const isPlaywright = !!allDeps['@playwright/test']
  const isCypress = !!allDeps['cypress']
  const isEslint = !!allDeps['eslint'] ||
    fs.existsSync(path.join(rootDir, '.eslintrc.cjs')) ||
    fs.existsSync(path.join(rootDir, '.eslintrc.json')) ||
    fs.existsSync(path.join(rootDir, 'eslint.config.js')) ||
    fs.existsSync(path.join(rootDir, 'eslint.config.mjs'))
  const isBiome = !!allDeps['@biomejs/biome'] || fs.existsSync(path.join(rootDir, 'biome.json'))

  // 11. Bundlers & Build Infrastructure
  const isVite = !!allDeps['vite'] ||
    fs.existsSync(path.join(rootDir, 'vite.config.ts')) ||
    fs.existsSync(path.join(rootDir, 'vite.config.js')) ||
    fs.existsSync(path.join(rootDir, 'vite.config.mjs'))
  const isWebpack = !!allDeps['webpack']
  const isTurborepo = !!allDeps['turbo'] || fs.existsSync(path.join(rootDir, 'turbo.json'))
  const isElectronBuilder = !!allDeps['electron-builder'] ||
    fs.existsSync(path.join(rootDir, 'electron-builder.json5')) ||
    fs.existsSync(path.join(rootDir, 'electron-builder.json')) ||
    fs.existsSync(path.join(rootDir, 'electron-builder.yml'))
  const isDocker = fs.existsSync(path.join(rootDir, 'Dockerfile')) || fs.existsSync(path.join(rootDir, 'docker-compose.yml'))

  // 12. Metadata & Description
  const baseName = path.basename(rootDir)
  const projectName = pkg.name || baseName
  let description = pkg.description

  if (!description) {
    if (isElectron) description = 'A high-performance desktop application built with Electron and modern web technologies.'
    else if (isTauri) description = 'A lightweight, secure desktop application powered by Tauri and Rust.'
    else if (isNext) description = 'A modern full-stack web application powered by Next.js and React.'
    else if (isAstro) description = 'A fast, content-focused web application built with Astro.'
    else if (isNuxt) description = 'An intuitive, full-stack Vue application powered by Nuxt.'
    else if (isSvelteKit) description = 'A reactive, high-performance web application built with SvelteKit.'
    else if (isReact && isVite) description = 'A fast, modern React single-page application built with Vite.'
    else if (hasPy) description = 'A robust Python application and backend service.'
    else if (hasRust) description = 'A high-performance, memory-safe Rust system application.'
    else if (hasGo) description = 'A scalable Go cloud and backend application.'
    else description = 'A modern, modular software application and codebase.'
  }

  return {
    projectName,
    baseName,
    description,
    pkg,
    scripts,
    hasTs,
    hasPy,
    hasRust,
    hasGo,
    hasJava,
    hasCSharp,
    hasPhp,
    hasRuby,
    isElectron,
    isTauri,
    isReactNative,
    isExpo,
    isFlutter,
    isNext,
    isNextAppRouter,
    isRemix,
    isAstro,
    isNuxt,
    isSvelteKit,
    isVue,
    isAngular,
    isSolid,
    isQwik,
    isReact,
    hasGoogleAI,
    hasOpenAI,
    hasAnthropic,
    hasLangChain,
    hasVercelAI,
    hasLlamaIndex,
    hasVectorDB,
    isThree,
    isR3F,
    isDrei,
    isPixi,
    isBabylon,
    isTailwind,
    isShadcn,
    isMui,
    isRadix,
    isChakra,
    isAntd,
    isMantine,
    isEmotion,
    isStyledComponents,
    isRedux,
    isZustand,
    isJotai,
    isTanstackQuery,
    isSwr,
    isPinia,
    isNest,
    isExpress,
    isFastify,
    isHono,
    isKoa,
    isPrisma,
    isDrizzle,
    isTypeOrm,
    isMongoose,
    isSupabase,
    isFirebase,
    isRedis,
    isZod,
    isValibot,
    isTypeBox,
    isHelmet,
    isDomPurify,
    isVitest,
    isJest,
    isPlaywright,
    isCypress,
    isEslint,
    isBiome,
    isVite,
    isWebpack,
    isTurborepo,
    isElectronBuilder,
    isDocker,
  }
}

// ── Dynamic Rule Formulators ────────────────────────────────────────────────

function formatProjectOverview(info) {
  const stack = []

  // Core Platform & Runtime
  if (info.isElectron) stack.push('**Electron**')
  else if (info.isTauri) stack.push('**Tauri**')
  else if (info.isExpo) stack.push('**Expo**')
  else if (info.isReactNative) stack.push('**React Native**')
  else if (info.isFlutter) stack.push('**Flutter**')

  // Web Frameworks
  if (info.isNext) stack.push(`**Next.js (${info.isNextAppRouter ? 'App Router' : 'Pages Router'})**`)
  else if (info.isRemix) stack.push('**Remix**')
  else if (info.isAstro) stack.push('**Astro**')
  else if (info.isNuxt) stack.push('**Nuxt**')
  else if (info.isSvelteKit) stack.push('**SvelteKit**')
  else if (info.isReact) stack.push('**React**')
  else if (info.isVue) stack.push('**Vue 3**')
  else if (info.isAngular) stack.push('**Angular**')
  else if (info.isSolid) stack.push('**SolidJS**')
  else if (info.isQwik) stack.push('**Qwik**')

  // Primary Languages
  if (info.hasTs) stack.push('**TypeScript**')
  else if (info.hasPy) stack.push('**Python**')
  else if (info.hasRust) stack.push('**Rust**')
  else if (info.hasGo) stack.push('**Go**')
  else if (info.hasJava) stack.push('**Java/Kotlin**')
  else if (info.hasCSharp) stack.push('**C# / .NET**')

  // AI & Agentic Stack
  if (info.hasGoogleAI) stack.push('**Google Gemini / Gen AI SDK**')
  if (info.hasVercelAI) stack.push('**Vercel AI SDK**')
  if (info.hasLangChain) stack.push('**LangChain**')
  if (info.hasOpenAI) stack.push('**OpenAI SDK**')
  if (info.hasAnthropic) stack.push('**Anthropic Claude SDK**')

  // Backend & APIs
  if (info.isNest) stack.push('**NestJS**')
  else if (info.isFastify) stack.push('**Fastify**')
  else if (info.isHono) stack.push('**Hono**')
  else if (info.isExpress) stack.push('**Express**')

  // 3D & Creative
  if (info.isThree || info.isR3F) stack.push('**Three.js / R3F**')
  if (info.isPixi) stack.push('**PixiJS**')

  // UI & Styling
  if (info.isShadcn) stack.push('**Shadcn UI**')
  else if (info.isMui) stack.push('**Material UI (MUI)**')
  else if (info.isChakra) stack.push('**Chakra UI**')
  else if (info.isAntd) stack.push('**Ant Design**')
  else if (info.isMantine) stack.push('**Mantine**')
  else if (info.isTailwind) stack.push('**Tailwind CSS**')

  // ORM & Database
  if (info.isPrisma) stack.push('**Prisma ORM**')
  else if (info.isDrizzle) stack.push('**Drizzle ORM**')
  if (info.isSupabase) stack.push('**Supabase**')
  if (info.isFirebase) stack.push('**Firebase**')

  // State Management
  if (info.isZustand) stack.push('**Zustand**')
  else if (info.isRedux) stack.push('**Redux Toolkit**')
  else if (info.isPinia) stack.push('**Pinia**')
  if (info.isTanstackQuery) stack.push('**TanStack Query**')

  // Build & Tooling
  if (info.isVite) stack.push('**Vite**')
  if (info.isTurborepo) stack.push('**Turborepo**')

  const stackString = stack.length > 0 ? stack.join(', ') : 'modern architectural patterns'

  return `**${info.projectName}** is a production-grade application engineered with ${stackString}.\n\n` +
    `> ${info.description}`
}

function formatCodingStandards(info) {
  const items = []

  // 1. Language Excellence
  if (info.hasTs) {
    items.push(`**Senior TypeScript Architecture & Strict Typing:**\n` +
      `   - Enforce strict type safety: never use \`any\` or \`as unknown as T\` workarounds. Utilize explicit interfaces, tagged unions, and generics.\n` +
      `   - Ensure proper separation of concerns across state persistence, business domain logic, presentation UI, and platform bridges.\n` +
      `   - Keep \`tsconfig.json\` strict and ensure TypeScript compilation exits with 0 errors and 0 warnings.`)

    if (info.isElectron) {
      items.push(`**Electron Strict Process Boundaries:**\n` +
        `   - Maintain an impenetrable separation between the **Main Process** (native OS, display routing, system tray, window lifecycle) and the **Renderer Process** (UI views, rendering loop).\n` +
        `   - Never import Node.js core modules (\`fs\`, \`path\`, \`child_process\`) directly in renderer code (\`src/\`). All native platform interactions must cross through a typed preload bridge.`)
    } else if (info.isNextAppRouter) {
      items.push(`**Next.js Server vs Client Component Boundaries:**\n` +
        `   - Maintain React Server Components (RSC) as the default. Confine \`'use client'\` strictly to leaf interactive components.\n` +
        `   - Server actions and database mutations must execute on the server with schema validation (e.g. Zod).`)
    }
  } else if (info.hasPy) {
    items.push(`**Senior Python Architecture:**\n` +
      `   - Adhere strictly to PEP 8, PEP 484 type hints, and Pydantic data schemas.\n` +
      `   - Use dependency injection, structured logging, and robust exception handling without bare \`except:\` clauses.`)
  } else if (info.hasRust) {
    items.push(`**Idiomatic Rust Engineering:**\n` +
      `   - Write memory-safe, zero-cost abstractions with explicit ownership, borrowing, and lifetime management.\n` +
      `   - Never use \`.unwrap()\` or \`.expect()\` in production code paths; propagate structured errors via \`Result<T, E>\` and \`?\`.`)
  } else if (info.hasGo) {
    items.push(`**Idiomatic Go Principles:**\n` +
      `   - Adhere to effective Go conventions: clear interface definitions, explicit error propagation, and context propagation (\`ctx context.Context\`).\n` +
      `   - Properly manage goroutine lifecycles with channels or sync primitives to avoid goroutine leaks.`)
  } else {
    items.push(`**Senior Developer Standards:**\n` +
      `   - Write clean, modular, self-documenting code with comprehensive separation of concerns and single responsibility.`)
  }

  // 2. DRY & Modular Refactoring
  items.push(`**DRY & Single Responsibility Principles:**\n` +
    `   - Decompose monolithic routines and large files into focused, reusable modules, services, and utility functions.\n` +
    `   - Decouple external API integrations and persistence layers behind clear domain interfaces.`)

  // 3. AI / LLM Integration Rules
  if (info.hasGoogleAI || info.hasOpenAI || info.hasAnthropic || info.hasVercelAI || info.hasLangChain) {
    items.push(`**Resilient AI & LLM SDK Integration:**\n` +
      `   - Always wrap LLM inference calls with exponential backoff retries, explicit timeout bounds, and graceful model fallbacks.\n` +
      `   - Sanitize and validate all structured outputs and JSON schema responses from LLMs before passing them to application business logic.\n` +
      `   - Implement streaming responses and optimistic state updates to preserve smooth user experiences.`)
  }

  // 4. 3D & Graphics Lifecycle
  if (info.isThree || info.isR3F) {
    items.push(`**High-Performance 3D & WebGL Lifecycle:**\n` +
      `   - Wrap all 3D asset loaders (\`useGLTF\`, \`useAnimations\`) inside React \`<Suspense>\` and custom error boundaries with fallback states.\n` +
      `   - Preload static models using \`useGLTF.preload()\` at module load time to eliminate runtime rendering hitches.\n` +
      `   - Explicitly dispose of Three.js geometries, textures, materials, and Web Audio context nodes upon component teardown to eliminate memory leaks.`)
  }

  return items.map((item, i) => `${i + 1}. ${item}`).join('\n\n')
}

function formatFrameworkRules(info) {
  const sections = []

  if (info.isElectron) {
    sections.push(`### Electron Desktop & Window Lifecycle Guidelines:\n` +
      `1. **Window Transparency & Pointer Events Routing:**\n` +
      `   - When overlays are idle or transparent, pass pointer events through to background applications (\`win.setIgnoreMouseEvents(true, { forward: true })\`).\n` +
      `   - When interactive modals, context menus, or prompts open, immediately restore pointer capture (\`win.setIgnoreMouseEvents(false)\`).\n` +
      `2. **Multi-Monitor Display & Cursor Detection:**\n` +
      `   - Dynamically compute active cursor positions (\`screen.getCursorScreenPoint()\`) and route overlays to the nearest display bounds (\`screen.getDisplayNearestPoint()\`).\n` +
      `3. **Single-Instance Lock & Lifecycle Sync:**\n` +
      `   - Guard the application with \`app.requestSingleInstanceLock()\`. If a second instance launches, restore and focus the primary window.\n` +
      `   - Keep tray menus and global shortcut listeners synchronized with live application state.`)
  }

  if (info.isTauri) {
    sections.push(`### Tauri Desktop Guidelines:\n` +
      `1. **IPC & Command Security:**\n` +
      `   - Keep Tauri IPC commands in Rust strongly typed with Serde serialization.\n` +
      `   - Minimize Tauri allowlist permissions in \`tauri.conf.json\` following the principle of least privilege.`)
  }

  if (info.isNext) {
    sections.push(`### Next.js & Fullstack React Guidelines:\n` +
      `1. **Data Caching & Revalidation:**\n` +
      `   - Leverage \`fetch\` cache tags and \`revalidateTag\` / \`revalidatePath\` for granular invalidation.\n` +
      `   - Never perform expensive database queries or expose secret credentials inside client-rendered code.\n` +
      `2. **Route Handlers & Server Actions:**\n` +
      `   - Validate incoming payloads using schema validators (Zod / TypeBox) before executing database mutations.`)
  }

  if (info.isTailwind || info.isShadcn || info.isMui || info.isChakra || info.isAntd || info.isMantine) {
    sections.push(`### UI / UX Design System & Layout Conventions:\n` +
      `1. **Design System & Visual Cohesion:**\n` +
      `   - Maintain consistent spacing tokens, typography hierarchies, and cohesive theme modes (dark/light) with WCAG AA contrast compliance.\n` +
      `   - Ensure smooth transitions, subtle glassmorphism effects, and accessible focus outlines on all interactive elements.`)
  }

  if (info.isPrisma || info.isDrizzle || info.isSupabase || info.isTypeOrm || info.isMongoose) {
    sections.push(`### Database, ORM & Persistence Standards:\n` +
      `1. **Schema Integrity & Migrations:**\n` +
      `   - Always validate database inputs with schema validators before triggering ORM queries.\n` +
      `   - Ensure proper indexes on foreign keys, lookups, and unique constraints for query performance.`)
  }

  return sections.length > 0
    ? sections.join('\n\n')
    : `Follow standard idiomatic ${info.isReact ? 'React' : 'software'} design patterns, modular architecture, and clean separation of concerns.`
}

function formatSecurityRules(info) {
  const items = []

  if (info.isElectron) {
    items.push(`**Electron Hardened Sandboxing & Context Isolation:**\n` +
      `   - Enforce \`contextIsolation: true\`, \`nodeIntegration: false\`, \`nodeIntegrationInWorker: false\`, \`nodeIntegrationInSubFrames: false\`, \`sandbox: true\`, and \`webSecurity: true\` across all \`BrowserWindow\` instances.\n` +
      `   - Never expose raw \`ipcRenderer\` or Node internals to the renderer window. Expose strictly typed, minimal helper functions via \`contextBridge.exposeInMainWorld('api', ...)\`.\n` +
      `   - Enforce navigation lockdown: intercept \`will-navigate\` and register \`setWindowOpenHandler\` to block untrusted URLs from loading inside Electron. Route verified web URLs through \`shell.openExternal\` after strict protocol validation (\`http:\` / \`https:\` only).\n` +
      `   - Verify \`event.senderFrame\` on all \`ipcMain\` handlers to prevent unauthorized frame spoofing. Validate all IPC payload schemas using Zod/TypeBox before execution.`)
  } else {
    items.push(`**Zero Exposed Secrets & Environment Validation:**\n` +
      `   - Never hardcode private API keys, database credentials, or sensitive tokens in client-facing or version-controlled files.\n` +
      `   - Validate all runtime environment variables at application boot using schema parsers (e.g. Zod / envalid).`)
  }

  // Slow Network & Offline Resilience (Essential for flaky / high-latency connections)
  items.push(`**Network Resilience & Latency Handling:**\n` +
    `   - All network calls must specify explicit timeout thresholds (e.g. \`AbortSignal.timeout(10000)\`).\n` +
    `   - Implement automatic exponential backoff retry with jitter for idempotent network requests to handle unstable 3G or high-latency connections.\n` +
    `   - Handle offline and degraded connection states gracefully (\`navigator.onLine\`, \`offline\` event listeners) without unhandled promise rejections or freezing UI state.`)

  // Injection, Shell & Cross-Platform Path Security
  items.push(`**Injection Defense & Cross-Platform Path Safety:**\n` +
    `   - Never construct shell commands via string concatenation (e.g., avoid \`exec(\`cmd \${input}\`)\`). Use parameterized execution APIs (\`execFile\` or \`spawn\` with array arguments) to eliminate Command Injection (CWE-78).\n` +
    `   - Normalize all file system paths using \`node:path\` (\`path.join\`, \`path.resolve\`) to ensure seamless cross-platform reliability on Windows, macOS, and Linux.\n` +
    `   - Parameterize all SQL/database queries and sanitize any HTML rendered dynamically (e.g. via DOMPurify) to prevent SQLi and XSS.`)

  // Resource Management & Memory Safety
  items.push(`**Resource Management & Concurrency Safety:**\n` +
    `   - Prevent memory leaks: always unregister event listeners, clear intervals/timers, abort pending network requests, and tear down WebSockets/workers when components unmount.\n` +
    `   - Offload heavy compute operations away from the main UI thread to Web Workers or Worker Threads to maintain responsive 60fps rendering.`)

  if (info.isSupabase) {
    items.push(`**Row-Level Security (RLS) & Authorization:**\n` +
      `   - Ensure all Supabase tables enforce strict Row-Level Security (RLS) policies. Never rely solely on client-side state for authorization.`)
  }

  items.push(`**Clean Build Artifacts & Git Hygiene:**\n` +
    `   - Keep build artifacts (\`dist\`, \`dist-electron\`, \`release\`, \`build\`, \`node_modules\`, \`.next\`, \`.turbo\`) ignored in \`.gitignore\`.`)

  return items.map((item, i) => `${i + 1}. ${item}`).join('\n\n')
}

function formatVerificationRunbook(info) {
  const steps = []
  let stepNumber = 1

  if (info.scripts['lint'] || info.isEslint || info.isBiome) {
    const lintCmd = info.scripts['lint'] ? 'npm run lint' : (info.isBiome ? 'npx @biomejs/biome check .' : 'npx eslint .')
    steps.push(`${stepNumber++}. **Lint & Code Style Quality Check:**\n   \`\`\`bash\n   ${lintCmd}\n   \`\`\`\n   *Must exit with code 0 without unaddressed errors.*`)
  }

  if (info.hasTs) {
    steps.push(`${stepNumber++}. **TypeScript Strict Compilation:**\n   \`\`\`bash\n   npx tsc --noEmit\n   \`\`\`\n   *Must compile with zero TypeScript errors or type mismatches.*`)
  }

  if (info.hasRust) {
    steps.push(`${stepNumber++}. **Rust Cargo Verification:**\n   \`\`\`bash\n   cargo check && cargo clippy -- -D warnings\n   \`\`\`\n   *Must pass cleanly with zero warnings or errors.*`)
  }

  if (info.hasGo) {
    steps.push(`${stepNumber++}. **Go Vet & Build:**\n   \`\`\`bash\n   go vet ./... && go build ./...\n   \`\`\`\n   *Must build cleanly with zero vet warnings.*`)
  }

  if (info.scripts['build']) {
    const buildCmd = info.isVite ? 'npx vite build' : 'npm run build'
    steps.push(`${stepNumber++}. **Production Build Verification:**\n   \`\`\`bash\n   ${buildCmd}\n   \`\`\`\n   *Must bundle cleanly with zero compilation or packaging errors.*`)
  }

  if (info.scripts['test'] || info.isVitest || info.isJest || info.isPlaywright || info.isCypress) {
    const testCmd = info.scripts['test'] ? 'npm test' : (info.isVitest ? 'npx vitest run' : (info.isJest ? 'npx jest' : 'npm test'))
    steps.push(`${stepNumber++}. **Automated Test Suite:**\n   \`\`\`bash\n   ${testCmd}\n   \`\`\`\n   *All unit, integration, and end-to-end tests must pass cleanly.*`)
  }

  if (steps.length === 0) {
    steps.push(`1. **Manual Verification:**\n   - Ensure all modified files run without syntax errors and conform to project standards.`)
  }

  return steps.join('\n\n')
}

// ── Built-in Master Template (Fallback & Standard) ──────────────────────────
const MASTER_TEMPLATE = `# Senior Developer & Security Guidelines (Coding Agent Instructions)

> **CRITICAL INSTRUCTION FOR ALL AI CODING AGENTS**:
> Whenever you analyze, plan, edit, or refactor code in this repository (**{{PROJECT_NAME}}**), you must **strictly adhere** to all architectural best practices, security standards, UI/UX conventions, documentation maintenance, and commit conventions detailed in this document.

---

## 1. Project Overview & Architecture

{{PROJECT_OVERVIEW}}

### Project Structure & Separation of Concerns:
\`\`\`text
{{PROJECT_STRUCTURE}}
\`\`\`

---

## 2. Professional Mindset & Clean Code Standards

{{CODING_STANDARDS}}

---

## 3. Framework & Technical Guidelines

{{FRAMEWORK_SPECIFIC_RULES}}

---

## 4. Zero-Vulnerability & Cybersecurity Principles

{{SECURITY_RULES}}

---

## 5. Continuous Documentation Maintenance (README Sync)

1. **Keep Documentation Synchronized:**
   - Whenever adding new features, components, architecture changes, settings options, or build requirements, **you must update \`README.md\`** to reflect the changes.
   - Keep technology stack listings, installation/build instructions, and environment variable notes completely accurate.

---

## 6. Standard Git Commit Message Conventions

All commit messages in this project must follow the standard **Conventional Commits** specification:

### Format:
\`\`\`text
<type>(<scope>): <short description in imperative mood>
\`\`\`

### Commit Types:
* \`feat(scope):\` -> A new feature or user-facing capability (e.g. \`feat(models): add animated cyber samurai 3D model\`).
* \`fix(scope):\` -> A bug fix or error correction (e.g. \`fix(tray): update mute icon on tray menu toggle\`).
* \`perf(scope):\` -> Performance improvement (e.g. \`perf(three): dispose unused textures on model swap\`).
* \`refactor(scope):\` -> Code restructuring without changing functional behavior (e.g. \`refactor(timers): extract interval calculation helper\`).
* \`security(scope):\` -> Security hardening or IPC sanitization (e.g. \`security(ipc): validate payload structure in main process\`).
* \`style(scope):\` -> Styling, theme, or layout tweaks (e.g. \`style(settings): refine slider contrast for dark theme\`).
* \`docs(scope):\` -> Documentation updates (e.g. \`docs(readme): document new stretch break intervals\`).
* \`chore(scope):\` -> Maintenance, dependencies, build configuration (e.g. \`chore(deps): update electron to latest patch release\`).

---

## 7. Verification & Quality Assurance Runbook

Before completing any coding task, the agent must run and verify all of the following:

{{VERIFICATION_RUNBOOK}}
`

// ── Auto-update .gitignore to ignore generated AI Agent rule files ────────────

function ensureGitignore(rootDir, entries = ['AGENTS.md', 'GEMINI.md', 'templates/']) {
  const gitignorePath = path.join(rootDir, '.gitignore')
  let currentContent = ''

  if (fs.existsSync(gitignorePath)) {
    try {
      currentContent = fs.readFileSync(gitignorePath, 'utf8')
    } catch {
      return
    }
  }

  const missing = entries.filter(entry => {
    const pattern = escapeRegex(entry.replace(/\/$/, ''))
    const regex = new RegExp(`(^|\\n)\\s*${pattern}(\\/)?\\s*($|\\n)`, 'm')
    return !regex.test(currentContent)
  })

  if (missing.length > 0) {
    const block = `\n# AI Agent rule & template files (per-repo local generated)\n${missing.join('\n')}\n`
    const normalized = normalizeLineEndings(currentContent)
    const newContent = normalized + (normalized.endsWith('\n') || normalized.length === 0 ? '' : '\n') + block
    try {
      fs.writeFileSync(gitignorePath, newContent, 'utf8')
      console.log(`[generate-rules] + Added to .gitignore: ${missing.join(', ')}`)
    } catch (err) {
      console.warn(`[generate-rules] ! Could not update .gitignore: ${err.message}`)
    }
  }
}

// ── Generator Orchestration ─────────────────────────────────────────────────

/**
 * Main generator API.
 * Analyzes target codebase and outputs tailored AGENTS.md and GEMINI.md files.
 *
 * @param {string} [targetDir] - Root directory to inspect. Defaults to current working directory.
 * @param {object} [options] - Configuration options.
 * @param {boolean} [options.dryRun] - If true, logs generated content without writing files.
 * @param {boolean} [options.verbose] - If true, prints verbose inspection logs.
 * @returns {object} Results containing generated file names and analyzed metadata.
 */
export function generateRules(targetDir = process.cwd(), options = {}) {
  const rootDir = getValidatedDirectory(targetDir)
  const { dryRun = false, verbose = false } = options

  if (verbose || !dryRun) {
    console.log(`[generate-rules] ^-^ Analyzing codebase at: ${rootDir}`)
  }

  const info = analyzeCodebase(rootDir)

  const treeLines = [info.baseName + '/', ...generateDirectoryTree(rootDir)]
  const projectStructure = treeLines.join('\n')

  const overview = formatProjectOverview(info)
  const codingStandards = formatCodingStandards(info)
  const frameworkRules = formatFrameworkRules(info)
  const securityRules = formatSecurityRules(info)
  const verificationRunbook = formatVerificationRunbook(info)

  const replacements = {
    '{{PROJECT_NAME}}': info.projectName,
    '{{PROJECT_OVERVIEW}}': overview,
    '{{PROJECT_STRUCTURE}}': projectStructure,
    '{{CODING_STANDARDS}}': codingStandards,
    '{{FRAMEWORK_SPECIFIC_RULES}}': frameworkRules,
    '{{SECURITY_RULES}}': securityRules,
    '{{VERIFICATION_RUNBOOK}}': verificationRunbook,
  }

  const targets = [
    { templateName: 'AGENTS.template.md', outputName: 'AGENTS.md' },
    { templateName: 'GEMINI.template.md', outputName: 'GEMINI.md' },
  ]

  const templatesDir = path.join(rootDir, 'templates')
  const generatedFiles = []

  for (const { templateName, outputName } of targets) {
    const templatePath = path.join(templatesDir, templateName)
    let content = ''

    if (fs.existsSync(templatePath)) {
      try {
        content = fs.readFileSync(templatePath, 'utf8')
      } catch {
        content = MASTER_TEMPLATE
      }
    } else {
      content = MASTER_TEMPLATE
    }

    for (const [placeholder, value] of Object.entries(replacements)) {
      content = content.replaceAll(placeholder, value)
    }

    content = normalizeLineEndings(content)

    if (dryRun) {
      console.log(`\n================== [DRY-RUN: ${outputName}] ==================`)
      console.log(content.slice(0, 500) + '\n... [content truncated for dry-run preview] ...')
      console.log(`==============================================================\n`)
    } else {
      const outputPath = path.join(rootDir, outputName)
      fs.writeFileSync(outputPath, content, 'utf8')
      console.log(`[generate-rules] :> Generated ${outputName} customized for ${info.projectName}`)
    }

    generatedFiles.push(outputName)
  }

  // Ensure generated markdown files and templates are in .gitignore
  if (!dryRun) {
    ensureGitignore(rootDir)
  }

  console.log(`[generate-rules] >>> Completed AI agent rule generation successfully!`)
  return { rootDir, info, generatedFiles }
}

// ── CLI Runner & Argument Parser ────────────────────────────────────────────

function printHelp() {
  console.log(`
Universal Intelligent AI Agent Rules Generator (${PKG_VERSION})

Usage:
  npx github:PramudithaN/generate-rules [target-directory] [options]
  generate-rules [target-directory] [options]
  node generate-rules.mjs [target-directory] [options]

Arguments:
  target-directory       Optional target project path (defaults to current working directory)

Options:
  -n, --dry-run          Preview generated output without modifying files
  -v, --version          Display version number
  -h, --help             Show this help menu
  --verbose              Display detailed analysis logs

Examples:
  generate-rules
  generate-rules /path/to/project
  generate-rules . --dry-run
`)
}

function runCli() {
  const args = process.argv.slice(2)
  let targetPath = null
  let dryRun = false
  let verbose = false

  for (const arg of args) {
    if (arg === '-h' || arg === '--help') {
      printHelp()
      process.exit(0)
    } else if (arg === '-v' || arg === '--version') {
      console.log(`generate-rules v${PKG_VERSION}`)
      process.exit(0)
    } else if (arg === '-n' || arg === '--dry-run') {
      dryRun = true
    } else if (arg === '--verbose') {
      verbose = true
    } else if (!arg.startsWith('-')) {
      targetPath = arg
    }
  }

  try {
    generateRules(targetPath || process.cwd(), { dryRun, verbose })
  } catch (err) {
    console.error(`\n[generate-rules] x Error: ${err.message}\n`)
    process.exit(1)
  }
}

// Run CLI when invoked directly from command line
if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  runCli()
}
