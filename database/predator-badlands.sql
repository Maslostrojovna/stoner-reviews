-- Source: Reviews/Predator_Badlands.md, approved review text and seven scores.
-- Requires migration 0003. Preserve existing matching editorial records.
INSERT INTO editorial_reviews (
    slug, movie_slug, movie_title, release_year, runtime_minutes, tagline, verdict, body_md, why_watch_high_md, fun, action, mind_blowing, smart, feels, brain_effort, overall
) VALUES (
    'predator-badlands',
    'predator-badlands-2025',
    'Predator: Badlands',
    2025,
    107,
    'The Predator somehow has friends now.',
    'Spectacular alien combat, beautifully choreographed fights and glowing weaponry. Add a chatty android, an adorable baby monster and a planet that seems personally offended by the existence of visitors.',
    'The opening duel in *Predator: Badlands* is a lovely reminder that the Yautja could probably sustain an entire martial arts franchise of their own. Dek and his older brother Kwei keep changing the distance between them: one moment circling, the next crashing together in a burst of glowing blades. The light flashes across their armour as they duck, twist and counterattack. These are creatures we''re used to seeing stalk humans through jungles. Watching them fight someone their own size is a different pleasure.

Dek, unfortunately, isn''t much of a success by Predator standards. Considered too weak for his clan, he heads for a hostile planet to hunt a creature nobody is supposed to be able to kill. What begins as a brutal test of strength gradually develops an unexpected sense of humour, and even a little warmth. Nobody watching the original *Predator* in 1987 could have reasonably predicted that.

He meets Thia, an android with the relentlessly chatty energy of someone who''s delighted to have company. She''s missing her legs, but her ability to talk appears entirely unaffected. Then there''s Bud, a baby monster who turns this already improbable partnership into something dangerously close to a family outing.

The joke is that Dek doesn''t suddenly become nice. He''s still a stubborn, violence-first alien trying to maintain some dignity while his companions behave as though they''ve wandered into a completely different film. Somehow, their chemistry works.

### Why watch it high?

*Predator: Badlands* (2025) is a terrific film to watch high for the opening fight alone. The choreography is crisp, and those luminous weapons leave you staring at every movement. But there''s also an unexpected pleasure in watching a fearsome alien hunter reluctantly put up with companions he''d probably rather hunt.

The planet helps, too. Almost everything on it looks capable of killing you, including things that ordinarily have the decency to stay rooted in the ground. There''s plenty to marvel at between the fights, and the humour stops it all becoming unbearably macho.',
    '*Predator: Badlands* (2025) is a terrific film to watch high for the opening fight alone. The choreography is crisp, and those luminous weapons leave you staring at every movement. But there''s also an unexpected pleasure in watching a fearsome alien hunter reluctantly put up with companions he''d probably rather hunt.',
    3,
    5,
    3,
    2,
    3,
    2,
    4
) ON CONFLICT(slug) DO NOTHING;
