const db = require('./db');
const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());

app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is running');
});

app.listen(5050, () => {
  console.log('Server running on port 5050');
});

app.post('/transactions', (req, res) => {
    const { type, amount, category, date, description } = req.body;
  
    const query = `
      INSERT INTO transactions (type, amount, category, date, description)
      VALUES (?, ?, ?, ?, ?)
    `;
  
    db.run(query, [type, amount, category, date, description], function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
  
      res.json({ id: this.lastID });
    });
  });

  app.get('/transactions', (req, res) => {
    db.all('SELECT * FROM transactions', [], (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
  
      res.json(rows);
    });
  });

  app.get('/summary', (req, res) => {
    db.all('SELECT * FROM transactions', [], (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
  
      let income = 0;
      let expenses = 0;
  
      rows.forEach((t) => {
        if (t.type === 'income') {
          income += t.amount;
        } else if (t.type === 'expense') {
          expenses += t.amount;
        }
      });
  
      res.json({
        income,
        expenses,
        balance: income - expenses
      });
    });

    app.delete('/transactions/:id', (req, res) => {
        const { id } = req.params;
      
        db.run(
          'DELETE FROM transactions WHERE id = ?',
          [id],
          function (err) {
            if (err) {
              return res.status(500).json({ error: err.message });
            }
      
            res.json({ deleted: this.changes });
          }
        );
      });
  });