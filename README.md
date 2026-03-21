# Akshay's Portfolio

A modern portfolio site built with Next.js, TypeScript, and Tailwind CSS to showcase analytics engineering experience, featured projects, and AI-assisted recruiter workflows.

This repository powers a personal portfolio experience with three main surfaces:

- A polished landing page for recruiters and hiring managers
- `AkshayGPT`, a portfolio-grounded chat assistant
- A recruiter tool that analyzes job descriptions against portfolio evidence

## Features

- Portfolio content managed from structured data sources
- Recruiter-focused job fit analysis grounded in portfolio evidence
- AI chat experience powered by the OpenAI Responses API
- Responsive UI built with the Next.js App Router
- Typed frontend and API routes with TypeScript

## Tech Stack

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- OpenAI Responses API

## Getting Started

### Prerequisites

- Node.js 18+ recommended
- npm

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env.local` file using `.env.example` as a reference:

```bash
OPENAI_API_KEY=your_openai_api_key_here
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

### Run Locally

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

## Available Scripts

- `npm run dev` starts the development server
- `npm run build` creates a production build
- `npm run start` starts the production server
- `npm run lint` runs ESLint

## Project Structure

- `app/` application routes, layouts, metadata, and API handlers
- `components/` UI building blocks and page-level React components
- `data/portfolio.ts` structured portfolio content used across the site
- `lib/` shared utilities, portfolio context builders, and recruiter-fit logic
- `public/` static assets including images and resume files

## AI Functionality

The portfolio includes two AI-backed experiences:

- `app/api/chat/route.ts` for portfolio-grounded chat
- `app/api/job-fit/route.ts` for recruiter-oriented job fit analysis

To use these features locally, set `OPENAI_API_KEY` in `.env.local`.

## Notes

- Portfolio content is centralized in `data/portfolio.ts`
- The recruiter tool uses normalized job briefs plus portfolio evidence for fit analysis
- The chat and recruiter flows both rely on the OpenAI Responses API

## License

This project is intended as a personal portfolio codebase unless stated otherwise.
