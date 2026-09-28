# TrueScan — Stage 1: Project Setup

AI-Powered Intelligent Land Record Digitization and Validation System — built for SIH 2026.

> **What this is:** a digitization + preliminary-validation tool. It extracts and
> flags land-record data for a human officer to review. It does **not** prove
> ownership, establish legal validity, or confirm fraud on its own.

This README covers **Stage 1 only**: the folder structure, a running (empty)
frontend, and a running (empty) backend. Firebase, OCR, AI extraction, and the
pastel UI all come in later stages — see the checklist below.

---

## 1. Architecture (where Stage 1 fits)

```
┌─────────────────────┐        ┌──────────────────────┐        ┌───────────────────┐
│   React + Vite +     │  HTTP  │   FastAPI backend     │        │   Firebase         │
│   TypeScript +       │ ─────► │   (Python)            │ ─────► │   (Stage 3+)       │
│   Tailwind (frontend)│        │                        │        │  Auth / Firestore  │
│                      │ ◄───── │   OCR + Gemini live    │ ◄───── │  / Storage         │
└─────────────────────┘        │   here (Stage 5)      │        └───────────────────┘
                                └──────────────────────┘
```

- **Frontend** talks to Firebase directly for auth/session state (Stage 3), and
  to FastAPI for anything that needs OCR, AI extraction, or server-trusted logic.
- **Backend** is the only place that ever sees the Gemini API key or the Firebase
  Admin service-account credentials. The frontend never holds secrets.
- Right now (Stage 1), the frontend and backend don't actually talk to each
  other yet — `frontend/src/lib/api.ts` exists but nothing calls it. That
  wiring starts in Stage 4.

---

## 2. Folder structure

```
truescan/
├── README.md                  ← you are here
├── .gitignore
│
├── frontend/                  ← React + Vite + TypeScript + Tailwind
│   ├── .env.example           ← copy to .env.local, fill in later stages
│   ├── package.json
│   ├── vite.config.ts         ← Vite config + Tailwind v4 plugin
│   ├── index.html
│   ├── public/
│   └── src/
│       ├── main.tsx           ← app entry point, wraps <App/> in BrowserRouter
│       ├── App.tsx            ← renders <AppRoutes/>, nothing else
│       ├── index.css          ← @import "tailwindcss"; design tokens land here in Stage 2
│       ├── routes/
│       │   └── AppRoutes.tsx  ← every page's URL, wired to the 16 pages below
│       ├── pages/              ← one file per page from the brief (all stubs for now)
│       │   ├── LandingPage.tsx        (working Stage 1 status card)
│       │   ├── LoginPage.tsx          (Stage 3)
│       │   ├── RegisterPage.tsx       (Stage 3)
│       │   ├── DashboardPage.tsx      (Stage 7)
│       │   ├── UploadPage.tsx         (Stage 4)
│       │   ├── OcrProcessingPage.tsx  (Stage 5)
│       │   ├── ExtractedRecordPage.tsx(Stage 5)
│       │   ├── ValidationResultsPage.tsx (Stage 6)
│       │   ├── VerificationPage.tsx   (Stage 6)
│       │   ├── RecordSearchPage.tsx   (Stage 4/6)
│       │   ├── GisMapPage.tsx         (Stage 7)
│       │   ├── DocumentRepositoryPage.tsx (Stage 4)
│       │   ├── AuditHistoryPage.tsx   (Stage 6)
│       │   ├── AnalyticsPage.tsx      (Stage 7)
│       │   ├── UserManagementPage.tsx (Stage 3/8)
│       │   └── SettingsPage.tsx       (Stage 3/8)
│       ├── components/
│       │   ├── layout/        ← Sidebar.tsx, Topbar.tsx (empty stubs, built in Stage 2)
│       │   └── ui/             ← shared Card/Button/Input etc. land in Stage 2
│       ├── lib/
│       │   ├── firebase.ts    ← Firebase init — commented out until Stage 3
│       │   └── api.ts         ← axios client pointed at the FastAPI backend
│       ├── context/            ← AuthContext etc. lands in Stage 3
│       ├── hooks/               ← custom hooks land as features need them
│       └── types/
│           └── index.ts        ← shared TS types (UserRole, AppUser, …)
│
└── backend/                    ← FastAPI (Python)
    ├── .env.example             ← copy to .env, fill in later stages
    ├── requirements.txt         ← Stage 1 deps only (grows stage by stage)
    └── app/
        ├── main.py              ← FastAPI app, CORS, mounts every router
        ├── core/
        │   └── config.py        ← Settings (env vars), Firebase/Gemini keys optional for now
        ├── api/
        │   ├── deps.py          ← get_current_user() — real Firebase check in Stage 3
        │   └── routes/
        │       ├── health.py    ← GET /health — the only fully working route in Stage 1
        │       ├── documents.py     (Stage 4, currently returns 501)
        │       ├── ocr.py           (Stage 5, currently returns 501)
        │       ├── extraction.py    (Stage 5, currently returns 501)
        │       ├── validation.py    (Stage 6, currently returns 501)
        │       ├── verification.py  (Stage 6, currently returns 501)
        │       ├── records.py       (Stage 4/6, currently returns 501)
        │       ├── dashboard.py     (Stage 7, currently returns 501)
        │       ├── reports.py       (Stage 7, currently returns 501)
        │       └── audit.py         (Stage 6, currently returns 501)
        ├── schemas/              ← Pydantic request/response models land as each stage needs them
        └── services/             ← OCR/Gemini/validation logic lands in Stages 5–6
```

