-- IDs are optional until verified. TMDB IDs are scoped by movie/tv media type.
ALTER TABLE editorial_reviews ADD COLUMN tmdb_id INTEGER
    CHECK (tmdb_id IS NULL OR (typeof(tmdb_id) = 'integer' AND tmdb_id > 0));
ALTER TABLE editorial_reviews ADD COLUMN imdb_id TEXT
    CHECK (imdb_id IS NULL OR (
        imdb_id GLOB 'tt[0-9]*' AND length(imdb_id) >= 9
        AND substr(imdb_id, 3) NOT GLOB '*[^0-9]*'
    ));
ALTER TABLE editorial_reviews ADD COLUMN media_type TEXT
    CHECK (media_type IS NULL OR media_type IN ('movie', 'tv'));
