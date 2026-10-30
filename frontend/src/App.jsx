import { useEffect, useState } from "react";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("token"));
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  //whenever theme changes tell page to remember it
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  function handleLogout() {
    localStorage.removeItem("token");
    setLoggedIn(false);
  }

  function toggleTheme() {
    setTheme(theme === "dark" ? "light" : "dark");
  }

  return loggedIn ? (
    <DashboardPage
      onLogout={handleLogout}
      theme={theme}
      onToggleTheme={toggleTheme}
    />
  ) : (
    <LoginPage onLogin={() => setLoggedIn(true)} />
  );
}
