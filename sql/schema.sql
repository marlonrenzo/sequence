CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(30) NOT NULL,

);

CREATE TABLE scores (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    userID INTEGER NOT NULL,
    score_time INTEGER NOT NULL,
    FOREIGN KEY (userID) REFERENCES users (id)
);


-- STORED PROCEDURES and FUNCTIONS-- 


/*
Shows the top 10 high scores for the game.
Accessed by GET request to /scores
*/
CREATE VIEW get_scores AS
SELECT users.username, scores.score_time
FROM scores JOIN users ON (scores.userID = users.id)
ORDER BY scores.score_time ASC; 


/*
Gets all the scores for a given user.
Accessed by GET request to /scores/:username
*/
DROP PROCEDURE IF EXISTS get_user_scores;
DELIMITER //
CREATE PROCEDURE get_user_scores(IN current_username VARCHAR(30))
BEGIN
    SELECT * FROM scores
    WHERE userID = (SELECT id FROM users WHERE username = current_username)
END//
DELIMITER ;