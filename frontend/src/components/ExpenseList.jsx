export default function ExpenseList({ expenses, onDelete }) {
  if (expenses.length === 0) {
    return <p className="muted">No expenses this month.</p>;
  }

  return (
    <ul>
      {expenses.map((e) => (
        <li key={e.id}>
          <div>
            ₹{e.amount} . {e.description || "(no description)"}
            <div className="muted">
              {e.date} . {e.category || "Uncategorized"}
            </div>
          </div>
          <button className="small danger" onClick={() => onDelete(e.id)}>
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}
