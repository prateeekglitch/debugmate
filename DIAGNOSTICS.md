# Streamify – Easy diagnostics

Use these to see why chat/video is stuck on “Connecting…” (usually missing or wrong env in deployment).

---

## 1. Backend: env + Stream token (local or deploy)

From repo root:

```bash
cd backend
npm run diagnose
```

**What it checks:**

- `STEAM_API_KEY` and `STEAM_API_SECRET` are set
- Stream token can be generated
- Optional: if you set `BASE_URL`, it pings your deployed API

**If something fails:**

- **STEAM_API_KEY / STEAM_API_SECRET missing**  
  - Local: add them to `backend/.env` (same as your Stream dashboard).  
  - Deploy (e.g. Render): add both in the service **Environment** tab, then redeploy.

- **Token generation fails**  
  - Key or secret is wrong. Copy them again from Stream and fix env.

---

## 2. Test your deployed backend

Replace with your real backend URL (no trailing slash).

**Windows (PowerShell):**
```powershell
cd backend
$env:BASE_URL="https://your-backend.onrender.com"; node scripts/diagnose.js
```

**Mac/Linux:**
```bash
cd backend
BASE_URL=https://your-backend.onrender.com node scripts/diagnose.js
```

**How to read the result:**

- **401 Unauthorized** → Server is up; `/api/chat/token` needs a logged-in user. Normal when called without a session.
- **200 with token** → Token endpoint works when logged in.
- **500** → Server error while creating the token. Check Render logs and that `STEAM_API_KEY` / `STEAM_API_SECRET` are set on Render.
- **504 / timeout** → Backend not responding (e.g. Render free tier sleep). Open the app in the browser once to wake it, then try again.

---

## 3. Frontend: build-time env (for deploy)

From repo root:

```bash
cd frontend
npm run check-env
```

**For production build:**

Where you run `npm run build` (e.g. Render), set:

- `VITE_STREAM_API_KEY` = same value as backend `STEAM_API_KEY`

If this is missing in the build env, the built app won’t have the Stream key and chat/call will never connect.

---

## Quick checklist when it works locally but not on deploy

1. Run `cd backend && npm run diagnose` → all green.
2. Set on **Render** (backend service): `STEAM_API_KEY`, `STEAM_API_SECRET`, and your existing vars (`MONGO_URI`, `JWT_SECRET_KEY`, etc.).
3. Set on **Render** (frontend build or same service if you build there): `VITE_STREAM_API_KEY` = same as `STEAM_API_KEY`.
4. Run `BASE_URL=https://your-backend.onrender.com node scripts/diagnose.js` from `backend` → at least 401 or 200, not 500/504.
5. Redeploy after changing env.

If all of the above pass and the app still hangs on “Connecting…”, open DevTools → Network, trigger chat/call, and check the `/api/chat/token` request: status and response body (token present or not).
