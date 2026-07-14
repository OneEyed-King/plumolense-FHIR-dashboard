# FHIR Chart Review Assistant

Next.js app for the FHIR hackathon: patient management (Week 1) + pulmonology chart-review
dashboard with AI-assisted summaries (Week 2 + stretch), backed by a local HAPI FHIR server.

## Architecture

- **Next.js App Router**, single container — no separate backend service.
- **Route Handlers as a FHIR proxy** (`src/app/api/fhir/[...path]/route.ts`): the browser only
  ever calls same-origin `/api/fhir/*`, which forwards to the local HAPI server. Avoids CORS
  entirely and keeps `FHIR_BASE_URL` server-side only.
- **Server Components fetch FHIR data directly** (`src/lib/fhir.ts`, server-only) for all read
  paths (patient list, chart review) — no extra network hop.
- **Client Components** (patient create/edit forms) write through the `/api/fhir/*` proxy.
- **AI Chart Summary** (`src/app/api/ai/summarize/route.ts`): condenses a patient's FHIR chart
  into a structured text prompt and calls OpenAI's Chat Completions API to generate a clinical
  summary + flagged concerns.

## Setup

1. Start the FHIR server (from the project root, one level up from this app if using the
   existing `docker-compose.yml`):

   ```bash
   docker compose up -d
   ```

   Confirm it's up: `curl http://localhost:8080/fhir/metadata`

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure environment variables — copy `.env.local.example` to `.env.local` if you haven't
   already, and add your OpenAI key:

   ```
   FHIR_BASE_URL=http://localhost:8080/fhir
   OPENAI_API_KEY=sk-...
   OPENAI_MODEL=gpt-4o-mini
   ```

4. Run the dev server:

   ```bash
   npm run dev
   ```

   Open http://localhost:3000 — it redirects to `/patients`.

## Pages

- `/patients` — list + search patients by name
- `/patients/new` — create patient (validated: required name, gender from fixed set, DOB not in
  the future)
- `/patients/[id]` — chart review dashboard: demographics, vitals, active conditions/medications,
  allergies, encounter + medication timelines, pulmonary function/lab trend charts, SOAP notes &
  diagnostic reports, AI chart summary
- `/patients/[id]/edit` — edit patient

## Notes

- No UI framework CLI (create-next-app/shadcn) was run — this project was hand-authored file by
  file since the build sandbox couldn't reach the npm registry. Run `npm install` and report any
  dependency or type errors back for a fix.
- `fixtures/*.json` contain the synthetic pulmonology patient bundles already loaded into the
  local HAPI server (10 base patients + 3 detailed pulmonology patients + shared
  Organization/Practitioner).
# plumolense-FHIR-dashboard
