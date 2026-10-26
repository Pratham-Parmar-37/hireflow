# Verification — 26 October 2026

The reported Post Opening defect was reproduced in the built-in browser against port 8088. Root cause: React referenced `modal-card`, KPI and skill class names absent from the shared stylesheet; form controls also lacked full-width layout.

## Changes

- Shared accessible native dialogs with an opaque themed panel, contained scrolling, focus handling, Escape/backdrop dismissal, and busy-state dismissal protection.
- Explicit form labels, full-width inputs, responsive form rows, navigation and dashboard layouts, corrected KPI/skill styles and mobile monitoring links.
- Notifications use the shared dialog and candidate notifications filter by the profile's actual user ID.
- Removed invented record IDs, first-user assignment, hardcoded recruiter identity, and fabricated experience/salary/company defaults.
- Job forms require real companies and explicitly selected recruiter/admin accounts. Candidate profiles link only to an email-matched candidate account, otherwise remain unlinked.
- Applications require an open job, prevent client-side duplicates, and reset preselection on each opening. Candidate one-click submission has an in-flight guard.
- Interview applications filter by candidate, reset when the candidate changes, and reject past dates. Date defaults use the local calendar date.
- API errors/timeouts, loading, partial refresh failures and retry are visible. Refresh no longer reports success after a failed request.
- Docker compiles the React source before packaging the gateway; the local gateway sync command is documented. API/proxy and monitoring URLs are configurable.

## Checks completed

- Production frontend build and lint: passed.
- Nine new record-linking/API regression checks: passed.
- Five existing service-health tests: passed (these exercise the legacy health implementation).
- Docker Compose configuration and image build: passed.
- Built-in browser: desktop and mobile job dialog, dark theme, required fields, keyboard dismissal/focus, candidate registration, application submission, duplicate prevention, interview creation, candidate persona and notification filtering, all recruiter navigation, and live service health.
- API-unavailable browser scenario: error banner and Retry visible; missing company/recruiter records disable job publication.
- Temporary company, recruiter, job, candidate, application and interview were created for end-to-end checks; record relationships were independently verified through the gateway, then all six test records were removed.

## Remaining architectural limitations

Role switching is a demo feature. Backend authentication and authorization are not implemented by this change. Browser filtering is not a security boundary. The new relationship and duplicate checks protect these UI flows; the backend still needs equivalent validation and concurrency protection for direct API clients. No existing user records were edited or removed.
