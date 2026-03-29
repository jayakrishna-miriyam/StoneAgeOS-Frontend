# StoneAgeOS Frontend

React + Vite + TypeScript UI for StoneAgeOS tactical planning.

## Features

- Responsive planner, history, and result flows
- Centered top navigation and mobile sidebar menu
- Home hero with smooth rotating visuals (every 5 seconds)
- History search with clean empty state UX
- SEO-ready metadata and sitemap/robots assets

## Scripts

- `npm run dev` - start local dev server on `http://localhost:3000`
- `npm run build` - production build
- `npm run preview` - preview production build
- `npm run lint` - type-check (`tsc --noEmit`)

## Environment

Create `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:8080
```

If backend runs on a different port, update this value to match.
For production, start from `.env.production.example`.

## Run Locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start frontend:
   ```bash
   npm run dev
   ```
3. Open:
   - `http://localhost:3000`

## Routes

- `/` - Home
- `/planner` - Plan generation form
- `/history` - Saved plan history
- `/result` and `/result/:id` - Plan output

## SEO Files

- `index.html` - base meta tags, Open Graph, Twitter tags, canonical, JSON-LD
- `public/robots.txt` - crawl directives
- `public/sitemap.xml` - route sitemap entries

## Production Build

```bash
npm ci
npm run build
npm run preview
```

## Docker (Frontend Only)

Build:

```bash
docker build -t stoneageos-frontend .
```

Run:

```bash
docker run --rm -p 3000:80 stoneageos-frontend
```

## Separate Frontend/Backend Deploy

1. Deploy backend and copy its public URL.
2. Set `VITE_API_BASE_URL` to backend public URL before building frontend.
3. Rebuild frontend and deploy static bundle/container.
4. Replace `https://your-frontend-domain.com` placeholders in `index.html`, `public/robots.txt`, and `public/sitemap.xml`.
