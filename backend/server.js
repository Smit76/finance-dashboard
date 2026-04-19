const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// import routes
const transactionRoutes = require('./routes/transactions');
const summaryRoutes = require('./routes/summary');

// use routes
app.use('/transactions', transactionRoutes);
app.use('/', summaryRoutes);

app.listen(5050, () => {
  console.log('Server running on port 5050');
});