const express = require('express');
const db = require('../db');
const requireAuth = require('../middleware/auth');

const router = express.Router();

router.use(requireAuth);

// ---POST /categories---

router.post('/', (req, res) => {
    const {name} = req.body;

    if(!name){
        return res.status(400).json({error : 'name is required'});
    }

    const result = db
        .prepare('INSERT INTO categories (user_id, name) VALUES (?, ?)' )
        .run(req.user.id, name);
    
    res.status(201).json({ id: result.lastInsertRowid, name});
});

// ---GET /categories ->read 

router.get('/', (res, req) => {
    const rows = db
        .prepare('SELECT id, name FROM categories WHERE user_id = ?')
        .all(req.user.id);

    res.json(rows);
});

module.exports = router;