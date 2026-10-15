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

The service search filters the category cards as you type. The category chips provide quick filters. The phone number form displays a confirmation state; connect it to an SMS provider to send real download links. App Store and Google Play links are starter destinations to replace with the published app links.

