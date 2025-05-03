CREATE DATABASE planner_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- (optional) create a dedicated user
CREATE USER 'planner_user'@'localhost' IDENTIFIED BY 'some_strong_password';
GRANT ALL PRIVILEGES ON planner_db.* TO 'planner_user'@'localhost';
FLUSH PRIVILEGES;