-- The Meerkats (2008). Wording, scores and complete cover approved 2026-11-19.
-- Author explicitly authorized publication 2026-11-19. Retry-safe single-review import.
-- TMDB: https://www.themoviedb.org/movie/16971-the-meerkats
-- IMDb: https://www.imdb.com/title/tt0892391/
INSERT INTO editorial_reviews (slug, movie_slug, movie_title, release_year, runtime_minutes, tmdb_id, imdb_id, media_type, tagline, verdict, body_md, why_watch_high_md, fun, action, mind_blowing, smart, feels, brain_effort, overall)
SELECT
  'the-meerkats-2008',
  'the-meerkats-2008',
  'The Meerkats',
  2008,
  83,
  16971,
  'tt0892391',
  'movie',
  'The greatest underdog story. Starring a meerkat.',
  'What begins as a charming wildlife documentary becomes an astonishing story of survival. You''ll soon find yourself rooting for Kolo, a tiny meerkat with the odds stacked against him.',
  'Hollywood spends millions inventing heroes, impossible situations and dramatic twists. Meanwhile, somewhere in the Kalahari Desert, a meerkat called Kolo is living a story screenwriters would kill to come up with.

Kolo is young, curious and mightily adorable. He''s also surrounded by creatures considerably larger than himself, many of which would be delighted to have him for lunch.

Before long, Kolo isn''t just a meerkat anymore. He''s your pal. You''re rooting for him, worrying about him, and occasionally questioning why nature has to be such a ruthless bastard.

And the best part? Hollywood didn''t have to invent any of it.

There''s a little cinematic storytelling involved, of course. This is a dramatised wildlife documentary, not an uninterrupted record of one animal''s life. But the footage is real, the dangers are real, and the emotional attachment is hard to resist.

## Why watch it high?

*The Meerkats (2008)* is a wonderful choice for a stoned evening because it brings you face to face with the tiny inhabitants of the Kalahari Desert, lets you enjoy their ridiculous antics, and on top of it all, gives you Kolo and his unbelievable heroic story.

The close-up photography brings you right into their tiny world, where a perfectly ordinary patch of desert becomes an enormous and dangerous place. And Paul Newman''s narration gives the whole experience the warmth of someone telling you an extraordinary story by the fireplace.

There''s something beautifully absurd about being high on your sofa, worrying about a creature that weighs less than your dinner.

Meerkats are great. Kolo is unquestionably the greatest of them all.',
  '*The Meerkats (2008)* is a wonderful choice for a stoned evening because it brings you face to face with the tiny inhabitants of the Kalahari Desert, lets you enjoy their ridiculous antics, and on top of it all, gives you Kolo and his unbelievable heroic story.',
  3,
  4,
  4,
  3,
  5,
  1,
  5
WHERE NOT EXISTS (
  SELECT 1 FROM editorial_reviews
  WHERE slug = 'the-meerkats-2008'
     OR (media_type = 'movie' AND tmdb_id = 16971)
     OR imdb_id = 'tt0892391'
);
