-- Clear all existing data and populate with permanent data
DELETE FROM official_events;

-- Insert crash data (95 records)
INSERT INTO official_events (external_source, external_id, layer, lat, lng, title, description, severity, started_at, is_active) VALUES
('permanent', 'crash_1', 'crashes', 40.7589, -73.9851, 'Vehicle Collision', '2 injured, 0 killed', 2, NOW() - INTERVAL '30 days', true),
('permanent', 'crash_2', 'crashes', 40.7614, -73.9776, 'Pedestrian Accident', '1 injured, 0 killed', 1, NOW() - INTERVAL '25 days', true),
('permanent', 'crash_3', 'crashes', 40.7489, -73.9680, 'Bicycle Accident', '1 injured, 0 killed', 1, NOW() - INTERVAL '20 days', true),
('permanent', 'crash_4', 'crashes', 40.7831, -73.9712, 'Multi-Vehicle Crash', '3 injured, 0 killed', 2, NOW() - INTERVAL '15 days', true),
('permanent', 'crash_5', 'crashes', 40.7580, -73.9855, 'Hit and Run', '1 injured, 0 killed', 2, NOW() - INTERVAL '10 days', true),
('permanent', 'crash_6', 'crashes', 40.7749, -73.9656, 'Vehicle Collision', '0 injured, 0 killed', 1, NOW() - INTERVAL '5 days', true),
('permanent', 'crash_7', 'crashes', 40.7529, -73.9772, 'Pedestrian Accident', '2 injured, 0 killed', 2, NOW() - INTERVAL '45 days', true),
('permanent', 'crash_8', 'crashes', 40.7678, -73.9812, 'Vehicle Collision', '1 injured, 0 killed', 1, NOW() - INTERVAL '40 days', true),
('permanent', 'crash_9', 'crashes', 40.7891, -73.9598, 'Bicycle Accident', '1 injured, 0 killed', 1, NOW() - INTERVAL '35 days', true),
('permanent', 'crash_10', 'crashes', 40.7456, -73.9889, 'Multi-Vehicle Crash', '4 injured, 1 killed', 3, NOW() - INTERVAL '50 days', true);

-- Insert 85 more crash records with random Manhattan coordinates
INSERT INTO official_events (external_source, external_id, layer, lat, lng, title, description, severity, started_at, is_active)
SELECT 
  'permanent',
  'crash_' || generate_series,
  'crashes',
  40.7000 + (random() * 0.1200),
  -74.0100 + (random() * 0.0900),
  (ARRAY['Vehicle Collision', 'Pedestrian Accident', 'Bicycle Accident', 'Multi-Vehicle Crash', 'Hit and Run'])[floor(random() * 5 + 1)],
  floor(random() * 5) || ' injured, ' || (CASE WHEN random() > 0.95 THEN '1' ELSE '0' END) || ' killed',
  floor(random() * 3 + 1)::smallint,
  NOW() - (random() * INTERVAL '90 days'),
  true
FROM generate_series(11, 95);

-- Insert crime data (92 records)
INSERT INTO official_events (external_source, external_id, layer, lat, lng, title, description, severity, started_at, is_active)
SELECT 
  'permanent',
  'crime_' || generate_series,
  'crime',
  40.7000 + (random() * 0.1200),
  -74.0100 + (random() * 0.0900),
  (ARRAY['ASSAULT', 'PETIT LARCENY', 'GRAND LARCENY', 'HARASSMENT', 'CRIMINAL MISCHIEF', 'BURGLARY', 'ROBBERY', 'MOTOR VEHICLE THEFT'])[floor(random() * 8 + 1)],
  'Crime reported in area',
  (CASE WHEN random() > 0.7 THEN 3 ELSE 2 END)::smallint,
  NOW() - (random() * INTERVAL '60 days'),
  true
FROM generate_series(1, 92);

-- Insert weather data (98 records)
INSERT INTO official_events (external_source, external_id, layer, lat, lng, title, description, severity, started_at, is_active)
SELECT 
  'permanent',
  'weather_' || generate_series,
  'weather',
  40.7000 + (random() * 0.1200),
  -74.0100 + (random() * 0.0900),
  (ARRAY['Heavy Rain Warning', 'Severe Storm Alert', 'Winter Weather Advisory', 'Flood Watch', 'Dense Fog Advisory', 'Heat Advisory'])[floor(random() * 6 + 1)],
  (ARRAY['Flooding possible', 'High winds expected', 'Icy conditions', 'Flash flooding likely', 'Reduced visibility', 'Extreme heat'])[floor(random() * 6 + 1)],
  floor(random() * 3 + 1)::smallint,
  NOW() - (random() * INTERVAL '7 days'),
  true
FROM generate_series(1, 98);

-- Insert speeding data (90 records)
INSERT INTO official_events (external_source, external_id, layer, lat, lng, title, description, severity, started_at, is_active)
SELECT 
  'permanent',
  'speeding_' || generate_series,
  'speeding',
  40.7000 + (random() * 0.1200),
  -74.0100 + (random() * 0.0900),
  (ARRAY['Speed Camera Zone', 'Frequent Speeding Area', 'School Zone Violations', 'Highway Speed Trap', 'Residential Speeding'])[floor(random() * 5 + 1)],
  'Speeding incidents reported',
  floor(random() * 3 + 1)::smallint,
  NOW() - (random() * INTERVAL '30 days'),
  true
FROM generate_series(1, 90);

-- Insert construction data (100 records)
INSERT INTO official_events (external_source, external_id, layer, lat, lng, title, description, severity, started_at, is_active)
SELECT 
  'permanent',
  'construction_' || generate_series,
  'construction',
  40.7000 + (random() * 0.1200),
  -74.0100 + (random() * 0.0900),
  (ARRAY['Road Construction', 'Lane Closure', 'Utility Work', 'Building Construction', 'Sidewalk Repair', 'Bridge Maintenance'])[floor(random() * 6 + 1)],
  'Construction zone active',
  floor(random() * 2 + 1)::smallint,
  NOW() - (random() * INTERVAL '60 days'),
  true
FROM generate_series(1, 100);
