CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(30) NOT NULL,
    pswrd VARCHAR(30)
);

CREATE TABLE scores (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    userID INTEGER NOT NULL,
    score_time DECIMAL(10, 2) NOT NULL,
    game_mode INTEGER NOT NULL DEFAULT 1,
    FOREIGN KEY (userID) REFERENCES users (id),
    FOREIGN KEY (game_mode) REFERENCES game_modes(id)
);

CREATE TABLE stats (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    end_point VARCHAR(30) NOT NULL,
    method VARCHAR(6) NOT NULL,
    total_requests INTEGER NOT NULL
);

CREATE TABLE game_modes (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    mode VARCHAR(30) NOT NULL
)


-- PROCEDURES, FUNCTIONS and Queries-- 


/*
Shows the top 10 high scores for the game.
Accessed by GET request to /scores
*/
CREATE VIEW get_scores AS
SELECT scores.id AS id, users.username AS user, min(scores.score_time) AS score 
FROM scores JOIN users ON (scores.userID = users.id) 
GROUP BY users.username 
ORDER BY score;


/*
Gets the high score for a given user along with the current placing on the leaderboard.
Accessed by GET request to /scores/:username
*/
DROP PROCEDURE IF EXISTS get_user_scores;
DELIMITER //
CREATE PROCEDURE get_user_scores(IN current_username VARCHAR(30), IN g_mode VARCHAR(30))
BEGIN
    DECLARE game_mode_id INTEGER;
    SELECT get_game_mode_id(g_mode) INTO game_mode_id;
    SELECT get_high_score(current_username) AS score, 
    (
        SELECT COUNT(*) + 1 FROM get_scores
        WHERE score < (SELECT get_high_score(current_username))
        AND game_mode = game_mode_id
    ) AS place, username AS user
    FROM users WHERE username = current_username;
END//
DELIMITER ;


/*
Gets the high score for a given user along with the current placing on the leaderboard.
Accessed by GET request to /scores/:username

CALL get_user_score_placing('marlon');
*/
DROP PROCEDURE IF EXISTS get_user_score_placing;
DELIMITER //
CREATE PROCEDURE get_user_score_placing(IN current_username VARCHAR(30))
BEGIN
    SELECT get_high_score_game_mode(current_username, game_modes.mode) AS score, game_modes.mode, (CASE 
        WHEN game_modes.id <= 3 THEN (
            SELECT COUNT(*) + 1 FROM scores
            WHERE score_time < (SELECT get_high_score_game_mode(current_username, game_modes.mode))
            AND game_mode = game_modes.id
        ) 
        ELSE (
            SELECT COUNT(*) + 1 FROM scores
            WHERE score_time > (SELECT get_high_score_game_mode(current_username, game_modes.mode))
            AND game_mode = game_modes.id
        ) 
    END) AS place
    FROM game_modes;
END//
DELIMITER ;

/*
********TODO*********
Gets the high score for each game mode
Accessed by GET request to /scores/:username
*/
DROP PROCEDURE IF EXISTS get_all_high_scores;
DELIMITER //
CREATE PROCEDURE get_all_high_scores()
BEGIN
    SELECT scores.score_time, scores.userID, game_modes.id, CASE
        WHEN game_modes.id <= 3 THEN (SELECT scores.id, MIN(scores.score_time) FROM scores GROUP BY scores.id)
        ELSE (SELECT scores.id, MAX(scores.score_time) FROM scores GROUP BY scores.id)
        END AS high_score
    FROM game_modes JOIN scores ON game_modes.id = scores.game_mode
    GROUP BY scores.id;
END//
DELIMITER ;

/*
Gets the high score for a given user.
*/
DROP FUNCTION IF EXISTS get_high_score;
DELIMITER //
CREATE FUNCTION get_high_score(current_username VARCHAR(30)) 
RETURNS DECIMAL(10,2) READS SQL DATA
BEGIN
    RETURN (
      SELECT MIN(score_time)
      FROM scores
      WHERE userID = (SELECT id FROM users WHERE username = current_username)
    );
END //
DELIMITER ;


