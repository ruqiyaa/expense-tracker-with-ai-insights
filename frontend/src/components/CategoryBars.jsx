import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { COLORS, money } from "../utils";

export default function CategoryBars({ data }) {
  if (!data.length) return <p className="muted">No data yet.</p>;

  const coloredData = data.map((row, i) => ({
    ...row,
    fill: COLORS[i % COLORS.length],
  }));

  return (
    <div style={{ height: 220 }}>
      <ResponsiveContainer>
        <BarChart data={coloredData}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="category" tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} />
          <Tooltip
            formatter={(v) => money(v)}
            cursor={{ fill: "transparent" }}
            contentStyle={{
              background: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: 8,
            }}
          />
          <Bar dataKey="total" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
