import { money } from "../utils";

export default function ExpenseList({ expenses, onDelete }) {
  if (expenses.length === 0) {
    return <p className="muted">No expenses this month.</p>;
  }

  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Category</th>
            <th className="right">Amount</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((e) => (
            <tr key={e.id}>
              <td>{e.date}</td>
              <td>{e.description || "(no description)"}</td>
              <td>{e.category || "Uncategorized"}</td>
              <td className="right">{money(e.amount)}</td>
              <td className="right">
                <button className="small danger" onClick={() => onDelete(e.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
