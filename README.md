# Job Form

A small static site containing `index.html` and `styles.css`.

This project is a plain static website — there is no build step. Below are a few ways to preview it locally on Windows (PowerShell examples).

## Prerequisites

- A modern web browser (Edge, Chrome, Firefox, etc.)
- Optional: Python 3 (for the simple HTTP server) or Node.js + npm (for `http-server`), or VS Code Live Server extension

## Quick ways to run / preview

Option A — Open file directly (no server)

From PowerShell in the project folder:

```powershell
Start-Process .\index.html
```

This launches the file in your default browser. Good for quick checks. Note: some features (module imports, fetch from local files) may require a server.

Option B — Python built-in static server (recommended if you have Python)

```powershell
py -3 -m http.server 8000
# or if python is on PATH
python -m http.server 8000
```

Then open http://localhost:8000 in your browser.

Option C — Node `http-server` (if you have Node.js)

Install once globally (if not already installed):

```powershell
npm install -g http-server
```

Run the server from the project folder:

```powershell
http-server -p 8080 .
```

Then open http://localhost:8080

Option D — VS Code Live Server extension

- Install the Live Server extension in VS Code.
- Open `index.html` and click "Go Live" (bottom-right) — it serves the folder and auto-reloads on changes.

## Files

- `index.html` — main HTML file
- `styles.css` — CSS for the page

## Verification

I created this README with the exact PowerShell examples you can copy/paste. If you want, I can also run a local server for you now (I can run the Python server from the workspace) or add a small `package.json` with a `start` script.

## Backend (Node/Express)

This project has been adapted to work on Vercel using serverless functions.

What changed:

- The previous Express `server.js` was removed because Vercel expects serverless functions for backend logic.
- The HTML form now posts to `/api/submit` (see `index.html`).
- Two serverless endpoints were added under `api/`:
  - `api/submit.js` — accepts form posts (application/x-www-form-urlencoded or JSON) and stores them in `/tmp/submissions.json` for the lifetime of the serverless instance.
  - `api/submissions.js` — returns stored submissions as JSON.

Important note about storage on Vercel

Serverless functions on Vercel run on ephemeral instances. Writing to the filesystem is allowed only in temporary folders (for example `/tmp`) and is not persistent across function instances or redeploys. That means submissions saved to `/tmp` will not be durable.

Recommended production options for persistence:

- Use Vercel KV (recommended for key/value storage).
- Use an external database: Supabase, Firebase, PlanetScale, MongoDB Atlas, etc.
- Push submissions to a Google Sheet / Airtable / external API if you prefer no-database solutions.

Deploying a full Express backend

This project now includes a small Express server and a SQLite database for persistence. Deploy this to any host that supports Node apps (Heroku, Render, Railway, Fly, DigitalOcean App Platform, etc.). Vercel can still host the static frontend, but if you want to host the backend as well on a single provider, consider one of the platforms above.

How to run locally (PowerShell):

1. Install Node dependencies:

```powershell
npm install
npm run prepare-db
```

2. Start the server:

```powershell
npm start
```

3. Open the site:

```text
http://localhost:3000
```

Testing and deployment notes

- The local SQLite DB is created at `data/submissions.db`.
- If you prefer serverless deployment (Vercel), I can instead wire up the API routes to a managed DB (Supabase, Vercel KV, etc.) so you keep everything serverless.
- Tell me which hosting provider you'd like and I can produce deployment steps for that provider.

## Next steps (optional)

- Add a `README`-style banner inside `index.html` to document the project
- Add `package.json` with a `start` script that runs `http-server`
- Install and configure a Live Reload workflow

If you want any of those, tell me which and I'll add them.
