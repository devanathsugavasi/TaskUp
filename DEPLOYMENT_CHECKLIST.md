# ============================================
# TASKUP - DEPLOYMENT CHECKLIST
# ============================================

This document provides step-by-step instructions for deploying TaskUp to production.

---

## PHASE 1: WEB APP DEPLOYMENT (Firebase Hosting or Vercel)

### Option A: Deploy to Firebase Hosting

#### Prerequisites
- Firebase CLI installed: `npm install -g firebase-tools`
- Firebase project created at https://console.firebase.google.com
- Firestore database enabled
- Authentication (Email/Password) enabled

#### Step 1: Configure Firebase Project

```bash
# Login to Firebase
firebase login

# Initialize Firebase in your project
cd taskup_web
firebase init hosting
```

Follow the prompts:
- Select your Firebase project
- Set public directory to `dist`
- Configure as single-page app: Yes
- Set up automatic builds: No (or Yes if using GitHub Actions)

#### Step 2: Deploy

```bash
# Build the web app
npm run build

# Deploy to Firebase Hosting
firebase deploy --only hosting
```

Your site will be available at: `https://your-project-id.web.app`

#### Step 3: Set up Custom Domain (Optional)

1. Go to Firebase Console > Hosting
2. Click "Add custom domain"
3. Follow DNS verification steps

---

### Option B: Deploy to Vercel

#### Prerequisites
- Vercel account at https://vercel.com
- GitHub repository (recommended)

#### Step 1: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd taskup_web
vercel
```

Follow the prompts:
- Set up and deploy: Yes
- Which scope: Select your account
- Link to existing project: No
- Project name: taskup-web
- Directory: ./
- Override settings: No

#### Step 2: Configure Environment Variables

In Vercel Dashboard:
1. Go to Settings > Environment Variables
2. Add all variables from `.env.example`:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`

3. Redeploy: Settings > Deployments > Redeploy

---

### Option C: Deploy to Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
cd taskup_web
netlify deploy --prod --dir=dist
```

---

## PHASE 2: FIREBASE CONFIGURATION

### Step 1: Deploy Firestore Security Rules

```bash
# Login to Firebase
firebase login

# Initialize Firestore rules (if not done)
firebase init firestore

# Deploy only the rules
firebase deploy --only firestore:rules
```

The `firestore.rules` file in the root directory contains all security rules.

### Step 2: Set up Firestore Indexes (if needed)

If you see errors about missing indexes in the Firebase console:

```bash
# Deploy indexes
firebase deploy --only firestore:indexes
```

Or create indexes via Firebase Console:
1. Go to Firestore > Indexes
2. Add composite indexes for:
   - Collection: tasks, Fields: userId (Asc), calendarDate (Asc)
   - Collection: tasks, Fields: userId (Asc), createdAt (Desc)

### Step 3: Enable Authentication

1. Go to Firebase Console > Authentication
2. Click "Get started"
3. Enable "Email/Password" provider
4. Optionally enable "Google" for social login

---

## PHASE 3: MOBILE APP (EXPO/EAS)

### Prerequisites
- Node.js 18+ installed
- Expo account at https://expo.dev
- EAS CLI: `npm install -g eas-cli`
- Apple Developer Account (for iOS)
- Google Play Developer Console (for Android)

### Step 1: Configure app.json

Update `app.json` with your Firebase values:

```json
{
  "expo": {
    "extra": {
      "firebaseApiKey": "YOUR_API_KEY",
      "firebaseAuthDomain": "YOUR_PROJECT.firebaseapp.com",
      "firebaseProjectId": "YOUR_PROJECT_ID",
      "firebaseStorageBucket": "YOUR_PROJECT.appspot.com",
      "firebaseMessagingSenderId": "YOUR_SENDER_ID",
      "firebaseAppId": "YOUR_APP_ID"
    }
  }
}
```

### Step 2: Build for Development (Simulator)

```bash
cd taskup_mobile

# Install dependencies
npm install

# Start Expo
expo start

# Run on iOS Simulator
expo run:ios

# Run on Android Emulator
expo run:android
```

### Step 3: Build for Production

#### Android (APK for testing)

```bash
# Build development APK
eas build --platform android --profile development --local

# Build production APK
eas build --platform android --profile production
```

#### iOS (for Simulator or TestFlight)

```bash
# Build for iOS Simulator
eas build --platform ios --profile development

# Build for TestFlight/Production
eas build --platform ios --profile production
```

### Step 4: Submit to App Stores

#### Google Play Store

```bash
# Submit to Google Play (Internal Testing)
eas submit --platform android --latest

# Or specify a build
eas submit --platform android --id BUILD_ID
```

Prerequisites:
- Google Play Developer Console account
- App signing key configured
- Store listing assets (icons, screenshots, description)

#### Apple App Store

```bash
# Submit to App Store Connect
eas submit --platform ios --latest

# Or with specific build
eas submit --platform ios --id BUILD_ID
```

Prerequisites:
- Apple Developer Program membership ($99/year)
- App Store Connect app created
- Certificates and provisioning profiles configured
- Store listing assets ready

---

## PHASE 4: VERIFICATION CHECKLIST

### Pre-Launch Verification

- [ ] All Firebase config values set in environment variables
- [ ] Firestore security rules deployed and tested
- [ ] Authentication working (signup, login, logout, password reset)
- [ ] Tasks can be created, edited, completed, deleted
- [ ] Zones can be created, edited, deleted
- [ ] Date picker works on mobile
- [ ] Reminders scheduled correctly (mobile)
- [ ] Dark mode toggle works
- [ ] Responsive layout works on mobile and desktop
- [ ] No console errors in browser DevTools
- [ ] No security warnings in Firebase Console

### Post-Launch Verification

- [ ] Real-time sync working (tasks update across devices)
- [ ] Push notifications working (mobile)
- [ ] Analytics tracking (optional)
- [ ] Error reporting configured (Sentry recommended)

---

## COMMON ISSUES & TROUBLESHOOTING

### "Permission denied" errors
- Verify Firestore rules are deployed: `firebase deploy --only firestore:rules`
- Check that userId field matches request.auth.uid

### "Firebase config not found" errors
- Verify environment variables are set correctly
- Restart dev server after changing .env

### "onSnapshot not a function"
- Update Firebase SDK: `npm install firebase@latest`

### Build fails on mobile
- Clear cache: `expo start --clear`
- Delete node_modules and reinstall: `rm -rf node_modules && npm install`

---

## SUPPORT RESOURCES

- Firebase Documentation: https://firebase.google.com/docs
- Expo Documentation: https://docs.expo.dev
- React Navigation: https://reactnavigation.org/docs
- EAS Build: https://docs.expo.dev/build/introduction
