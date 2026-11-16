-- Jodorowsky's Dune (2013). Editorial scores approved 2026-11-16.
-- IMDb: https://www.imdb.com/title/tt1935156/
-- TMDB: https://www.themoviedb.org/movie/191720-jodorowsky-s-dune
INSERT INTO editorial_reviews (
  slug, movie_slug, movie_title, release_year, runtime_minutes, tmdb_id, imdb_id,
  media_type, tagline, verdict, body_md, why_watch_high_md,
  fun, action, mind_blowing, smart, feels, brain_effort, overall
)
SELECT
  'jodorowskys-dune-2013',
  'jodorowskys-dune-2013',
  'Jodorowsky''s Dune',
  2013,
  90,
  191720,
  'tt1935156',
  'movie',
  'The greatest science-fiction film never made.',
  'A glorious love letter to creative madness. Discover how one director''s completely insane vision of Dune helped shape modern science fiction, without ever making it to the screen. Prepare to have your brain blown away.',
  'Forget everything you know about ambitious filmmaking. In the 1970s, Chilean-French director Alejandro Jodorowsky set out to adapt Frank Herbert''s *Dune*, and apparently nobody thought to tell him that there were limits to what a human being could reasonably attempt.

His plans were spectacularly insane. Mick Jagger was supposed to play Feyd-Rautha. Salvador Dalí was lined up as Emperor Shaddam IV, demanding an astronomical salary for his participation. Orson Welles was involved. Pink Floyd would provide music. And legendary artists H. R. Giger, Moebius and Chris Foss were brought together to create an entirely new cinematic universe.

The film was never made. Which might be the most extraordinary thing about this documentary.

Because as Jodorowsky''s Dune reveals, the project''s creative DNA would eventually find its way into some of the most influential science-fiction films ever made. *Alien* is the clearest example, with several members of Jodorowsky''s creative team later working on Ridley Scott''s masterpiece. The documentary also draws fascinating connections to *Star Wars* and other classics, although not every claimed influence is quite so easy to prove.

But the real star is Jodorowsky himself. Decades later, his enthusiasm remains utterly infectious. He recounts his impossible ambitions with the conviction of a man who still believes he could have pulled the whole thing off. And after listening to him for ninety minutes, you might start believing it too.

## Why watch it high?

*Jodorowsky''s Dune* (2013) might be the ultimate stoner documentary. An unmade science-fiction epic, an outrageous collection of artistic geniuses, and a director whose imagination operates somewhere beyond the known laws of physics.

The concept art alone is worth your evening. But hearing Jodorowsky explain the sheer scale of his vision, while discovering how much of it echoes through the films you already love, is something else entirely.

It''s a love letter to creative madness, to artistic ambition without compromise, and to the beautiful absurdity of trying to make something impossible.

Get high. Watch it. Have your brain blown away.',
  '*Jodorowsky''s Dune* (2013) might be the ultimate stoner documentary. An unmade science-fiction epic, an outrageous collection of artistic geniuses, and a director whose imagination operates somewhere beyond the known laws of physics.',
  4,
  1,
  5,
  4,
  4,
  2,
  5
WHERE NOT EXISTS (
  SELECT 1
  FROM editorial_reviews
  WHERE slug = 'jodorowskys-dune-2013'
     OR (media_type = 'movie' AND tmdb_id = 191720)
     OR imdb_id = 'tt1935156'
);
