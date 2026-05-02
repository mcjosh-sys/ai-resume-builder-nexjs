# CVCopilot — AI-Powered Resume Builder

An intelligent, full-stack resume builder that combines a rich editing experience with a multi-provider AI copilot. CVCopilot helps you write, refine, and tailor your resume to specific job descriptions — all in one place.

---

## ✨ Features

### 📝 Rich Resume Editor
- Drag-and-drop section reordering powered by **dnd-kit**
- **Lexical**-based rich text editing for freeform content
- Section management: enable/disable, reorder, or add custom sections
- Photo upload via **UploadThing**
- Live resume preview with instant reflection of changes

### 🤖 AI Copilot
- **Rewrite with AI** — rewrites your entire resume with improved, professional language
- **Tailor to Job** — adapts your resume to match a specific job description
- **Improve Bullet Points** — converts paragraph text into impactful bullet points
- **Analyze & Optimize** — generates targeted per-section suggestions (insert / replace / delete) based on a job description
- Multi-provider architecture: **Google Gemini**, **Groq**, and **OpenRouter** with automatic fallback

### 🎨 Resume Templates (13 Designs)
| Template | Template | Template |
|----------|----------|----------|
| Aurora   | Axis     | Banner   |
| Canvas   | Diff     | Ember    |
| Focal    | Ledger   | Nova     |
| Prism    | Sage     | Slate    |
| Velvet   |          |          |

- Per-resume color theme and border style (Squircle / Rounded / Square)
- PDF export with print-optimised CSS

### 📄 Resume Sections
- Header (name, job title, contact info, links)
- Professional Summary
- Work Experience
- Education
- Skills (with level & category)
- Projects
- Certifications
- Awards
- Custom / Other Fields

### 🔐 Auth & Subscriptions
- Authentication via **Clerk** (sign-up, sign-in, session management)
- Stripe-powered subscription model for premium features
- ATS score tracking per resume

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| UI | React 19, Radix UI, shadcn/ui, Framer Motion |
| Styling | Tailwind CSS v4 |
| Rich Text | Lexical |
| Drag & Drop | dnd-kit |
| Database | PostgreSQL via Prisma + Neon adapter |
| Auth | Clerk |
| AI Providers | Google Gemini, Groq, OpenRouter |
| File Uploads | UploadThing |
| Payments | Stripe |
| Validation | Zod + React Hook Form |
| Package Manager | Bun |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** ≥ 20
- **Bun** (recommended) — [install](https://bun.sh)
- A PostgreSQL database (e.g. [Neon](https://neon.tech))
- Clerk, Stripe, and at least one AI provider account

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

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# AI Providers (configure at least one)
GOOGLE_GENERATIVE_AI_API_KEY=
GROQ_API_KEY=
OPENROUTER_API_KEY=

# UploadThing
UPLOADTHING_SECRET=
UPLOADTHING_APP_ID=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
```

### Database Setup

```bash
# Push schema to your database
bunx prisma db push

# (Optional) Open Prisma Studio
bunx prisma studio
```

### Run the Development Server

```bash
bun run dev
```

The app runs on **[http://localhost:3600](http://localhost:3600)**.

> The dev script also compiles the PDF-specific CSS automatically before starting Next.js.

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
│   └── api/             # API routes (resume CRUD, PDF export, UploadThing, Stripe)
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
├── providers/           # App-level providers (theme, etc.)
├── server/              # Server-side helpers and DB queries
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
| `bun run dev` | Build PDF CSS, then start Next.js dev server on port 3600 |
| `bun run build` | Build PDF CSS, then build the production bundle |
| `bun run start` | Start the production server |
| `bun run lint` | Run ESLint |
| `bun run build:pdf:css` | Compile `app/pdf.css` → `public/css/pdf.css` (Tailwind CLI) |
| `bun run shadcn:add` | Add a shadcn/ui component |

---

## 📄 License

This project is private. All rights reserved.
