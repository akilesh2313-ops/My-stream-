# My Stream

A responsive React interface for discovering and saving sample video cards. Built with Vite and prepared for deployment to GitHub Pages.

> **Project status:** UI starter / demo. The current catalog is local sample data. It does not stream real video, provide user accounts, or connect to a backend.

## Features

- Responsive desktop and mobile layout
- Search by video title, creator, or category
- Category filtering and trending sort
- Save/unsave items with browser-local persistence
- Sample preview screen with an explicit demo notice
- GitHub Pages deployment workflow
- Capacitor configuration as a starting point for Android packaging

## Requirements

- Node.js 20.19+ (or a compatible newer LTS release)
- npm

## Local development

```bash
npm install
npm run dev
```

Vite prints the local development URL after startup.

## Production build

```bash
npm run build
npm run preview
```

The production bundle is written to `dist/`.

## Deploy to GitHub Pages

1. In the repository, open **Settings → Pages**.
2. Select **GitHub Actions** as the build and deployment source.
3. Push to `main` or manually run **Deploy My Stream to GitHub Pages** in the Actions tab.
4. Wait for both the build and deploy jobs to succeed. The published URL is shown in the workflow deployment environment and Pages settings.

## Android packaging

The repository includes `capacitor.config.json` as a starting point. To add Android support after verifying the web build:

```bash
npm install
npx cap add android
npm run build
npx cap sync android
npx cap open android
```

Android Studio and the Android SDK are required to build an APK. An APK is not included in this repository.

## Next production milestones

1. Add a backend and media catalog API.
2. Connect a real, licensed video playback source.
3. Add authentication and server-side user profiles if accounts are required.
4. Add automated tests and dependency lockfile verification.
5. Configure monitoring, privacy controls, and content reporting before public launch.

## License

No license has been added yet. Add one before accepting external contributions or allowing reuse.
