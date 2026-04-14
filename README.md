<p align="center">
  <img src="https://img.shields.io/badge/TaskUp-Smart%20Student%20Planner-000000?style=for-the-badge&labelColor=FFD500" alt="TaskUp Banner" />
</p>

<h1 align="center">📋 TaskUp — Smart Student Planner</h1>

<p align="center">
  A full-stack, cross-platform student task management platform built with a bold <strong>Neo-Brutalism</strong> design system.<br />
  Organize your academic life into color-coded zones, track deadlines on a custom calendar, and gamify your productivity with streaks and XP.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React_Native-Expo_SDK_55-000000?style=flat-square&logo=expo&logoColor=white" />
  <img src="https://img.shields.io/badge/React-Vite-646CFF?style=flat-square&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Firebase-v12-FFCA28?style=flat-square&logo=firebase&logoColor=black" />
  <img src="https://img.shields.io/badge/License-MIT-00FF88?style=flat-square" />
</p>

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Design System — Neo-Brutalism](#-design-system--neo-brutalism)
- [Setup & Installation](#-setup--installation)
  - [Mobile App (Expo)](#mobile-app-expo)
  - [Web App (Vite + React)](#web-app-vite--react)
- [Firebase Configuration](#-firebase-configuration)
- [Firestore Security Rules](#-firestore-security-rules)
- [Deployment](#-deployment)
  - [Web Deployment](#web-deployment-vercel--firebase-hosting)
  - [Mobile Deployment (EAS Build)](#mobile-deployment-eas-build)
- [Screens & User Flow](#-screens--user-flow)
- [Bug Fixes Applied](#-bug-fixes-applied)
- [Branch Strategy](#-branch-strategy)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**TaskUp** is a student-focused task management application designed to help students organize their academic responsibilities efficiently. Built across **three platforms** (React Native mobile, React web, and Flutter), TaskUp uses a shared Firebase backend for real-time data synchronization.

### Why TaskUp?

| Problem | TaskUp Solution |
|---|---|
| Students forget deadlines | 📅 Custom calendar with color-coded task dots |
| Tasks feel overwhelming | 🗂️ Organize into **Zones** (Work, Exam, Personal, etc.) |
| No motivation to complete tasks | 🔥 **Streak + XP** gamification system |
| Need access on multiple devices | 📱💻 Same Firebase backend for mobile & web |
| Hard to prioritize | 🎯 4-level priority system (Urgent → Low) |

---

## ✨ Features

### Core Features
- [x] **Email/Password Authentication** — Sign up, log in, forgot password
- [x] **Task CRUD** — Create, read, update, delete tasks with full validation
- [x] **Color-Coded Zones** — Organize tasks into customizable zones (Work, Exam, Reading, etc.)
- [x] **Priority Levels** — Urgent / High / Medium / Low with visual indicators
- [x] **Custom Calendar** — Monthly grid with colored dots showing task distribution
- [x] **Today's Focus** — Priority-grouped daily checklist with progress bar
- [x] **Real-Time Sync** — Firestore `onSnapshot` listeners for instant updates across devices

### Gamification
- [x] **Daily Streak Counter** — Track consecutive productive days
- [x] **XP System** — Earn 10 XP per completed task + streak bonus (up to 20 extra)
- [x] **Profile Stats** — Today, This Week, Overall completion percentages

### User Experience
- [x] **Dark / Light Mode** — System-aware theme toggle with localStorage persistence
- [x] **Edit Profile** — Update name, college, department from within the app
- [x] **Browser Notifications** — Push reminders for upcoming task deadlines (web)
- [x] **Responsive Layout** — Desktop sidebar + mobile bottom navigation
- [x] **Error Boundary** — Graceful crash handling with recovery screen
- [x] **Loading States** — Skeleton screens while Firebase resolves auth

### Security
- [x] **Firestore Security Rules** — Users can only access their own data
- [x] **Environment Variables** — Firebase secrets stored in `.env` (web) and `app.json` extra (mobile)
- [x] **Input Validation** — All forms validate before submitting to Firestore

---

## 🛠 Tech Stack

| Layer | Technology | Version |
|---|---|---|
| **Mobile App** | React Native + Expo | SDK 55 |
| **Web App** | React + Vite | React 19, Vite 8 |
| **Backend / Database** | Firebase Firestore | v12 |
| **Authentication** | Firebase Auth | v12 |
| **Navigation (Mobile)** | React Navigation | v7 |
| **Navigation (Web)** | React Router DOM | v6 |
| **Icons (Mobile)** | @expo/vector-icons | Ionicons |
| **State Management** | React Context API | — |
| **Build (Mobile)** | EAS Build | CLI v3+ |
| **Design System** | Custom Neo-Brutalism | — |

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Firebase Backend                       │
│  ┌──────────┐   ┌──────────────┐   ┌────────────────┐  │
│  │   Auth   │   │  Firestore   │   │  Security      │  │
│  │ (Email/  │   │  (tasks,     │   │  Rules         │  │
│  │  Pass)   │   │   zones,     │   │  (per-user     │  │
│  │          │   │   users)     │   │   isolation)   │  │
│  └────┬─────┘   └──────┬───────┘   └────────────────┘  │
│       │                │                                 │
└───────┼────────────────┼─────────────────────────────────┘
        │                │
        │    onSnapshot (real-time)
        │                │
  ┌─────┴────────────────┴──────────────────┐
  │         Shared Context Layer             │
  │  ┌────────────┐  ┌───────────────────┐  │
  │  │ AuthContext │  │   TaskContext      │  │
  │  │ (user,     │  │   (tasks, zones,  │  │
  │  │  profile,  │  │    CRUD, streak,  │  │
  │  │  loading)  │  │    XP, listeners) │  │
  │  └────────────┘  └───────────────────┘  │
  └──────────┬───────────────┬──────────────┘
             │               │
     ┌───────┴───┐   ┌──────┴──────┐
     │  Mobile   │   │    Web      │
     │  (Expo)   │   │  (Vite)     │
     │           │   │             │
     │ React     │   │ React       │
     │ Navigation│   │ Router v6   │
     │ Bottom    │   │ Sidebar +   │
     │ Tabs      │   │ Bottom Nav  │
     └───────────┘   └─────────────┘
```

---

## 📁 Project Structure

```
TaskUp/
│
├── 📱 Mobile App (React Native + Expo)
│   ├── App.js                          # Root: Navigation + Providers + ErrorBoundary
│   ├── app.json                        # Expo config + Firebase credentials (extra)
│   ├── eas.json                        # EAS Build profiles (dev, preview, production)
│   ├── package.json                    # Dependencies
│   │
│   └── src/
│       ├── contexts/
│       │   ├── AuthContext.js           # Auth state, login, signup, profile, gamification
│       │   └── TaskContext.js           # Tasks/Zones CRUD + onSnapshot listeners
│       │
│       ├── firebase/
│       │   └── config.js               # Firebase init (reads from app.json extra)
│       │
│       ├── components/
│       │   ├── EmptyState.jsx           # Empty list placeholder
│       │   ├── InputField.jsx           # Styled text input with Neo-Brutalism borders
│       │   ├── PrimaryButton.jsx        # Black CTA button with loading state
│       │   ├── SecondaryButton.jsx       # Outlined secondary button
│       │   ├── SearchBar.jsx            # Search input with icon
│       │   ├── StatsCard.jsx            # Numeric stat card (e.g. "12 Completed")
│       │   ├── TaskCard.jsx             # Task list item with priority accent bar
│       │   ├── ZoneCard.jsx             # Zone management card (extracted for hooks fix)
│       │   └── ZoneChip.jsx             # Selectable zone tag
│       │
│       ├── screens/
│       │   ├── SplashScreen.jsx         # Landing page with logo + CTAs
│       │   ├── LoginScreen.jsx          # Email/password login + forgot password
│       │   ├── SignUpScreen.jsx         # 7-field registration form
│       │   ├── ZonesScreen.jsx          # Onboarding zone selector
│       │   ├── DashboardScreen.jsx      # Main task list with search + filters
│       │   ├── AddTaskScreen.jsx        # Create/edit task form
│       │   ├── CalendarScreen.jsx       # Monthly calendar grid
│       │   ├── TodayScreen.jsx          # Priority-grouped daily checklist
│       │   ├── ProfileScreen.jsx        # Stats, streak, edit profile, settings
│       │   └── ManageZonesScreen.jsx    # Zone CRUD with color picker
│       │
│       └── theme.js                     # Design tokens (colors, spacing, shadows)
│
├── 🌐 Web App (React + Vite)
│   └── taskup-web/
│       ├── .env.example                 # Firebase environment variable template
│       ├── index.html                   # HTML entry with SEO meta tags
│       ├── package.json                 # Vite + React + Firebase dependencies
│       │
│       └── src/
│           ├── firebase/config.js       # Firebase init (uses VITE_ env vars)
│           ├── theme.css                # 700+ line Neo-Brutalism CSS design system
│           ├── main.jsx                 # React DOM entry point
│           ├── App.jsx                  # React Router v6 + provider hierarchy
│           │
│           ├── contexts/
│           │   ├── AuthContext.jsx       # Auth with loading, forgot password, gamification
│           │   ├── TaskContext.jsx       # onSnapshot listeners + CRUD + streak/XP
│           │   └── ThemeContext.jsx      # Dark/light toggle + localStorage
│           │
│           ├── components/              # 15 reusable UI components
│           │   ├── Layout.jsx           # App shell (sidebar + bottom nav + Outlet)
│           │   ├── ProtectedRoute.jsx   # Auth guard wrapper
│           │   ├── ErrorBoundary.jsx     # Crash recovery
│           │   ├── LoadingScreen.jsx     # Full-page loading spinner
│           │   ├── ThemeToggle.jsx       # Light/dark mode button
│           │   ├── TaskCard.jsx          # Task card with accent bar
│           │   ├── InputField.jsx        # Styled input with label
│           │   ├── PrimaryButton.jsx     # Primary CTA button
│           │   ├── SecondaryButton.jsx   # Secondary button
│           │   ├── FilterTabs.jsx        # Horizontal scroll filter tabs
│           │   ├── SearchBar.jsx         # Search input
│           │   ├── EmptyState.jsx        # Empty placeholder
│           │   ├── StatsCard.jsx         # Stat number card
│           │   ├── ZoneChip.jsx          # Zone selection chip
│           │   └── Modal.jsx            # Reusable modal overlay
│           │
│           └── screens/                 # 10 page-level screens
│               ├── SplashScreen.jsx
│               ├── LoginScreen.jsx
│               ├── SignUpScreen.jsx
│               ├── ZonesScreen.jsx
│               ├── DashboardScreen.jsx
│               ├── AddTaskScreen.jsx
│               ├── CalendarScreen.jsx
│               ├── TodayScreen.jsx
│               ├── ProfileScreen.jsx
│               └── ManageZonesScreen.jsx
│
├── 🔒 Firebase
│   ├── firestore.rules                  # Security rules (auth + userId isolation)
│   ├── FIRESTORE_SCHEMA.md              # Database schema documentation
│   └── DEPLOYMENT_CHECKLIST.md          # Step-by-step deployment guide
│
├── .gitignore                           # Ignores node_modules, .env, dist, etc.
├── .env.example                         # Mobile Firebase env template
└── README.md                            # This file
```

---

## 🎨 Design System — Neo-Brutalism

TaskUp uses a custom **Neo-Brutalism** aesthetic that is bold, unapologetic, and highly legible.

### Design Tokens

| Token | Value | Purpose |
|---|---|---|
| **Border Width** | 3px | All interactive elements have thick borders |
| **Border Radius** | max 8px | Slightly rounded, never circular |
| **Shadows** | `4px 4px 0px #000` | Hard block shadows (no blur) |
| **Font (Headings)** | `system-ui, -apple-system` | Clean system font |
| **Font (Mono)** | `'Courier New', monospace` | Stats and numbers |
| **Text Transform** | `uppercase` | Headers and labels |
| **Letter Spacing** | `1.5px` | Label readability |

### Color Palette

| Color | Hex | Usage |
|---|---|---|
| Background (Light) | `#F5F0EB` | Warm cream base |
| Background (Dark) | `#1a1a2e` | Deep navy dark mode |
| Primary | `#000000` | Buttons, text |
| Accent Yellow | `#FFD500` | FAB button, warnings |
| Accent Pink | `#FF007F` | Urgent priority, links |
| Accent Cyan | `#00FFFF` | Medium priority, info |
| Accent Mint | `#00FF88` | Low priority, success |
| Border | `#2a2a2a` | Element borders |

### Priority Colors

| Priority | Color | Hex |
|---|---|---|
| 🔴 Urgent | Hot Pink | `#FF007F` |
| 🟡 High | Gold | `#FFD500` |
| 🔵 Medium | Cyan | `#00FFFF` |
| 🟢 Low | Mint Green | `#00FF88` |

---

## 🚀 Setup & Installation

### Prerequisites

- **Node.js** v18+ ([download](https://nodejs.org/))
- **npm** or **yarn**
- **Expo CLI**: `npm install -g expo-cli`
- A **Firebase project** with Auth + Firestore enabled
- **Git** for version control

---

### Mobile App (Expo)

```bash
# 1. Clone the repository
git clone https://github.com/devanathsugavasi/TaskUp.git
cd TaskUp

# 2. Install dependencies
npm install

# 3. Firebase credentials are already in app.json > expo > extra
#    For production, override with EAS Secrets (see Deployment section)

# 4. Start the Expo development server
npx expo start

# 5. Scan the QR code with Expo Go (iOS/Android)
#    Or press 'w' for web, 'i' for iOS simulator, 'a' for Android emulator
```

---

### Web App (Vite + React)

```bash
# 1. Navigate to the web project
cd TaskUp/taskup-web

# 2. Install dependencies
npm install

# 3. Create your environment file
cp .env.example .env

# 4. Fill in your Firebase credentials in .env:
#    VITE_FIREBASE_API_KEY=your-api-key
#    VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
#    VITE_FIREBASE_PROJECT_ID=your-project-id
#    ... (see .env.example for all fields)

# 5. Start the development server
npm run dev

# 6. Open http://localhost:5173 in your browser
```

---

## 🔥 Firebase Configuration

### Firestore Collections

| Collection | Fields | Description |
|---|---|---|
| `users` | `uid`, `name`, `email`, `college`, `dept`, `year`, `xp`, `streak`, `lastCompletionDate`, `createdAt` | User profiles + gamification data |
| `tasks` | `userId`, `title`, `desc`, `zone`, `priority`, `status`, `calendarDate`, `dueDateStr`, `reminderMinutes`, `createdAt`, `completedAt` | All task data |
| `zones` | `userId`, `name`, `color`, `taskCount`, `createdAt` | User's task organization zones |

### Security Model

Every document in `tasks` and `zones` has a `userId` field. Firestore security rules enforce that users can only read/write documents where `userId === auth.uid`.

---

## 🔒 Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Users: read/write own profile only
    match /users/{userId} {
      allow read, create, update: if request.auth != null
                                   && request.auth.uid == userId;
      allow delete: if false;
    }

    // Tasks: CRUD own tasks only, validate title exists
    match /tasks/{taskId} {
      allow read: if request.auth != null
                   && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null
                    && request.resource.data.userId == request.auth.uid
                    && request.resource.data.title is string
                    && request.resource.data.title.size() > 0;
      allow update: if request.auth != null
                    && resource.data.userId == request.auth.uid;
      allow delete: if request.auth != null
                    && resource.data.userId == request.auth.uid;
    }

    // Zones: CRUD own zones only
    match /zones/{zoneId} {
      allow read: if request.auth != null
                   && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null
                    && request.resource.data.userId == request.auth.uid;
      allow update, delete: if request.auth != null
                    && resource.data.userId == request.auth.uid;
    }

    // Deny everything else
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

**Deploy rules:**
```bash
firebase login
firebase deploy --only firestore:rules
```

---

## 🚢 Deployment

### Web Deployment (Vercel / Firebase Hosting)

#### Option 1: Vercel (Recommended)
```bash
cd taskup-web
npm install -g vercel
vercel
# Follow the prompts — Vercel auto-detects Vite
```

#### Option 2: Firebase Hosting
```bash
cd taskup-web
npm run build

firebase login
firebase init hosting
# Set public directory: dist
# Single-page app: Yes

firebase deploy --only hosting
```

---

### Mobile Deployment (EAS Build)

```bash
# 1. Install EAS CLI
npm install -g eas-cli

# 2. Log in to your Expo account
eas login

# 3. Configure the project
eas build:configure

# 4. Set production Firebase secrets
eas secret:create --name FIREBASE_API_KEY --value "your-key"
eas secret:create --name FIREBASE_AUTH_DOMAIN --value "your-domain"
eas secret:create --name FIREBASE_PROJECT_ID --value "your-id"
# ... repeat for all config values

# 5. Build for Android (APK for testing)
eas build --platform android --profile preview

# 6. Build for production
eas build --platform android --profile production
eas build --platform ios --profile production

# 7. Submit to stores
eas submit --platform android
eas submit --platform ios
```

---

## 📱 Screens & User Flow

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Splash      │────▶│  Login       │────▶│  Dashboard   │
│  (Landing)   │     │  (or SignUp)  │     │  (Planner)   │
└──────────────┘     └──────────────┘     └──────┬───────┘
                                                  │
                           ┌──────────────────────┼────────────────────┐
                           │                      │                    │
                     ┌─────┴──────┐   ┌───────────┴──────┐   ┌───────┴───────┐
                     │  Calendar   │   │   Add/Edit Task   │   │    Today      │
                     │  (Monthly)  │   │   (Form)          │   │    (Focus)    │
                     └────────────┘   └──────────────────┘   └───────────────┘
                                                                      │
                                                              ┌───────┴───────┐
                                                              │    Profile    │
                                                              │  (Stats/XP)  │
                                                              └───────┬───────┘
                                                                      │
                                                              ┌───────┴───────┐
                                                              │ Manage Zones  │
                                                              │  (CRUD)       │
                                                              └───────────────┘
```

| # | Screen | Description |
|---|---|---|
| 1 | **Splash** | Landing page with logo, tagline ("Plan clearly. Finish on time."), Login/SignUp CTAs |
| 2 | **Login** | Email + password form with working **Forgot Password** button |
| 3 | **Sign Up** | 7-field form: name, college, department, year, email, password, confirm |
| 4 | **Zones** | Onboarding — select preset zones or add custom ones |
| 5 | **Dashboard** | Main task list with search bar, zone filter tabs, task cards |
| 6 | **Add Task** | Create/edit form with zone picker, priority chips, date picker, reminder |
| 7 | **Calendar** | Custom monthly grid with colored dots + day-click task panel |
| 8 | **Today** | Priority-grouped checklist (Urgent → Low) with progress bar |
| 9 | **Profile** | Avatar, stats grid, streak/XP, zone breakdown, edit profile, manage zones |
| 10 | **Manage Zones** | Zone list with edit (rename/recolor) and delete with task reassignment |

---

## 🐛 Bug Fixes Applied

During the development audit, **11 critical bugs** were identified and fixed:

| # | Bug | Severity | Fix |
|---|---|---|---|
| 1 | React Hooks called inside `renderItem` callback | 🔴 Critical | Extracted `ZoneCard` as standalone component |
| 2 | `DEFAULT_ZONES.push()` mutates module constant | 🔴 Critical | Replaced with `useState` + spread operator |
| 3 | Today filter was `filtered = filtered` (no-op) | 🟡 Major | Filters by `calendarDate === today ISO date` |
| 4 | Forgot Password button had no `onPress` handler | 🟡 Major | Added `sendPasswordResetEmail` from Firebase |
| 5 | Due date used plain text input | 🟡 Major | Web: `<input type="datetime-local">` |
| 6 | Reminder field was non-functional | 🟡 Major | Web: Browser Notifications API with `setTimeout` |
| 7 | Firebase API keys hardcoded in source | 🔴 Critical | `.env` (web) + `app.json extra` (mobile) |
| 8 | No Firestore security rules deployed | 🔴 Critical | Complete rules with auth + userId validation |
| 9 | Profile stats used independent `getDocs` (stale) | 🟡 Major | Reads from `useTasks()` context (real-time) |
| 10 | No loading screen while auth resolves | 🟢 Minor | Loading spinner until `onAuthStateChanged` fires |
| 11 | Tasks fetched with `getDocs` (one-shot, stale) | 🟡 Major | Replaced with `onSnapshot` real-time listeners |

---

## 🌿 Branch Strategy

| Branch | Purpose |
|---|---|
| `main` | Production-ready code, stable releases |
| `feature/web-app` | Complete React web application (Vite) |
| `feature/mobile-bugfixes` | React Native mobile app bug fixes + upgrades |
| `feature/firebase-security` | Firestore rules, env vars, deployment configs |
| `docs/readme` | Documentation updates, README, schema docs |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "feat: Add your feature"`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

### Commit Convention

| Prefix | Usage |
|---|---|
| `feat:` | New features |
| `fix:` | Bug fixes |
| `docs:` | Documentation changes |
| `style:` | Design/CSS changes |
| `refactor:` | Code restructuring |
| `chore:` | Build/config changes |

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  <strong>Built with ❤️ by <a href="https://github.com/devanathsugavasi">Devanath Sugavasi</a></strong>
</p>