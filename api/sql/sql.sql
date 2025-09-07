CREATE DATABASE IF NOT EXISTS devbook;

USE devbook;

DROP TABLE IF EXISTS users;

CREATE TABLE users(
    id int AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    nick VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP()
) ENGINE=INNODB;

DROP TABLE IF EXISTS followers;

CREATE TABLE followers(
    user_id int NOT NULL,
    FOREIGN KEY (user_id) 
    REFERENCES users(id) 
    ON DELETE CASCADE,

    follower_id int NOT NULL,
    FOREIGN KEY (user_id) 
    REFERENCES users(id) 
    ON DELETE CASCADE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),

    PRIMARY KEY(user_id, follower_id)
) ENGINE=INNODB; 