const db = require('../db');

function getMonthlySummary (userId, month) {
    const byCategory = db
        .prepare(
            `SELECT COALESCE(c.name, 'Uncategorized') AS category,
                    SUM(e.amount) AS total,
                    COUNT(*) AS count
            FROM expenses e
            LEFT JOIN categories c ON c.id = e.category_id
            WHERE e.user_id = ? AND substr(e.date, 1, 7) = ?
            GROUP BY COALESCE(c.name, 'Uncategorized')
            ORDER BY total DESC`
        )
        .all(userId, month);

        const overall = db
            .prepare(
                `SELECT COALESCE(SUM(amount), 0) AS total, COUNT(*) AS count
                FROM expenses
                WHERE user_id = ? AND substr(date, 1, 7) = ?`
            )
            .get(userId, month);

        return { month, total: overall.total, count: overall.count, byCategory };
}

function previousMonth (month) {
    const [year, m] = month.split('-').map(Number);
    const d = new Date(Date.UTC(year, m - 2, 1));
    return d.toISOString().slice(0, 7);
}

function getFacts (userId, month) {
    const current = getMonthlySummary(userId, month);
    const previous = getMonthlySummary(userId, previousMonth(month));

    const [year, m] = month.split('-').map(Number);
    const daysInMonth = new Date(year, m, 0).getDate();
    const now = new Date();
    const isThisMonth = now.toISOString().slice(0, 7) === month;
    const daysSoFar = isThisMonth ? now.getDate() : daysInMonth;

    const budgetRow = db
        .prepare('SELECT amount FROM budgets WHERE user_id = ? AND month = ?')
        .get(userId, month);
    const budget = budgetRow ? budgetRow.amount : 0;

    const income = db
    .prepare(
      `SELECT COALESCE(SUM(amount), 0) AS total FROM income
       WHERE user_id = ? AND substr(date, 1, 7) = ?`
    )
    .get(userId, month).total;

  const biggest = db
    .prepare(
      `SELECT e.amount, COALESCE(c.name, 'Uncategorized') AS category
       FROM expenses e
       LEFT JOIN categories c ON c.id = e.category_id
       WHERE e.user_id = ? AND substr(e.date, 1, 7) = ?
       ORDER BY e.amount DESC LIMIT 1`
    )
    .get(userId, month);

      const pct = (part, whole) => (whole > 0 ? Math.round((part / whole) * 100) : null);
  const prevByName = Object.fromEntries(
    previous.byCategory.map((r) => [r.category, r.total])
  );

  return {
    month,
    spent: current.total,
    transactions: current.count,
    previousMonthSpent: previous.total,
    changeVsPreviousPercent:
      previous.total > 0
        ? Math.round(((current.total - previous.total) / previous.total) * 100)
        : null,
    averagePerDay: Math.round(current.total / daysSoFar),
    daysCounted: daysSoFar,
    categories: current.byCategory.map((r) => ({
      name: r.category,
      spent: r.total,
      sharePercent: pct(r.total, current.total),
      previousMonthSpent: prevByName[r.category] ?? 0,
    })),
    budget:
      budget > 0 ? { amount: budget, usedPercent: pct(current.total, budget) } : null,
    income:
      income > 0
        ? {
            amount: income,
            leftOver: income - current.total,
            savingsRatePercent: pct(income - current.total, income),
          }
        : null,
    largestExpense: biggest || null,
  };

}

module.exports = { getMonthlySummary, previousMonth, getFacts };