/**
 * Photo Gallery API - Cloudflare Worker with D1
 */

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

function jsonResponse(data, status = 200) {
    return new Response(JSON.stringify(data), {
        status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
}

function errorResponse(message, status = 400) {
    return jsonResponse({ error: message }, status);
}

// Generate unique ID
function generateId() {
    return crypto.randomUUID();
}

export default {
    async fetch(request, env) {
        // Handle CORS preflight
        if (request.method === 'OPTIONS') {
            return new Response(null, { headers: corsHeaders });
        }

        const url = new URL(request.url);
        const path = url.pathname;
        const method = request.method;

        try {
            // Photos endpoints
            if (path === '/photos' && method === 'GET') {
                return await getPhotos(env.DB, url.searchParams);
            }
            if (path === '/photos' && method === 'POST') {
                return await createPhoto(env.DB, await request.json());
            }
            if (path.startsWith('/photos/') && method === 'PUT') {
                const id = path.split('/')[2];
                return await updatePhoto(env.DB, id, await request.json());
            }
            if (path.startsWith('/photos/') && method === 'DELETE') {
                const id = path.split('/')[2];
                return await deletePhoto(env.DB, id);
            }

            // Albums endpoints
            if (path === '/albums' && method === 'GET') {
                return await getAlbums(env.DB);
            }
            if (path === '/albums' && method === 'POST') {
                return await createAlbum(env.DB, await request.json());
            }
            if (path.startsWith('/albums/') && method === 'PUT') {
                const id = path.split('/')[2];
                return await updateAlbum(env.DB, id, await request.json());
            }
            if (path.startsWith('/albums/') && method === 'DELETE') {
                const id = path.split('/')[2];
                return await deleteAlbum(env.DB, id);
            }

            // Content endpoints
            if (path.startsWith('/content/') && method === 'GET') {
                const page = path.split('/')[2];
                return await getContent(env.DB, page);
            }
            if (path.startsWith('/content/') && method === 'PUT') {
                const page = path.split('/')[2];
                return await updateContent(env.DB, page, await request.json());
            }

            // Health check
            if (path === '/health') {
                return jsonResponse({ status: 'ok', timestamp: new Date().toISOString() });
            }

            return errorResponse('Not Found', 404);
        } catch (error) {
            console.error('API Error:', error);
            return errorResponse(error.message || 'Internal Server Error', 500);
        }
    },
};

// ==================== PHOTOS ====================

async function getPhotos(db, params) {
    const albumId = params.get('albumId');
    const limit = parseInt(params.get('limit')) || 100;

    let query = 'SELECT * FROM photos';
    const bindings = [];

    if (albumId) {
        query += ' WHERE album_id = ?';
        bindings.push(albumId);
    }

    query += ' ORDER BY "order" ASC, created_at DESC LIMIT ?';
    bindings.push(limit);

    const result = await db.prepare(query).bind(...bindings).all();

    // Parse tags JSON
    const photos = result.results.map(p => ({
        ...p,
        tags: JSON.parse(p.tags || '[]'),
        albumId: p.album_id,
        createdAt: p.created_at,
        mediaType: p.media_type || 'image',
        youtubeUrl: p.youtube_url || '',
        concept: p.concept || '',
    }));

    return jsonResponse({ photos });
}

async function createPhoto(db, data) {
    const id = generateId();
    const { url, thumbnail, title = '', description = '', albumId = '', tags = [], order = 0, mediaType = 'image', youtubeUrl = '', concept = '' } = data;

    if (!url && mediaType !== 'video') {
        return errorResponse('URL is required for images');
    }

    if (mediaType === 'video' && !youtubeUrl) {
        return errorResponse('YouTube URL is required for videos');
    }

    await db.prepare(`
        INSERT INTO photos (id, url, thumbnail, title, description, album_id, tags, "order", media_type, youtube_url, concept)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(id, url || '', thumbnail || url || '', title, description, albumId, JSON.stringify(tags), order, mediaType, youtubeUrl, concept).run();

    return jsonResponse({ id, success: true }, 201);
}

async function updatePhoto(db, id, data) {
    const updates = [];
    const bindings = [];

    if (data.url !== undefined) { updates.push('url = ?'); bindings.push(data.url); }
    if (data.thumbnail !== undefined) { updates.push('thumbnail = ?'); bindings.push(data.thumbnail); }
    if (data.title !== undefined) { updates.push('title = ?'); bindings.push(data.title); }
    if (data.description !== undefined) { updates.push('description = ?'); bindings.push(data.description); }
    if (data.albumId !== undefined) { updates.push('album_id = ?'); bindings.push(data.albumId); }
    if (data.tags !== undefined) { updates.push('tags = ?'); bindings.push(JSON.stringify(data.tags)); }
    if (data.order !== undefined) { updates.push('"order" = ?'); bindings.push(data.order); }
    if (data.mediaType !== undefined) { updates.push('media_type = ?'); bindings.push(data.mediaType); }
    if (data.youtubeUrl !== undefined) { updates.push('youtube_url = ?'); bindings.push(data.youtubeUrl); }
    if (data.concept !== undefined) { updates.push('concept = ?'); bindings.push(data.concept); }

    if (updates.length === 0) {
        return errorResponse('No fields to update');
    }

    bindings.push(id);
    await db.prepare(`UPDATE photos SET ${updates.join(', ')} WHERE id = ?`).bind(...bindings).run();

    return jsonResponse({ success: true });
}

async function deletePhoto(db, id) {
    await db.prepare('DELETE FROM photos WHERE id = ?').bind(id).run();
    return jsonResponse({ success: true });
}

// ==================== ALBUMS ====================

async function getAlbums(db) {
    const result = await db.prepare('SELECT * FROM albums ORDER BY "order" ASC').all();

    const albums = result.results.map(a => ({
        ...a,
        coverUrl: a.cover_url,
        isPublic: Boolean(a.is_public),
        createdAt: a.created_at,
    }));

    return jsonResponse({ albums });
}

async function createAlbum(db, data) {
    const id = generateId();
    const { name, description = '', coverUrl = '', order = 0, isPublic = true } = data;

    if (!name) {
        return errorResponse('Name is required');
    }

    await db.prepare(`
        INSERT INTO albums (id, name, description, cover_url, "order", is_public)
        VALUES (?, ?, ?, ?, ?, ?)
    `).bind(id, name, description, coverUrl, order, isPublic ? 1 : 0).run();

    return jsonResponse({ id, success: true }, 201);
}

async function updateAlbum(db, id, data) {
    const updates = [];
    const bindings = [];

    if (data.name !== undefined) { updates.push('name = ?'); bindings.push(data.name); }
    if (data.description !== undefined) { updates.push('description = ?'); bindings.push(data.description); }
    if (data.coverUrl !== undefined) { updates.push('cover_url = ?'); bindings.push(data.coverUrl); }
    if (data.order !== undefined) { updates.push('"order" = ?'); bindings.push(data.order); }
    if (data.isPublic !== undefined) { updates.push('is_public = ?'); bindings.push(data.isPublic ? 1 : 0); }

    if (updates.length === 0) {
        return errorResponse('No fields to update');
    }

    bindings.push(id);
    await db.prepare(`UPDATE albums SET ${updates.join(', ')} WHERE id = ?`).bind(...bindings).run();

    return jsonResponse({ success: true });
}

async function deleteAlbum(db, id) {
    await db.prepare('DELETE FROM albums WHERE id = ?').bind(id).run();
    return jsonResponse({ success: true });
}

// ==================== CONTENT ====================

async function getContent(db, page) {
    const result = await db.prepare('SELECT * FROM site_content WHERE id = ?').bind(page).first();

    if (!result) {
        // Return default content
        return jsonResponse({ id: page, content: null, updatedAt: null });
    }

    return jsonResponse({
        id: result.id,
        content: JSON.parse(result.content || '{}'),
        updatedAt: result.updated_at,
    });
}

async function updateContent(db, page, data) {
    const content = JSON.stringify(data.content || data);

    await db.prepare(`
        INSERT INTO site_content (id, content, updated_at)
        VALUES (?, ?, datetime('now'))
        ON CONFLICT(id) DO UPDATE SET content = ?, updated_at = datetime('now')
    `).bind(page, content, content).run();

    return jsonResponse({ success: true });
}
