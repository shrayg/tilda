-- Insert fake user-reported danger pins with details
INSERT INTO pins (user_id, lat, lng, score, status, title, description, user_category, ai_layer) VALUES
-- Traffic Hazards
(NULL, 40.7589, -73.9851, 4, 'open', 'Dangerous Intersection', 'Multiple near-miss accidents reported at this busy intersection. Poor visibility due to parked cars.', 'traffic', 'crashes'),
(NULL, 40.7614, -73.9776, 3, 'open', 'Pothole Cluster', 'Several large potholes causing vehicles to swerve unexpectedly. Needs immediate repair.', 'traffic', 'construction'),
(NULL, 40.7489, -73.9680, 5, 'open', 'Blind Corner', 'Extremely dangerous blind corner with no warning signs. Multiple collisions reported.', 'traffic', 'crashes'),
(NULL, 40.7831, -73.9712, 3, 'investigating', 'Broken Traffic Light', 'Traffic signal has been malfunctioning for 3 days. Causing confusion and delays.', 'infrastructure', 'construction'),
(NULL, 40.7580, -73.9855, 4, 'open', 'Aggressive Drivers', 'High-speed racing and dangerous driving frequently observed late at night.', 'traffic', 'speeding'),

-- Crime Risk
(NULL, 40.7749, -73.9656, 5, 'open', 'Multiple Muggings', 'Several mugging incidents reported in this area over the past 2 weeks. Poor lighting.', 'crime', 'crime'),
(NULL, 40.7529, -73.9772, 3, 'investigating', 'Suspicious Activity', 'Groups loitering at night. Residents feeling unsafe walking through this area.', 'crime', 'crime'),
(NULL, 40.7678, -73.9812, 4, 'open', 'Car Break-ins', 'Multiple car break-ins reported. Windows smashed, valuables stolen.', 'crime', 'crime'),
(NULL, 40.7891, -73.9598, 2, 'resolved', 'Package Theft', 'Packages being stolen from building entrance. Security camera now installed.', 'crime', 'crime'),
(NULL, 40.7456, -73.9889, 3, 'open', 'Harassment Reports', 'Multiple people reporting verbal harassment and uncomfortable encounters.', 'crime', 'crime'),

-- Infrastructure Hazards  
(NULL, 40.7723, -73.9558, 4, 'open', 'Crumbling Sidewalk', 'Large sections of sidewalk cracked and raised. Trip hazard for pedestrians and wheelchair users.', 'infrastructure', 'construction'),
(NULL, 40.7612, -73.9623, 3, 'investigating', 'Broken Street Lamp', 'Street light out for over a month. Area completely dark at night.', 'infrastructure', 'construction'),
(NULL, 40.7834, -73.9534, 5, 'open', 'Unstable Scaffolding', 'Construction scaffolding appears unstable and poorly maintained. Safety concern.', 'infrastructure', 'construction'),
(NULL, 40.7501, -73.9945, 2, 'resolved', 'Loose Manhole Cover', 'Manhole cover was rattling and shifting. City has now secured it.', 'infrastructure', 'construction'),
(NULL, 40.7667, -73.9701, 4, 'open', 'Fallen Tree Branch', 'Large branch hanging dangerously low over sidewalk after storm. Could fall anytime.', 'infrastructure', 'weather'),

-- Environmental Hazards
(NULL, 40.7556, -73.9690, 3, 'open', 'Flooding After Rain', 'Severe flooding occurs here during heavy rain. Standing water blocks entire sidewalk.', 'environmental', 'weather'),
(NULL, 40.7778, -73.9823, 4, 'investigating', 'Gas Smell', 'Strong natural gas odor reported by multiple residents. Utility company notified.', 'environmental', 'weather'),
(NULL, 40.7445, -73.9712, 2, 'open', 'Icy Conditions', 'This area never gets salted in winter. Extremely slippery and dangerous.', 'environmental', 'weather'),
(NULL, 40.7890, -73.9645, 3, 'open', 'Smoke/Fire Risk', 'Homeless encampment with open fires. Smoke affecting nearby buildings.', 'environmental', 'weather'),
(NULL, 40.7623, -73.9889, 4, 'open', 'Chemical Spill', 'Unknown chemical spilled on sidewalk. Strong odor, possible health hazard.', 'environmental', 'weather'),

-- Other/Mixed
(NULL, 40.7512, -73.9834, 3, 'open', 'Stray Dog Pack', 'Pack of aggressive stray dogs roaming this area. Several people chased/threatened.', 'other', 'crime'),
(NULL, 40.7701, -73.9590, 4, 'investigating', 'Noise Pollution', 'Construction site operating 24/7 with loud machinery. Residents cannot sleep.', 'other', 'construction'),
(NULL, 40.7823, -73.9767, 2, 'resolved', 'Graffiti Problem', 'Area was covered in graffiti. Clean-up crew has addressed the issue.', 'other', 'crime'),
(NULL, 40.7534, -73.9712, 5, 'open', 'Unstable Building', 'Abandoned building with structural damage. Windows broken, walls cracking. Dangerous.', 'other', 'construction'),
(NULL, 40.7645, -73.9623, 3, 'open', 'Rat Infestation', 'Large rat population in this area. Health concern for residents and businesses.', 'other', 'weather');
