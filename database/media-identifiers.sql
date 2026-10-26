-- Verified TMDB/IMDb identifiers, 2026-10-26. See MEDIA-IDENTIFIERS-2026-10-26.md.

-- Fill missing metadata only; do not overwrite conflicting IDs or editorial fields.

UPDATE editorial_reviews
SET tmdb_id = COALESCE(tmdb_id, 1878),
    imdb_id = COALESCE(imdb_id, 'tt0120669'),
    media_type = COALESCE(media_type, 'movie'),
    updated_at = CURRENT_TIMESTAMP
WHERE slug = 'fear-and-loathing-in-las-vegas' AND movie_title = 'Fear and Loathing in Las Vegas' AND release_year = 1998
  AND (tmdb_id IS NULL OR tmdb_id = 1878)
  AND (imdb_id IS NULL OR imdb_id = 'tt0120669')
  AND (media_type IS NULL OR media_type = 'movie')
  AND (tmdb_id IS NULL OR imdb_id IS NULL OR media_type IS NULL);

UPDATE editorial_reviews
SET tmdb_id = COALESCE(tmdb_id, 220289),
    imdb_id = COALESCE(imdb_id, 'tt2866360'),
    media_type = COALESCE(media_type, 'movie'),
    updated_at = CURRENT_TIMESTAMP
WHERE slug = 'coherence' AND movie_title = 'Coherence' AND release_year = 2013
  AND (tmdb_id IS NULL OR tmdb_id = 220289)
  AND (imdb_id IS NULL OR imdb_id = 'tt2866360')
  AND (media_type IS NULL OR media_type = 'movie')
  AND (tmdb_id IS NULL OR imdb_id IS NULL OR media_type IS NULL);

UPDATE editorial_reviews
SET tmdb_id = COALESCE(tmdb_id, 661539),
    imdb_id = COALESCE(imdb_id, 'tt11563598'),
    media_type = COALESCE(media_type, 'movie'),
    updated_at = CURRENT_TIMESTAMP
WHERE slug = 'a-complete-unknown' AND movie_title = 'A Complete Unknown' AND release_year = 2024
  AND (tmdb_id IS NULL OR tmdb_id = 661539)
  AND (imdb_id IS NULL OR imdb_id = 'tt11563598')
  AND (media_type IS NULL OR media_type = 'movie')
  AND (tmdb_id IS NULL OR imdb_id IS NULL OR media_type IS NULL);

UPDATE editorial_reviews
SET tmdb_id = COALESCE(tmdb_id, 106646),
    imdb_id = COALESCE(imdb_id, 'tt0993846'),
    media_type = COALESCE(media_type, 'movie'),
    updated_at = CURRENT_TIMESTAMP
WHERE slug = 'the-wolf-of-wall-street' AND movie_title = 'The Wolf of Wall Street' AND release_year = 2013
  AND (tmdb_id IS NULL OR tmdb_id = 106646)
  AND (imdb_id IS NULL OR imdb_id = 'tt0993846')
  AND (media_type IS NULL OR media_type = 'movie')
  AND (tmdb_id IS NULL OR imdb_id IS NULL OR media_type IS NULL);

UPDATE editorial_reviews
SET tmdb_id = COALESCE(tmdb_id, 1242898),
    imdb_id = COALESCE(imdb_id, 'tt31227572'),
    media_type = COALESCE(media_type, 'movie'),
    updated_at = CURRENT_TIMESTAMP
WHERE slug = 'predator-badlands' AND movie_title = 'Predator: Badlands' AND release_year = 2025
  AND (tmdb_id IS NULL OR tmdb_id = 1242898)
  AND (imdb_id IS NULL OR imdb_id = 'tt31227572')
  AND (media_type IS NULL OR media_type = 'movie')
  AND (tmdb_id IS NULL OR imdb_id IS NULL OR media_type IS NULL);
