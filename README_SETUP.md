# LCM Devotional - Android App Setup Guide

## 📱 Overview
Transform your devotional website into a fully-featured Android app with:
- ✅ Daily automatic devotional updates at midnight
- ✅ Push notifications for new devotionals
- ✅ Offline access with local caching
- ✅ Native Android features via Capacitor

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- Android Studio installed
- Java Development Kit (JDK) 11+
- Firebase account (for push notifications)

### Step 1: Install Dependencies

```bash
# Clone the repository
git clone https://github.com/Kasuleronald/lcm_devotional.git
cd lcm_devotional

# Install Node dependencies
npm install
```

### Step 2: Set Up Environment Variables

```bash
# Copy example env file
cp .env.example .env

# Edit .env with your Firebase credentials
nano .env
```

---

## 🔥 Firebase Setup (For Push Notifications)

### 1. Create Firebase Project
- Go to [Firebase Console](https://console.firebase.google.com)
- Click "Add project"
- Enter project name (e.g., "LCM Devotional")
- Enable Google Analytics (optional)

### 2. Generate Service Account Key
- In Firebase Console, go to Settings ⚙️ → Service Accounts
- Click "Generate New Private Key"
- Save as `serviceAccountKey.json` in project root (add to .gitignore)

### 3. Set Up Realtime Database
- Click "Realtime Database" in left menu
- Click "Create Database"
- Start in **Test Mode** (for development)
- Copy Database URL to `.env` as `FIREBASE_DB_URL`

### 4. Enable Cloud Messaging
- Go to Cloud Messaging tab
- Copy "Server API Key"
- This is used for sending notifications

---

## 📱 Capacitor Setup (Convert to Android App)

### Step 1: Add Android Platform

```bash
# Initialize Capacitor
npx cap init

# Add Android platform
npx cap add android
```

### Step 2: Configure capacitor.config.json

Already configured! The file includes:
- PushNotifications plugin
- LocalNotifications plugin
- Splash screen settings
- Android-specific build options

### Step 3: Sync and Build

```bash
# Sync web assets to Android project
npx cap sync android

# Open Android Studio
npx cap open android

# Or build directly
npm run android
```

---

## 🔧 Backend Server Setup (Optional but Recommended)

### Local Development

```bash
# Install backend dependencies
npm install express cors firebase-admin node-cron dotenv

# Start the backend server
node server.js

# Server runs on http://localhost:5000
```

### API Endpoints Available

#### Get all devotionals
```
GET /api/devotionals
```

#### Get devotional by date
```
GET /api/devotional/:date (format: DD-MM-YYYY)
Response: { success: true, data: {...} }
```

#### Get today's devotional
```
GET /api/devotional/today
```

#### Register device for notifications
```
POST /api/register-device
Body: { deviceToken: "...", userId: "..." }
```

---

## 🏗️ Building the Android APK

### Development APK

```bash
# Build for development
cd android
./gradlew assembleDebug

# APK generated at: android/app/build/outputs/apk/debug/app-debug.apk
```

### Release APK (For Play Store)

#### 1. Generate Signing Key
```bash
keytool -genkey -v -keystore ~/my-release-key.jks \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias lcm_devotional
```

#### 2. Update capacitor.config.json
```json
"android": {
  "buildOptions": {
    "keystorePath": "~/my-release-key.jks",
    "keystorePassword": "your_password",
    "keystoreAlias": "lcm_devotional",
    "keystoreAliasPassword": "your_password",
    "releaseType": "APK"
  }
}
```

#### 3. Build Release APK
```bash
npm run android:build

# APK at: android/app/build/outputs/apk/release/app-release.apk
```

---

## 🔔 Push Notifications Setup

### Enable in AndroidManifest.xml

Already configured via Capacitor! The plugin handles:
- Permission requests
- Message receiving
- Local notification display

### Test Push Notification

```bash
# Register device token first
curl -X POST http://localhost:5000/api/register-device \
  -H "Content-Type: application/json" \
  -d '{"deviceToken": "your_device_token", "userId": "user123"}'

# Send notification
curl -X POST http://localhost:5000/api/send-notification \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Notification",
    "message": "This is a test",
    "deviceTokens": ["your_device_token"]
  }'
```

---

## 📚 Daily Devotionals Structure

Add devotionals to `devotionals.json`:

```json
{
  "DD-MM-YYYY": {
    "date": "DD-MM-YYYY",
    "title": "Devotional Title",
    "theme": "Theme/Topic",
    "scripture": "Scripture text",
    "scriptureReference": "Reference",
    "reflection": "Main reflection content",
    "seed": "Action/Prayer seed for the day"
  }
}
```

---

## 🔄 Update Mechanism Explained

1. **App Launch**: Checks if today's devotional is cached
2. **Fetch**: If not cached, fetches from `/api/devotional/today`
3. **Cache**: Stores in localStorage for offline access
4. **Midnight Scheduler**: At exactly midnight, app:
   - Fetches next day's devotional
   - Updates display
   - Sends local notification
5. **Push Notifications**: Backend sends daily at midnight to all registered devices

---

## 🧪 Testing the App

### On Android Emulator
```bash
# Open Android Studio project
npx cap open android

# Select Pixel 5 (or any device)
# Click Run or press Shift+F10
```

### On Physical Device
```bash
# Enable USB Debugging on Android device
# Connect via USB

# Build and run
npx cap run android
```

---

## 📤 Deploy to Google Play Store

1. Build release APK (see above)
2. Create Google Play Developer account
3. Create new app
4. Upload APK to internal testing track
5. Add screenshots, description, privacy policy
6. Submit for review

---

## 🐛 Troubleshooting

### Notifications not showing
- Check Firebase credentials in `.env`
- Verify device token is registered
- Check Android app permissions in Android Studio

### Devotional not updating at midnight
- Check browser console for errors
- Verify `script.js` is loaded
- Check localStorage (DevTools → Application → LocalStorage)

### APK won't install
- Run `npm run sync` before building
- Clean build: `./gradlew clean`
- Ensure signing key is correct for release builds

### Backend not connecting
- Verify backend URL in script.js
- Check CORS settings in server.js
- Test API: `curl http://your-backend:5000/health`

---

## 📝 File Structure

```
lcm_devotional/
├── index.html                # Main app HTML
├── style.css                 # App styling
├── script.js                 # App logic + update mechanism
├── devotionals.json          # Daily devotional database
├── server.js                 # Node.js backend (optional)
├── package.json              # Dependencies
├── .env                      # Environment variables
├── capacitor.config.json     # Capacitor config
├── android/                  # Android app (generated)
│   └── app/
│       └── src/
│           └── main/
│               └── AndroidManifest.xml
└── ios/                      # iOS app (optional)
```

---

## 📞 Support & Next Steps

1. **Customize**: Update colors, fonts in `style.css`
2. **Add More Devotionals**: Update `devotionals.json`
3. **Deploy Backend**: Use Firebase Functions, Heroku, or AWS
4. **Submit to Play Store**: Follow Google's app guidelines

---

**Version**: 1.0.0  
**Last Updated**: 2026-03-20