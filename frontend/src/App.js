import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [summary, setSummary] = useState({ income: 0, expenses: 0, balance: 0 });
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [networth, setNetworth] = useState(0);

  // form state
  const [form, setForm] = useState({
    type: "expense",
    amount: "",
    category: "",
    date: "",
    description: "",
    account_id: ""
  });

  const fetchData = () => {
    fetch("http://localhost:5050/summary")
      .then(res => res.json())
      .then(data => setSummary(data));

    fetch("http://localhost:5050/transactions")
      .then(res => res.json())
      .then(data => setTransactions(data));

    fetch("http://localhost:5050/accounts")
      .then(res => res.json())
      .then(data => setAccounts(data));
    
    fetch("http://localhost:5050/networth")
      .then(res => res.json())
      .then(data => setNetworth(data.netWorth));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch("http://localhost:5050/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ...form,
        amount: Number(form.amount),
        account_id: Number(form.account_id)
      })
    });

    setForm({
      type: "expense",
      amount: "",
      category: "",
      date: "",
      description: ""
    });

    fetchData(); // refresh UI
  };

  const handleDelete = async (id) => {
    await fetch(`http://localhost:5050/transactions/${id}`, {
      method: "DELETE"
    });
  
    fetchData(); // refresh UI after delete
  };

  return (
    <div className="container">
      <h1>💰 Finance Dashboard</h1>

      {/* Summary */}
      <div className="cards">
        <div className="card">Income: ${summary.income}</div>
        <div className="card">Expenses: ${summary.expenses}</div>
        <div className="card">Balance: ${summary.balance}</div>
      </div>

      {/* Net Worth */}
      <div className="card" style={{ marginTop: "20px" }}>
        <h2>Net Worth</h2>
        <h1>${networth}</h1>
      </div>

      {/* Accounts */}
      <h2>Accounts</h2>
      <div className="cards">
        {accounts.map(acc => (
          <div key={acc.id} className="card">
            <h3>{acc.name}</h3>
            <p>Type: {acc.type}</p>
            <p>Balance: ${acc.balance}</p>
          </div>
        ))}
      </div>

      {/* FORM */}
      <h2>Add Transaction</h2>
      <form onSubmit={handleSubmit} className="form">
        <select name="type" value={form.type} onChange={handleChange}>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>

        <input
          name="amount"
          placeholder="Amount"
          value={form.amount}
          onChange={handleChange}
        />

        <input
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
        />

        <select
          name="account_id"
          value={form.account_id}
          onChange={handleChange}
        >
          <option value="">Select Account</option>
          {accounts.map(acc => (
            <option key={acc.id} value={acc.id}>
              {acc.name}
            </option>
          ))}
        </select>


        <input
          name="date"
          type="date"
          value={form.date}
          onChange={handleChange}
        />

        <input
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        />

        <button type="submit">Add</button>
      </form>

      {/* Transactions */}
      <h2>Transactions</h2>
      <div className="list">
      {transactions.map(t => (
        <div key={t.id} className="item">
          {t.type} - ${t.amount} ({t.category})
          <button onClick={() => handleDelete(t.id)}>
            Delete
    </button>
  </div>
))}
      </div>
    </div>
  );
}

export default App;