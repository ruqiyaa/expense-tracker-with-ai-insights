const express = require('express');
const requireAuth = require('../middleware/auth');
const { getMonthlySummary, previousMonth } = require('../services/summary');
const { getInsights } = require('../services/ai');

const router = express.Router();
router.use(requireAuth);

// POST /insights   body: { "month": "2026-10" }
router.post('/', async (req, res) => {
  const { month } = req.body || {};

  if (!month || !/^\d{4}-\d{2}$/.test(month)) {
    return res.status(400).json({ error: 'month is required, format YYYY-MM' });
  }

  const current = getMonthlySummary(req.user.id, month);
  const previous = getMonthlySummary(req.user.id, previousMonth(month));

  if (current.count === 0) {
    return res.json({ month, insights: 'No expenses recorded for this month yet.' });
  }

  try {
    const insights = await getInsights(current, previous);
    res.json({ month, insights });
  } catch (err) {
    console.error('AI error:', err.message);
    res.status(502).json({ error: 'could not get insights right now' });
  }
});

module.exports = router;