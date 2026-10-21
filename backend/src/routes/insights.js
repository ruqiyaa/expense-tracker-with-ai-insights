const express = require('express');
const requireAuth = require('../middleware/auth');
const { getFacts } = require('../services/summary');
const { getInsights } = require('../services/ai');

const router = express.Router();
router.use(requireAuth);

// POST /insights   body: { "month": "2026-10" }
router.post('/', async (req, res) => {
  const { month } = req.body || {};

  if (!month || !/^\d{4}-\d{2}$/.test(month)) {
    return res.status(400).json({ error: 'month is required, format YYYY-MM' });
  }

  const facts = getFacts(req.user.id, month);

  if (facts.transactions === 0) {
    return res.json({
      month,
      insights: {
        headline: 'No expenses recorded for this month yet.',
        observations: [],
        tips: [],
      },
    });
  }

  try {
    const insights = await getInsights(facts);
    res.json({ month, insights });
  } catch (err) {
    console.error('AI error:', err.message);
    res.status(502).json({ error: 'could not get insights right now' });
  }
});

module.exports = router;