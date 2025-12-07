# Run and Build the Application

## I. Prerequisites

Ensure you have the following installed before starting:
* **Node.js**: Installed globally.
* **For Mobile**: Java (JDK 17) and Android SDK installed (via Android Studio).
* **For Windows Build**: PowerShell or CMD must be run as **Administrator** (required to allow symlinks).

---

## II. Running the App Locally

To start the application in development mode:

### a. Web Version
```bash
npm run web
```

### b. Desktop Version (Electron)
```bash
npm run desktop
```
> **Note:** This launches the Electron window connecting to the local Vite server.

### c. Mobile Version (Android)
```bash
npm run openAndroid
```
> **Note:** This opens Android Studio to run the app on an emulator or device.

---

## III. Building Production Versions

### a. Desktop Build (ONLY for Windows .exe)
Run the following command to generate the installer:
```bash
npm run buildDesktop
```
* **Output:** The executable file will be located in `dist/desktop/`.
* **Note:** If you encounter permission errors, run your terminal as **Administrator**.

### b. Mobile Build (Android .apk)
Run the following command to build the APK:
```bash
npm run buildMobile
```
* **Output:** The APK file will be located in `packages/mobile/android/app/build/outputs/apk/debug/`.

---

## IV. Implementation Documentation & Changes for Windows

This section documents the specific changes made to the codebase to support production builds on Windows and allow HTTP communication.

### 1. Desktop (Electron) Implementation

#### File Paths & Routing
* **Problem:** The production build showed a white screen because React Router was trying to interpret the Windows file path (`C:/Users/...`) as a URL route.
* **Solution:**
    * Switched from `BrowserRouter` to `HashRouter` in `main.tsx` / `App.tsx`.
    * Set `base: './'` in `vite.config.ts` to ensure relative asset loading.

**Code Snippet (`packages/desktop/vite.config.ts`):**
```typescript
export default defineConfig({
  base: './', // Ensures assets load correctly in file:// protocol
  plugins: [react()],
})
```

#### Build Script for Windows
* **Problem:** The original template used Linux commands (`rm -rf`) and targeted macOS (`--mac`), causing the build to fail on Windows.
* **Solution:**
    * Replaced `rm -rf` with `rimraf` (cross-platform).
    * Changed the build target to `--win`.
    * Updated the files configuration to correctly copy the web build into the renderer folder inside the app.

**Code Snippet (`packages/desktop/package.json`):**
```json
"scripts": {
  "electronBuild": "rimraf ../../dist/desktop && electron-builder build --publish=never --win"
},
"build": {
  "files": [
    "main.js",
    "preload.js",
    "resources/**/*",
    {
      "from": "../web/dist",
      "to": "renderer"  // Explicitly places web files where main.js expects them
    }
  ]
}
```

#### Icon Configuration
* **Implementation:** Converted the logo to `.ico` format and placed it in `packages/desktop/resources/icon.ico`. Configured `electron-builder` to use this icon for the Windows installer.

### 2. Mobile (Android) Implementation

#### a. Windows-Compatible Build Script
* **Problem:** The command chaining (`cd ... && ...`) and the usage of `./gradlew` were not compatible with Windows PowerShell/CMD.
* **Solution:**
    * Rewrote the script to use linear navigation (`cd ..`).
    * Replaced `./gradlew` with `gradlew.bat` (Windows wrapper).
    * Replaced `cap copy` with `cap sync` to ensure native plugins are generated.

**Code Snippet (`package.json` - Root):**
```json
"buildMobile": "cd packages/web && npm run build && cd ../mobile && npx cap sync android && cd android && gradlew.bat assembleDebug"
```

#### b. Allowing HTTP Traffic (Cleartext)
* **Problem:** Android blocks non-HTTPS traffic by default. The API (`http://sanger.dia.fi.upm.es`) is HTTP, causing connection errors.
* **Solution:** Added `android:usesCleartextTraffic="true"` to the `AndroidManifest.xml`.

**Code Snippet (`AndroidManifest.xml`):**
```xml
<application
    android:allowBackup="true"
    android:icon="@mipmap/ic_launcher"
    android:usesCleartextTraffic="true" ... >
```

#### c. Fixing Mixed Content (CORS/WebView)
* **Problem:** Even with Cleartext enabled, the WebView (served over `https://localhost`) blocked requests to the HTTP API due to "Mixed Content" security rules.
* **Solution:** Configured Capacitor to serve the app content via `http` instead of `https` on Android.

**Code Snippet (`packages/mobile/capacitor.config.ts`):**
```typescript
const config: CapacitorConfig = {
  server: {
    androidScheme: 'http', // Lowers security scheme to match the API
    cleartext: true,
    allowNavigation: [
      'sanger.dia.fi.upm.es'
    ]
  }
};
```

---

## V. Adaptation Guide for macOS

To run this project on a Mac environment, the following adjustments would be required:

1.  **Script Adjustments:**
    * In `package.json` (Root), revert `gradlew.bat` to `./gradlew`.
    * In `packages/desktop/package.json`, change the build flag from `--win` to `--mac`.

2.  **App Transport Security (ATS):**
    * Just like Android's "Cleartext", iOS blocks HTTP by default.
    * You would need to modify `Info.plist` in the iOS project to allow "Arbitrary Loads" or specifically whitelist the API domain.

3.  **Capacitor Config:**
    * The `androidScheme` setting is specific to Android. For iOS, similar configuration might be needed in the `iosScheme` or strictly relying on the native `CapacitorHttp` plugin if "Mixed Content" issues persist.
