-- Source: Reviews/A_Complete_Unknown.md. Approved prose, runtime and independent scores.
-- Safe to repeat: preserve existing review content. Apply migration 0002 first.
INSERT INTO editorial_reviews (
    slug, movie_slug, movie_title, release_year, runtime_minutes, tagline, verdict,
    body_md, why_watch_high_md, fun, action, mind_blowing, smart, feels, overall
) VALUES (
    'a-complete-unknown',
    'a-complete-unknown-2024',
    'A Complete Unknown',
    2024,
    141,
    'The revolution has an approved instrument list.',
    'A Bob Dylan biopic that cleverly follows folk music from a powerful voice of rebellion to a movement increasingly uncomfortable with change. Fantastic music, the sixties, and the peculiar rules of artistic freedom.',
    'There''s something fascinating about watching a rebellious movement slowly become the very thing it once opposed.

*A Complete Unknown* follows a young Bob Dylan (Timothée Chalamet) arriving in New York in the early sixties, guitar in hand, and finding his place in a thriving folk music scene. It''s a time when songs carry political weight, musicians have something to say, and a bloke with an acoustic guitar can genuinely make people believe the world might change.

And for a while, it''s beautiful.

But one of the cleverest things about the film is how gradually that atmosphere changes. The earnestness that initially feels so powerful starts becoming a little self-important. The folk movement, built on challenging conventions, develops conventions of its own. What begins as artistic freedom slowly turns into a rather strict idea of what authentic music is supposed to sound like.

By the time Dylan starts pushing against those boundaries, the whole thing has become slightly ridiculous. Apparently, changing the world is fine, provided you don''t change the instruments.

The film never needs to turn this into a lecture about artistic freedom. It''s there in the relationships, the performances, and the growing frustration of an artist who refuses to be neatly categorised. Dylan isn''t necessarily the most likeable person in the room, but that''s rather the point. He doesn''t owe anyone the version of himself they''ve grown comfortable with.

## Why watch it high?

For the music. Seriously. *A Complete Unknown* (2024) is a wonderful film to watch high if you love the sound and atmosphere of the sixties. Intimate folk performances, Dylan''s extraordinary songs, and the gradual arrival of a completely different musical energy. It''s worth watching just to sit back and listen.

There''s also something particularly enjoyable about being immersed in that period. The smoky clubs, the personalities, the idealism, and the sense that popular music is changing in real time.

And as the music evolves, so does your understanding of the people making it. What starts as an affectionate trip through folk history gradually becomes a rather funny reminder that even rebels can be hopelessly conservative.',
    'For the music. Seriously. *A Complete Unknown* (2024) is a wonderful film to watch high if you love the sound and atmosphere of the sixties. Intimate folk performances, Dylan''s extraordinary songs, and the gradual arrival of a completely different musical energy. It''s worth watching just to sit back and listen.',
    3,
    2,
    2,
    4,
    4,
    4
) ON CONFLICT(slug) DO NOTHING;
