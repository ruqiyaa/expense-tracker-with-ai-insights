const express = require('express');
const db = require('../db');
const requireAuth = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth);

//----GET /income?month=2026-10 -----
router.get('/', (req, res) => {
    const {month} = req.query;

    if (!month || !/^\d{4}-\d{2}$/.test(month)) {
    return res.status(400).json({ error: 'month is required, format YYYY-MM' });
  }

  const entries = db
    .prepare(`SELECT id, amount, source, date FROM income
        WHERE user_id = ? AND substr(date, 1, 7) = ?
        ORDER BY date DESC`)
        .all(req.user.id, month);

        const total = entries.reduce((sum, e) => sum + e.amount, 0);

  res.json({ month, total, entries });
});

// POST /income  body: { amount, source, date }
router.post('/', (req, res) => {
  const { amount, source, date } = req.body || {};

  if (typeof amount !== 'number' || amount <= 0) {
    return res.status(400).json({ error: 'amount must be a number greater than 0' });
  }
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).json({ error: 'date is required, format YYYY-MM-DD' });
  }

  const result = db
    .prepare('INSERT INTO income (user_id, amount, source, date) VALUES (?, ?, ?, ?)')
    .run(req.user.id, amount, source || null, date);

  res.status(201).json({ id: result.lastInsertRowid, amount, source, date });
});

// DELETE /income/:id
router.delete('/:id', (req, res) => {
  const result = db
    .prepare('DELETE FROM income WHERE id = ? AND user_id = ?')
    .run(req.params.id, req.user.id);

  if (result.changes === 0) {
    return res.status(404).json({ error: 'income not found' });
  }
  res.json({ message: 'deleted' });
});

module.exports = router;
