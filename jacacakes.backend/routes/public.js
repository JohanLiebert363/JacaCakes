export default function registerPublicRoutes(app, { db }) {
  app.get('/api/cakes', async (req, res) => {
    try {
      const cakes = await db.all('SELECT id, title, description, image_path, created_at FROM cakes ORDER BY created_at DESC');
      res.json({ cakes });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch cakes' });
    }
  });

  app.get('/api/cake/:id', async (req, res) => {
    try {
      const cake = await db.get('SELECT * FROM cakes WHERE id = ?', req.params.id);
      if (!cake) return res.status(404).json({ error: 'Not found' });
      res.json({ cake });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch cake' });
    }
  });
}
