# Supplier Food Safety Query Portal

Next.js (App Router) app for QA / food safety teams: supplier risk & certificate overview, raising queries, and tracking conversations (mock data, no backend).

## Stack

- **Next.js 14** · **TypeScript** · **Tailwind CSS**
- **Shadcn-style UI** (Radix primitives + CVA)
- **React Context** — global suppliers & queries state
- **React Hook Form + Zod** — `/new-query` validation

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Routes

| Path | Purpose |
|------|---------|
| `/` | Supplier dashboard (search, filters, smart suggestions, raise query) |
| `/new-query` | Form with templates per query type |
| `/queries` | Tabs (All / Pending / In review / Resolved), sort & priority filter |
| `/queries/[id]` | Detail: timeline, chat thread, attachments, status & comments |

## Structure

```
app/                 — pages & layout
components/ui/       — reusable primitives
components/supplier/ — cards, badges, filters, suggestions
components/query/    — status, timeline, list rows, conversation
context/             — AppStateProvider
hooks/               — e.g. smart suggestions (memoized)
types/               — Supplier, FoodSafetyQuery, etc.
utils/               — mock data, certificate helpers, query templates
```

## Production build

```bash
npm run build && npm start
```
# Food-Safety
