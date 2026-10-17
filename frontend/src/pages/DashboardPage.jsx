import { useState, useEffect } from "react";
import { api } from "../api";
import CategoryBars from "../components/CategoryBars";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseList from "../components/ExpenseList";
import SpendingDonut from "../components/SpendingDonut";

export default function DashboardPage({ onLogout }) {
  const [email, setEmail] = useState("");
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");

  const [categories, setCategories] = useState([]);
  const [expenses, setExpenses] = useState([]);

  //-----SUMMARY-----//
  async function loadSummary() {
    try {
      setError("");
      const [s, e] = await Promise.all([
        api(`/summary?month=${month}`),
        api(`/expenses?month=${month}`),
      ]);
      setSummary(s);
      setExpenses(e);
    } catch (err) {
      setError(err.message);
    }
  }

  //----LOAD ONCE WHEN PAGE REFRESHES----//
  useEffect(() => {
    api("/me")
      .then((data) => setEmail(data.user.email))
      .catch((err) => {
        console.log("me failed", err);
        onLogout();
      });
    loadCategories();
  }, []);

  useEffect(() => {
    loadSummary();
  }, [month]);
  //-----CATEGORIES-----//
  //api call to load the categories array..called when the page loads
  async function loadCategories() {
    try {
      setCategories(await api("/categories"));
    } catch (err) {
      setError(err.message);
    }
  }
  //-----EXPENSES-----//
  //function the form will call
  async function addExpense(data) {
    try {
      await api("/expenses", "POST", data);
      const newMonth = data.date.slice(0, 7);
      if (newMonth === month) await loadSummary();
      else setMonth(newMonth);
    } catch (err) {
      setError(err.message);
    }
  }

  //-----DELETE EXPENSE-----//
  async function deleteExpense(id) {
    try {
      await api(`/expenses/${id}`, "DELETE");
      await loadSummary();
    } catch (err) {
      setError(err.message);
    }
  }

  const byCategory = summary ? summary.byCategory : [];
  const total = summary ? summary.total : 0;

  return (
    <main className="card">
      <h1>Dashboard</h1>
      <p>{email ? `Logged in as ${email}` : "Loading..."}</p>
      <p className="message">{error}</p>

      <h2>Spending in breakdown</h2>
      <SpendingDonut data={byCategory} total={total} />

      <h2>Expenses by Category</h2>
      <CategoryBars data={byCategory} />

      <h2>Add an expense</h2>
      <ExpenseForm categories={categories} onAdd={addExpense} />

      <h2>Expenses this month</h2>
      <ExpenseList expenses={expenses} onDelete={deleteExpense} />

      <button onClick={onLogout}>Log out</button>
    </main>
  );
}
