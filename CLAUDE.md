# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

This repo contains a single application: **Employee Self-Service Portal (ESS/SHCM)**, in `employee-portal/`. It's a FastAPI + SQLAlchemy backend paired with a React + TypeScript (Vite) frontend.

## Commands

### Backend (`employee-portal/backend`)

```bash
python -m venv venv && venv\Scripts\activate   # Windows; venv already exists in repo
pip install -r requirements.txt
python seed.py                                  # seed the database with sample data
uvicorn app.main:app --reload                   # run dev server on :8000
```

No test suite or linter is configured for the backend.

### Frontend (`employee-portal/frontend`)

```bash
npm install
npm run dev        # Vite dev server on :5173
npm run build       # tsc -b && vite build
npm run preview
```

No test suite is configured for the frontend. `tsc -b` (part of `build`) is the only type-check step.

### Full stack via Docker

```bash
docker-compose up   # runs postgres (db), backend (:8000), frontend (:5173)
```

## Architecture

### Backend

- Config is centralized in `app/config.py` via `pydantic-settings`, reading from `.env` (see `.env.example`). Notable settings: `DATABASE_URL` (defaults to local SQLite, but Docker/`.env.example` use Postgres), `SECRET_KEY`, JWT algorithm/expiry, `UPLOAD_DIR`.
- `app/database.py` defines the SQLAlchemy `engine`/`SessionLocal`/`Base` and the `get_db` dependency. SQLite vs. Postgres is auto-detected from `DATABASE_URL` (adds `check_same_thread` connect arg only for SQLite).
- `app/main.py` wires together one router per domain: `auth`, `employee`, `leave`, `payroll`, `performance`, `directory`, `documents`, `attendance`, `notifications`. `Base.metadata.create_all` runs at import time (no Alembic migrations are actually wired up despite being a dependency).
- Auth: JWT access + refresh tokens (`app/auth/jwt.py`), password hashing (`app/auth/password.py`). `get_current_user` decodes the bearer token and loads the `Employee` row. Frontend calls `/auth/login` (OAuth2 password flow) and `/auth/refresh`.
- Role-based access is done ad hoc per-router with small `require_<role>` dependency functions (e.g. `require_manager` in `app/routers/admin.py`), not a shared/central permission system — check the specific router when adding role-gated endpoints.
- Each domain has matching `models/`, `schemas/`, and `routers/` files of the same name (e.g. `models/leave.py` / `schemas/leave.py` / `routers/leave.py`) — when changing one, check whether the corresponding model/schema/router need the same change.

### Frontend

- Routing in `App.tsx` uses `react-router-dom`; all authenticated pages are nested under a single `ProtectedRoute` + `AppLayout` wrapper, with `/login` and `/signup` outside it.
- Auth state lives in a Zustand store (`store/authStore.ts`), persisting access/refresh tokens to `localStorage`.
- `api/client.ts` is a shared axios instance: a request interceptor attaches the bearer token, and a response interceptor transparently refreshes on 401 (via `/auth/refresh`) and retries the original request once, logging out and redirecting to `/login` if the refresh also fails.
- Each backend domain has a matching `api/<domain>.ts` (axios calls) and `hooks/use<Domain>.ts` (TanStack Query wrapper) — follow this pairing when adding a new domain/page.
- The frontend currently hardcodes the backend base URL (`http://localhost:8000`) in `api/client.ts` rather than reading it from an env var — be aware of this when working on deployment-related changes (see reverted commit `304369f`/`6aa28d4` for prior history here).
