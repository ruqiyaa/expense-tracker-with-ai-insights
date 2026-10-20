import { useState } from "react";

export default function ExpenseForm({ categories, onAdd }) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [categoryName, setCategoryName] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    await onAdd({
      amount: parseFloat(amount),
      description,
      date,
      category_name: categoryName.trim(),
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

      <input
        list="category-options"
        placeholder="Category (pick or enter)"
        value={categoryName}
        onChange={(e) => setCategoryName(e.target.value)}
      />

      <datalist id="category-options">
        {categories.map((c) => (
          <option key={c.id} value={c.name} />
        ))}
      </datalist>
      <button type="submit">Add expense</button>
    </form>
  );
}
