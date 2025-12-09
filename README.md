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

## IV. Adaptation Guide for macOS

To run this project on a Mac environment, the following adjustments would be required:

1.  **Script Adjustments:**
    * In `package.json` (Root), revert `gradlew.bat` to `./gradlew`.
    * In `packages/desktop/package.json`, change the build flag from `--win` to `--mac`.

2.  **App Transport Security (ATS):**
    * Just like Android's "Cleartext", iOS blocks HTTP by default.
    * You would need to modify `Info.plist` in the iOS project to allow "Arbitrary Loads" or specifically whitelist the API domain.

3.  **Capacitor Config:**
    * The `androidScheme` setting is specific to Android. For iOS, similar configuration might be needed in the `iosScheme` or strictly relying on the native `CapacitorHttp` plugin if "Mixed Content" issues persist.
