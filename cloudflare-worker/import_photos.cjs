const fs = require('fs');

// Read backup
const data = JSON.parse(fs.readFileSync('/tmp/photos_backup.json', 'utf-8'));

// Generate SQL
const statements = data.photos.map(p => {
    const escape = (s) => (s || '').replace(/'/g, "''");
    return `INSERT INTO photos (id, url, thumbnail, title, description, album_id, tags, "order", media_type, youtube_url, concept, created_at) VALUES ('${escape(p.id)}', '${escape(p.url)}', '${escape(p.thumbnail)}', '${escape(p.title)}', '${escape(p.description)}', '${escape(p.album_id)}', '${escape(Array.isArray(p.tags) ? p.tags.join(',') : '')}', ${p.order || 0}, '${escape(p.media_type || 'image')}', '${escape(p.youtube_url)}', '${escape(p.concept)}', '${escape(p.created_at)}');`;
});

console.log(statements.join('\n'));
