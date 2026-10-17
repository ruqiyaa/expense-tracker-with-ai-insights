//shows how much you spend on each day of the mont

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { money } from "../utils";

function dailyTotals(expenses, month) {
  const [year, m] = month.split("-").map(Number);
  const daysInMonth = new Date(year, m, 0).getDate();

  const days = Array.from({ length: daysInMonth }, (_, i) => ({
    day: i + 1,
    total: 0,
  }));

  for (const e of expenses) {
    const dayNumber = Number(e.date.slice(8, 10));
    days[dayNumber - 1].total += e.amount;
  }

  return days;
}

export default function TrendChart({ expenses, month }) {
  const data = dailyTotals(expenses, month);

  return (
    <div style={{ height: 220 }}>
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="day" tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} />
          <Tooltip
            formatter={(v) => money(v)}
            labelFormatter={(d) => `Day${d}`}
            contentStyle={{
              background: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: 8,
            }}
          />
          <Line
            type="monotone"
            dataKey="total"
            stroke="#2dd4bf"
            strokeWidth={3}
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
