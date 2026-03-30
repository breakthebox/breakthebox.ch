# Break the Box

Webbasierte Applikation fuer Break the Box — gebaut mit SvelteKit, TypeScript und Tailwind CSS.

## Quick Start

```bash
# 1. Dependencies installieren
npm install

# 2. Environment konfigurieren
cp .env.example .env
# Auth0-Credentials, DB-URL, API-Keys eintragen

# 3. Docker + DB starten
docker compose up -d db
npm run db:generate
npm run db:migrate

# 4. App starten
npm run dev
```

## Tech Stack

- **Framework:** SvelteKit 2 / Svelte 5 / Vite 7
- **Language:** TypeScript (strict mode)
- **Database:** PostgreSQL 16 with Drizzle ORM
- **Auth:** Lucia v3 with Auth0 OAuth (via Arctic)
- **Styling:** Tailwind CSS 4 (Break the Box Design System)
- **AI:** Anthropic Claude API
- **Forms:** sveltekit-superforms + Zod
- **i18n:** Paraglide JS 2.x (de, en, fr)
- **Testing:** Vitest + @testing-library/svelte

## Commands

```bash
npm run dev              # Dev server (port 5173)
npm run build            # Production build
npm run check            # TypeScript + Svelte validation
npm run test             # Vitest watch mode
npm run test:run         # Tests once
npm run db:generate      # Generate migration
npm run db:migrate       # Apply migrations
npm run db:studio        # Drizzle Studio UI
```
