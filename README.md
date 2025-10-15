# AI Customer Support Bot (Gemini + Supabase + React)

## Overview
- Backend: Express REST API with Gemini for responses and Supabase for persistence.
- Frontend: Vite + React chat UI.
- Features: FAQ-first answers, LLM fallback, escalation simulation, session memory with periodic summaries.

## Prerequisites
- Node 18+
- Supabase project (URL, Anon Key)
- Gemini API key

## Setup
1) Clone the repo and install
```
cd server && npm i && cd ..
cd client && npm i && cd ..
```

2) Environment
- `server/.env` (based on `.env.example`):
```
PORT=8080
SUPABASE_URL=...your supabase url...
SUPABASE_ANON_KEY=...supabase anon key...
GEMINI_API_KEY=...gemini api key...
CORS_ORIGIN=http://localhost:5173
```
- `client/.env`:
```
VITE_API_BASE=http://localhost:8080/api
```

3) Database schema (Supabase SQL editor)
- Paste `supabase/schema.sql` and run.

4) Seed FAQs
```
cd server
npm run load:faqs
```

## Run
- Server: `cd server && npm run dev`
- Client: `cd client && npm run dev` (open http://localhost:5173)

## API
- `POST /api/sessions` → create session
- `GET /api/sessions/:id` → fetch session
- `POST /api/sessions/:id/close` → close session
- `POST /api/messages { sessionId, text }` → chat
- `GET /api/faqs` → list FAQs

## Prompts
- `server/src/prompts/respondSystem.txt`: assistant behavior, FAQ-first strategy, escalate if unknown
- `server/src/prompts/summarizeSystem.txt`: summarize conversation into 3–5 bullets

## Demo flow (2–3 min)
1) Start server and client.
2) Ask a known FAQ → instant answer.
3) Ask unknown → Gemini responds; shows escalation line.
4) After several turns, check `sessions.summary` in DB.
5) Close session via API.

## Notes
- FAQ matching is simple. For best accuracy, swap to embeddings + vector search.
- Summarization runs every ~6 messages to keep context lean.
