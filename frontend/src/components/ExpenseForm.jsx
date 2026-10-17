import { useState } from "react";

export default function ExpenseForm({ categories, onAdd }) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [categoryId, setCategoryId] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    await onAdd({
      amount: parseFloat(amount),
      description,
      date,
      category_id: categoryId ? Number(categoryId) : null,
    });
    setAmount("");
    setDescription("");
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
        placeholder="What was it for?"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        placeholder="When?"
        required
      />

      <select
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
      >
        <option value="">No category</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
      <button type="submit">Add expense</button>
    </form>
  );
}
