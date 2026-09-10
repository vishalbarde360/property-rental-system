# HomeLuxe frontend (React + Vite + Tailwind)

This replaces the existing `frontend/` folder UI only.
All routes, API calls, auth tokens (`rentnest_token` / `rentnest_user`), and role logic stay the same as your current app.
Backend is unchanged.

## Setup

```bash
cd frontend
npm install
npm run dev
```

Keep your existing `.env`:

```
VITE_API_URL=http://localhost:5000/api/v1
VITE_GOOGLE_AUTH_URL=http://localhost:5000/api/v1/auth/google
```

Run backend on port 5000, then open the Vite URL (usually http://localhost:5173).

## What changed
- Tailwind CSS UI in the HomeLuxe style from your screenshot
- Same pages: Home, Login, Register, Property details, Dashboard, Create/Edit property, Applications, Payments, Admin, Saved, Earnings, Forgot/Reset password, Google success
- Same API service and route guards
