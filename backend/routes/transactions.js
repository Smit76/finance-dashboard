const express = require('express');
const router = express.Router();
const db = require('../db/db');

// CREATE
router.post('/', (req, res) => {
    const { type, amount, category, date, description, account_id } = req.body;
  
    db.run(
      `INSERT INTO transactions (type, amount, category, date, description, account_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [type, amount, category, date, description, account_id],
      function (err) {
        if (err) return res.status(500).json({ error: err.message });
  
        // 🔥 UPDATE ACCOUNT BALANCE
        const sign = type === "income" ? 1 : -1;
  
        db.run(
          `UPDATE accounts
           SET balance = balance + ?
           WHERE id = ?`,
          [sign * amount, account_id]
        );
  
        res.json({ id: this.lastID });
      }
    );
  });

// READ
router.get('/', (req, res) => {
  db.all('SELECT * FROM transactions', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    res.json(rows);
  });
});

// DELETE
router.delete('/:id', (req, res) => {
  db.run('DELETE FROM transactions WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });

    res.json({ deleted: this.changes });
  });
});

module.exports = router;