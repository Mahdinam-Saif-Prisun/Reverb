USE reverb;

-- Users
INSERT INTO User (Name, Email, Pass_hash, Subscription_type, Role) VALUES
('Admin', 'admin@reverb.com', 'admin', 'Premium', 'admin'),
('Alice', 'alice@example.com', 'pass123', 'Free', 'user'),
('Bob', 'bob@example.com', 'pass123', 'Free', 'user'),
('Carol', 'carol@example.com', 'pass123', 'Premium', 'user'),
('David', 'david@example.com', 'pass123', 'Free', 'user');

-- Artists
INSERT INTO Artist (Name, Country, Bio) VALUES
('Artist A', 'USA', 'Bio A'),
('Artist B', 'UK', 'Bio B'),
('Artist C', 'Canada', 'Bio C'),
('Artist D', 'Germany', 'Bio D'),
('Artist E', 'France', 'Bio E');

-- Albums
INSERT INTO Album (Title, Release_date, Artist_ID, Genre) VALUES
('Album 1', '2022-01-01', 1, 'Pop'),
('Album 2', '2022-02-01', 2, 'Rock'),
('Album 3', '2022-03-01', 3, 'Jazz'),
('Album 4', '2022-04-01', 4, 'Electronic'),
('Album 5', '2022-05-01', 5, 'Acoustic');

