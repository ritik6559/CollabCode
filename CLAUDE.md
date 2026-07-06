# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Structure

Monorepo with two independent packages:
- `frontend/` — Next.js 15 app (React 19, TypeScript, Tailwind v4, shadcn/ui)
- `backend/` — Node.js/Express server (TypeScript, Socket.IO, MongoDB/Mongoose)

## Development Commands

### Frontend (`cd frontend`)
```bash
npm run dev      # Start Next.js dev server on port 3000
npm run build    # Production build
npm run lint     # ESLint
```

### Backend (`cd backend`)
```bash
npm run dev      # Start backend with nodemon + ts-node on port 8000
npm run build    # Compile TypeScript to dist/
npm start        # Run compiled dist/index.js
```

## Environment Variables

**`frontend/.env.local`**
```
JUDGE0_API_KEY=your-judge0-api-key
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

**`backend/.env`**
```
PORT=8000
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-secret-key
CLIENT_URL=http://localhost:3000   # optional, defaults to localhost:3000
```

## Architecture

### Real-time Collaboration Flow
1. The frontend gets a shared Socket.IO client from `frontend/context/SocketProvider.tsx` (created with `withCredentials: true` so the httpOnly auth cookie rides the handshake); the editor/doc pages join a room via `socket.emit(ACTIONS.ROOM_JOIN, ...)`
2. Sockets are authenticated before any handler runs: `authenticateSocket` (`backend/src/modules/auth/auth.middleware.ts`) verifies the JWT from the cookie header and sets `socket.data.userId`; `ROOM_JOIN` then checks DB membership (admin or joinedUser) before `socket.join`, emitting `ROOM_ERROR` on failure
3. Document sync is CRDT-based (Yjs): both editors bind to a `Y.Doc` owned by `useCollabSession` (`frontend/hooks/use-collab-session.ts`), which relays binary Yjs updates over `YJS_UPDATE` and cursor presence (name + color per user) over `YJS_AWARENESS`. The gateway (`backend/src/modules/room/room.gateway.ts`) relays these only within joined rooms, size-capped; the server holds no document state. When a peer joins, existing clients push their full state (`Y.encodeStateAsUpdate`).
4. CodeMirror binds via `y-codemirror.next` (`yCollab` + `Y.UndoManager`); TipTap via `@tiptap/extension-collaboration` + `@tiptap/extension-collaboration-caret` (StarterKit's `undoRedo` is disabled). Remote cursor styling lives in `globals.css` (`.cm-ySelection*`, `.collaboration-carets__*`).
5. Persistence: the typing client's `useSaveCode` PATCHes both the derived plain content (`code`, used for dashboard previews/exports) and the serialized CRDT state (`yjsState`, base64). On open, clients hydrate from `yjsState` when present; legacy rooms are seeded once from `code`.
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
- `modules/<feature>/` — one directory per domain feature containing its routes, controller, service, Zod schemas, Mongoose model, and middleware. Existing modules: `auth` (also owns the User model and `validateToken`) and `room` (also owns the Socket.IO layer: `room.gateway.ts` registers socket handlers, `room.events.ts` defines the `ACTIONS` event names).
- `common/` — shared infrastructure: `ApiError` (status-coded error class), `asyncHandler` (wraps async handlers so rejections reach the error middleware), `errorHandler` (global error middleware, registered last in `index.ts`), `validateBody(schema)` (Zod body validation), `validateObjectId(param)`.

Layering convention: routes wire middleware + controller; controllers are thin `asyncHandler`-wrapped functions that call services and shape `{ success, message, data }` responses; services hold business logic, are HTTP-agnostic, and throw `ApiError` for domain failures. All error responses flow through `errorHandler`. New features should follow this same module pattern.

### Backend API Routes
- `POST /api/auth/register`, `POST /api/auth/login`, `DELETE /api/auth/logout`, `GET /api/auth/me` — JWT auth via httpOnly cookies
- `GET /api/room`, `POST /api/room`, `GET /api/room/:roomId`, `DELETE /api/room/:roomId`, `PATCH /api/room/:roomId/join`, `PATCH /api/room/:roomId/leave`, `PATCH /api/room/:roomId/update`

`validateToken` (`backend/src/modules/auth/auth.middleware.ts`) validates the JWT from the `token` cookie and sets `req.userId`; `validateObjectId` (`backend/src/common/validate-object-id.middleware.ts`) guards all `:roomId` routes.

### Room Constraints
Rooms are limited to 2 users (admin + one joined user), enforced in `backend/src/controllers/room.controller.ts`.

## Key Notes

- The `ACTIONS` constants in `backend/src/modules/room/room.events.ts` must stay in sync with the `ACTIONS` object in `frontend/lib/utils.ts`
- Allowed CORS origin comes from the `CLIENT_URL` env var (used by both the Express CORS config and the Socket.IO `cors` option in `backend/src/index.ts`)
- The editor page disconnects the shared socket on unmount and reconnects it on mount (`socket.connect()`); listeners are registered/removed symmetrically in a single effect
- The editor always uses `@codemirror/lang-javascript` extension regardless of the selected `languageId`; the language selection only affects Judge0 submission
