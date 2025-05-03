-- 1) Users with 6‑digit password “123456” (all share the same bcrypt hash)
INSERT INTO users (username, info, password_hash, role, created) VALUES
  (
    'alice',
    'Junior Biology major',
    '123654',
    'user',
    '2025-04-01 09:15:00'
  ),
  (
    'bob',
    'Senior Mathematics major',
    '654321',
    'admin',
    '2025-04-03 14:42:30'
  ),
  (
    'carol',
    'Sophomore CS major',
    '123456',
    'user',
    '2025-04-05 11:08:45'
  );

-- 2) Tasks
INSERT INTO tasks (UserID) VALUES
  (1),(1),(2),(3),(3);

-- 3) Study sessions
INSERT INTO studySession (UserID) VALUES
  (1),(1),(2),(3),(3);

-- 4) Study groups
INSERT INTO studyGroup () VALUES
  (),(),();

-- 5) Group‑study sessions
INSERT INTO groupStudySession (GroupID) VALUES
  (1),(2),(3),(1);

-- 6) Reminders
INSERT INTO reminder (UserID, TaskID) VALUES
  (1,1),(2,3),(3,4),(1,2);

-- 7) Analytics records
INSERT INTO analytics (UserID) VALUES
  (1),(2),(3),(1);