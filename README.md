# 🔍 RepoLens - AI GitHub Repository Analyzer & Chat Assistant

RepoLens is a premium, glassmorphic full-stack application that crawls, indexes, and analyzes GitHub codebases. Using advanced sequential AI fallbacks and interactive visual charts, it builds comprehensive development reports and provides a real-time conversational interface to discuss the codebase structure, installation instructions, database interactions, and architecture patterns.

---

## 🌟 Key Features

*   **⚡ Interactive AI Assistant (RepoChat)**:
    *   **Fallback Resilience**: Queries OpenRouter using a priority queue sequence (`Gemini 2.5 Flash` ➔ `Gemini 2.5 Lite` ➔ `Gemma 4 31B` ➔ `Free Fallbacks`) for 100% conversational uptime.
    *   **Local State Persistence**: Automatically persists conversation logs in `localStorage` keyed by repository to prevent losing context across reloads.
    *   **One-Click Code Copier**: Embedded copy button directly on generated code blocks with active visual feedback states.
    *   **Instant History Reset**: A clear header option to wipe session logs and reset conversational state.
*   **📊 Repository Analytics & Snapshots**:
    *   Visual representation of languages, contributors, and commit logs with interactive hover states and beautiful CSS styling.
    *   Automatic file tree construction showing project hierarchy.
    *   Visual "How It Works" step-by-step workflow generator.
*   **🛡️ Project Health Score (6/6 Checks)**:
    *   Tracks crucial standards: `README`, `License`, `Docker Configurations`, `CI/CD Workflows`, `Test Coverage`, and `Recent Commits`.
    *   **Force-Refresh Bypass**: A footer action to instantly reload and bypass DB caches, enabling immediate health score updates.

---

## 📁 Folder Structure

```text
repolens/
├── client/                  (Vite React Frontend)
│   ├── src/
│   │   ├── components/      (Navbar, RepoChat, HealthScore, SnapshotBar, Charts, LoadingScreen)
│   │   ├── pages/           (Home and Report pages)
│   │   ├── services/        (API communication & helpers)
│   │   ├── App.jsx          (Vite Routes & layout wrappers)
│   │   └── index.css        (Custom design system & glassmorphism variables)
│   └── package.json
│
├── server/                  (Node.js + Express Backend)
│   ├── routes/              (Analyze, chat, and database retrieval routes)
│   ├── services/            (GitHub crawler, OpenRouter LLM orchestrator, Supabase SDK wrapper)
│   ├── tests/               (Automated unit tests)
│   └── index.js             (Express server entrypoint)
│
├── LICENSE                  (MIT License file)
├── Dockerfile               (Multi-stage Docker setup)
└── .gitignore               (Global ignore declarations)
```

---

## 🛠️ Setup Instructions

Follow these steps to configure, build, and run the project locally.

### 1. Root Configuration
Create a `.env` file in the root `repolens/` (or `repolens/server/`) directory. Add the following parameters:
```env
PORT=5000
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_key
OPENROUTER_API_KEY=your_openrouter_api_key
```
> [!IMPORTANT]
> Never commit your `.env` file to version control. It is already ignored by default in `.gitignore`.

### 2. Install Server Dependencies & Run
```bash
cd server
npm install
npm run dev
```

### 3. Install Client Dependencies & Run
```bash
cd ../client
npm install
npm run dev
```

---

## 🚀 Free Deployment Options ($0/month)

### Option A: Hosting on Vercel (Recommended)
This repository contains pre-configured Vercel configuration files (`vercel.json`).

#### 1. Deploy Serverless Backend API
1. Create a new project on **Vercel** and connect your repository.
2. Set **Root Directory** to `repolens/server`.
3. Set **Framework Preset** to `Other` (or Node.js).
4. Configure the **Environment Variables**:
   * `SUPABASE_URL`
   * `SUPABASE_ANON_KEY`
   * `SUPABASE_SERVICE_KEY`
   * `OPENROUTER_API_KEY`
   * `CLIENT_URL` = `*`
5. Deploy and save the API URL (e.g., `https://repolens-api.vercel.app`).

#### 2. Deploy React Frontend
1. Create a new project on **Vercel** and connect the same repository.
2. Set **Root Directory** to `repolens/client`.
3. Set **Framework Preset** to `Vite`.
4. Configure the **Environment Variable**:
   * `VITE_API_URL` = `https://repolens-api.vercel.app/api` (your backend URL + `/api`)
5. Deploy.

---

### Option B: Hosting on Render + Netlify

#### 1. Database (Supabase)
Create a free database project on [Supabase](https://supabase.com) and initialize the tables using the SQL editor.

#### 2. Server (Render)
1. Create a **Web Service** on [Render](https://render.com).
2. Set the **Root Directory** to `server`.
3. Set build command to `npm install` and start command to `node index.js`.
4. Add all backend environment variables.

#### 3. Client (Netlify)
1. Connect repository on [Netlify](https://netlify.com).
2. Set **Base Directory** to `client`, build command to `npm run build`, and publish directory to `dist`.
3. Set `VITE_API_URL` to point to the server.