/*
Gets the high score for a given user based on game mode.

SELECT get_high_score_game_mode('marlon', 'classic60'); 23.4
SELECT get_high_score_game_mode('marlon', 'timed15');   25
SELECT get_high_score_game_mode('marlon', 'timed45');   55

SELECT CASE
WHEN (SELECT get_high_score_game_mode('marlon', 'classic60')) IS NOT NULL THEN 'exists'
ELSE 'Doesnt exist'
END AS test;

*/
DROP FUNCTION IF EXISTS get_high_score_game_mode;
DELIMITER //
CREATE FUNCTION get_high_score_game_mode(current_username VARCHAR(30), g_mode VARCHAR(30)) 
RETURNS DECIMAL(10,2) READS SQL DATA
BEGIN
    DECLARE game_mode_id INTEGER;
    SELECT get_game_mode_id(g_mode) INTO game_mode_id;
    RETURN (
      SELECT CASE 
        WHEN game_mode_id <= 3 THEN MIN(score_time)
        ELSE MAX(score_time)
        END AS high_score
      FROM scores
      WHERE userID = (SELECT id FROM users WHERE username = current_username)
      AND game_mode = game_mode_id
    );
END //
DELIMITER ;


/*
Gets the high score id for a given user.
*/
DROP FUNCTION IF EXISTS get_high_score_id;
DELIMITER //
CREATE FUNCTION get_high_score_id(current_username VARCHAR(30)) 
RETURNS INTEGER READS SQL DATA
BEGIN
    RETURN (
      SELECT id 
      FROM scores 
      WHERE userID = (SELECT id FROM users WHERE username = current_username)
      ORDER BY score_time limit 1
    );
END //
DELIMITER ;


/*
Gets the game mode id based on its correlating name.
*/
DROP FUNCTION IF EXISTS get_game_mode_id;
DELIMITER //
CREATE FUNCTION get_game_mode_id(g_mode VARCHAR(30)) 
RETURNS INTEGER READS SQL DATA
BEGIN
    RETURN (
      SELECT id 
      FROM game_modes 
      WHERE mode = g_mode
    );
END //
DELIMITER ;


/*
Gets a list of users.
Accessed by GET request to /users
*/
SELECT username FROM users; 


/*
Inserts a new score into the database
Accessed by PUT request to /scores

CALL add_score_with_gamemode('marlon', 23.4, 'classic60');
CALL add_score_with_gamemode('marlon', 34.5, 'classic60');
CALL add_score_with_gamemode('marlon', 15, 'timed15');
CALL add_score_with_gamemode('marlon', 25, 'timed15');
CALL add_score_with_gamemode('marlon', 45, 'timed45');
CALL add_score_with_gamemode('marlon', 55, 'timed45');
*/
DROP PROCEDURE IF EXISTS add_score;
DELIMITER //
CREATE PROCEDURE add_score(IN current_username VARCHAR(30), IN new_score DECIMAL(10,2), IN g_mode VARCHAR(30))
BEGIN
    DECLARE game_mode_id INTEGER;
    SELECT get_game_mode_id(g_mode) INTO game_mode_id;
    INSERT INTO scores(userID, score_time, game_mode)
    VALUES ((SELECT id FROM users WHERE username = current_username), new_score, game_mode_id);
    SELECT ROW_COUNT();
END//
DELIMITER ;


/*
***IN PROGRESS***
Inserts a new score if it beats a user's current high score based on game mode
Accessed by PUT request to /scores
*/
DROP PROCEDURE IF EXISTS add_score_with_gamemode;
DELIMITER //
CREATE PROCEDURE add_score_with_gamemode(IN current_username VARCHAR(30), IN new_score DECIMAL(10,2), IN g_mode VARCHAR(30))
BEGIN
    DECLARE g_mode_id INTEGER;
    SELECT get_game_mode_id(g_mode) INTO g_mode_id;
    INSERT INTO scores(userID, score_time, game_mode)
    VALUES ((SELECT id FROM users WHERE username = current_username), new_score, g_mode_id);
    SELECT ROW_COUNT();
END//
DELIMITER ;


