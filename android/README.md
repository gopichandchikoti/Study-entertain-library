# Study Library Android Wrapper

This is the Android WebView shell for the deployed Study Library web app. The web app remains the product surface; this module owns Android navigation, cookies, downloads, external links, and Play Store packaging.

## Configure the web app URL

The release build defaults to a placeholder HTTPS URL. Pass the deployed URL at build time:

```bash
./gradlew :app:assembleDebug -PLIBRARY_URL=https://your-study-library.example.com
./gradlew :app:bundleRelease -PLIBRARY_URL=https://your-study-library.example.com
```

For an Android emulator pointed at a local server, use the host gateway and explicitly allow cleartext traffic only for a debug build:

```bash
./gradlew :app:assembleDebug -PLIBRARY_URL=http://10.0.2.2:4444 -PALLOW_CLEARTEXT=true
```

Do not put Supabase keys, AI keys, shared passwords, or session secrets in this project.

## Build requirements

- Android Studio with SDK 35 installed.
- JDK 17.
- Gradle 8.9 through the included wrapper.

The app preserves the web session cookie, keeps same-origin navigation inside the WebView, sends external links to the system browser, forwards downloads to Android Download Manager, and handles back navigation inside the reading history.

Before Play Store submission, configure a real release signing key in a private CI or Android Studio signing configuration. Do not commit keystores or passwords.
