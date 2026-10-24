-- Apply migration 0002 first, then run after the review imports.
-- Coherence: SFFILM 2014 programme, original release, 89 minutes.
-- https://sffilm.org/event/coherence/
UPDATE editorial_reviews
SET runtime_minutes = 89, updated_at = CURRENT_TIMESTAMP
WHERE movie_slug = 'coherence-2013' AND runtime_minutes IS NULL;

-- Fear and Loathing in Las Vegas: BFI, original release, 118 minutes.
-- https://www.bfi.org.uk/film/a47079b7-6cbe-534a-8287-1fac54af6e7a/fear-and-loathing-in-las-vegas
UPDATE editorial_reviews
SET runtime_minutes = 118, updated_at = CURRENT_TIMESTAMP
WHERE movie_slug = 'fear-and-loathing-in-las-vegas-1998' AND runtime_minutes IS NULL;