-- Songs (50 total)
INSERT INTO Song (Title, Release_date, Duration, Producer, Lyrics, Language, Album_ID, Genre) VALUES
('Song 1', '2022-01-01', 210, 'Producer 1', 'Lyrics 1', 'English', 1, 'Pop'),
('Song 2', '2022-01-02', 200, 'Producer 2', 'Lyrics 2', 'English', 1, 'Pop'),
('Song 3', '2022-01-03', 180, 'Producer 3', 'Lyrics 3', 'English', 1, 'Pop'),
('Song 4', '2022-01-04', 220, 'Producer 4', 'Lyrics 4', 'English', 2, 'Rock'),
('Song 5', '2022-01-05', 205, 'Producer 5', 'Lyrics 5', 'English', 2, 'Rock'),
('Song 6', '2022-01-06', 190, 'Producer 1', 'Lyrics 6', 'English', 2, 'Rock'),
('Song 7', '2022-01-07', 210, 'Producer 2', 'Lyrics 7', 'English', 3, 'Jazz'),
('Song 8', '2022-01-08', 200, 'Producer 3', 'Lyrics 8', 'English', 3, 'Jazz'),
('Song 9', '2022-01-09', 215, 'Producer 4', 'Lyrics 9', 'English', 3, 'Jazz'),
('Song 10', '2022-01-10', 225, 'Producer 5', 'Lyrics 10', 'English', 3, 'Jazz'),
('Song 11', '2022-01-11', 210, 'Producer 1', 'Lyrics 11', 'English', 4, 'Electronic'),
('Song 12', '2022-01-12', 200, 'Producer 2', 'Lyrics 12', 'English', 4, 'Electronic'),
('Song 13', '2022-01-13', 195, 'Producer 3', 'Lyrics 13', 'English', 4, 'Electronic'),
('Song 14', '2022-01-14', 220, 'Producer 4', 'Lyrics 14', 'English', 4, 'Electronic'),
('Song 15', '2022-01-15', 210, 'Producer 5', 'Lyrics 15', 'English', 4, 'Electronic'),
('Song 16', '2022-01-16', 200, 'Producer 1', 'Lyrics 16', 'English', 5, 'Acoustic'),
('Song 17', '2022-01-17', 205, 'Producer 2', 'Lyrics 17', 'English', 5, 'Acoustic'),
('Song 18', '2022-01-18', 215, 'Producer 3', 'Lyrics 18', 'English', 5, 'Acoustic'),
('Song 19', '2022-01-19', 225, 'Producer 4', 'Lyrics 19', 'English', 5, 'Acoustic'),
('Song 20', '2022-01-20', 230, 'Producer 5', 'Lyrics 20', 'English', 5, 'Acoustic'),
('Song 21', '2022-02-01', 210, 'Producer 1', 'Lyrics 21', 'English', 1, 'Pop'),
('Song 22', '2022-02-02', 200, 'Producer 2', 'Lyrics 22', 'English', 1, 'Pop'),
('Song 23', '2022-02-03', 180, 'Producer 3', 'Lyrics 23', 'English', 1, 'Pop'),
('Song 24', '2022-02-04', 220, 'Producer 4', 'Lyrics 24', 'English', 2, 'Rock'),
('Song 25', '2022-02-05', 205, 'Producer 5', 'Lyrics 25', 'English', 2, 'Rock'),
('Song 26', '2022-02-06', 190, 'Producer 1', 'Lyrics 26', 'English', 2, 'Rock'),
('Song 27', '2022-02-07', 210, 'Producer 2', 'Lyrics 27', 'English', 3, 'Jazz'),
('Song 28', '2022-02-08', 200, 'Producer 3', 'Lyrics 28', 'English', 3, 'Jazz'),
('Song 29', '2022-02-09', 215, 'Producer 4', 'Lyrics 29', 'English', 3, 'Jazz'),
('Song 30', '2022-02-10', 225, 'Producer 5', 'Lyrics 30', 'English', 3, 'Jazz'),
('Song 31', '2022-02-11', 210, 'Producer 1', 'Lyrics 31', 'English', 4, 'Electronic'),
('Song 32', '2022-02-12', 200, 'Producer 2', 'Lyrics 32', 'English', 4, 'Electronic'),
('Song 33', '2022-02-13', 195, 'Producer 3', 'Lyrics 33', 'English', 4, 'Electronic'),
('Song 34', '2022-02-14', 220, 'Producer 4', 'Lyrics 34', 'English', 4, 'Electronic'),
('Song 35', '2022-02-15', 210, 'Producer 5', 'Lyrics 35', 'English', 4, 'Electronic'),
('Song 36', '2022-02-16', 200, 'Producer 1', 'Lyrics 36', 'English', 5, 'Acoustic'),
('Song 37', '2022-02-17', 205, 'Producer 2', 'Lyrics 37', 'English', 5, 'Acoustic'),
('Song 38', '2022-02-18', 215, 'Producer 3', 'Lyrics 38', 'English', 5, 'Acoustic'),
('Song 39', '2022-02-19', 225, 'Producer 4', 'Lyrics 39', 'English', 5, 'Acoustic'),
('Song 40', '2022-02-20', 230, 'Producer 5', 'Lyrics 40', 'English', 5, 'Acoustic'),
('Song 41', '2022-03-01', 210, 'Producer 1', 'Lyrics 41', 'English', 1, 'Pop'),
('Song 42', '2022-03-02', 200, 'Producer 2', 'Lyrics 42', 'English', 1, 'Pop'),
('Song 43', '2022-03-03', 180, 'Producer 3', 'Lyrics 43', 'English', 2, 'Rock'),
('Song 44', '2022-03-04', 220, 'Producer 4', 'Lyrics 44', 'English', 2, 'Rock'),
('Song 45', '2022-03-05', 205, 'Producer 5', 'Lyrics 45', 'English', 3, 'Jazz'),
('Song 46', '2022-03-06', 190, 'Producer 1', 'Lyrics 46', 'English', 3, 'Jazz'),
('Song 47', '2022-03-07', 210, 'Producer 2', 'Lyrics 47', 'English', 4, 'Electronic'),
('Song 48', '2022-03-08', 200, 'Producer 3', 'Lyrics 48', 'English', 4, 'Electronic'),
('Song 49', '2022-03-09', 215, 'Producer 4', 'Lyrics 49', 'English', 5, 'Acoustic'),
('Song 50', '2022-03-10', 225, 'Producer 5', 'Lyrics 50', 'English', 5, 'Acoustic');

-- Playlists
INSERT INTO Playlist (Name, Owner_UID) VALUES
('Alice Playlist', 2),
('Bob Playlist', 3),
('Carol Playlist', 4),
('David Playlist', 5),
('Admin Playlist', 1);

-- Radio Stations (genre based, 10 songs max per station)
INSERT INTO Radio_Station (Name, Genre, Date_Created) VALUES
('Pop Station', 'Pop', '2022-01-01'),
('Rock Station', 'Rock', '2022-01-02'),
('Jazz Station', 'Jazz', '2022-01-03'),
('Electronic Station', 'Electronic', '2022-01-04'),
('Acoustic Station', 'Acoustic', '2022-01-05');

