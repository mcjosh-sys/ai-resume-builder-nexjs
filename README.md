# CVCopilot — AI-Powered Resume Builder

An intelligent, full-stack resume builder that combines a rich editing experience with a multi-provider AI copilot. CVCopilot helps you write, refine, and tailor your resume to specific job descriptions — all in one place.

---

## ✨ Features

### 📝 Rich Resume Editor
- Drag-and-drop section reordering powered by **dnd-kit**
- **Lexical**-based rich text editing for freeform content
- Section management: enable/disable, reorder, or add custom sections
- Photo upload via **UploadThing** (using Direct Server Uploads)
- Live resume preview with instant reflection of changes

### 🤖 AI Copilot
- **Rewrite with AI** — rewrites your entire resume with professional language
- **Tailor to Job** — adapts your resume to match a specific job description
- **Improve Bullet Points** — converts paragraph text into impactful bullet points
- **Analyze & Optimize** — generates targeted per-section suggestions (insert / replace / delete) based on a job description
- Multi-provider architecture: **Google Gemini**, **Groq**, and **OpenRouter** with automatic fallback

### 🎨 Resume Templates (15 Designs)
| Template | Template | Template |
|----------|----------|----------|
| Aurora   | Axis     | Banner   |
| Canvas   | Chronicle| Ember    |
| Focal    | Ledger   | Nova     |
| Prism    | Sage     | Slate    |
| Summit   | Vanguard | Velvet   |

- Per-resume color theme and border style (Squircle / Rounded / Square)
- Pixel-perfect PDF export via headless browser rendering (**Puppeteer** & **Chromium** integration)

### 📄 Resume Sections
- Header (name, job title, contact info, links)
- Professional Summary
- Work Experience
- Education
- Skills (with category and proficiency level)
- Languages (with proficiency level)
- Projects
- Certifications
- Awards
- Custom / Other Fields

### 🔐 Auth & Subscriptions
- Authentication via **Clerk** (sign-up, sign-in, session management)
- Paystack-powered subscription model for premium/PRO/team tiers
- ATS score tracking per resume

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| UI | React 19, Radix UI, Base UI, shadcn/ui, Framer Motion |
| Styling | Tailwind CSS v4 |
| Rich Text | Lexical |
| Drag & Drop | dnd-kit |
| Database | PostgreSQL via Prisma + Neon adapter |
| Auth | Clerk |
| AI Providers | Google Gemini, Groq, OpenRouter |
| File Uploads | UploadThing |
| Payments | Paystack |
| Validation | Zod + React Hook Form |
| Package Manager | Bun |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** ≥ 20
- **Bun** (recommended) — [install](https://bun.sh)
- A PostgreSQL database (e.g. [Neon](https://neon.tech))
- Clerk, Paystack, and at least one AI provider account

### Installation

```bash
# Clone the repository
git clone https://github.com/mcjosh-sys/ai-resume-builder-nexjs.git
cd ai-resume-builder-nexjs

# Install dependencies
bun install
```

### Environment Variables

Create a `.env` file at the project root. Required variables:

```env
# Database
DATABASE_URL=

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3600

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL=/dashboard
NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL=/dashboard?isNew=true

# AI Providers (configure at least one)
GEMINI_API_KEY=
GROQ_API_KEY=
OPENROUTER_API_KEY=

# UploadThing
UPLOADTHING_TOKEN=

# Paystack
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=
PAYSTACK_SECRET_KEY=
PAYSTACK_PRO_MONTHLY_PLAN_CODE=
PAYSTACK_PRO_ANNUAL_PLAN_CODE=
PAYSTACK_TEAM_MONTHLY_PLAN_CODE=
PAYSTACK_TEAM_ANNUAL_PLAN_CODE=
```

### Database Setup

```bash
# Push schema to your database and generate Client
bunx prisma db push

# (Optional) Open Prisma Studio
bunx prisma studio
```

### Run the Development Server

```bash
bun run dev
```

The app runs on **[http://localhost:3600](http://localhost:3600)**.

> The dev script automatically compiles the styling (`globals.css` → `main.css`) before launching the Next.js server.

---

## 📁 Project Structure

```
cvcopilot/
├── app/
│   ├── (auth)/          # Sign-in / sign-up pages
│   ├── (main)/          # Protected app: dashboard, resume list, editor
│   │   ├── dashboard/
│   │   ├── resumes/
│   │   └── editor/
│   ├── (marketing)/     # Public landing page
│   └── api/             # API routes (resume CRUD, PDF export, Paystack billing)
├── features/
│   ├── ai/              # AI providers, prompts, and server actions
│   │   ├── actions/     # rewrite, tailor, suggestions, bullet conversion
│   │   ├── prompts/     # Prompt builders
│   │   └── providers/   # Gemini, Groq, OpenRouter, multi-provider factory
│   ├── editor/          # Resume editor UI, forms, templates, context
│   │   ├── components/  # Editor shell, sidebar, copilot panel, templates
│   │   ├── contexts/    # Editor state context
│   │   ├── helpers/     # Resume ↔ AI data transformations
│   │   └── hooks/       # Editor-specific hooks
│   ├── marketing/       # Landing page sections (hero, features, CTA, etc.)
│   └── resume/          # Resume list, resume card, resume actions
├── components/          # Shared UI components
├── hooks/               # Global hooks (useResumeAI, useModal, etc.)
├── lib/                 # Utilities, Prisma client, error handling
├── prisma/              # Prisma schema and migrations
├── providers/           # App-level providers (theme, clerk, etc.)
├── server/              # Server-side helpers, actions (image upload/PDF generation), DB queries
├── store/               # Zustand global state stores
└── types/               # Shared TypeScript types
```

---

## 🧠 AI Architecture

The AI layer is built around a **multi-provider strategy** with an abstracted `AIProvider` interface. The `getMultiProvider()` factory returns a `MultiAIProvider` that chains Gemini → Groq → OpenRouter, falling back automatically on failure.

Each action uses a purpose-built prompt:
- `buildRewriteResumePrompt` — full resume rewrite
- `buildTailorToJobPrompt` — job-description-aware tailoring
- `buildConvertToBulletsPrompt` — bullet point formatting
- `buildSuggestionPrompt` — structured per-section suggestions (insert/replace/delete)

AI responses are returned as structured JSON or HTML and parsed with `parseAIJSON` / `parseAIHTML` utilities.

---

## 📦 Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Compile global CSS, then start Next.js dev server on port 3600 |
| `bun run build` | Generate Prisma client, apply database migrations, compile CSS, and build Next.js production bundle |
| `bun run start` | Start the production server |
| `bun run lint` | Run ESLint checks |
| `bun run build:css` | Compile `app/globals.css` → `public/css/main.css` using Tailwind CSS CLI |
| `bun run shadcn:add` | Add a shadcn/ui component |

---

## 📄 License

This project is private. All rights reserved.
