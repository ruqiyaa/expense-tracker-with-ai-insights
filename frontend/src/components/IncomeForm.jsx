import { useState } from "react";

export default function IncomeForm({ onAdd }) {
  const [amount, setAmount] = useState("");
  const [source, setSource] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  async function handleSubmit(event) {
    event.preventDefault();
    await onAdd({ amount: parseFloat(amount), source, date });
    setAmount("");
    setSource("");
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="number"
        step="0.01"
        min="0.01"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />

      <button type="submit">Add income</button>
    </form>
  );
}
