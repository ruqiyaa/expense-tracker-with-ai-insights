import { useState } from "react";
import { money } from "../utils";

export default function GoalCard({ goal, onSave, onDelete }) {
  const [name, setName] = useState("");
  const [target, setTarget] = useState("");
  const [saved, setSaved] = useState("");
  const hasGoal = goal.target > 0;

  const percent =
    goal.target > 0 ? Math.round((goal.saved / goal.target) * 100) : 0;
  const barWidth = Math.min(percent, 100);

  async function handleSubmit(event) {
    event.preventDefault();

    await onSave({
      name: hasGoal ? goal.name : name,
      target: hasGoal ? goal.target : parseFloat(target),
      saved: parseFloat(saved),
    });
    setName("");
    setSaved("");
    setTarget("");
  }

  return (
    <div>
      {goal.target > 0 ? (
        <>
          <p className="total">
            {goal.name} : {percent}%
          </p>
          <div className="bar-track">
            <div
              className="bar-fill"
              style={{ width: `${percent}%`, background: "var(--accent)" }}
            />
          </div>
          <p className="muted">
            {money(goal.saved)} of {money(goal.target)}
          </p>
        </>
      ) : (
        <p className="muted">No savings goal yet.</p>
      )}

      <form onSubmit={handleSubmit}>
        {!hasGoal && (
          <>
            <input
              placeholder="Goal name (e.g. Laptop)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="number"
              min="1"
              placeholder="Target amount"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              required
            />
          </>
        )}
        <input
          type="number"
          min="0"
          placeholder="Saved so far"
          value={saved}
          onChange={(e) => setSaved(e.target.value)}
          required
        />
        <button type="submit">
          {hasGoal ? "Update saved amount" : "Save goal"}
        </button>
      </form>

      {hasGoal && (
        <button
          type="button"
          className="small danger goal-delete"
          onClick={onDelete}
        >
          Delete goal
        </button>
      )}

      <p className="muted goal-note">
        You can have one goal at a time. Delete it to set a new one.
      </p>
    </div>
  );
}
