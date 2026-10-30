import { useState } from "react";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("token"));

  function handleLogout() {
    localStorage.removeItem("token");
    setLoggedIn(false);
  }

  return loggedIn ? (
    <DashboardPage onLogout={handleLogout} />
  ) : (
    <LoginPage onLogin={() => setLoggedIn(true)} />
  );
}
