-- Source: Reviews/The_Wolf_of_Wall_Street.md; approved text and scores preserved.
-- Apply migration 0003 first. Re-import preserves existing editorial records.
INSERT INTO editorial_reviews (
    slug, movie_slug, movie_title, release_year, runtime_minutes, tagline, verdict, body_md, why_watch_high_md, fun, action, mind_blowing, smart, feels, brain_effort, overall
) VALUES (
    'the-wolf-of-wall-street',
    'the-wolf-of-wall-street-2013',
    'The Wolf of Wall Street',
    2013,
    180,
    'An awful person but excellent company.',
    'Leonardo DiCaprio turns a greedy, dishonest stockbroker into someone you genuinely want to succeed. Three hours of monstrous behaviour, ridiculous comedy and the uneasy discovery that you''re on the wrong side.',
    'Jordan Belfort is a crook. Not a charming rogue who occasionally bends the rules. A proper, unrepentant crook who makes a fortune convincing people to buy rubbish. And yet, within half an hour of *The Wolf of Wall Street*, I was firmly on his side.

That''s DiCaprio''s trick. He doesn''t make Belfort decent or misunderstood. He makes him irresistible. The manic confidence, the motivational speeches, the spectacular absence of shame — you can see why people follow him. Worse, you can see why you''d want to be him. Not forever. A weekend would do. Preferably with a good lawyer on standby.

Scorsese is fully in on the scam. He gives the parties, yachts and drug binges so much energy that the victims barely get a look in. People are being fleeced, lives are being ruined, and I''m sitting there hoping Jordan wriggles out of his next disaster. Not my finest moment.

And it''s genuinely hilarious. The Quaalude sequence, with DiCaprio attempting basic physical tasks, is magnificent slapstick. A man who can sell anything suddenly can''t negotiate with his own legs.

## Why watch it high?

*The Wolf of Wall Street* is outrageously entertaining when you''re high. The speeches, the parties, the spectacularly terrible decisions. Scorsese keeps turning everything up until even the most absurd behaviour starts to seem perfectly normal.

There''s something beautifully ridiculous about watching people take heroic quantities of drugs while you''ve settled in with a much quieter evening. The speeches get louder, the decisions get worse, and the physical comedy eventually reaches a level that barely seems human.

No need to make sense of it all. Catch the brilliant throwaway lines and marvel at DiCaprio''s complete lack of restraint. Three hours have rarely gone by so quickly. Enjoy the ride. There won''t be another quite like it any time soon.',
    '*The Wolf of Wall Street* is outrageously entertaining when you''re high. The speeches, the parties, the spectacularly terrible decisions. Scorsese keeps turning everything up until even the most absurd behaviour starts to seem perfectly normal.',
    5,
    4,
    3,
    4,
    2,
    2,
    5
) ON CONFLICT(slug) DO NOTHING;
