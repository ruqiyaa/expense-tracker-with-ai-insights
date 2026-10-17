import { useState, useEffect } from "react";
import { api } from "../api";
import CategoryBars from "../components/CategoryBars";

export default function DashboardPage({ onLogout }) {
  const [email, setEmail] = useState("");
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");

  async function loadSummary() {
    try {
      setError("");
      const data = await api(`/summary?month=${month}`);
      setSummary(data);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    api("/me")
      .then((data) => setEmail(data.user.email))
      .catch((err) => {
        console.log("me failed", err);
        onLogout();
      });
  }, []);

  useEffect(() => {
    loadSummary();
  }, [month]);

  const byCategory = summary ? summary.byCategory : [];

  return (
    <main className="card">
      <h1>Dashboard</h1>
      <p>{email ? `Logged in as ${email}` : "Loading..."}</p>
      <p className="message">{error}</p>

      <h2>Expenses by Category</h2>
      <CategoryBars data={byCategory} />

      <button onClick={onLogout}>Log out</button>
    </main>
  );
}
