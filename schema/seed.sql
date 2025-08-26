USE reverb;

-- Users
INSERT INTO User (Name, Email, Pass_hash, Subscription_type, Role) VALUES
('Admin', 'admin@example.com', 'admin', 'Premium', 'admin'),
('User 1', 'user1@example.com', 'hash1', 'Free', 'user'),
('User 2', 'user2@example.com', 'hash2', 'Premium', 'user'),
('User 3', 'user3@example.com', 'hash3', 'Free', 'user');

-- Artists
INSERT INTO Artist (Name, Email, Pass_hash, Country, Bio) VALUES
('Artist A', 'artistA@example.com', 'passA', 'USA', 'Bio A'),
('Artist B', 'artistB@example.com', 'passB', 'UK', 'Bio B'),
('Artist C', 'artistC@example.com', 'passC', 'Canada', 'Bio C'),
('Artist D', 'artistD@example.com', 'passD', 'Germany', 'Bio D'),
('Artist E', 'artistE@example.com', 'passE', 'France', 'Bio E');

-- Albums
INSERT INTO Album (Title, Release_date, Artist_ID, Genre) VALUES
('Album 1', '2021-01-01', 1, 'Pop'),
('Album 2', '2021-03-15', 2, 'Rock'),
('Album 3', '2022-07-10', 3, 'Jazz'),
('Album 4', '2020-11-22', 4, 'Hip-Hop'),
('Album 5', '2019-05-05', 5, 'Classical');

-- Songs (50 unique)
INSERT INTO Song (Title, Release_date, Duration, Producer, Lyrics, Language, Album_ID, Genre) VALUES
('Song 1', '2021-01-01', 210, 'Producer 1', 'Lyrics 1', 'English', 1, 'Pop'),
('Song 2', '2021-01-02', 200, 'Producer 2', 'Lyrics 2', 'English', 1, 'Pop'),
('Song 3', '2021-01-03', 190, 'Producer 3', 'Lyrics 3', 'English', 1, 'Pop'),
('Song 4', '2021-01-04', 220, 'Producer 4', 'Lyrics 4', 'English', 2, 'Rock'),
('Song 5', '2021-01-05', 230, 'Producer 5', 'Lyrics 5', 'English', 2, 'Rock'),
('Song 6', '2021-01-06', 240, 'Producer 6', 'Lyrics 6', 'English', 2, 'Rock'),
('Song 7', '2021-01-07', 250, 'Producer 7', 'Lyrics 7', 'English', 2, 'Rock'),
('Song 8', '2021-01-08', 180, 'Producer 8', 'Lyrics 8', 'English', 3, 'Jazz'),
('Song 9', '2021-01-09', 195, 'Producer 9', 'Lyrics 9', 'English', 3, 'Jazz'),
('Song 10', '2021-01-10', 205, 'Producer 10', 'Lyrics 10', 'English', 3, 'Jazz'),
('Song 11', '2021-01-11', 215, 'Producer 11', 'Lyrics 11', 'English', 3, 'Jazz'),
('Song 12', '2021-01-12', 225, 'Producer 12', 'Lyrics 12', 'English', 4, 'Hip-Hop'),
('Song 13', '2021-01-13', 235, 'Producer 13', 'Lyrics 13', 'English', 4, 'Hip-Hop'),
('Song 14', '2021-01-14', 245, 'Producer 14', 'Lyrics 14', 'English', 4, 'Hip-Hop'),
('Song 15', '2021-01-15', 255, 'Producer 15', 'Lyrics 15', 'English', 4, 'Hip-Hop'),
('Song 16', '2021-01-16', 205, 'Producer 16', 'Lyrics 16', 'English', 4, 'Hip-Hop'),
('Song 17', '2021-01-17', 215, 'Producer 17', 'Lyrics 17', 'English', 5, 'Classical'),
('Song 18', '2021-01-18', 225, 'Producer 18', 'Lyrics 18', 'English', 5, 'Classical'),
('Song 19', '2021-01-19', 235, 'Producer 19', 'Lyrics 19', 'English', 5, 'Classical'),
('Song 20', '2021-01-20', 245, 'Producer 20', 'Lyrics 20', 'English', 5, 'Classical'),
('Song 21', '2021-01-21', 180, 'Producer 21', 'Lyrics 21', 'English', 1, 'Pop'),
('Song 22', '2021-01-22', 190, 'Producer 22', 'Lyrics 22', 'English', 1, 'Pop'),
('Song 23', '2021-01-23', 200, 'Producer 23', 'Lyrics 23', 'English', 1, 'Pop'),
('Song 24', '2021-01-24', 210, 'Producer 24', 'Lyrics 24', 'English', 2, 'Rock'),
('Song 25', '2021-01-25', 220, 'Producer 25', 'Lyrics 25', 'English', 2, 'Rock'),
('Song 26', '2021-01-26', 230, 'Producer 26', 'Lyrics 26', 'English', 2, 'Rock'),
('Song 27', '2021-01-27', 240, 'Producer 27', 'Lyrics 27', 'English', 3, 'Jazz'),
('Song 28', '2021-01-28', 250, 'Producer 28', 'Lyrics 28', 'English', 3, 'Jazz'),
('Song 29', '2021-01-29', 260, 'Producer 29', 'Lyrics 29', 'English', 3, 'Jazz'),
('Song 30', '2021-01-30', 270, 'Producer 30', 'Lyrics 30', 'English', 4, 'Hip-Hop'),
('Song 31', '2021-02-01', 280, 'Producer 31', 'Lyrics 31', 'English', 4, 'Hip-Hop'),
('Song 32', '2021-02-02', 290, 'Producer 32', 'Lyrics 32', 'English', 4, 'Hip-Hop'),
('Song 33', '2021-02-03', 200, 'Producer 33', 'Lyrics 33', 'English', 5, 'Classical'),
('Song 34', '2021-02-04', 210, 'Producer 34', 'Lyrics 34', 'English', 5, 'Classical'),
('Song 35', '2021-02-05', 220, 'Producer 35', 'Lyrics 35', 'English', 5, 'Classical'),
('Song 36', '2021-02-06', 230, 'Producer 36', 'Lyrics 36', 'English', 1, 'Pop'),
('Song 37', '2021-02-07', 240, 'Producer 37', 'Lyrics 37', 'English', 1, 'Pop'),
('Song 38', '2021-02-08', 250, 'Producer 38', 'Lyrics 38', 'English', 2, 'Rock'),
('Song 39', '2021-02-09', 260, 'Producer 39', 'Lyrics 39', 'English', 2, 'Rock'),
('Song 40', '2021-02-10', 270, 'Producer 40', 'Lyrics 40', 'English', 3, 'Jazz'),
('Song 41', '2021-02-11', 280, 'Producer 41', 'Lyrics 41', 'English', 3, 'Jazz'),
('Song 42', '2021-02-12', 290, 'Producer 42', 'Lyrics 42', 'English', 4, 'Hip-Hop'),
('Song 43', '2021-02-13', 200, 'Producer 43', 'Lyrics 43', 'English', 4, 'Hip-Hop'),
('Song 44', '2021-02-14', 210, 'Producer 44', 'Lyrics 44', 'English', 5, 'Classical'),
('Song 45', '2021-02-15', 220, 'Producer 45', 'Lyrics 45', 'English', 5, 'Classical'),
('Song 46', '2021-02-16', 230, 'Producer 46', 'Lyrics 46', 'English', 1, 'Pop'),
('Song 47', '2021-02-17', 240, 'Producer 47', 'Lyrics 47', 'English', 2, 'Rock'),
('Song 48', '2021-02-18', 250, 'Producer 48', 'Lyrics 48', 'English', 3, 'Jazz'),
('Song 49', '2021-02-19', 260, 'Producer 49', 'Lyrics 49', 'English', 4, 'Hip-Hop'),
('Song 50', '2021-02-20', 270, 'Producer 50', 'Lyrics 50', 'English', 5, 'Classical');