-- Add songs to Radio_Station_Contents (10 per station)
INSERT INTO Radio_Station_Contents (Station_ID, Song_ID) VALUES
(1,1),(1,2),(1,3),(1,21),(1,22),(1,41),(1,42),(1,11),(1,15),(1,35),
(2,4),(2,5),(2,6),(2,24),(2,25),(2,43),(2,44),(2,14),(2,34),(2,33),
(3,7),(3,8),(3,9),(3,10),(3,27),(3,28),(3,29),(3,30),(3,45),(3,46),
(4,11),(4,12),(4,13),(4,14),(4,15),(4,31),(4,32),(4,33),(4,34),(4,47),
(5,16),(5,17),(5,18),(5,19),(5,20),(5,36),(5,37),(5,38),(5,39),(5,50);


-- --------------------------
-- Likes (Users liking songs)
-- --------------------------
INSERT INTO Likes (User_ID, Song_ID) VALUES
(2,1),(2,5),(2,10),(3,3),(3,7),(3,12),
(4,2),(4,6),(4,15),(5,4),(5,8),(5,20),
(1,1),(1,25),(1,30); -- Admin likes a few songs

-- --------------------------
-- Compose (Song-Artist relations)
-- --------------------------
INSERT INTO Compose (Song_ID, Artist_ID) VALUES
(1,1),(2,1),(3,1),(4,2),(5,2),(6,2),
(7,3),(8,3),(9,3),(10,3),(11,4),(12,4),
(13,4),(14,4),(15,4),(16,5),(17,5),(18,5),
(19,5),(20,5),(21,1),(22,1),(23,1),(24,2),
(25,2),(26,2),(27,3),(28,3),(29,3),(30,3),
(31,4),(32,4),(33,4),(34,4),(35,4),(36,5),
(37,5),(38,5),(39,5),(40,5),(41,1),(42,1),
(43,2),(44,2),(45,3),(46,3),(47,4),(48,4),
(49,5),(50,5);

-- --------------------------
-- Playlist_Contents (1 playlist each)
-- --------------------------
INSERT INTO Playlist_Contents (Playlist_ID, Song_ID, Custom_index) VALUES
(1,1,1),(1,2,2),(1,3,3),(2,4,1),(2,5,2),(2,6,3),
(3,7,1),(3,8,2),(3,9,3),(4,10,1),(4,11,2),(4,12,3),
(5,13,1),(5,14,2),(5,15,3);

-- --------------------------
-- Queue (1 queue per user)
-- --------------------------
INSERT INTO Queue (User_ID, Incognito) VALUES
(2,0),(3,0),(4,0),(5,0),(1,0);

-- --------------------------
-- Queue_Contents (enqueue some songs)
-- --------------------------
INSERT INTO Queue_Contents (Queue_ID, Song_ID, Custom_index) VALUES
(1,1,1),(1,2,2),(1,3,3),
(2,4,1),(2,5,2),(2,6,3),
(3,7,1),(3,8,2),(3,9,3),
(4,10,1),(4,11,2),(4,12,3),
(5,13,1),(5,14,2),(5,15,3);

-- --------------------------
-- History (1 per user)
-- --------------------------
INSERT INTO History (User_ID) VALUES
(2),(3),(4),(5),(1);

-- --------------------------
-- History_Contents (user listening history)
-- --------------------------
INSERT INTO History_Contents (History_ID, Song_ID, Timestamp) VALUES
(1,1,'2025-08-22 08:00:00'),
(1,2,'2025-08-22 08:05:00'),
(2,4,'2025-08-22 09:00:00'),
(2,5,'2025-08-22 09:03:00'),
(3,7,'2025-08-22 10:00:00'),
(3,8,'2025-08-22 10:07:00'),
(4,10,'2025-08-22 11:00:00'),
(4,11,'2025-08-22 11:05:00'),
(5,13,'2025-08-22 12:00:00'),
(5,14,'2025-08-22 12:10:00');

-- --------------------------
-- Rate (users rating songs)
-- --------------------------
INSERT INTO Rate (User_ID, Song_ID, Rating) VALUES
(2,1,5),(2,2,4),(3,4,3),(3,5,5),(4,7,4),(5,10,5),(1,25,5);

-- --------------------------
-- Follow (users following artists)
-- --------------------------
INSERT INTO Follow (User_ID, Artist_ID) VALUES
(2,1),(2,2),(3,2),(3,3),(4,3),(4,4),(5,4),(5,5),(1,1),(1,5);


