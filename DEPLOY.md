Deployment guide — Vercel (frontend) + Render (backend)

This repository contains two apps:
- frontend/ — Vite + React app (deploy to Vercel)
- backend/  — Express + MongoDB app (deploy to Render or any Node host)

Checklist before deploying
1. Create environment files locally (do NOT commit secrets):
   - backend/.env (copy from backend/.env.example)
   - frontend/.env.local (copy from frontend/.env.example)

2. For production, set strong values for:
   - JWT_SECRET
   - MONGO_URI (use a managed MongoDB like Atlas)

Frontend (Vercel)
1. Push the repo to GitHub.
2. In Vercel, create a new project and import your GitHub repo.
3. In Project Settings > Environment Variables, add:
   - VITE_API_URL = https://<your-backend-host>/api
   (Example: https://my-backend.onrender.com/api)
4. Build & Output settings (Vite):
   - Framework: Other
   - Build Command: npm run build
   - Output Directory: dist
5. Deploy. Frontend will call the backend using VITE_API_URL.

Backend (Render)
1. Create a new Web Service on Render (connect your GitHub repo).
2. Set the build and start commands:
   - Build Command: npm install --production
   - Start Command: npm start
   - Root directory: backend
3. Environment variables (add in Render dashboard):
   - MONGO_URI = mongodb+srv://...
   - JWT_SECRET = (strong secret)
   - NODE_ENV = production
   - PORT = 5000 (Render assigns a port via PORT env var automatically; leave if not needed)
   - FRONTEND_URL = https://<your-frontend>.vercel.app (optional, used for CORS)
4. Render will provide a URL like https://my-backend.onrender.com — set VITE_API_URL in Vercel to that URL + /api.

Serving frontend from backend (optional)
- The backend already serves the built frontend from `frontend/dist` when the static files exist.
- If you want to deploy only the backend and serve frontend from it, build the frontend locally (`cd frontend && npm run build`) and commit the `dist/` folder (or add a build step in backend deploy to build frontend). Then the backend will serve static files.

Security & notes
- Never commit .env with secrets. Use the platform's environment variable UI.
- Use HTTPS for all API calls in production.
- Set strong JWT_SECRET and secure MongoDB access (IP allowlist or SRV connection with credentials).

If you'd like, I can prepare Vercel/Render-ready configuration and a small GitHub Action to build and deploy automatically.