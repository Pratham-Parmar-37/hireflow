# HireFlow frontend

React UI for the HireFlow gateway. Run commands from this directory.

- `npm ci`: install the locked dependencies (Node 22.12+).
- `npm run dev`: open http://localhost:5173; API requests proxy to the gateway on port 8088.
- `npm run lint`: check source code.
- `npm test`: run record-linking and API regression checks.
- `npm run build`: compile production files to `dist`.
- `npm run sync:gateway`: build and copy the output into the gateway's static resources for a local Maven build.

Docker builds the frontend from source before packaging the gateway. Rebuild and restart only the gateway with `docker compose build api-gateway` and `docker compose up -d --no-deps api-gateway`.

Optional `.env.local` settings:

- `HIREFLOW_GATEWAY_URL`: development proxy target (default `http://localhost:8088`).
- `VITE_GRAFANA_URL` / `VITE_PROMETHEUS_URL`: optional monitoring links; default to the local Compose endpoints.
- `VITE_API_BASE_URL`: production API origin; leave empty to use the same origin.

The role selector is a demo view selector, not authentication or authorization. Candidate views filter by the selected profile. Production access control must be enforced by the backend before exposing personal data publicly.

Posting jobs requires a real company and an explicitly selected recruiter/admin account. Candidate profiles link to an existing candidate account only when its email matches; otherwise the profile is unlinked. Interview applications are restricted to the selected candidate. Missing optional information is displayed as unspecified rather than fabricated.
