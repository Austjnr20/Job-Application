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

A simple Node/Express backend has been added to accept form submissions and store them locally in `submissions.json`.

Files added:

- `server.js` — Express server that serves the static files and provides `/submit` and `/submissions` endpoints.
- `package.json` — scripts and dependency declaration.
- `submissions.json` — storage file for saved submissions (initially empty).

How to run (PowerShell):

1. Install dependencies (Node.js and npm required):

```powershell
npm install
```

2. Start the server:

```powershell
npm start
```

3. Open the site in your browser:

```text
http://localhost:3000
```

Endpoints:

- POST /submit — receives form submissions (form data from `index.html` will be posted here). The server saves submissions to `submissions.json` and redirects back to `/` for browser form posts.
- GET /submissions — returns all stored submissions as JSON (useful for reviewing data during development).

Notes:

- `submissions.json` is created in the project root. By default it's listed in `.gitignore` so submissions aren't committed. Remove from `.gitignore` if you want to track it in git.
- If you want auto-reload during development install `nodemon` and run `npm run dev`.

## Next steps (optional)

- Add a `README`-style banner inside `index.html` to document the project
- Add `package.json` with a `start` script that runs `http-server`
- Install and configure a Live Reload workflow

If you want any of those, tell me which and I'll add them.
