import { useState } from "react";
import { money } from "../utils";

export default function BudgetCard({ budget, spent, onSave }) {
  const [input, setInput] = useState("");
  const percent = budget > 0 ? Math.round((spent / budget) * 100) : 0;
  const barWidth = Math.min(percent, 100);
  const over = percent > 100;

  async function handleSubmit(event) {
    event.preventDefault();
    await onSave(parseFloat(input));
    setInput("");
  }

  return (
    <div>
      {budget > 0 ? (
        <>
          <p className="total">{percent} % used</p>
          <div className="bar-track">
            <div
              className="bar-fill"
              style={{
                width: `${barWidth}%`,
                background: over ? "var(--danger)" : "var(--accent)",
              }}
            />
          </div>
          <p className="muted">
            {money(spent)} of {money(budget)}
          </p>
        </>
      ) : (
        <p className="muted">No budget set for this month</p>
      )}

      <form className="row" onSubmit={handleSubmit}>
        <input
          type="number"
          min="0"
          step="1"
          placeholder="Set monthly budget"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          required
        />
        <button type="submit">Save</button>
      </form>
    </div>
  );
}
