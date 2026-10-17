import { money } from "../utils";

export default function StatCard({ label, value, soon }) {
  return (
    <div className={`panel stat ${soon ? "soon" : ""}`}>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{soon ? "Coming soon" : money(value)}</div>
    </div>
  );
}