/*
***IN PROGRESS***
Inserts a new score if it beats a user's current high score based on game mode
Accessed by PUT request to /scores
*/
DROP PROCEDURE IF EXISTS add_score_with_gamemode;
DELIMITER //
CREATE PROCEDURE add_score_with_gamemode(IN current_username VARCHAR(30), IN new_score DECIMAL(10,2), IN g_mode VARCHAR(30))
BEGIN
    DECLARE current_score DECIMAL(10,2);
    DECLARE old_score INTEGER;
    DECLARE g_mode_id INTEGER;
    SELECT get_high_score(current_username) INTO current_score;
    SELECT get_game_mode_id(g_mode) INTO g_mode_id;
    IF ((g_mode_id <= 3 AND new_score < old_score) OR (g_mode_id > 3 AND new_score > old_score)) THEN
        SELECT get_high_score_id(current_username) INTO old_score;
        DELETE FROM scores WHERE id = old_score;
        INSERT INTO scores(userID, score_time, game_mode)
        VALUES ((SELECT id FROM users WHERE username = current_username), new_score, g_mode_id);
        SELECT ROW_COUNT();
    END IF;
END//
DELIMITER ;


/*
Inserts a new user into the database
Accessed by PUT request to /users
*/
DROP PROCEDURE IF EXISTS add_user;
DELIMITER //
CREATE PROCEDURE add_user(IN new_username VARCHAR(30))
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
CREATE PROCEDURE change_name(IN old_username VARCHAR(30), IN new_username VARCHAR(30))
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
      SELECT 1 FROM `users`
      WHERE username = input_name AND pswrd = AES_ENCRYPT(passwrd, UNHEX(SHA2('BCIT CST',512)))
    );
END //
DELIMITER ;


/*
UPDATE users
SET pswrd = AES_ENCRYPT('comp4537', UNHEX(SHA2('BCIT CST',512)))
WHERE username = 'admin';
*/


/*
Deletes a user from the database
Accessed by DELETE request to /users
*/
DROP PROCEDURE IF EXISTS delete_user;
DELIMITER //
CREATE PROCEDURE delete_user(IN input_name VARCHAR(30))
BEGIN
    DELETE FROM scores WHERE userID = (SELECT id FROM users WHERE username = input_name);
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
CREATE PROCEDURE delete_score(IN score_id VARCHAR(30))
BEGIN
    DELETE FROM scores WHERE id = score_id;
    SELECT ROW_COUNT();
END//
DELIMITER ;


/*
Inserts a new request into the stats table
Accessed by all requests
*/
DROP PROCEDURE IF EXISTS track_request;
DELIMITER //
CREATE PROCEDURE track_request(IN endpoint_str VARCHAR(50), method_str VARCHAR(6))
BEGIN
    UPDATE stats
    SET total_requests = total_requests + 1
    WHERE end_point = endpoint_str AND method = method_str;
    SELECT ROW_COUNT();
END//
DELIMITER ;

/*
Deletes all scores that are not the best score for each user.
*/
DELETE FROM scores
WHERE id NOT IN (
    SELECT sid FROM (
        SELECT scores.id as sid FROM scores 
        JOIN users ON users.id = scores.userID 
        WHERE scores.id = get_high_score_id(users.username)
    ) as s
);


-- Initial Seeds for stats table 
INSERT INTO stats (end_point, method, total_requests)
VALUES 
("/sequence/v1/scores", "GET", 0),
("/sequence/v1/scores/username", "GET", 0),
("/sequence/v1/users", "GET", 0),
("/sequence/v1/scores/username/score", "PUT", 0),
("/sequence/v1/users/username", "PUT", 0),
("/sequence/v1/users/username", "POST", 0),
("/sequence/v1/users/change/username/newname", "POST", 0),
("/sequence/v1/users/authenticate/username/pw", "POST", 0),
("/sequence/v1/users/username", "DELETE", 0),
("/sequence/v1/scores/scoreID", "DELETE", 0);

INSERT INTO game_modes (mode)
VALUES
("classic20"),
("classic40"),
("classic60"),
("timed15"),
("timed30"),
("timed45");
