# My Stream Studio

My Stream is a responsive app-blueprint builder with a GitHub Actions workflow that can compile a **real Android debug APK** from a generated starter app.

## What works in this repository

- Responsive React/Vite web interface.
- Local app blueprints, starter templates, customization, and JSON export.
- A manually triggered Android build workflow at `.github/workflows/build-apk.yml`.
- Workflow inputs for app name, package ID, description, and theme.
- A Node generator that creates a self-contained starter app page and Capacitor config.
- GitHub Actions installs Java/Node dependencies, creates the Capacitor Android platform, runs Gradle `assembleDebug`, verifies the APK exists, and uploads it as a downloadable artifact.

## Build an APK

1. Open the repository's **Actions** tab: https://github.com/akilesh2313-ops/My-stream-/actions
2. Select **Build Android APK**.
3. Choose **Run workflow**.
4. Enter the app name, a unique package ID such as `com.example.myapp`, a description of the app, and a theme.
5. Start the workflow and wait for all steps to pass.
6. Open the successful run, find **Artifacts**, and download the `my-stream-…-debug-apk` artifact. Extract the ZIP to get `app-debug.apk`.

The APK is built remotely by GitHub Actions; this web page itself does not compile APKs on your phone. The workflow is manual so it will not consume build minutes on every push.

## Important limitations

This is a working starter-app generation pipeline, **not a general-purpose AI code-generation engine yet**. The description is rendered into an app shell and feature-outline cards; it does not infer and implement arbitrary functional features from prose. The resulting APK is a debug APK and is not signed for Play Store release. A release pipeline needs secure signing credentials, tests, and release verification. APK builds and Pages deployment are not considered successful until the corresponding GitHub Actions run completes successfully.

The workflow requires GitHub Actions to be enabled for this repository and its runner to have access to required Android SDK packages. GitHub's hosted Ubuntu runners normally provide Android build tooling; if the Gradle build reports missing SDK packages, add an explicit Android SDK setup step and rerun.

## Run the web studio locally

Requirements: Node.js 20.19+ and npm.

```bash
npm install
npm run dev
npm run build
```

## Repository

https://github.com/akilesh2313-ops/My-stream-

No license has been added yet.
