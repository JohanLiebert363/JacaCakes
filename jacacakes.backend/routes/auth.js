export default function registerAuthRoutes(app, { db }) {
  app.post('/auth/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Missing credentials' });
    try {
      const user = await db.get('SELECT * FROM users WHERE username = ?', username);
      if (!user) return res.status(401).json({ error: 'Invalid credentials' });
      const bcrypt = await import('bcrypt');
      const ok = await bcrypt.compare(password, user.password_hash);
      if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
      req.session.user = { id: user.id, username: user.username };
      res.json({ ok: true, user: { id: user.id, username: user.username } });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  });

  app.post('/auth/logout', (req, res) => {
    req.session.destroy(err => {
      if (err) return res.status(500).json({ error: 'Logout failed' });
      res.json({ ok: true });
    });
  });

  app.get('/auth/me', (req, res) => {
    if (!req.session.user) return res.status(401).json({ error: 'Not logged in' });
    res.json({ user: req.session.user });
  });
}
