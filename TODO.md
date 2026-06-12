# TODO (Vercel Not Found fix)

- [ ] Update `lms-frontend/vercel.json` to exclude `/api/*` from SPA catch-all rewrite.
- [ ] Ensure production uses correct `VITE_BACKEND_URL` (must not default to `http://localhost:5000`).
- [ ] Redeploy frontend to Vercel and verify that `/api/*` requests return expected JSON/status.

