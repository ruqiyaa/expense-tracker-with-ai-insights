import { NavLink } from "react-router-dom";

export default function Sidebar({ email, onLogout }) {
  const soon = ["Budgets", "Goals", "Settings"];

  return (
    <aside className="sidebar">
      <div className="brand">EXPENSE TRACKER</div>

      <NavLink
        to="/"
        end
        className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}
      >
        Dashboard
      </NavLink>

      <NavLink
        to="/transactions"
        className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}
      >
        Transactions
      </NavLink>

      {soon.map((name) => (
        <div key={name} className="nav-item disabled">
          {name} <small>soon</small>
        </div>
      ))}

      <div className="sidebar-bottom">
        <span className="user-email">{email}</span>
        <button className="small secondary" onClick={onLogout}>
          Log out
        </button>
      </div>
    </aside>
  );
}
