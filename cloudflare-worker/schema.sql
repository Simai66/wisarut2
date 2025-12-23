-- Photos table
CREATE TABLE IF NOT EXISTS photos (
    id TEXT PRIMARY KEY,
    url TEXT NOT NULL,
    thumbnail TEXT NOT NULL,
    title TEXT DEFAULT '',
    description TEXT DEFAULT '',
    album_id TEXT DEFAULT '',
    tags TEXT DEFAULT '[]',
    "order" INTEGER DEFAULT 0,
    width INTEGER,
    height INTEGER,
    media_type TEXT DEFAULT 'image',
    youtube_url TEXT DEFAULT '',
    concept TEXT DEFAULT '',
    created_at TEXT DEFAULT (datetime('now'))
);

-- Albums table
CREATE TABLE IF NOT EXISTS albums (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT DEFAULT '',
    cover_url TEXT DEFAULT '',
    "order" INTEGER DEFAULT 0,
    is_public INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now'))
);

-- Site content table
CREATE TABLE IF NOT EXISTS site_content (
    id TEXT PRIMARY KEY,
    content TEXT NOT NULL,
    updated_at TEXT DEFAULT (datetime('now'))
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_photos_album ON photos(album_id);
CREATE INDEX IF NOT EXISTS idx_photos_order ON photos("order");
CREATE INDEX IF NOT EXISTS idx_albums_order ON albums("order");
