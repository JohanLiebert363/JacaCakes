import { app, initDb, upload } from './server.js';
import registerAuthRoutes from './routes/auth.js';
import registerAdminRoutes from './routes/admin.js';
import registerPublicRoutes from './routes/public.js';

const PORT = process.env.PORT || 3000;

async function start() {
  await initDb();
  // Pass DB via app.locals after init
  const db = (await import('./server.js')).db;
  // register routes
  registerAuthRoutes(app, { db });
  registerAdminRoutes(app, { db, upload });
  registerPublicRoutes(app, { db });

  app.listen(PORT, () => console.log(`JacaCakes backend listening on http://localhost:${PORT}`));
}

start().catch(err => {
  console.error('Failed to start:', err);
  process.exit(1);
});
