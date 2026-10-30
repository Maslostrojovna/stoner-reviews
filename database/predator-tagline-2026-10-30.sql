-- User-approved wording change, 2026-10-30. No review body or ratings change.
-- Conditional, repeat-safe update; inspect the matching row before and after.
UPDATE editorial_reviews
SET tagline = 'The Predator somehow has friends now.',
    updated_at = CURRENT_TIMESTAMP
WHERE slug = 'predator-badlands'
  AND tagline = 'The Predator has friends now. Somehow.';
