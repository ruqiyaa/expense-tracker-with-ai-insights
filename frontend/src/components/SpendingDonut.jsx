import { PieChart, Pie, Tooltip, ResponsiveContainer } from "recharts";
import { COLORS, money } from "../utils";

export default function SpendingDonut({ data, total }) {
  if (!data.length) return <p className="muted">No spending yet.</p>;

  // give every row its own color
  const coloredData = data.map((row, i) => ({
    ...row,
    fill: COLORS[i % COLORS.length],
  }));

  return (
    <>
      <div style={{ height: 190 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={coloredData}
              dataKey="total"
              nameKey="category"
              innerRadius={55}
              outerRadius={85}
              stroke="none"
            />
            <Tooltip
              formatter={(v) => money(v)}
              contentStyle={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: 8,
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <ul className="legend">
        {coloredData.map((row) => (
          <li key={row.category}>
            <span>
              <span className="dot" style={{ background: row.fill }} />
              {row.category}
            </span>
            <span className="muted">
              {Math.round((row.total / total) * 100)}%
            </span>
          </li>
        ))}
      </ul>
    </>
  );
}
