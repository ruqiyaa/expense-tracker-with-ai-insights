import { useEffect, useState } from "react";
import { api } from "../api";

export default function InsightsCard({ month }) {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setInsights(null);
    setError("");
  }, [month]);

  async function generate() {
    setLoading(true);
    setError("");
    try {
      const data = await api("/insights", "POST", { month });
      setInsights(data.insights);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="insights-head">
        <div>
          <h3>✨ AI Insights</h3>
          {!insights && !loading && !error && (
            <p className="muted">Get tips based on this month's spending.</p>
          )}
        </div>

        <button className="ai-btn" onClick={generate} disabled={loading}>
          {loading
            ? "Thinking..."
            : insights
              ? "Refresh insights"
              : "✨ Get insights"}
        </button>
      </div>

      {error && <p className="message">{error}</p>}

      {insights && (
        <div className="insights">
          <p className="insights-headline">{insights.headline}</p>

          {insights.observations.length > 0 && (
            <>
              <h4>What stands out</h4>
              <ul>
                {insights.observations.map((o, i) => (
                  <li key={i}>{o}</li>
                ))}
              </ul>
            </>
          )}

          {insights.tips.length > 0 && (
            <>
              <h4>Try this</h4>
              <ul>
                {insights.tips.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
}
