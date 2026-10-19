import { useState, useEffect } from "react";
import { api } from "../api";
import CategoryBars from "../components/CategoryBars";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseList from "../components/ExpenseList";
import SpendingDonut from "../components/SpendingDonut";
import TrendChart from "../components/TrendChart";
import StatCard from "../components/StatCard";
import Sidebar from "../components/Sidebar";
import BudgetCard from "../components/BudgetCard";
import IncomeForm from "../components/IncomeForm";
import GoalCard from "../components/GoalCard";

export default function DashboardPage({ onLogout, theme, onToggleTheme }) {
  const [email, setEmail] = useState("");
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");

  const [categories, setCategories] = useState([]);
  const [expenses, setExpenses] = useState([]);

  const [budget, setBudget] = useState(0);

  const [income, setIncome] = useState(0);

  const [goal, setGoal] = useState({ name: "", target: 0, saved: 0 });

  //-----SUMMARY-----//
  async function loadSummary() {
    try {
      setError("");
      const [s, e, b, inc, g] = await Promise.all([
        api(`/summary?month=${month}`),
        api(`/expenses?month=${month}`),
        api(`/budgets?month=${month}`),
        api(`/income?month=${month}`),
        api("/goals"),
      ]);
      setSummary(s);
      setExpenses(e);
      setBudget(b.amount);
      setIncome(inc.total);
      setGoal(g);
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

  //-----SAVE BUDGET-----//
  async function saveBudget(amount) {
    try {
      await api("/budgets", "PUT", { month, amount });
      setBudget(amount);
    } catch (err) {
      setError(err.message);
    }
  }

  //-----INCOME-----//
  async function addIncome(data) {
    try {
      await api("/income", "POST", data);
      const newMonth = data.date.slice(0, 7);
      if (newMonth === month) await loadSummary();
      else setMonth(newMonth);
    } catch (err) {
      setError(err.message);
    }
  }

  //-----SAVE GOAL-----//
  async function saveGoal(data) {
    try {
      await api("/goals", "PUT", data);
      setGoal(data);
    } catch (err) {
      setError(err.message);
    }
  }

  //-----DELETE GOAL-----//
  async function deleteGoal() {
    try {
      await api("/goals", "DELETE");
      setGoal({ name: "", target: 0, saved: 0 });
    } catch (err) {
      setError(err.message);
    }
  }

  const byCategory = summary ? summary.byCategory : [];
  const total = summary ? summary.total : 0;

  const today = new Date().toLocaleDateString("en-IN", { dateStyle: "long" });
  const name = email ? email.split("@")[0] : "";

  ///////////////////////
  return (
    <div className="app">
      <Sidebar email={email} onLogout={onLogout} />

      <main className="main">
        <div className="top-bar">
          <div>
            <h1>Welcome back{name ? `, ${name}` : ""}!</h1>
            <span className="muted">{today}</span>
          </div>

          <div className="top-actions">
            <input
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
            />
            <button className="small secondary" onClick={onToggleTheme}>
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
          </div>
        </div>

        <p className="message">{error}</p>

        <div className="stats">
          <StatCard label="Total Balance" value={income - total} />
          <StatCard label="Monthly Income" value={income} />
          <StatCard label="Monthly Expenses" value={total} />
          <StatCard label="Savings Goal" value={goal.saved} />
        </div>

        <div className="dash-grid">
          <div className="panel">
            <h3>Add an expense</h3>
            <ExpenseForm categories={categories} onAdd={addExpense} />
          </div>

          <div className="panel">
            <h3>Savings Goal</h3>
            <GoalCard goal={goal} onSave={saveGoal} onDelete={deleteGoal} />
          </div>

          <div className="panel">
            <h3>Budget Used</h3>
            <BudgetCard budget={budget} spent={total} onSave={saveBudget} />
          </div>

          <div className="panel">
            <h3>Spending Breakdown</h3>
            <SpendingDonut data={byCategory} total={total} />
          </div>

          <div className="panel">
            <h3>Spending Trend</h3>
            <TrendChart expenses={expenses} month={month} />
          </div>

          <div className="panel">
            <h3>Expenses by Category</h3>
            <CategoryBars data={byCategory} />
          </div>

          <div className="panel">
            <h3>Add income</h3>
            <IncomeForm onAdd={addIncome} />
          </div>
        </div>

        <div className="panel" style={{ marginTop: 16 }}>
          <h3>Expenses this month</h3>
          <ExpenseList expenses={expenses} onDelete={deleteExpense} />
        </div>
      </main>
    </div>
  );
}
