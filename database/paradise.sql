-- Paradise (2025); runtime is approximate and per episode.
INSERT INTO editorial_reviews (
  slug, movie_slug, movie_title, release_year, runtime_minutes, tmdb_id, imdb_id, media_type, tagline, verdict, body_md, why_watch_high_md, fun, action, mind_blowing, smart, feels, brain_effort, overall
) VALUES (
  'paradise-2025',
  'paradise-2025',
  'Paradise',
  2025,
  50,
  245927,
  'tt27444205',
  'tv',
  'Welcome to paradise. Everyone''s miserable.',
  'A remarkably clever post-apocalyptic thriller with sharp dialogue and beautifully constructed characters. Death is everywhere, but every cheerful little detail of Paradise plays a role in covering it up.',
  'Death and grief are everywhere in *Paradise*. Yet the dialogue is remarkably sharp, occasionally witty, and full of little observations about people that stay with you. There''s something deeply sad about the whole thing, but the writing is so good that you can''t help enjoying it.

A US president is murdered, his Secret Service agent becomes the prime suspect, and the investigation unfolds in a seemingly perfect American community. Except there''s a rather significant detail about this particular paradise that changes everything.

But the real pleasure is in the writing.

There''s something almost James Joyce-like about the conversations. Think *Dubliners*: people making small talk that turns out to be anything but small. Half the story is happening between the lines.

One scene captures this particularly well. The late president''s father and son pretend they''re having a conversation with him. It''s a strange little exchange, almost playful, but neither needs to explain what they''re really doing. They miss him. And somehow, pretending he''s still there makes his absence even more apparent.

*Paradise* also moves back and forth through time, gradually revealing the lives of characters you''ve already met. Just when you think you''ve figured someone out, another piece of their past changes your opinion. The characters haven''t changed. Your understanding of them has.

## Why watch it high?

*Paradise* rewards paying attention while high. Not because the plot is impossibly complicated, but because so much of the good stuff happens in conversations that initially seem unimportant.

A casual remark, an awkward silence, a strangely timed joke. You start noticing how much the characters are telling each other without actually saying it.

It''s also unexpectedly emotional. You might come for the conspiracy, but it''s the people who keep you watching.',
  '*Paradise* rewards paying attention while high. Not because the plot is impossibly complicated, but because so much of the good stuff happens in conversations that initially seem unimportant.',
  2,
  3,
  3,
  5,
  4,
  3,
  4
) ON CONFLICT(slug) DO NOTHING;
