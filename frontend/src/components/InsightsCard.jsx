import { useEffect, useState } from "react";
import { api } from "../api";

export default function InsightsCard({ month }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setText("");
    setError("");
  }, [month]);

  async function generate() {
    setLoading(true);
    setError("");

    try {
      const data = await api("/insights", "POST", { month });
      setText(data.insights);
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
          <h3>✨ AI Insights ✨</h3>
          {!text && !loading && !error && (
            <p className="muted">Get tips based on this month's spending.</p>
          )}
        </div>
      </div>
      <button className="ai-btn" onClick={generate} disabled={loading}>
        {loading ? "Thinking..." : text ? "Refresh insights" : "Get insights"}
      </button>

      {error && <p className="message">{error}</p>}
      {text && <p className="inisghts">{text}</p>}
    </div>
  );
}
