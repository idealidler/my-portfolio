# Akshay Portfolio

 Premium SaaS-style portfolio rebuilt with Next.js, TypeScript, Tailwind CSS, and Framer Motion.

## Stack

- Next.js App Router
- React 19
- TypeScript
- Tailwind CSS
- Framer Motion

## Scripts

- `npm run dev` starts the local dev server
- `npm run build` creates the production build
- `npm run start` runs the production server
- `npm run lint` runs ESLint

## Environment

- Copy the shape from `.env.example`
- Add `OPENAI_API_KEY` in your local `.env.local`
- Set `NEXT_PUBLIC_SITE_URL` to your production domain for sitemap and robots output

## App Structure

- `app/page.tsx`: main portfolio experience
- `app/akshaygpt/page.tsx`: dedicated AkshayGPT workspace
- `app/api/chat/route.ts`: current chat API route
- `data/portfolio.ts`: typed portfolio content
- `lib/portfolio-context.ts`: server-built chat grounding context

## Notes

- Phase 2 now uses structured portfolio data as the source of truth for both the site and AkshayGPT.
- AkshayGPT uses the OpenAI Responses API with `gpt-4o-mini`.
- Featured projects now include `gitdecode-backend` with the Chrome extension link as its live surface.
- Set `OPENAI_API_KEY` in `.env.local` to enable the chat route.
