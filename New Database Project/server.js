// server.js (or auth.js)
import express from 'express';
import bcrypt  from 'bcrypt';
import session from 'express-session';
import pool    from './db-init.js'; 
import path from 'path';
app.use(express.static(path.join(__dirname, 'public')));

const app = express();
app.use(express.json());
app.use(session({
  secret: 'very_secret_key',    // move to .env in production
  resave: false,
  saveUninitialized: false
}));

// Login route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const [rows] = await pool.query(
    `SELECT UserID, password_hash, role
     FROM users WHERE username = ?`,
    [username]
  );
  if (!rows.length) return res.status(401).json({ error: 'Invalid creds' });

  const user = rows[0];
  const ok   = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).json({ error: 'Invalid creds' });

  req.session.userId = user.UserID;
  req.session.role   = user.role;
  res.json({ success: true, role: user.role });
});

// 2b) Logout
app.post('/logout', (req, res) => {
  req.session.destroy(() => res.json({ success: true }));
});

// 2c) Auth‑checking middleware
function requireAuth(req, res, next) {
  if (!req.session.userId) return res.status(401).end();
  next();
}
function requireAdmin(req, res, next) {
  if (req.session.role !== 'admin') return res.status(403).end();
  next();
}

// server.js
app.get('/api/users', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT u.UserID, u.username, u.info, u.created,
             GROUP_CONCAT(c.classname) AS classes
      FROM users u
      LEFT JOIN classes c ON c.user_id = u.UserID
      GROUP BY u.UserID;
    `);
    // parse classes into arrays
    const users = rows.map(u => ({
      ...u,
      classes: u.classes ? u.classes.split(',') : []
    }));
    res.json(users);
  } catch (err) {
    console.error('DB error', err);
    res.status(500).json({ error: 'Database error' });
  }
});

//create a user
app.post('/api/users', async (req, res) => {
  const { username, info, classes = [] } = req.body;
  if (!username) return res.status(400).json({ error: 'username required' });

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [result] = await conn.query(
      `INSERT INTO users (username, info) VALUES (?, ?)`,
      [username, info || null]
    );
    const userId = result.insertId;

    const insertClasses = classes.map(c =>
      conn.query(`INSERT INTO classes (user_id, classname) VALUES (?, ?)`, [userId, c])
    );
    await Promise.all(insertClasses);

    await conn.commit();
    res.status(201).json({ id: userId, username, info, classes });
  } catch (err) {
    await conn.rollback();
    console.error('Transaction error', err);
    res.status(500).json({ error: 'Could not create user' });
  } finally {
    conn.release();
  }
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
