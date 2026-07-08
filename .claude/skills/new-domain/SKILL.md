---
name: new-domain
description: Scaffold a new employee-portal domain module (backend model/schema/router + frontend api/hook) following this repo's existing per-domain pairing convention. Use when the user asks to add a new feature area/module to the employee portal, e.g. "add an expenses module", "scaffold a new domain called X".
---

# Scaffold a new domain module

This repo pairs each backend domain with matching frontend files. When asked to add a new domain (e.g. `expenses`), create all of the following, mirroring the `leave` domain as the reference implementation (`employee-portal/backend/app/{models,schemas,routers}/leave.py`, `employee-portal/frontend/src/{api/leave.ts,hooks/useLeave.ts}`).

## Steps

1. **Model** — `employee-portal/backend/app/models/<domain>.py`
   - SQLAlchemy model(s) subclassing `Base` from `app.database`.
   - Use `ForeignKey("employees.id")` for ownership, matching the pattern in `models/leave.py`.

2. **Schema** — `employee-portal/backend/app/schemas/<domain>.py`
   - Pydantic `*Create` (request) and `*Response` (with `model_config = {"from_attributes": True}`) models.

3. **Router** — `employee-portal/backend/app/routers/<domain>.py`
   - `router = APIRouter(prefix="/<domain>", tags=["<domain>"])`.
   - Use `Depends(get_current_user)` from `app.auth.jwt` for auth, `Depends(get_db)` from `app.database` for the session.
   - If the endpoint needs role gating, add a local `require_<role>` dependency the way `routers/admin.py` does — there is no shared/central permission system in this repo.

4. **Register the router** in `employee-portal/backend/app/main.py`: add the import and `app.include_router(<domain>.router)`.

5. **Frontend API** — `employee-portal/frontend/src/api/<domain>.ts`
   - Thin axios wrappers using the shared `api` client from `./client`, one function per endpoint, typed against `@/types`.

6. **Frontend types** — add the corresponding interfaces to `employee-portal/frontend/src/types/index.ts` if they don't already exist.

7. **Frontend hook** — `employee-portal/frontend/src/hooks/use<Domain>.ts`
   - TanStack Query: `useQuery` for reads (`queryKey: ["<domain>", ...]`), `useMutation` for writes with `onSuccess` invalidating `["<domain>"]`.

8. **Page + route** (only if the user wants a UI, not just an API) — add a `<Domain>Page.tsx` under `frontend/src/pages/` and register it as a nested route under the `ProtectedRoute`/`AppLayout` block in `App.tsx`.

## Notes

- Don't introduce a shared CRUD/router-factory abstraction — this repo intentionally keeps each domain's router/schema/model as plain, independent files. Follow that even if it means some repetition across domains.
- No test suite exists for either side; don't add one unless asked.
