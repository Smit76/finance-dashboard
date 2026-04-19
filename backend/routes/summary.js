const express = require('express');
const router = express.Router();
const db = require('../db/db');

// health check
router.get('/', (req, res) => {
  res.send('API is running');
});

// summary
router.get('/summary', (req, res) => {
  db.all('SELECT * FROM transactions', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    let income = 0;
    let expenses = 0;

    rows.forEach((t) => {
      if (t.type === 'income') income += t.amount;
      if (t.type === 'expense') expenses += t.amount;
    });

    res.json({
      income,
      expenses,
      balance: income - expenses
    });
  });
});

module.exports = router;