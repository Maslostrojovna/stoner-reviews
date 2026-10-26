-- Concentration required, independently assigned; NULL when not supplied.
ALTER TABLE editorial_reviews ADD COLUMN brain_effort INTEGER
    CHECK (brain_effort IS NULL OR (typeof(brain_effort) = 'integer' AND brain_effort BETWEEN 1 AND 5));
