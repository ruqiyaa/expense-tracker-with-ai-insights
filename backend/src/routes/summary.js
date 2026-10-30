const express = require('express');
const db = require('../db');
const requireAuth = require('../middleware/auth');
const router = express.Router();

router.use(requireAuth);

//---- GET /summary?month=2026-10
router.get('/', (req,res) => {
    const { month } = req.query;

    if(( !month || !/^\d{4}-\d{2}$/.test(month))) {
        return res.status(400).json({error : 'month is required in yyyy-mm-dd format'});

    }

    //total by category
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
        .all(req.user.id, month);

        //overall total
        const overall = db
            .prepare(
                `SELECT COALESCE(SUM(amount), 0) AS total, COUNT(*) AS count
                FROM expenses
                WHERE user_id = ? AND substr(date, 1, 7) = ?`
            ).get(req.user.id, month);

        //console.log({month, userId : req.user.id, byCategory, overall});
        res.json({
            month,
            total: overall.total,
            count: overall.count,
            byCategory,
        });
});

module.exports = router;