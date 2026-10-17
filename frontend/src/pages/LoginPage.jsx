import { useState } from "react";
import { api } from "../api";

export default function LoginPage({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const isRegister = mode === "register";

  async function handleSubmit(event) {
    event.preventDefault();
    console.log("1. submit clicked", { mode, email });
    setError("");

    const body = { email, password };
    if (isRegister) body.name = name;

    try {
      const data = await api(`/auth/${mode}`, "POST", body);
      console.log("2. got response", data);
      localStorage.setItem("token", data.token);
      onLogin();
      console.log("3. onLogin called");
    } catch (err) {
      setError(err.message);
    }
  }

  function switchMode() {
    setMode(isRegister ? "login" : "register");
    setError("");
  }

  return (
    <main className="card">
      <h1>Expense Tracker</h1>
      <h2>{isRegister ? "Create Account" : "Log in"}</h2>

      <form onSubmit={handleSubmit}>
        {isRegister && (
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        ></input>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">{isRegister ? "Register" : "Log In"}</button>
      </form>

      <p className="message">{error}</p>

      <p>
        {isRegister ? "Already have an account?" : "New here?"}{" "}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            switchMode();
          }}
        >
          {isRegister ? "Log in" : "Create an account"}
        </a>
      </p>
    </main>
  );
}
