-- Source: Reviews/Coherence.md. Approved wording and independent scores preserved.
-- Safe to repeat: leave an existing matching review unchanged.
INSERT INTO editorial_reviews (
    slug, movie_slug, movie_title, release_year, tagline, verdict,
    body_md, why_watch_high_md, fun, action, mind_blowing, smart, feels, overall
) VALUES (
    'coherence',
    'coherence-2013',
    'Coherence',
    2013,
    'An infinite number of ways for dinner to go wrong.',
    'A dinner party, a passing comet, and an increasingly unbelievable universe. A clever, low-budget mind-bender that keeps pushing an increasingly ridiculous situation to its logical, and thoroughly illogical, extremes.',
    'Eight friends get together for dinner. There''s a comet passing overhead, a few awkward conversations, and the usual assortment of relationship baggage. Nothing particularly unusual. Until the lights go off and parallel realities intertwine.

And no, this isn''t the MCU version, where some guy with a suspiciously confident understanding of quantum physics explains the rules while everyone nods along.

No sir. *Coherence* throws you straight into the deep end with its characters. Nobody knows what''s happening, nobody''s coming to explain it, and you''re left trying to piece things together alongside eight increasingly paranoid people at a dinner party.

### Why watch it high?

Watching *Coherence* high feels like being the ninth guest at the table. As the evening unfolds, you can barely believe what you''re seeing. Neither can anyone else. And just when you think things can''t get any stranger, the universe politely asks you to reconsider.

All this with a suburban house, a few glow sticks, and eight people who really should have stayed inside.',
    'Watching *Coherence* high feels like being the ninth guest at the table. As the evening unfolds, you can barely believe what you''re seeing. Neither can anyone else. And just when you think things can''t get any stranger, the universe politely asks you to reconsider.',
    3,
    2,
    5,
    5,
    2,
    5
)
ON CONFLICT(slug) DO NOTHING;
