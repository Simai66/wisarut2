/**
 * Cloudflare Worker - ImgBB Upload Proxy
 * 
 * This worker proxies requests to ImgBB API to bypass CORS restrictions.
 * Deploy this to Cloudflare Workers and use the worker URL in your app.
 * 
 * Free tier: 100,000 requests/day
 */

const IMGBB_API_URL = 'https://api.imgbb.com/1/upload';

// Allowed origins (add your domains here)
const ALLOWED_ORIGINS = [
    'https://photo-wisarut.web.app',
    'https://photo-wisarut.firebaseapp.com',
    'http://localhost:5173',
    'http://localhost:3000',
];

/**
 * Handle CORS preflight requests
 */
function handleOptions(request) {
    const origin = request.headers.get('Origin');
    const isAllowed = ALLOWED_ORIGINS.includes(origin) || origin?.includes('localhost');

    return new Response(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': isAllowed ? origin : ALLOWED_ORIGINS[0],
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '86400',
        },
    });
}

/**
 * Add CORS headers to response
 */
function corsHeaders(origin) {
    const isAllowed = ALLOWED_ORIGINS.includes(origin) || origin?.includes('localhost');
    return {
        'Access-Control-Allow-Origin': isAllowed ? origin : ALLOWED_ORIGINS[0],
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json',
    };
}

/**
 * Main request handler
 */
async function handleRequest(request) {
    const origin = request.headers.get('Origin');

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
        return handleOptions(request);
    }

    // Only allow POST requests
    if (request.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
            status: 405,
            headers: corsHeaders(origin),
        });
    }

    try {
        // Get the form data from the request
        const formData = await request.formData();

        // Forward the request to ImgBB
        const response = await fetch(IMGBB_API_URL, {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();

        return new Response(JSON.stringify(data), {
            status: response.status,
            headers: corsHeaders(origin),
        });
    } catch (error) {
        return new Response(JSON.stringify({
            error: 'Upload failed',
            message: error.message
        }), {
            status: 500,
            headers: corsHeaders(origin),
        });
    }
}

// Export for Cloudflare Workers
export default {
    async fetch(request) {
        return handleRequest(request);
    },
};