Why the 501 stubs exist: every route the brief asks for already has a real file
and a real URL from day one, so nothing has to be renamed or restructured
later — but nothing pretends to work before it actually does.

---

## 3. Important files, explained in simple Hinglish

- **`frontend/src/main.tsx`** — Ye app ka entry point hai. Yahan se React app
  browser ke `#root` div mein render hota hai, aur `BrowserRouter` yahin se
  wrap hota hai taaki page navigation (URLs) kaam kare.
- **`frontend/src/App.tsx`** — Bahut chhota hai jaan-boojhke. Sirf `AppRoutes`
  ko render karta hai. Jaise-jaise sidebar/topbar Stage 2 mein aayenge, wahi
  yahan wrap honge.
- **`frontend/src/routes/AppRoutes.tsx`** — Har page ka URL yahan define hai
  (jaise `/upload` → `UploadPage`). Naya page add karna ho to bas yahan ek
  line add karni hai.
- **`frontend/src/pages/*.tsx`** — Har ek file ek poora page hai. Abhi sab
  placeholder cards hain jo bata dete hain "main yahan hoon, mujhe Stage X mein
  banaya jaayega" — taaki structure abhi se clear rahe.
- **`frontend/src/lib/firebase.ts`** — Firebase ka connection code yahan
  aayega (Stage 3 mein). Abhi jaan-boojhke comment-out hai, kyunki bina
  Firebase credentials ke ye file app ko crash kar degi.
- **`frontend/vite.config.ts`** — Vite (dev server + build tool) ki settings.
  Tailwind CSS v4 ka plugin yahin register hua hai.
- **`frontend/.env.example`** — Sirf ek template hai, real keys nahi. Isko
  `.env.local` naam se copy karke asli Firebase keys Stage 3 mein daalenge.
  **Kabhi bhi asli `.env.local` GitHub par push mat karna.**
- **`backend/app/main.py`** — FastAPI ka entry point. Yahan sab routers
  (`documents`, `ocr`, `validation`, ...) ek jagah jud'te hain, aur CORS allow
  hota hai taaki frontend (port 5173) backend (port 8000) se baat kar sake.
- **`backend/app/core/config.py`** — Saari settings (env variables se) ek
  jagah. Firebase/Gemini keys abhi optional hain — Stage 1 bina unke chalta
  hai.
- **`backend/app/api/routes/health.py`** — `/health` endpoint. Isse hum check
  karte hain ki backend zinda hai ya nahi — ye Stage 1 ka sabse important file
  hai kyunki isi se pata chalta hai setup sahi hua.
- **`backend/requirements.txt`** — Python packages ki list jo install honi
  hain. Jaise-jaise stages aage badhenge (OCR, Gemini), isme naye packages add
  honge.
