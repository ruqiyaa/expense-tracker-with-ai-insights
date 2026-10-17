export default function Sidebar({ email, onLogout }) {
  const soon = ["Transactions", "Budgets", "Accounts", "Goals", "Settings"];

  return (
    <aside className="sidebar">
      <div className="brand">EXPENSE TRACKER</div>

      <div className="nav-item active">Dashboard</div>
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
