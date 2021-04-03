CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(30) NOT NULL,
    pswrd VARCHAR(30)
);

CREATE TABLE scores (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    userID INTEGER NOT NULL,
    score_time INTEGER NOT NULL,
    FOREIGN KEY (userID) REFERENCES users (id)
);


-- PROCEDURES, FUNCTIONS and Queries-- 


/*
Shows the top 10 high scores for the game.
Accessed by GET request to /scores
*/
CREATE VIEW get_scores AS
SELECT users.username AS user, scores.score_time AS score
FROM scores JOIN users ON (scores.userID = users.id)
ORDER BY scores.score_time ASC LIMIT 10; 


/*
Gets all the scores for a given user.
Accessed by GET request to /scores/:username
*/
DROP PROCEDURE IF EXISTS get_user_scores;
DELIMITER //
CREATE PROCEDURE get_user_scores(IN current_username VARCHAR(30))
BEGIN
    SELECT * FROM scores
    WHERE userID = (SELECT id FROM users WHERE username = current_username);
END//
DELIMITER ;


/*
Gets a list of users.
Accessed by GET request to /users
*/
SELECT username FROM users; 


/*
Inserts a new score into the database
Accessed by PUT request to /scores
*/
DROP PROCEDURE IF EXISTS add_score;
DELIMITER //
CREATE PROCEDURE add_score(IN current_username VARCHAR(30), IN new_score INTEGER)
BEGIN
    INSERT INTO scores(userID, score_time)
    VALUES ((SELECT id FROM users WHERE username = current_username), new_score);
    SELECT ROW_COUNT();
END//
DELIMITER ;


/*
Inserts a new user into the database
Accessed by PUT request to /users
*/
DROP PROCEDURE IF EXISTS add_user;
DELIMITER //
CREATE PROCEDURE add_user(IN new_username VARCHAR(30));
BEGIN
    INSERT INTO users (username) VALUES (new_username);
    SELECT ROW_COUNT();
END//
DELIMITER ;


/*
Check existence in database then login
Accessed by POST request to /users
*/
DROP FUNCTION IF EXISTS user_exists;
DELIMITER //
CREATE FUNCTION user_exists(input_name VARCHAR(30)) 
RETURNS INT READS SQL DATA
BEGIN
    RETURN (
      SELECT 1
      FROM users
      WHERE username = input_name
    );
END //
DELIMITER ;


/*
Change the name of a user
Accessed by POST request to users/change/
*/
DROP PROCEDURE IF EXISTS change_name;
DELIMITER //
CREATE PROCEDURE change_name(IN old_username VARCHAR(30), IN new_username VARCHAR(30));
BEGIN
    UPDATE users
    SET username = new_username
    WHERE username = old_username;
    SELECT ROW_COUNT();
END//
DELIMITER ;


/*
Authenticate credentials
Accessed by POST request to /users
*/
DROP FUNCTION IF EXISTS authenticate;
DELIMITER //
CREATE FUNCTION authenticate(input_name VARCHAR(30), passwrd VARCHAR(30)) 
RETURNS INT READS SQL DATA
BEGIN
    RETURN (
      SELECT 1
      FROM users
      WHERE username = input_name AND pswrd = passwrd
    );
END //
DELIMITER ;


/*
Deletes a user from the database
Accessed by DELETE request to /users
*/
DROP PROCEDURE IF EXISTS delete_user;
DELIMITER //
CREATE PROCEDURE delete_user(IN input_name VARCHAR(30));
BEGIN
    DELETE FROM users WHERE username = input_name;
    SELECT ROW_COUNT();
END//
DELIMITER ;



/*
Deletes a score from the database
Accessed by DELETE request to /scores
*/
DROP PROCEDURE IF EXISTS delete_score;
DELIMITER //
CREATE PROCEDURE delete_score(IN score_id VARCHAR(30));
BEGIN
    DELETE FROM scores WHERE id = score_id;
    SELECT ROW_COUNT();
END//
DELIMITER ;
