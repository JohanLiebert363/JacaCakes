import express from "express";
import session from "express-session";
import cors from "cors";
import bcrypt from "bcrypt";
import multer from "multer";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";
import fs from "fs";

const __dirname = path.resolve();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET || "super-secret-key",
  resave: false,
  saveUninitialized: false
}));

// Allow requests from GitHub Pages frontend (adjust or add origins as needed)
app.use(cors({
  origin: [
    'https://johanliebert363.github.io'
  ],
  credentials: true
}));

const UPLOAD_DIR = path.join(__dirname, "uploads", "cakes");
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const dbFile = path.join(__dirname, "db.sqlite");

let db;
async function initDb() {
  db = await open({ filename: dbFile, driver: sqlite3.Database });
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS cakes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      description TEXT,
      image_path TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  const adminUser = await db.get("SELECT * FROM users WHERE username = ?", "admin");
  if (!adminUser) {
    const pw = process.env.ADMIN_PASSWORD || "changeme";
    const hash = await bcrypt.hash(pw, 10);
    await db.run("INSERT INTO users (username, password_hash) VALUES (?, ?)", "admin", hash);
    console.log('Seeded admin user with username="admin"');
  }
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`)
});
const upload = multer({ storage });

// Serve static front-end and admin pages (parent folder contains index.html and admin/)
app.use(express.static(path.join(__dirname)));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Route bindings will be loaded after DB init

export { app, db, initDb, upload };
