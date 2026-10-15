# ServiceConnect

A responsive React + Vite landing page for ServiceConnect, a service marketplace connecting customers with trusted local professionals in Lagos, Nigeria.

## Requirements

- Node.js 20.19+ or 22.12+
- npm

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (usually `http://localhost:5173/`). To create and preview a production build:

```bash
npm run build
npm run preview
```

## Deploy to GitHub Pages

The Vite base path is set to `/First-Website/` in `vite.config.js`. The workflow at `.github/workflows/deploy.yml` builds the site and publishes the `dist` folder whenever changes are pushed to `main`.

In GitHub, open **Settings → Pages** and set **Build and deployment → Source** to **GitHub Actions**. After the workflow completes, the site will be available at:

https://petergboshe30.github.io/First-Website/

The deploy workflow can also be started from the repository’s **Actions** tab with **Run workflow**.

## Project structure

```text
.
├── .github/workflows/deploy.yml
├── index.html
├── package.json
├── src/
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
└── vite.config.js
```

## Current interaction scope

- Search filters services as you type. Category filters work independently and can be combined with search.
- Selecting a service opens a validated request form. Requests are held in React memory for the current page session and can be viewed with **My requests**. They are not sent to a provider or saved to a server.
- Provider interest forms use the same session-only behavior. No real provider onboarding or job matching is connected.
- The app-store buttons stay disabled until real store listings are available. The login, SMS delivery, payments, and support/social channels are not connected, so the page does not pretend that those actions completed.
- Privacy and terms links explain the limits of this demo. Replace them with reviewed production policies before launch.

To make the marketplace fully operational, connect a backend for accounts, provider verification, service requests and matching, job status, notifications/SMS, and payments. Add real iOS/Android store URLs and actual support/social contacts. Keep API secrets in GitHub Actions secrets or a backend; this repository is public.

