const express = require('express')
const db = require('../db');
const requireAuth = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth);

//----GET /goals----
router.get('/', (req, res) => {
    const row = db
        .prepare('SELECT name, target, saved FROM goals WHERE user_id = ?')
        .all(req.user.id);


    res.json(row || {name:'', target: 0, saved: 0})
})

//-----PUT ----
router.put('/', (req, res) => {
    const { name, target, saved } = req.body || {} ;

    if(!name || typeof target !== 'number' || target < 0) {
        return res.status(400).json({ error : 'name and target above 0 are required'});
    }

    if(typeof saved !== 'number' || saved < 0) {
        return res.status(400).json({ error : 'saved must be a number, 0 or more'});
    }

   db.prepare(
    `INSERT INTO goals (user_id, name, target, saved) VALUES (?, ?, ?, ?) 
    ON CONFLICT (user_id) DO UPDATE SET 
    name = excluded.name,
    target = excluded.target,
    saved = excluded.saved`
   ).run(req.user.id, name, target, saved);

   res.json({ name, target, saved})
})

module.exports = router;