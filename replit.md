# Kloud Diagnostics & Imaging

A premium, fully-responsive medical diagnostics website for Kloud Diagnostics & Imaging, a diagnostic testing, blood collection, and medical imaging center with multiple branches across Mumbai, India.

## Project Structure

This is a **pnpm monorepo** with two main artifacts:

| Artifact | Path | URL |
|---|---|---|
| Frontend (React/Vite) | `artifacts/kloud-diagnostics` | `/` |
| API Server (Express) | `artifacts/api-server` | `/api` |

Supporting libraries live in `lib/`:
- `lib/api-spec` — OpenAPI spec + Orval codegen config
- `lib/api-client-react` — Generated React Query hooks from the OpenAPI spec
- `lib/api-zod` — Zod validation schemas from the spec

## How to Run

Dependencies are managed with pnpm. To install:
```
pnpm install
```

Each artifact has its own managed workflow. The frontend and API server start automatically via:
- **Frontend**: `artifacts/kloud-diagnostics: web` workflow
- **API Server**: `artifacts/api-server: API Server` workflow

## Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS v4, Framer Motion, Wouter (routing), TanStack Query
- **Backend**: Node.js, Express, TypeScript
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Icons**: Lucide React

## Brand

- Primary: Deep Teal `#0B7A75`
- Secondary: Soft Aqua `#5FD0C4`
- CTA: Coral-Orange `#FF6B4A`
- Background: Off-white `#F7FAF9`
- Text: Charcoal `#1E2A2E`

## Key Features

- Hero search bar with live autocomplete for tests & packages
- Health packages browsable grid with cart/booking flow
- Prescription upload (drag-and-drop, PDF + images)
- Home sample collection with ₹1,500 free-collection logic
- Locations page with Mumbai branches
- Reports tracking page
- Sticky nav, WhatsApp/call floating buttons

## User Preferences

- Keep the existing project structure and stack — do not restructure or migrate
