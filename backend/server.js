const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// import routes
const transactionRoutes = require('./routes/transactions');
const summaryRoutes = require('./routes/summary');
const accountRoutes = require('./routes/accounts');

// use routes
app.use('/transactions', transactionRoutes);
app.use('/', summaryRoutes);
app.use('/accounts', accountRoutes);

app.get('/networth', (req, res) => {
  db.all('SELECT * FROM accounts', [], (err, accounts) => {
    if (err) return res.status(500).json({ error: err.message });

    const netWorth = accounts.reduce((sum, acc) => sum + acc.balance, 0);

    res.json({
      netWorth,
      accounts
    });
  });
});

app.listen(5050, () => {
  console.log('Server running on port 5050');
});