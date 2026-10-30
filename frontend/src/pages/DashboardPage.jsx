import { useState, useEffect } from "react";
import { api } from "../api";

export default function DashboardPage({ onLogout }) {
  const [email, setEmail] = useState("");

  useEffect(() => {
    api("/me")
      .then((data) => setEmail(data.user.email))
      .catch((err) => {
        console.log("me failed", err);
        onLogout();
      });
  }, []);

  return (
    <main className="card">
      <h1>Dashboard</h1>
      <p>{email ? `Logged in as ${email}` : "Loading..."}</p>
      <button onClick={onLogout}>Log out</button>
    </main>
  );
}
