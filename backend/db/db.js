const sqlite3 = require('sqlite3').verbose();

// Create or connect to database file
const db = new sqlite3.Database('./finance.db');

// Create table if it doesn't exist
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT,
      amount REAL,
      category TEXT,
      date TEXT,
      description TEXT
    )
  `);
});

module.exports = db;