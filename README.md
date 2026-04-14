# TaskUp — Smart Student Planner

A student-focused task management platform with a **Neo-Brutalism** design system. Features color-coded task zones, priority levels, a monthly calendar, daily checklists, and XP/streak gamification.

## Tech Stack

| Layer | Technology |
|---|---|
| **Mobile App** | React Native + Expo SDK 55 |
| **Web App** | React (Vite) |
| **Backend** | Firebase v12 (Auth + Firestore) |
| **Navigation (Mobile)** | React Navigation v7 with Bottom Tabs |
| **Navigation (Web)** | React Router v6 |
| **Icons** | @expo/vector-icons (Ionicons) |
| **State** | React Context API (AuthContext + TaskContext + ThemeContext) |

## Project Structure

```
taskup/
├── App.js                  # Mobile app root
├── app.json                # Expo config with Firebase extra
├── eas.json                # EAS Build config
├── firestore.rules         # Firestore security rules
├── .env.example            # Template for Firebase secrets
├── src/
│   ├── contexts/
│   │   ├── AuthContext.js  # Auth state, login, signup, edit profile
│   │   └── TaskContext.js  # Tasks & zones CRUD with onSnapshot
│   ├── firebase/
│   │   ├── config.js       # Firebase init (reads from app.json extra)
│   │   └── auth.js         # Auth helper exports
│   ├── components/         # 12 reusable components
│   ├── screens/            # 10 screens
│   └── theme.js            # Neo-Brutalism design tokens
│
├── taskup-web/             # Web app (separate Vite project)
│   ├── .env.example        # Template for VITE_FIREBASE_* vars
│   ├── .env                # Actual Firebase config (gitignored)
│   ├── firestore.rules     # Same security rules
│   └── src/
│       ├── contexts/       # AuthContext, TaskContext, ThemeContext
│       ├── components/     # 15 reusable components
│       ├── screens/        # 10 screens
│       ├── firebase/config.js
│       ├── theme.css       # CSS design system with dark mode
│       ├── App.jsx         # React Router setup
│       └── main.jsx        # Entry point
```

## Setup — Mobile App

```bash
# 1. Clone and install
cd taskup
npm install

# 2. Firebase credentials are in app.json > expo > extra
#    For production, use EAS Secrets to override these values.

# 3. Start the Expo dev server
npx expo start
```

## Setup — Web App

```bash
# 1. Navigate to web project
cd taskup/taskup-web

# 2. Install dependencies
npm install

# 3. Copy and fill in Firebase environment variables
cp .env.example .env
# Edit .env with your Firebase project values

# 4. Start development server
npm run dev
# Opens at http://localhost:5173
```

## Deploy — Web App (Vercel)

```bash
# Option 1: Vercel (recommended for simplicity)
npm install -g vercel
cd taskup-web
vercel

# Option 2: Firebase Hosting
npm install -g firebase-tools
firebase login
firebase init hosting  # Set public directory to "dist"
npm run build
firebase deploy --only hosting
```

## Deploy — Mobile App (EAS Build)

```bash
# 1. Install EAS CLI
npm install -g eas-cli

# 2. Log in to Expo account
eas login

# 3. Configure project (first time only)
eas build:configure

# 4. Set production secrets
eas secret:create --name FIREBASE_API_KEY --value "your-key"
# Repeat for all Firebase config values

# 5. Build
eas build --platform android --profile production
eas build --platform ios --profile production

# 6. Submit to stores
eas submit --platform android
eas submit --platform ios
```

## Deploy Firestore Security Rules

```bash
firebase login
firebase init firestore  # Select your project
# Copy firestore.rules into the initialized directory
firebase deploy --only firestore:rules
```

## Features

- [x] Email/password authentication
- [x] Forgot password (sends reset email)
- [x] Color-coded task zones with CRUD
- [x] Task priorities (Urgent / High / Medium / Low)
- [x] Monthly calendar with colored task dots
- [x] Today's Focus checklist with progress bar
- [x] Profile with stats, zone breakdown, XP and streak
- [x] Edit Profile (name, college, department)
- [x] Dark / Light mode toggle
- [x] Real-time Firestore sync (onSnapshot)
- [x] Browser push notifications (web)
- [x] Neo-Brutalism design system
- [x] Responsive web layout (desktop + mobile)
- [x] Input validation on all forms
- [x] Error Boundary for crash protection
- [x] Firestore security rules

## Bug Fixes Applied

| # | Bug | Status |
|---|---|---|
| 1 | Hooks violation in ManageZonesScreen renderItem | Fixed (extracted ZoneCard component) |
| 2 | DEFAULT_ZONES mutation with .push() | Fixed (useState + spread copy) |
| 3 | Today filter was a no-op | Fixed (filters by today's ISO date) |
| 4 | Forgot Password button was dead | Fixed (sends Firebase reset email) |
| 5 | No date picker (plain text input) | Fixed (datetime-local on web) |
| 6 | Reminder field did nothing | Fixed (browser notifications on web) |
| 7 | Firebase secrets hardcoded | Fixed (.env + app.json extra) |
| 8 | No Firestore security rules | Fixed (complete rules file) |
| 9 | Stale Profile stats | Fixed (uses useTasks() context) |
| 10 | No auth loading indicator | Fixed (loading screen while auth resolves) |
| 11 | No real-time listeners | Fixed (onSnapshot replaces getDocs) |