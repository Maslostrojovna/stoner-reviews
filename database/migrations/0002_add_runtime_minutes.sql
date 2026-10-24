-- A film's watch time in whole minutes; unknown runtimes stay NULL.
ALTER TABLE editorial_reviews ADD COLUMN runtime_minutes INTEGER
    CHECK (runtime_minutes IS NULL OR (typeof(runtime_minutes) = 'integer' AND runtime_minutes > 0));
