# JacaCakes

This repo contains the static frontend and a Node.js + Express backend in `jacacakes.backend` for managing cake images.

Quick start (backend):

```bash
cd jacacakes/jacacakes.backend
npm install
# set secure env vars before production
export ADMIN_PASSWORD="your-admin-password"
export SESSION_SECRET="some-long-secret"
npm start
```

Admin pages are in `admin/` — update the `BACKEND` constant at the top of `admin/login.html` and `admin/dashboard.html` to your deployed backend URL.

Notes:
- `db.sqlite` is created automatically; it's ignored by git.
- Uploaded images are saved to `uploads/cakes/` and are ignored by git.
- For production, serve the backend over HTTPS and set `cookie.sameSite='none'` and `cookie.secure=true`.

To push to your GitHub repository:

```bash
# on your machine
cd path/to/jacacakes
git remote add origin https://github.com/youruser/yourrepo.git
git branch -M main
git push -u origin main
```
