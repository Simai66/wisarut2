# Cloudflare Worker - ImgBB Proxy

This folder contains a Cloudflare Worker that proxies requests to ImgBB API to bypass CORS restrictions.

## Setup Instructions

### 1. Install Wrangler CLI
```bash
npm install -g wrangler
```

### 2. Login to Cloudflare
```bash
wrangler login
```

### 3. Deploy the Worker
```bash
cd cloudflare-worker
wrangler deploy
```

### 4. Get Your Worker URL
After deploying, you'll get a URL like:
```
https://imgbb-proxy.YOUR_USERNAME.workers.dev
```

### 5. Update Your App
Add the worker URL to your `.env` file:
```
VITE_IMGBB_PROXY_URL=https://imgbb-proxy.YOUR_USERNAME.workers.dev
```

## Free Tier Limits
- **100,000 requests/day**
- **10ms CPU time per request**
- Unlimited bandwidth

## Features
- ✅ CORS enabled for your domains
- ✅ Secure - only allows requests from whitelisted origins
- ✅ Fast - deployed on Cloudflare's edge network
- ✅ Free - generous free tier

## Customization
Edit `imgbb-proxy.js` to add more allowed origins:
```javascript
const ALLOWED_ORIGINS = [
    'https://photo-wisarut.web.app',
    'https://your-other-domain.com',
];
```
