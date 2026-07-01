# Learnify

Learnify turns your documents into study material. Upload a PDF and it uses AI to generate a summary (with flashcard-style slides) or a quiz, so you can review and test yourself on the content instead of re-reading it.

## Features

- **Upload & process PDFs** — files are parsed and stored via Cloudflare R2 / UploadThing.
- **AI-generated summaries** — key takeaways and slide-based overviews powered by Groq and Gemini.
- **AI-generated quizzes** — question/answer sets generated from the uploaded material.
- **Auth** — user accounts and sessions via Clerk.
- **Billing** — subscriptions via Stripe, with Bakong (Cambodian payment) support.
- **Dashboard** — track and revisit your quizzes and summaries.

## Tech Stack

- [Next.js](https://nextjs.org) (App Router) + React 19 + TypeScript
- [Prisma](https://www.prisma.io) + PostgreSQL
- [Clerk](https://clerk.com) for authentication
- [Tailwind CSS](https://tailwindcss.com) + shadcn/ui components
- [Groq SDK](https://groq.com) / [Google Generative AI](https://ai.google.dev) + LangChain for AI generation
- [Stripe](https://stripe.com) and Bakong for payments
- Cloudflare R2 for file storage

## Getting Started

### Prerequisites

- Node.js 18+
- A PostgreSQL database (e.g. [Neon](https://neon.tech))

### Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy the example environment file and fill in your own credentials:

   ```bash
   cp .env.example .env
   ```

   You'll need keys for Clerk, Groq, Gemini, Cloudflare R2, UploadThing, Stripe, and Bakong — see `.env.example` for the full list.

3. Generate the Prisma client and run database migrations:

   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

4. Run the development server:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to see the app.

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — generate the Prisma client and build for production
- `npm run start` — start the production server
- `npm run lint` / `npm run lint:fix` — lint the codebase

## Project Structure

- `app/` — Next.js App Router pages and API routes (`api/upload`, `api/summaries`, `api/quizzes`, `api/payments`, `api/complete`)
- `app/(logged-in)/` — authenticated routes: dashboard, upload, summary, quiz
- `components/` — UI components, organized by feature (`upload`, `flashcards`, `allQuizzes`, `home`, `layout`, `ui`)
- `prisma/schema.prisma` — database schema (users, quizzes, summaries, slides, questions, payments)
- `lib/` / `utils/` — shared helpers
