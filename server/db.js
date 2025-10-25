const path = require('path');
const Database = require('better-sqlite3');

const DB_PATH = path.join(__dirname, '..', 'data', 'submissions.db');

function init() {
  const dbDir = path.join(__dirname, '..', 'data');
  const fs = require('fs');
  if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });

  const db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');

  db.prepare(`
    CREATE TABLE IF NOT EXISTS submissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      surname TEXT,
      email TEXT,
      phone TEXT,
      position TEXT,
      experience INTEGER,
      education TEXT,
      skills TEXT,
      cover TEXT,
      receivedAt TEXT
    )
  `).run();

  return db;
}

const db = init();

function saveSubmission(submission) {
  const stmt = db.prepare(`INSERT INTO submissions
    (name, surname, email, phone, position, experience, education, skills, cover, receivedAt)
    VALUES (@name, @surname, @email, @phone, @position, @experience, @education, @skills, @cover, @receivedAt)`);
  const info = stmt.run(submission);
  return info.lastInsertRowid;
}

function getAllSubmissions() {
  const stmt = db.prepare('SELECT * FROM submissions ORDER BY id DESC');
  return stmt.all();
}

module.exports = { saveSubmission, getAllSubmissions, DB_PATH };
