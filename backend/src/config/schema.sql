-- =============================================
-- RUANG-RASA DATABASE SCHEMA
-- =============================================

CREATE DATABASE IF NOT EXISTS ruang_rasa;
USE ruang_rasa;

-- 1. Users
CREATE TABLE IF NOT EXISTS users (
    User_ID INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    gender ENUM('Laki-laki', 'Perempuan') DEFAULT NULL,
    birth DATE DEFAULT NULL,
    job VARCHAR(100) DEFAULT NULL,
    status VARCHAR(50) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Moods
CREATE TABLE IF NOT EXISTS moods (
    Mood_ID INT PRIMARY KEY AUTO_INCREMENT,
    User_ID INT NOT NULL,
    mood_type VARCHAR(50) NOT NULL,
    note TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (User_ID) REFERENCES users(User_ID) ON DELETE CASCADE,
    INDEX idx_user_mood_date (User_ID, created_at)
);

-- 3. Journals
CREATE TABLE IF NOT EXISTS journals (
    Journal_ID INT PRIMARY KEY AUTO_INCREMENT,
    User_ID INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (User_ID) REFERENCES users(User_ID) ON DELETE CASCADE,
    INDEX idx_user_journal_date (User_ID, created_at)
);

-- 4. Screenings
CREATE TABLE IF NOT EXISTS screenings (
    Screen_ID INT PRIMARY KEY AUTO_INCREMENT,
    User_ID INT NOT NULL,
    category VARCHAR(50) NOT NULL,
    answers JSON NOT NULL,
    score INT NOT NULL,
    risk VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (User_ID) REFERENCES users(User_ID) ON DELETE CASCADE,
    INDEX idx_user_screening_date (User_ID, created_at)
);

-- 5. Chatbot
CREATE TABLE IF NOT EXISTS chatbot (
    Chatbot_ID INT PRIMARY KEY AUTO_INCREMENT,
    User_ID INT NOT NULL,
    Journal_ID INT DEFAULT NULL,
    Mood_ID INT DEFAULT NULL,
    message TEXT NOT NULL,
    response TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (User_ID) REFERENCES users(User_ID) ON DELETE CASCADE,
    FOREIGN KEY (Journal_ID) REFERENCES journals(Journal_ID) ON DELETE SET NULL,
    FOREIGN KEY (Mood_ID) REFERENCES moods(Mood_ID) ON DELETE SET NULL,
    INDEX idx_user_chat_date (User_ID, created_at)
);

-- 6. Recommendations
CREATE TABLE IF NOT EXISTS recommendations (
    Rec_ID INT PRIMARY KEY AUTO_INCREMENT,
    User_ID INT NOT NULL,
    Screen_ID INT NOT NULL,
    Rec_type VARCHAR(50) NOT NULL,
    Activities TEXT DEFAULT NULL,
    Affirmations TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (User_ID) REFERENCES users(User_ID) ON DELETE CASCADE,
    FOREIGN KEY (Screen_ID) REFERENCES screenings(Screen_ID) ON DELETE CASCADE
);
