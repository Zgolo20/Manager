# Nkhuku Android App — Build Instructions
# ════════════════════════════════════════

This is a TWA (Trusted Web Activity) project.
It wraps your Netlify PWA in a native Android shell.
No rewriting of your app — it loads nkhuku.netlify.app.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 1 — INSTALL ANDROID STUDIO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Go to developer.android.com/studio
2. Download and install Android Studio
3. During setup, install the Android SDK (it will prompt you)
4. Choose SDK version 34 (Android 14) when asked

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 2 — OPEN THIS PROJECT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Extract this zip folder on your laptop
2. Open Android Studio
3. Click "Open" (not New Project)
4. Navigate to the extracted "nkhuku-android" folder
5. Click OK
6. Wait for Gradle to sync (3-5 minutes first time)
   — you will see a progress bar at the bottom

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 3 — ADD YOUR LOGO AS APP ICON
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. In Android Studio, right-click on "app" folder
2. Click New → Image Asset
3. Set Icon Type to "Launcher Icons"
4. Click the folder icon next to "Path"
5. Choose your logo1.png file
6. Click Next → Finish
   This replaces the default Android icon with your logo.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 4 — GENERATE A SIGNING KEY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Every APK must be signed before it installs on a phone.

1. In Android Studio top menu: Build → Generate Signed Bundle/APK
2. Select "APK" → click Next
3. Click "Create new..." under Key store path
4. Fill in:
   - Key store path: choose a safe folder on your laptop
   - Password: choose a strong password (SAVE THIS!)
   - Key alias: nkhuku
   - Key password: same password
   - First and Last Name: your name
   - Country Code: MW
5. Click OK → Next
6. Select "release" build → click Finish
7. Wait 2-3 minutes
8. APK will be in: app/release/app-release.apk

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 5 — GENERATE YOUR SHA-256 FINGERPRINT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
This is needed to link the APK to your website (very important).

1. In Android Studio: View → Tool Windows → Terminal
2. Run this command (replace YOUR_KEYSTORE_PATH):

keytool -list -v -keystore YOUR_KEYSTORE_PATH -alias nkhuku

3. Copy the SHA-256 fingerprint that appears
   It looks like: AB:CD:12:34:...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 6 — ADD assetlinks.json TO YOUR NETLIFY SITE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
This is what makes the TWA work properly without a browser bar.

1. Create a file called: assetlinks.json
2. Paste this content (replace SHA256_FINGERPRINT with yours from Step 5):

[{
  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "com.nkhuku.app",
    "sha256_cert_fingerprints": ["YOUR_SHA256_FINGERPRINT_HERE"]
  }
}]

3. In your nkhuku-pwa folder, create a folder called: .well-known
4. Put assetlinks.json inside that folder
5. Redeploy to Netlify
6. Verify it works: https://nkhuku.netlify.app/.well-known/assetlinks.json

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 7 — INSTALL APK ON YOUR PHONE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Transfer app-release.apk to your phone via USB or WhatsApp
2. On phone: Settings → Security → Allow Unknown Sources (ON)
3. Open the APK file on your phone
4. Tap Install
5. Open Nkhuku — it will load your full app with NO browser bar

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
IMPORTANT NOTES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Your phone must have Chrome installed (version 72+)
- The app requires internet to load (first time)
- After first load, it works offline via service worker
- Keep your .keystore file safe — you need it for all future updates
- Package name: com.nkhuku.app
- App URL: https://nkhuku.netlify.app

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FILES IN THIS PROJECT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
build.gradle              — Project build config
app/build.gradle          — App build config + TWA dependency
app/src/main/
  AndroidManifest.xml     — App entry point + TWA config
  java/com/nkhuku/app/
    FallbackActivity.java — Shown if Chrome is too old
  res/values/
    strings.xml           — App name + YOUR NETLIFY URL
    colors.xml            — App colors matching Nkhuku theme
    styles.xml            — App theme
  res/drawable/
    splash.xml            — Splash screen shown on launch
