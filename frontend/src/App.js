import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [summary, setSummary] = useState({ income: 0, expenses: 0, balance: 0 });
  const [transactions, setTransactions] = useState([]);

  // form state
  const [form, setForm] = useState({
    type: "expense",
    amount: "",
    category: "",
    date: "",
    description: ""
  });

  const fetchData = () => {
    fetch("http://localhost:5050/summary")
      .then(res => res.json())
      .then(data => setSummary(data));

    fetch("http://localhost:5050/transactions")
      .then(res => res.json())
      .then(data => setTransactions(data));
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
        amount: Number(form.amount)
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