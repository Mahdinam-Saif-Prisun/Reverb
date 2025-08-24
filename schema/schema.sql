CREATE DATABASE IF NOT EXISTS reverb;
USE reverb;


-- Entities:

CREATE TABLE User (
    User_ID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Email VARCHAR(150) NOT NULL UNIQUE,
    Pass_hash VARCHAR(255) NOT NULL,
    Subscription_type VARCHAR(50),
    Role ENUM('user','admin') DEFAULT 'user'
);

CREATE TABLE Artist (
    Artist_ID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(150) NOT NULL,
    Email VARCHAR(150) UNIQUE NOT NULL,
    Pass_hash VARCHAR(255) NOT NULL,
    Country VARCHAR(100),
    Bio TEXT
);

CREATE TABLE Album (
    Album_ID INT AUTO_INCREMENT PRIMARY KEY,
    Title VARCHAR(200) NOT NULL,
    Release_date DATE,
    Artist_ID INT NOT NULL,
    Genre VARCHAR(100),
    FOREIGN KEY (Artist_ID) REFERENCES Artist(Artist_ID)
);

CREATE TABLE Song (
    Song_ID INT AUTO_INCREMENT PRIMARY KEY,
    Title VARCHAR(200) NOT NULL,
    Release_date DATE,
    Duration INT, -- in seconds
    Producer VARCHAR(150),
    Lyrics TEXT,
    Language VARCHAR(50),
    Album_ID INT,
    Genre VARCHAR(100),
    FOREIGN KEY (Album_ID) REFERENCES Album(Album_ID)
);

CREATE TABLE Playlist (
    Playlist_ID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(150) NOT NULL,
    Parent_playlist INT,
    Owner_UID INT NOT NULL,
    FOREIGN KEY (Parent_playlist) REFERENCES Playlist(Playlist_ID),
    FOREIGN KEY (Owner_UID) REFERENCES User(User_ID)
);

CREATE TABLE Radio_Station (
    Station_ID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(150) NOT NULL,
    Description TEXT,
    Date_Created DATE,
    Genre VARCHAR(100)
);

CREATE TABLE Queue (
    Queue_ID INT AUTO_INCREMENT PRIMARY KEY,
    User_ID INT NOT NULL,
    Incognito BOOLEAN DEFAULT 0,
    FOREIGN KEY (User_ID) REFERENCES User(User_ID)
);

CREATE TABLE History (
    History_ID INT AUTO_INCREMENT PRIMARY KEY,
    User_ID INT NOT NULL UNIQUE,
    FOREIGN KEY (User_ID) REFERENCES User(User_ID)
);


-- Multivalued Attributes

-- Likes
CREATE TABLE Likes (
    User_ID INT NOT NULL,
    Song_ID INT NOT NULL,
    PRIMARY KEY (User_ID, Song_ID),
    FOREIGN KEY (User_ID) REFERENCES User(User_ID),
    FOREIGN KEY (Song_ID) REFERENCES Song(Song_ID)
);


-- Relationships

-- Compose (multiple artists per song)
CREATE TABLE Compose (
    Song_ID INT NOT NULL,
    Artist_ID INT NOT NULL,
    PRIMARY KEY (Song_ID, Artist_ID),
    FOREIGN KEY (Song_ID) REFERENCES Song(Song_ID),
    FOREIGN KEY (Artist_ID) REFERENCES Artist(Artist_ID)
);


CREATE TABLE Rate (
    User_ID INT NOT NULL,
    Song_ID INT NOT NULL,
    Rating INT CHECK (Rating BETWEEN 1 AND 5),
    PRIMARY KEY (User_ID, Song_ID),
    FOREIGN KEY (User_ID) REFERENCES User(User_ID),
    FOREIGN KEY (Song_ID) REFERENCES Song(Song_ID)
);

CREATE TABLE Follow (
    User_ID INT NOT NULL,
    Artist_ID INT NOT NULL,
    PRIMARY KEY (User_ID, Artist_ID),
    FOREIGN KEY (User_ID) REFERENCES User(User_ID),
    FOREIGN KEY (Artist_ID) REFERENCES Artist(Artist_ID)
);


CREATE TABLE Playlist_Compile (
    Playlist_ID INT NOT NULL,
    User_ID INT NOT NULL,
    PRIMARY KEY (Playlist_ID, User_ID),
    FOREIGN KEY (Playlist_ID) REFERENCES Playlist(Playlist_ID),
    FOREIGN KEY (User_ID) REFERENCES User(User_ID)
);

CREATE TABLE Playlist_Contents (
    Playlist_ID INT NOT NULL,
    Song_ID INT NOT NULL,
    Custom_index INT,
    PRIMARY KEY (Playlist_ID, Song_ID),
    FOREIGN KEY (Playlist_ID) REFERENCES Playlist(Playlist_ID),
    FOREIGN KEY (Song_ID) REFERENCES Song(Song_ID)
);

CREATE TABLE Radio_Station_Contents (
    Station_ID INT NOT NULL,
    Song_ID INT NOT NULL,
    PRIMARY KEY (Station_ID, Song_ID),
    FOREIGN KEY (Station_ID) REFERENCES Radio_Station(Station_ID),
    FOREIGN KEY (Song_ID) REFERENCES Song(Song_ID)
);

-- Play (Queue_Contents)
CREATE TABLE Queue_Contents (
    Queue_ID INT NOT NULL,
    Song_ID INT NOT NULL,
    Custom_index INT,
    PRIMARY KEY (Queue_ID, Song_ID),
    FOREIGN KEY (Queue_ID) REFERENCES Queue(Queue_ID),
    FOREIGN KEY (Song_ID) REFERENCES Song(Song_ID)
);

-- Play (History_Contents)
CREATE TABLE History_Contents (
    History_ID INT NOT NULL,
    Song_ID INT NOT NULL,
    Timestamp TIMESTAMP NOT NULL,
    PRIMARY KEY (History_ID, Song_ID, Timestamp),
    FOREIGN KEY (History_ID) REFERENCES History(History_ID),
    FOREIGN KEY (Song_ID) REFERENCES Song(Song_ID)
);
