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
```

## Architecture

### Real-time Collaboration Flow
1. The frontend gets a shared Socket.IO client from `frontend/context/SocketProvider.tsx`; the editor page joins a room via `socket.emit(ACTIONS.ROOM_JOIN, ...)`
2. `CODE_CHANGE` events are relayed to the other peer via `socket.to(room).emit(...)` in `backend/src/index.ts` — the server holds no document state
3. The typing client persists its own code via the debounced `useSaveCode` hook (`PATCH /api/room/:roomId/update`); the receiving client only applies the change
4. Socket.IO event names (`ROOM_JOIN`, `USER_JOINED`, `CODE_CHANGE`) are defined in `backend/src/utils/actions.ts` and mirrored as `ACTIONS` in `frontend/lib/utils.ts`

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
The backend is being migrated to a module-first layout under `backend/src/`:
- `modules/<feature>/` — one directory per domain feature containing its routes, controller, service, Zod schemas, Mongoose model, and middleware. `modules/auth/` is done; `room` still lives in the legacy `controllers/`/`routes/`/`models/` layout and should be converted the same way.
- `common/` — shared infrastructure: `ApiError` (status-coded error class), `asyncHandler` (wraps async handlers so rejections reach the error middleware), `errorHandler` (global error middleware, registered last in `index.ts`), `validateBody(schema)` (Zod body validation), `validateObjectId(param)`.

Layering convention: routes wire middleware + controller; controllers are thin `asyncHandler`-wrapped functions that call services and shape `{ success, message, data }` responses; services hold business logic, are HTTP-agnostic, and throw `ApiError` for domain failures. All error responses flow through `errorHandler`.

### Backend API Routes
- `POST /api/auth/register`, `POST /api/auth/login`, `DELETE /api/auth/logout`, `GET /api/auth/me` — JWT auth via httpOnly cookies
- `GET /api/room`, `POST /api/room`, `GET /api/room/:roomId`, `DELETE /api/room/:roomId`, `PATCH /api/room/:roomId/join`, `PATCH /api/room/:roomId/leave`, `PATCH /api/room/:roomId/update`

`validateToken` (`backend/src/modules/auth/auth.middleware.ts`) validates the JWT from the `token` cookie and sets `req.userId`; `validateObjectId` (`backend/src/common/validate-object-id.middleware.ts`) guards all `:roomId` routes.

### Room Constraints
Rooms are limited to 2 users (admin + one joined user), enforced in `backend/src/controllers/room.controller.ts`.

## Key Notes

- The `ACTIONS` constants in `backend/src/utils/actions.ts` must stay in sync with the `ACTIONS` object in `frontend/lib/utils.ts`
- CORS is currently restricted to `http://localhost:3000` in `backend/src/index.ts` — update both the Express CORS config and the Socket.IO `cors` option when changing allowed origins
- The editor page disconnects the shared socket on unmount and reconnects it on mount (`socket.connect()`); listeners are registered/removed symmetrically in a single effect
- The editor always uses `@codemirror/lang-javascript` extension regardless of the selected `languageId`; the language selection only affects Judge0 submission