- **`.gitignore`** (root) — `node_modules`, Python `venv`, aur asli `.env`
  files ko Git se bahar rakhta hai, taaki secrets kabhi commit na ho.

---

## 4. Stage checklist

- [x] **Stage 1 — Project setup**: folder structure, Vite+React+TS+Tailwind
      frontend running, FastAPI backend running, `/health` verified, all 16
      page routes wired to placeholder components. *(this delivery)*
- [ ] **Stage 2 — Design system**: pastel skeuomorphic tokens (CSS variables),
      shared Card/Button/Input/Badge components, real landing page, real
      dashboard shell, Sidebar + Topbar.
- [ ] **Stage 3 — Firebase**: Auth (email/password + Google), Firestore,
      Storage, security rules, protected routes, role-based access.
- [ ] **Stage 4 — Document management**: upload → preview → Storage → Firestore
      metadata → FastAPI wiring.
- [ ] **Stage 5 — OCR + AI**: OpenCV preprocessing, OCR text extraction, Gemini
      structured-field extraction, confidence scores.
- [ ] **Stage 6 — Validation + verification**: validation engine, duplicate/
      mismatch detection, human review UI, audit logging.
- [ ] **Stage 7 — Dashboard, reports, GIS**: Firestore-backed analytics,
      Recharts visualizations, Leaflet map view.
- [ ] **Stage 8 — Testing + deployment**: end-to-end testing of every
      workflow, deployment instructions, final README.

---

## 5. Running this on your Windows machine

You need **Node.js 18+** and **Python 3.10+** installed. Check first:

```powershell
node -v
npm -v
python --version
```

If any of these fail, install Node.js from https://nodejs.org (LTS version)
and Python from https://python.org — during Python install, tick **"Add
python.exe to PATH"**.

### 5.1 Unzip the project

Unzip `truescan.zip` wherever you want the project, e.g. `C:\Projects\`.
You should end up with `C:\Projects\truescan\frontend` and
`C:\Projects\truescan\backend`.

### 5.2 Run the frontend

```powershell
cd C:\Projects\truescan\frontend
npm install
npm run dev
```

Open the URL it prints (usually `http://localhost:5173`). You should see a
cream-coloured card that says **"Frontend OK"**.

### 5.3 Run the backend (in a *second* PowerShell window)

```powershell
cd C:\Projects\truescan\backend
python -m venv venv
venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload
```

> If `Activate.ps1` is blocked with a script-execution error, run this once
> in that same PowerShell window and try again:
> ```powershell
> Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
> ```

Open `http://127.0.0.1:8000/health` in your browser — you should see
`{"status":"ok","service":"truescan-api"}`. Open `http://127.0.0.1:8000/docs`
for the interactive API reference (Swagger UI), which lists every route,
including the Stage 4–7 ones that currently return **501 Not Implemented** —
that's expected right now.

### 5.4 Everyday commands, once set up

```powershell
# Frontend (from frontend/)
npm run dev        # start dev server
npm run build       # production build (also type-checks)

# Backend (from backend/, after venv\Scripts\Activate.ps1)
uvicorn app.main:app --reload
```

---

## 6. What's actually verified vs. what's stubbed

**Verified by actually running it in this environment:**
- `npm run build` completes with no TypeScript errors.
- `npm run dev` serves the frontend and returns HTTP 200.
- `uvicorn app.main:app` starts, `/health` and `/` return 200, `/docs` returns
  200, and a sample stub route (`/documents/`) correctly returns 501.

**Not yet implemented (by design, per the staged plan):** Firebase (any of
it), OCR, Gemini extraction, validation engine, real page UIs, the pastel
design system, auth, and the frontend↔backend wiring. These are Stages 2–8.

---

## 7. Next up: Stage 2

Stage 2 builds the pastel skeuomorphic design system as CSS variables +
Tailwind theme, the shared Card/Button/Input/Badge components, the real
landing page, and the dashboard shell with Sidebar + Topbar — using the exact
palette from the brief. Say "start Stage 2" (or ask for changes to Stage 1
first) whenever you're ready.
