INSERT INTO milestone ( milestone_name, description, milestone_type, goal_count) VALUES
( 'Reach 10 km', 'Walk a lifetime total of 10 kilometers', 'DISTANCE', 10000),
( 'Reach 100 km', 'Walk a lifetime total of 100 kilometers', 'DISTANCE', 100000),
( 'Reach 1000 km', 'Walk a lifetime total of 1000 kilometers', 'DISTANCE', 1000000),
( 'Take 100,000 steps', 'Take a lifetime total of 100,000 steps', 'STEPS', 100000),
( 'Take 1,000,000 steps', 'Take a lifetime total of 1,000,000 steps', 'STEPS', 1000000),
( 'Collect 5 creatures', 'Collect 5 distinct creatures', 'CREATURES', 5),
( 'Collect 3 items', 'Collect 3 distinct items', 'ITEMS', 3)
ON CONFLICT (milestone_name) DO NOTHING;

INSERT INTO creature ( creature_name, rarity, species, description) VALUES
('Lumo', 'COMMON', 'Glow Wisp', 'Lumo''s soft glow is the first light every traveler learns to trust, said to gather wherever someone takes their very first step toward a long journey.'),
('Hedgespike', 'RARE', 'Thistleback', 'Curling into a ball of quills at the faintest sound, the Thistleback is said to guard forgotten forest paths, letting only the truly lost pass safely through.'),
('Kitritual', 'EPIC', 'Moon Familiar', 'By moonlight, the Moon Familiar traces silent circles in the grass, said to appear only for those who pause long enough to listen to the quiet.'),
('Aerogon', 'LEGENDARY', 'Sky Serpent', 'This creature is said to appear in the sky when travelers overcome their hardest challenges.'),
('Bobabbit','COMMON', 'Bubble Hare', 'Bouncing between meadows with a spring in every step, the Bubble Hare is said to bring luck to travelers who share their snacks along the trail.'),
('Whaleus','LEGENDARY', 'Tide Leviathan', 'Drifting through open water and open sky alike, the Tide Leviathan is said to carry the memories of every traveler who ever crossed the sea.')
ON CONFLICT (creature_name) DO NOTHING;

INSERT INTO item ( item_name, description, item_type, is_Active, bonus_value) VALUES
('Step-Boost', 'Doubles your step-count','STEP_BOOST', 'false',2),
('Creature-Magnet', 'Higher Chance to encounter Creatures','CREATURE_MAGNET','false', 2),
('Item-Magnet', 'Higher Chance to get Items', 'ITEM_MAGNET','false',2)
ON CONFLICT (item_name) DO NOTHING;



