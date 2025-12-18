# 📸 Photo Gallery Website

A production-ready, modern photo gallery website built with React 18, TypeScript, and Firebase. Features a stunning minimalist design, masonry grid gallery, admin dashboard, and seamless deployment options.

![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)
![Firebase](https://img.shields.io/badge/Firebase-10.x-FFCA28?logo=firebase)
![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?logo=vite)

## ✨ Features

- **🖼️ Stunning Gallery** - Responsive masonry grid with smooth animations
- **🔍 Search & Filter** - Find photos by title, tags, or album
- **💡 Lightbox Viewer** - Full-screen image viewing with keyboard navigation
- **🌓 Dark/Light Mode** - Persistent theme preference
- **📱 Mobile Responsive** - Beautiful on all devices
- **🔐 Admin Dashboard** - Upload photos and manage albums
- **🔥 Firebase Integration** - Auth, Firestore, and Storage
- **⚡ Fast Performance** - Code splitting and lazy loading
- **🎨 Modern Design** - Minimalist, professional portfolio style

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.x | UI Framework |
| Vite | 5.x | Build Tool |
| TypeScript | 5.x (Strict) | Type Safety |
| MUI | 5.x | UI Components |
| Zustand | 4.x | State Management |
| Firebase | 10.x | Backend Services |
| React Router | 6.x | Routing |
| Framer Motion | 11.x | Animations |
| react-masonry-css | 1.x | Gallery Layout |

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── admin/          # Admin-specific components
│   ├── common/         # Shared components
│   ├── gallery/        # Gallery components
│   └── layout/         # Layout components
├── config/             # App configuration
├── hooks/              # Custom React hooks
├── pages/              # Route pages
├── services/           # Firebase API services
├── stores/             # Zustand state stores
├── types/              # TypeScript interfaces
└── utils/              # Helper functions
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Firebase account
- Git

### 1. Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd photo3

# Install dependencies
npm install
```

### 2. Firebase Setup

1. **Create Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Add project" and follow the setup wizard
   - Enable Google Analytics (optional)

2. **Enable Firebase Services**
   - **Authentication**: Enable Google sign-in provider
   - **Firestore**: Create database in production mode
   - **Storage**: Create default bucket

3. **Get Firebase Config**
   - Go to Project Settings > General
   - Scroll to "Your apps" and click "Add app" (Web)
   - Copy the configuration object

4. **Configure Environment**
   ```bash
   # Copy example env file
   cp .env.example .env
   
   # Edit .env with your Firebase config
   ```

   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_ADMIN_EMAIL=your_admin_email@gmail.com
   ```

5. **Deploy Security Rules**
   - Update `YOUR_ADMIN_EMAIL@gmail.com` in `firestore.rules` and `storage.rules`
   - Deploy rules via Firebase CLI or console

### 3. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173)

## 📄 Pages

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Hero, featured photos, about preview |
| Gallery | `/gallery` | Masonry grid with search/filter |
| Album | `/album/:id` | Single album photos |
| About | `/about` | Photographer bio and info |
| Contact | `/contact` | Contact form and info |
| Login | `/login` | Google sign-in |
| Admin | `/admin` | Photo upload, album management |

## 🔐 Authentication

- Uses Firebase Google Authentication
- Admin access controlled by `VITE_ADMIN_EMAIL` environment variable
- Protected routes redirect to login

## 🗄️ Database Schema

### Firestore Collections

**photos**
```typescript
{
  id: string;
  url: string;
  thumbnail: string;
  title: string;
  description: string;
  albumId: string;
  tags: string[];
  createdAt: Timestamp;
  order: number;
}
```

**albums**
```typescript
{
  id: string;
  name: string;
  description: string;
  coverUrl: string;
  order: number;
  isPublic: boolean;
  createdAt: Timestamp;
}
```

### Storage Structure

```
photos/
└── {photoId}/
    ├── original.jpg
    └── thumbnail.jpg
```

## 🚢 Deployment

### Option 1: Firebase Hosting (Recommended)

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize project (skip if firebase.json exists)
firebase init

# Build and deploy
npm run build
firebase deploy
```

### Option 2: Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

Or connect your GitHub repository to Vercel dashboard.

### Build Commands

```bash
# Development
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Type checking
npm run type-check

# Linting
npm run lint
```

## 🔧 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_FIREBASE_API_KEY` | Yes | Firebase API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Yes | Firebase auth domain |
| `VITE_FIREBASE_PROJECT_ID` | Yes | Firebase project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Yes | Firebase storage bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Yes | Firebase messaging sender ID |
| `VITE_FIREBASE_APP_ID` | Yes | Firebase app ID |
| `VITE_ADMIN_EMAIL` | Yes | Admin email for access control |

## 📝 License

MIT License - feel free to use this project for your own photography portfolio!

## 🙏 Acknowledgments

- [Unsplash](https://unsplash.com) for placeholder images
- [MUI](https://mui.com) for Material Design components
- [Firebase](https://firebase.google.com) for backend services
