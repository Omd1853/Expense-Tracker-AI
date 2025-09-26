# Expense Tracker AI

A simple AI-powered Expense Tracker built with Next.js.

## Features
- Track your expenses easily
- AI-powered insights (if integrated)
- User authentication (using Clerk)

## Tech Stack
- **Frontend & Backend:** Next.js 15
- **Authentication:** Clerk
- **Styling:** Tailwind CSS
- **AI Integration:** OpenRouter / OpenAI (optional)
- **Database:** SQLite / Prisma (if used)

## Installation

1. **Clone the repository**

git clone https://github.com/your-username/expense-tracker-ai.git
cd expense-tracker-ai

2. **Install Dependencies**
npm install

3.**Set Up Env**
DATABASE_URL=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/
GEMINI_API_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000

4.**Run**

npm run dev

