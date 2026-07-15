# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Structure

Monorepo with two independent packages:
- `frontend/` — Next.js 15 app (React 19, TypeScript, Tailwind v4, shadcn/ui)
- `backend/` — Node.js/Express server (TypeScript, Socket.IO, PostgreSQL/Prisma, S3 content storage)

## Development Commands

### Frontend (`cd frontend`)
```bash
npm run dev      # Start Next.js dev server on port 3000
npm run build    # Production build
npm run lint     # ESLint
```

### Backend (`cd backend`)
```bash
npm run dev              # Start backend with nodemon + ts-node on port 8000
npm run build            # Compile TypeScript to dist/
npm start                # Run compiled dist/index.js
npx prisma generate      # Regenerate the Prisma client after schema changes
npx prisma migrate dev   # Create/apply a migration (needs DATABASE_URL)
```

Prisma 7: the connection URL lives in `prisma.config.ts` (not the schema); the client uses the `@prisma/adapter-pg` driver adapter (`backend/src/db/prisma.ts`).

## Environment Variables

**`frontend/.env.local`**
```
JUDGE0_API_KEY=your-judge0-api-key
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

**`backend/.env`** (see `backend/.env.example`)
```
PORT=8000
DATABASE_URL=postgresql://user:pass@localhost:5432/collabcode
JWT_SECRET=your-secret-key
CLIENT_URL=http://localhost:3000   # optional, defaults to localhost:3000
S3_BUCKET=collabcode-content
AWS_REGION=ap-south-1
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
S3_ENDPOINT=http://localhost:9000  # optional, for MinIO/LocalStack
```

## Architecture

### Real-time Collaboration Flow
1. The frontend gets a shared Socket.IO client from `frontend/context/SocketProvider.tsx` (created with `withCredentials: true` so the httpOnly auth cookie rides the handshake); the editor/doc pages join a room via `socket.emit(ACTIONS.ROOM_JOIN, ...)`
2. Sockets are authenticated before any handler runs: `authenticateSocket` (`backend/src/modules/auth/auth.middleware.ts`) verifies the JWT from the cookie header and sets `socket.data.userId`; `ROOM_JOIN` then checks DB membership (admin or joinedUser) before `socket.join`, emitting `ROOM_ERROR` on failure
3. Document sync is CRDT-based (Yjs): both editors bind to a `Y.Doc` owned by `useCollabSession` (`frontend/hooks/use-collab-session.ts`), which relays binary Yjs updates over `YJS_UPDATE` and cursor presence (name + color per user) over `YJS_AWARENESS`. The gateway (`backend/src/modules/room/room.gateway.ts`) relays these only within joined rooms, size-capped; the server holds no document state. When a peer joins, existing clients push their full state (`Y.encodeStateAsUpdate`).
4. CodeMirror binds via `y-codemirror.next` (`yCollab` + `Y.UndoManager`); TipTap via `@tiptap/extension-collaboration` + `@tiptap/extension-collaboration-caret` (StarterKit's `undoRedo` is disabled). Remote cursor styling lives in `globals.css` (`.cm-ySelection*`, `.collaboration-carets__*`).
5. Persistence is diff-based (`useContentSync` in `frontend/features/dashboard/hooks/use-content-sync.ts`): each debounced save PATCHes a minimal text splice (common prefix/suffix diff) + SHA-256 of the result + the incremental Yjs delta (`Y.encodeStateAsUpdate(doc, lastAckedStateVector)`). The backend content store (`backend/src/modules/storage/content-store.ts`) applies the splice against a write-back cache, verifies the hash, merges the Yjs delta via `Y.mergeUpdates` (no Y.Doc materialization), bumps `contentVersion` in Postgres synchronously, and flushes bytes to S3 on a debounce (2s quiet / 10s max, plus flush on SIGINT/SIGTERM). Splice saves are optimistic (`baseVersion` mismatch → 409 → client resends full text once); full saves are last-write-wins. Postgres holds metadata + a 500-char `preview` for dashboard thumbnails; S3 holds `rooms/{id}/content.txt` and `rooms/{id}/state.yjs`.
6. Socket.IO event names (`ROOM_JOIN`, `USER_JOINED`, `USER_LEFT`, `CODE_CHANGE`, `DOC_CHANGE`, `YJS_UPDATE`, `YJS_AWARENESS`, `ROOM_ERROR`) are defined in `backend/src/modules/room/room.events.ts` and mirrored as `ACTIONS` in `frontend/lib/utils.ts`. `CODE_CHANGE`/`DOC_CHANGE` are legacy plain-content relays kept for compatibility; the editors now sync exclusively via the Yjs events.

### Room Types
Rooms have a `type` field: `"code"` (CodeMirror editor at `/editor/[roomId]`, Judge0 execution) or `"doc"` (TipTap rich-text editor at `/doc/[roomId]` with formatting toolbar and .doc/.html/.txt export). `POST /api/room` accepts optional `code` (initial content) and `language` (required for code rooms only — enforced via Zod refine). Both room types store their content in the `code` field and sync over their own socket event.

### Code Execution Pipeline
- Frontend submits code via `POST /api/submit` (Next.js route handler), which returns a Judge0 token
- The `useCodeExecution` hook (`frontend/hooks/use-code-execution.ts`) polls `GET /api/result/[token]` until the submission finishes
- Both route handlers call the Judge0 API via `frontend/lib/judge0.ts` (server-side, using `JUDGE0_API_KEY`)

### Frontend Feature Structure
Features are organized under `frontend/features/`:
- `auth/` — login, register, current user queries (React Query hooks in `api/`)
- `dashboard/` — room CRUD, join/leave, code save (React Query mutations in `api/`)
- `editor/` — editor UI components (sidebar, output panels)
- `landing/` — marketing page components

React Query is set up via `frontend/app/query-provider.tsx`. Axios client with base URL from env is at `frontend/utils/axios-client.ts`.

### Backend Structure (module-first)
The backend uses a module-first layout under `backend/src/`:
- `modules/<feature>/` — one directory per domain feature containing its routes, controller, service, Zod schemas, and middleware. Existing modules: `auth` (owns `validateToken` + `authenticateSocket`; bcrypt hashing lives in the service — Prisma has no model hooks), `room` (also owns the Socket.IO layer: `room.gateway.ts`, `room.events.ts`), and `storage` (`s3.client.ts`, `content-store.ts` — the write-back cache in front of S3 — and `text-diff.ts`).
- `common/` — shared infrastructure: `ApiError`, `asyncHandler`, `errorHandler` (registered last in `index.ts`), `validateBody(schema)`, `validateUuid(param)`.
- `db/prisma.ts` — the singleton PrismaClient (Prisma 7 + `@prisma/adapter-pg`); schema at `backend/prisma/schema.prisma`.

Layering convention: routes wire middleware + controller; controllers are thin `asyncHandler`-wrapped functions that call services and shape `{ success, message, data }` responses; services hold business logic, are HTTP-agnostic, and throw `ApiError` for domain failures. All error responses flow through `errorHandler`. Services serialize Prisma rows through `serializeRoom`/`toPublicUser` mappers that keep the legacy wire shape (`_id`, lowercase `type`) so the frontend is storage-agnostic. New features should follow this same module pattern.

### Backend API Routes
- `POST /api/auth/register`, `POST /api/auth/login`, `DELETE /api/auth/logout`, `GET /api/auth/me` — JWT auth via httpOnly cookies
- `GET /api/room`, `POST /api/room`, `GET /api/room/:roomId`, `DELETE /api/room/:roomId`, `PATCH /api/room/:roomId/join`, `PATCH /api/room/:roomId/leave`, `PATCH /api/room/:roomId/update`

`validateToken` (`backend/src/modules/auth/auth.middleware.ts`) validates the JWT from the `token` cookie and sets `req.userId`; `validateUuid` (`backend/src/common/validate-uuid.middleware.ts`) guards all `:roomId` routes.

### Room Constraints
Rooms are limited to 2 users (admin + one joined user), enforced in `backend/src/modules/room/room.service.ts` — the join seat is claimed with a conditional `updateMany({ where: { joinedUserId: null } })` so concurrent joins can't both win.

## Key Notes

- The `ACTIONS` constants in `backend/src/modules/room/room.events.ts` must stay in sync with the `ACTIONS` object in `frontend/lib/utils.ts`
- Allowed CORS origin comes from the `CLIENT_URL` env var (used by both the Express CORS config and the Socket.IO `cors` option in `backend/src/index.ts`)
- The editor page disconnects the shared socket on unmount and reconnects it on mount (`socket.connect()`); listeners are registered/removed symmetrically in a single effect
- The editor always uses `@codemirror/lang-javascript` extension regardless of the selected `languageId`; the language selection only affects Judge0 submission
