import { ensureAuth } from '../middleware/authMiddleware.js';

export default function registerAdminRoutes(app, { db, upload }) {
  app.post('/admin/upload', ensureAuth, upload.single('image'), async (req, res) => {
    try {
      const { title, description } = req.body;
      if (!req.file) return res.status(400).json({ error: 'No image uploaded' });
      const imagePath = `/uploads/cakes/${req.file.filename}`;
      const result = await db.run(
        'INSERT INTO cakes (title, description, image_path) VALUES (?, ?, ?)',
        title || null,
        description || null,
        imagePath
      );
      const cakeId = result.lastID;
      const cake = await db.get('SELECT * FROM cakes WHERE id = ?', cakeId);
      res.json({ ok: true, cake });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Upload failed' });
    }
  });

  app.get('/admin/cakes', ensureAuth, async (req, res) => {
    try {
      const cakes = await db.all('SELECT * FROM cakes ORDER BY created_at DESC');
      res.json({ cakes });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch' });
    }
  });
}
