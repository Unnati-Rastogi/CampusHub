# CampusHub

> **Campus life, simplified.** Discover clubs, track events, and book halls — all in one modern platform built for students and campus staff.

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore%20%2B%20Auth-FFCA28?logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v3-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

---

## Features

### Public (Student View)
| Feature | Description |
|---|---|
| **Club Directory** | Browse, search, and filter all campus clubs with rich detail pages |
| **Event Feed** | Today's events, featured highlights, upcoming — with countdown indicators |
| **Club Detail** | Activity timelines, social links, member stats, upcoming events |
| **Dark Mode** | Elegant dark mode with persistent preference |

### Club Representative Dashboard
| Feature | Description |
|---|---|
| **Club Profile Editor** | Update club info, tags, social links, banner & logo |
| **Event Management** | Create, edit, delete events — with featured toggle |
| **Hall Booking** | Submit venue booking requests with time/date/attendees |
| **Booking Tracker** | Monitor status of all submitted booking requests |
| **Hall Calendar** | Visual calendar of approved bookings |

### Authority / Admin Dashboard
| Feature | Description |
|---|---|
| **Booking Review** | Approve or reject booking requests with optional review notes |
| **Hall Manager** | Edit hall names, capacities, and locations in-line |
| **Hall Calendar** | Full venue schedule overview |
| **Database Seeder** | One-click seed for clubs, halls, and events |

### Notifications
- Inline toast notifications for all actions (approve, reject, save, error)
- Success / Warning / Error / Info variants with auto-dismiss

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18 + Vite 5 |
| **Styling** | Tailwind CSS v3 + Custom Design System |
| **Animation** | Framer Motion |
| **Icons** | Lucide React |
| **Backend / Auth** | Firebase (Auth + Firestore) |
| **Routing** | React Router v6 |
| **State** | React Context API |
| **Performance** | Route-based lazy loading + Vite manual chunk splitting |

---

## Getting Started

### Prerequisites
- Node.js ≥ 18
- npm ≥ 9
- A Firebase project (free tier works fine)

### 1. Clone & Install
```bash
git clone https://github.com/your-username/CampusHub.git
cd CampusHub
npm install
```

### 2. Configure Firebase
Create a `.env` file in the project root (see `.env.example`):
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173)

### 4. Seed the Database
After logging in as an Authority account, use the **"Seed Database"** button on the Authority Dashboard to populate clubs, halls, and events.

---

## User Roles

| Role | How to Create | Access |
|---|---|---|
| **Student** | No account needed | Browse clubs + events |
| **Club Rep** | Sign up at `/signup` | Dashboard, event management, hall booking |
| **Authority** | Create via Firebase Console, then set `role: "authority"` in Firestore | Admin dashboard, booking review |

---

## Architecture

```
src/
├── components/         # Reusable UI components
│   ├── dashboard/      # Dashboard-specific components
│   ├── ClubCard.jsx    # Club listing card
│   ├── EventCard.jsx   # Event card with countdown
│   ├── PageLoader.jsx  # Route-level Suspense fallback
│   └── ...
├── context/            # React Context providers
│   ├── AuthContext.jsx # Firebase Auth + user profile
│   ├── ThemeContext.jsx # Dark/light mode
│   └── ToastContext.jsx # Global toast notifications
├── data/               # Static seed data (clubs, etc.)
├── hooks/              # Custom data-fetching hooks
│   ├── useClubs.js     # Firestore clubs subscription
│   ├── useEvents.js    # Firestore events subscription
│   ├── useHalls.js     # Firestore halls subscription
│   └── useBookings.js  # Firestore bookings subscription
├── lib/
│   ├── firebase.js     # Firebase initialization
│   └── seed.js         # Database seed function
├── pages/              # Route-level page components (lazy-loaded)
│   ├── dashboard/      # Rep + Authority dashboards
│   └── ...
└── services/           # Firestore write operations
```

### Performance Design
- **Route-based code splitting** via `React.lazy()` — each page is a separate JS chunk
- **Manual Vite chunk splitting** — Firebase, Framer Motion, Lucide in isolated vendor chunks
- **Google Fonts** loaded via `<link rel="preconnect">` (non-render-blocking)
- **`React.memo`** on ClubCard + EventCard to prevent unnecessary re-renders
- **Lazy image loading** (`loading="lazy" decoding="async"`) across all images
- **Skeleton loaders** on all data-fetching states — no blank screens

---

## Build for Production

```bash
npm run build
```

Output in `dist/`. Preview locally:
```bash
npm run preview
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel --prod
```

### Deploy to Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting   # set dist/ as public directory
npm run build
firebase deploy
```

---

## Roadmap

### Stage 1 — Core UI
Public pages (Home, Clubs, Events, Hall Booking), design system, dark mode

### Stage 2 — Backend & Auth
Firebase integration, role-based auth, dashboards, booking system

### Stage 3 — Polish & Performance
Lazy loading, toast notifications, event countdowns, AnimatePresence, SEO, README

### Stage 4 — Future Features (Planned)
- [ ] AI Club Assistant — natural language Q&A about clubs
- [ ] Club Photo Gallery — media uploads per club
- [ ] QR Attendance System — scan-in for events
- [ ] Email Notifications — booking status updates via Firebase Functions
- [ ] Analytics Dashboard — club engagement metrics

---

## License

MIT — free to use, modify, and distribute.

---

<p align="center">Built for campus communities.</p>
