const express = require('express');
const db = require('../db');
const requireAuth = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth);

//----GET /budgets?month=2026-10 -----
router.get('/', (req, res) => {
    const { month } = req.query;

    if(!month || !/^\d{4}-\d{2}$/.test(month)) {
        return res.status(400).json({ error: 'month is required, format yyyy-mm'});

    }

    const row = db
        .prepare('SELECT amount FROM budgets WHERE user_id = ? AND month = ?')
        .get(req.user.id, month);

    res.json({ month, amount: row ? row.amount : 0});
});

// PUT /budgets   body: { "month": "2026-10", "amount": 4000 }
router.put('/', (req, res) => {
  const { month, amount } = req.body || {};

  if (!month || !/^\d{4}-\d{2}$/.test(month)) {
    return res.status(400).json({ error: 'month is required, format YYYY-MM' });
  }
  if (typeof amount !== 'number' || amount < 0) {
    return res.status(400).json({ error: 'amount must be a number, 0 or more' });
  }

  db.prepare(
    `INSERT INTO budgets (user_id, month, amount) VALUES (?, ?, ?)
     ON CONFLICT (user_id, month) DO UPDATE SET amount = excluded.amount`
  ).run(req.user.id, month, amount);

  res.json({ month, amount });
});

module.exports = router;