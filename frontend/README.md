# Budgie Frontend (Next.js)

Next.js 15 App Router frontend with shadcn/ui and Tailwind CSS v4.

## Setup

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_BASE_URL` | Laravel API base URL (default: `http://localhost:8000`) |

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm run start` — run production server

## Structure

```
src/
  app/          # Next.js App Router routes
  views/        # Page components (imported by app routes)
  components/   # UI and feature components
  services/     # API clients
  contexts/     # React contexts (auth)
  lib/          # Utilities
```
