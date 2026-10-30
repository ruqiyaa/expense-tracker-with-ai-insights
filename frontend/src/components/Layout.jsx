import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { api } from "../api";

import Sidebar from "./Sidebar";

export default function Layout({ onLogout, theme, onToggleTheme }) {
  const [email, setEmail] = useState("");

  useEffect(() => {
    api("/me")
      .then((data) => setEmail(data.user.email))
      .catch(() => onLogout());
  }, []);

  return (
    <div className="app">
      <Sidebar email={email} onLogout={onLogout} />
      <main className="main">
        <Outlet context={{ email, theme, onToggleTheme, onLogout }} />
      </main>
    </div>
  );
}
