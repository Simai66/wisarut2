# Copilot instructions (photo3)

## Big picture

- React + Vite + TypeScript app in `src/`, styled with MUI and motion via Framer Motion.
- Source of truth for versions is `package.json` (README may lag).
- Data layer is Firebase Auth + Firestore (no Firebase Storage). Images are stored on ImgBB.
- State is mostly Zustand stores; pages typically call small hooks that wrap store actions.

## Where to look first

- App shell (routing, theme, auth init): `src/App.tsx`, `src/config/routes.ts`, `src/config/theme.ts`, `src/config/firebase.ts`
- Store → hook pattern: `src/stores/galleryStore.ts` + `src/hooks/usePhotos.ts`, `src/hooks/useAlbums.ts`
- Firestore access (thin service modules): `src/services/photoService.ts`, `src/services/albumService.ts`, `src/services/authService.ts`
- Admin gate: `src/components/admin/ProtectedRoute.tsx` (admin emails parsed in `src/config/firebase.ts`)

## Critical workflows

- Install/run: `npm install` then `npm run dev`
- Typecheck/build/lint: `npm run type-check`, `npm run build` (runs `tsc && vite build`), `npm run lint`
- No unit test runner is configured in the root package.

## Env/config conventions

- Frontend reads Vite env vars via `import.meta.env` (see `src/config/firebase.ts`, `src/services/storageService.ts`).
- Admin is controlled by email allowlist: `VITE_ADMIN_EMAILS` (comma-separated) or legacy `VITE_ADMIN_EMAIL`.
- ImgBB uploads require `VITE_IMGBB_API_KEY`.
- ImgBB proxy endpoint is `VITE_IMGBB_PROXY_URL` (falls back to default worker URL in `src/services/storageService.ts`).

## Data flow & patterns

- Prefer `src/services/*` for Firestore/HTTP; avoid calling Firestore directly from pages/components.
- UI state (dark mode, lightbox, snackbar) lives in `src/stores/uiStore.ts` (persisted: `darkMode` only).
- Gallery pagination uses Firestore `DocumentSnapshot` cursor (`lastDoc`) + `limit(20)`; keep query ordering consistent with `src/services/photoService.ts`.
- Filtering/search: `searchPhotos()` fetches and filters client-side; not suitable for very large collections without changing approach.
- Admin add-photos flow: `src/pages/Admin.tsx` creates Firestore docs from pasted ImgBB URLs (no in-app file upload).

## External integration points

- Firebase Hosting SPA rewrite is configured in `firebase.json`.
- ImgBB uploads (current UI): browser → Cloudflare Worker proxy → ImgBB (`src/services/storageService.ts` + `cloudflare-worker/imgbb-proxy.js`).
- Optional alternative: Firebase callable function `functions/index.js` (`uploadToImgbb`) for server-to-server uploads (not wired into the frontend flow).
- Cloudflare Worker proxy must allow your origin in `cloudflare-worker/imgbb-proxy.js` (`ALLOWED_ORIGINS`).

## Repo conventions

- Prefer path aliases from `vite.config.ts` (e.g. `@/services/...`, `@components/...`) instead of relative imports.
- Keep modules small: stores orchestrate async state; services wrap Firestore/HTTP; hooks adapt store APIs for pages.
