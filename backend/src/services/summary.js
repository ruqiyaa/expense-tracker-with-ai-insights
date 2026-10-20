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

module.exports = { getMonthlySummary, previousMonth}