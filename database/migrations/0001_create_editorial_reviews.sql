CREATE TABLE editorial_reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT NOT NULL UNIQUE,
    movie_slug TEXT NOT NULL,
    movie_title TEXT NOT NULL,
    release_year INTEGER,
    tagline TEXT,
    verdict TEXT,
    body_md TEXT,
    why_watch_high_md TEXT,
    fun INTEGER CHECK (fun IS NULL OR (typeof(fun) = 'integer' AND fun BETWEEN 1 AND 5)),
    action INTEGER CHECK (action IS NULL OR (typeof(action) = 'integer' AND action BETWEEN 1 AND 5)),
    mind_blowing INTEGER CHECK (mind_blowing IS NULL OR (typeof(mind_blowing) = 'integer' AND mind_blowing BETWEEN 1 AND 5)),
    smart INTEGER CHECK (smart IS NULL OR (typeof(smart) = 'integer' AND smart BETWEEN 1 AND 5)),
    feels INTEGER CHECK (feels IS NULL OR (typeof(feels) = 'integer' AND feels BETWEEN 1 AND 5)),
    -- Independent editorial judgment: never derived from the category ratings.
    overall INTEGER CHECK (overall IS NULL OR (typeof(overall) = 'integer' AND overall BETWEEN 1 AND 5)),
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
