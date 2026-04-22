# Flatmate-Finder

A small full-stack application to help people find compatible flatmates and list properties. This repository contains two apps in the same monorepo:

- `frontend/` — Vite + React single-page application.
- `backend/` — Express + MongoDB REST API.

This README is written for a novice developer and covers setup, running the app locally, environment variables, testing auth flows, and deployment guidance for Vercel (frontend) and Render (backend).

## Quick demo (what you can do)

- Register and log in as a user (JWT-backed auth).
- Browse property listings and express interest in a listing.
- Protected pages (dashboard, create listing, profile) require login.

## Tech stack

- Frontend: React (Vite), React Router
- Backend: Node.js, Express, Mongoose (MongoDB)
- Auth: JSON Web Tokens (JWT)
- Deployment suggestions: Vercel (frontend), Render (backend) or both on Render/Heroku

## Prerequisites

- Node.js (v18+ recommended)
- npm (comes with Node.js)
- MongoDB (Atlas or local) — for local testing you can leave it blank to use an in-memory MongoDB server (useful for development)

## Repository layout

```
frontend/    # Vite + React app
backend/     # Express API (serves frontend/dist if present)
README.md
DEPLOY.md
```

## Setup — local development (step-by-step)

1. Clone the repository and open it:

```bash
git clone <your-repo-url>
cd Flatmate-Finder
```

2. Install dependencies for both projects. From the repo root:

```bash
# frontend
cd frontend
npm install

# in a separate terminal window/tab, backend
cd ../backend
npm install
```

3. Create environment files

- Backend: copy `backend/.env.example` to `backend/.env` and fill values.
- Frontend: copy `frontend/.env.example` to `frontend/.env.local` and set `VITE_API_URL`.

Example (development):

backend/.env

```
MONGO_URI=<your-mongo-uri-or-empty-for-dev-memory>
JWT_SECRET=your_local_dev_secret
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:5173
```

frontend/.env.local

```
VITE_API_URL=http://localhost:5000/api
```

4. Run the backend (development):

```bash
cd backend
npm run dev
```

Notes:
- The backend will try `MONGO_URI` from `.env`. If not set or connection fails in non-production, the app will fall back to an in-memory MongoDB (mongodb-memory-server) so you can develop without an external MongoDB.

5. Run the frontend:

```bash
cd frontend
npm run dev
```

Open the frontend at `http://localhost:5173`.

## Testing auth quickly (manual)

You can test the registration and login flows from the UI, or use curl/postman against the backend directly.

Register (example):

```bash
curl -X POST http://localhost:5000/api/auth/register \
	-H 'Content-Type: application/json' \
	-d '{"name":"Alice","email":"alice@example.com","password":"password123"}'
```

Login (example):

```bash
curl -X POST http://localhost:5000/api/auth/login \
	-H 'Content-Type: application/json' \
	-d '{"email":"alice@example.com","password":"password123"}'
```

Both endpoints return a JSON object containing a `token` (JWT) on success. The frontend stores the returned user object in localStorage which includes the `token`.

## Build for production

1. Build frontend

```bash
cd frontend
npm run build
```

2a. Serve frontend separately (deploy to Vercel): deploy the `frontend` directory to Vercel and set the `VITE_API_URL` environment variable in Vercel's dashboard to point at your backend API (e.g. `https://my-backend.onrender.com/api`).

2b. Or serve frontend from backend: copy/sync `frontend/dist` into the backend (the backend already serves static files from `frontend/dist` when present). If you prefer this approach, build the frontend and ensure `backend` has the `dist/` folder available during start.

## Deployment notes (Vercel + Render)

We've included a `DEPLOY.md` with step-by-step guidance but here are the essential pieces:

- Backend (Render):
	- Create a Web Service pointing to the `backend` directory.
	- Set environment variables in Render: `MONGO_URI`, `JWT_SECRET`, `NODE_ENV=production`, `FRONTEND_URL` (optional).
	- Start command: `npm start` (make sure `backend/package.json` `start` script uses `node src/server.js`).

- Frontend (Vercel):
	- Import the repo and select `frontend` as the project root (or let Vercel auto-detect the monorepo).
	- Set environment variable `VITE_API_URL` to your backend's API base (e.g. `https://my-backend.onrender.com/api`).
	- Build command: `npm run build`, Output directory: `dist`.

## Common issues & troubleshooting

- Error: "Invalid Unicode escape sequence" or parsing errors in Vite
	- This usually means a literal `\n` sequence is present in a source file. Open the file reported by Vite and remove the `\n` sequences so real newlines are used.

- Error: backend app crashes on start (nodemon / ESM errors)
	- Ensure Node.js supports ESM (`type: module` in `package.json` is set). Use Node v18+ or a compatible version. If you're on an incompatible Node version, upgrade Node or adjust the project to use CommonJS.

- Error: CORS blocked requests
	- Make sure `FRONTEND_URL` or the frontend host domain is set in backend environment variables (or allowed by `app.js`). When deploying to Vercel, set `FRONTEND_URL` to the Vercel URL (or set `VITE_API_URL` in Vercel to the backend).

## Developer tips

- Use the browser devtools Network tab to inspect requests and see response bodies when auth fails.
- The frontend axios client uses `VITE_API_URL` (or `/api` fallback). Configure this to point at your deployed backend.

## Contributing

If you'd like to contribute:

1. Fork the repo
2. Create a feature branch
3. Run and test changes locally
4. Open a pull request with a clear description

## License

This project does not include a license file. Add one (for example MIT) if you want to allow open-source use.

---

If you'd like, I can: create a small smoke-test script that registers and logs in automatically, or prepare a GitHub Action to build the frontend on push. Which would you prefer next?
