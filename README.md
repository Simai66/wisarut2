# 📸 Photo Gallery Website

A modern, production-ready photo gallery website built with React 18, TypeScript, and Cloudflare D1. Features a stunning minimalist design, masonry grid gallery, fully customizable admin dashboard, and seamless deployment.

![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)
![Cloudflare](https://img.shields.io/badge/Cloudflare_D1-SQLite-F38020?logo=cloudflare)
![Firebase](https://img.shields.io/badge/Firebase_Auth-10.x-FFCA28?logo=firebase)
![Vite](https://img.shields.io/badge/Vite-7.x-646CFF?logo=vite)

## 🌐 Live Demo

**https://photo-wisarut.web.app**

## ✨ Features

### Gallery & Display
- **🖼️ Stunning Gallery** - Responsive masonry grid with smooth animations
- **🔍 Search & Filter** - Find photos by title, tags, or album
- **💡 Lightbox Viewer** - Full-screen image viewing with keyboard navigation
- **🌓 Dark/Light Mode** - Persistent theme preference
- **📱 Mobile Responsive** - Beautiful on all devices

### Admin Dashboard
- **📝 Home Page Editor** - Customize hero title, subtitle, background image, CTA button
- **🏷️ Site Name Editor** - Change "PHOTO GALLERY" text in navbar/footer
- **📄 About & Contact Editors** - Edit page content directly
- **🖼️ Photo Management** - Add via URL, edit title/tags/album, delete
- **📁 Album Management** - Create, update, delete albums

### Technical
- **☁️ Cloudflare D1 Database** - Fast, reliable SQLite at the edge
- **🔐 Firebase Authentication** - Google sign-in for admin access
- **⚡ Fast Performance** - Code splitting and lazy loading
- **🎨 Modern Design** - Minimalist, professional portfolio style

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| React 18 | UI Framework |
| Vite 7 | Build Tool |
| TypeScript 5 (Strict) | Type Safety |
| MUI 5 | UI Components |
| Zustand 4 | State Management |
| Cloudflare D1 | Database (SQLite) |
| Cloudflare Workers | API Backend |
| Firebase Auth | Authentication |
| React Router 6 | Routing |
| Framer Motion 11 | Animations |

## 📁 Project Structure

```
├── cloudflare-worker/    # D1 API backend
│   ├── api.js           # Worker API endpoints
│   ├── schema.sql       # Database schema
│   └── wrangler.toml    # Worker config
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── admin/      # Admin components (PhotoManager, AlbumManager, ContentEditor)
│   │   ├── common/     # Shared components
│   │   ├── gallery/    # Gallery components
│   │   └── layout/     # Layout components (Navbar, Footer)
│   ├── config/         # App configuration
│   ├── hooks/          # Custom React hooks
│   ├── pages/          # Route pages
│   ├── services/       # API services (photoService, albumService, contentService)
│   ├── stores/         # Zustand state stores
│   ├── types/          # TypeScript interfaces
│   └── utils/          # Helper functions
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Cloudflare account (for D1 database)
- Firebase account (for authentication)

### 1. Clone and Install

```bash
git clone https://github.com/Simai66/wisarut2.git
cd wisarut2
npm install
```

### 2. Setup Cloudflare D1

```bash
cd cloudflare-worker

# Install Wrangler CLI
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Create D1 database
wrangler d1 create photo-gallery

# Update wrangler.toml with your database_id

# Apply schema
wrangler d1 execute photo-gallery --file=schema.sql

# Deploy Worker API
wrangler deploy
```

### 3. Setup Firebase

1. Create a project at [Firebase Console](https://console.firebase.google.com/)
2. Enable **Google Authentication**
3. Copy config values to `.env`

### 4. Configure Environment

```bash
cp .env.example .env
```

Edit `.env`:
```env
# Firebase Auth
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Admin Access (comma-separated emails)
VITE_ADMIN_EMAILS=admin@gmail.com,another@gmail.com

# Cloudflare Worker API
VITE_API_URL=https://your-worker.workers.dev
```

### 5. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173)

## 📄 Pages

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Hero section, featured photos |
| Gallery | `/gallery` | Masonry grid with search/filter |
| Album | `/album/:id` | Single album photos |
| About | `/about` | Photographer bio and info |
| Contact | `/contact` | Contact information |
| Admin | `/admin` | Full content management |

## 🗄️ Database Schema (D1)

### Tables

**photos**
```sql
CREATE TABLE photos (
    id TEXT PRIMARY KEY,
    url TEXT NOT NULL,
    thumbnail TEXT,
    title TEXT,
    description TEXT,
    album_id TEXT,
    tags TEXT,  -- JSON array
    order_num INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

**albums**
```sql
CREATE TABLE albums (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    cover_url TEXT,
    order_num INTEGER DEFAULT 0,
    is_public INTEGER DEFAULT 1,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

**site_content**
```sql
CREATE TABLE site_content (
    id TEXT PRIMARY KEY,
    content TEXT,  -- JSON object
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

## 🚢 Deployment

### Frontend: Firebase Hosting

```bash
npm run build
npx firebase deploy --only hosting
```

### Backend: Cloudflare Workers

```bash
cd cloudflare-worker
wrangler deploy
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
| `VITE_ADMIN_EMAILS` | Yes | Comma-separated admin emails |
| `VITE_API_URL` | Yes | Cloudflare Worker API URL |

## 📝 License

MIT License - feel free to use this project for your own photography portfolio!

## 🙏 Acknowledgments

- [MUI](https://mui.com) for Material Design components
- [Cloudflare](https://cloudflare.com) for D1 database and Workers
- [Firebase](https://firebase.google.com) for authentication
