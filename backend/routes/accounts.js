const express = require('express');
const router = express.Router();
const db = require('../db/db');

// CREATE account
router.post('/', (req, res) => {
  const { name, type, balance } = req.body;

  db.run(
    'INSERT INTO accounts (name, type, balance) VALUES (?, ?, ?)',
    [name, type, balance],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });

      res.json({ id: this.lastID });
    }
  );
});

// GET accounts
router.get('/', (req, res) => {
  db.all('SELECT * FROM accounts', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    res.json(rows);
  });
});

module.exports = router;