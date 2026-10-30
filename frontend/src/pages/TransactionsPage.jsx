import { useEffect, useState } from "react";
import { api } from "../api";
import ExpenseList from "../components/ExpenseList";

export default function TransactionsPage() {
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api("/categories")
      .then(setCategories)
      .catch((err) => setError(err.message));
  }, []);

  useEffect(() => {
    loadExpenses();
  }, [month, categoryId]);

  async function loadExpenses() {
    try {
      setError("");
      let url = `/expenses?month=${month}`;
      if (categoryId) url += `&category_id=${categoryId}`;

      const data = await api(url);
      //console.log("url:", url, "got:", data);

      setExpenses(data);
    } catch (err) {
      setError(err.message);
    }
  }

  async function deleteExpense(id) {
    try {
      await api(`/expenses/${id}`, "DELETE");
      await loadExpenses();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <>
      <div className="top-bar">
        <h1>Transactions</h1>
        <div className="top-actions">
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          />
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="message">{error}</p>

      <div className="panel">
        <h3>{expenses.length} expenses</h3>
        <ExpenseList expenses={expenses} onDelete={deleteExpense} />
      </div>
    </>
  );
}