-- Likes
INSERT INTO Likes (User_ID, Song_ID) VALUES
(1,1),(1,2),(1,3),(2,4),(2,5),(3,6),(3,7),(3,8);

-- Follow
INSERT INTO Follow (User_ID, Artist_ID) VALUES
(1,1),(1,2),(2,3),(3,4),(2,5);

-- Playlist
INSERT INTO Playlist (Name, Parent_playlist, Owner_UID) VALUES
('Chill Vibes', NULL, 1),
('Workout Mix', NULL, 2);

-- Playlist Compile
INSERT INTO Playlist_Compile (Playlist_ID, User_ID) VALUES
(1,1),(2,2);

-- Playlist Contents
INSERT INTO Playlist_Contents (Playlist_ID, Song_ID, Custom_index) VALUES
(1,1,1),(1,2,2),(1,3,3),(2,4,1),(2,5,2);

-- Radio Station
INSERT INTO Radio_Station (Name, Description, Date_Created, Genre) VALUES
('Top Hits', 'The latest chartbusters', '2025-01-01', 'Pop'),
('Rock Legends', 'Classic rock hits', '2025-01-01', 'Rock');

-- Radio Station Contents
INSERT INTO Radio_Station_Contents (Station_ID, Song_ID) VALUES
(1,1),(1,2),(1,3),(2,4),(2,5);

-- Queue
INSERT INTO Queue (User_ID, Incognito) VALUES
(1,0),(2,0);

-- Queue Contents
INSERT INTO Queue_Contents (Queue_ID, Song_ID, Custom_index) VALUES
(1,1,1),(1,2,2),(2,3,1),(2,4,2);

-- History
INSERT INTO History (User_ID) VALUES
(1),(2);

-- History Contents
INSERT INTO History_Contents (History_ID, Song_ID, Timestamp) VALUES
(1,1,'2025-08-01 10:00:00'),
(1,2,'2025-08-01 10:05:00'),
(2,3,'2025-08-02 12:00:00');
