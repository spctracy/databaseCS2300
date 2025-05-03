-- 1) Extend studyGroup to hold name, members & topics
ALTER TABLE studyGroup
  ADD COLUMN group_name VARCHAR(100) NOT NULL AFTER GroupID,
  ADD COLUMN members    TEXT           NOT NULL AFTER group_name,
  ADD COLUMN topics     TEXT           NOT NULL AFTER members;

-- 2) Add a meeting_datetime to groupStudySession
ALTER TABLE groupStudySession
  ADD COLUMN meeting_datetime DATETIME NOT NULL AFTER GroupID;

-- 3) Create a Classes table
CREATE TABLE IF NOT EXISTS classes (
  class_id    INT AUTO_INCREMENT PRIMARY KEY,
  user_id     INT                     NOT NULL,
  class_code  VARCHAR(20)             NOT NULL,
  class_name  VARCHAR(100)            NOT NULL,
  grade       VARCHAR(5),
  FOREIGN KEY (user_id) REFERENCES users(UserID) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 4) Create an Assignments table
CREATE TABLE IF NOT EXISTS assignments (
  assignment_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id       INT                     NOT NULL,
  course_code   VARCHAR(20)             NOT NULL,
  title         VARCHAR(200)            NOT NULL,
  due_date      DATE                    NOT NULL,
  status        ENUM('Not Started','In Progress','Completed') NOT NULL
                  DEFAULT 'Not Started',
  FOREIGN KEY (user_id) REFERENCES users(UserID) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 5) Create an Awards table
CREATE TABLE IF NOT EXISTS awards (
  award_id     INT AUTO_INCREMENT PRIMARY KEY,
  user_id      INT                     NOT NULL,
  title        VARCHAR(200)            NOT NULL,
  date_awarded DATE                    NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(UserID) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ────────────────────────────────────────────────────────────────────────────
-- Now populate with the exact data your static pages showed:

-- A) Classes for Alice (UserID=1)
INSERT INTO classes (user_id, class_code, class_name, grade) VALUES
  (1,'CS101', 'Introduction to Computer Science','A-'),
  (1,'MATH205','Calculus II',                   'B+'),
  (1,'HIST210','World History',                  'B'),
  (1,'ENG150', 'Academic Writing',               'A');

-- B) Assignments for Alice
INSERT INTO assignments (user_id, course_code, title, due_date, status) VALUES
  (1,'CS101', 'Project #1: Build a simple calculator','2025-05-10','In Progress'),
  (1,'MATH205','Homework #6: Integration techniques','2025-05-12','Not Started'),
  (1,'HIST210','Essay: Industrial Revolution',      '2025-05-15','Completed'),
  (1,'ENG150', 'Peer Review: Draft academic paper',  '2025-05-18','In Progress');

-- C) Study groups (names, members, topics)
INSERT INTO studyGroup (group_name, members, topics) VALUES
  ('Algorithms Enthusiasts', 'Alice,Bob,Carol',        'Sorting Algorithms, Big‑O Analysis'),
  ('Calculus Workshop',      'Dave,Eva,Frank',         'Integration by Parts, Improper Integrals'),
  ('History Review Crew',    'Grace,Heidi',            'Industrial Revolution, World War I');

-- D) Next meeting times for each group
INSERT INTO groupStudySession (GroupID, meeting_datetime) VALUES
  (1,'2025-05-08 16:00:00'),
  (2,'2025-05-09 14:00:00'),
  (3,'2025-05-11 17:00:00');

-- E) Awards for Alice
INSERT INTO awards (user_id, title, date_awarded) VALUES
  (1,'Dean’s List — Spring 2025',      '2025-05-01'),
  (1,'CS101 Hackathon Winner',         '2025-04-20'),
  (1,'Academic Excellence Scholarship','2025-04-15');
