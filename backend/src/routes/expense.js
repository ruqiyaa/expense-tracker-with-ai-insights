const express = require('express');
const db = require('../db');
const requireAuth = require('../middleware/auth');

const router = express.Router();

router.use(requireAuth);

//-----CREATE------
//-----POST /expenses ------

router.post('/', (req, res) => {
    const { amount, description, date, category_id } = req.body;

    if(typeof amount !== 'number' || amount <=0) {
        return res(400).json({ error: 'invalid amount'});

    }

    if( !date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return res.status(400).json({error : 'enter correct date format yyyy-mm-dd'});
    }

    if(category_id) {
        const cat = db
            .prepare('SELECT id FROM categories WHERE id = ? AND user_id = ?')
            .get(category_id, req.user.id);
        
        if(!cat) {
            return res.status(400).json({ error : 'category not found'});
        }
    }

    const result = db
        .prepare('INSERT INTO expenses (user_id, category_id, amount, description, date) VALUES (?, ?, ?, ?, ?)')
        .run(req.user.id, category_id || null , amount, description || null, date);

    res.status(201).json({ id : result.lastInsertRowid, amount, description, date, category_id});
});


//---- READ (list) ----
//---- GET /expenses?month=2026-10&category_id ----
router.get('/', (req, res) => {
    const {month, category_id} = req.query;

    let sql = `
        SELECT e.id, e.amount, e.description, e.date, e.category_id, c.name AS category
        FROM expenses e
        LEFT JOIN categories c ON c.id = e.category_id
        WHERE e.user_id = ?
        `;

    const params = [req.user.id];

    if( month ) {
        sql += ' AND substr(e.date, 1, 7) = ?';
        params.push(month);
    }

    if(category_id){
        sql += ' AND substr(e.date, 1, 7) = ?';
        params.push(category_id);
    }

    sql += ' ORDER BY e.date DESC';

    const rows = db.prepare(sql).all(...params);
    res.json(rows);
});

// ---- UPDATE ---- 
//---- PUT /expenses/:id ----
router.put('/:id', (req, res) => {
    const expense = db
        .prepare('SELECT * FROM expenses WHERE id = ? AND user_id = ?')
        .get(req.params.id, req.user.id);

    if( !expense) {
        return res.status(404).json({ error: 'expense not found'});

    }

    const amount = req.body.amount ?? expense.amount;
    const description = req.body.description ?? expense.description;
    const date = req.boy.date ?? expense.date;
    const category_id = req.bosy.category_id ?? expense.category_id;

    db.prepare(
        'UPDATE expenses SET amount = ?, description = ?, date= ?, category_id = ?, WHERE id = ? AND user_id = ?'
    ).run(amount, description, date, category_id, req.params.id, req.user.id);

    res.json({ id: expense.id, amount, description, date, category_id});
});

 
// ---- DELETE ----
// ----- DELETE /expenses/:id -----
router.delete('/:id', (req, res) => {
    const result = db
        .prepare('DELETE FROM expenses WHERE id = ? AND user_id = ?')
        .run(req.params.id, req.user.id);

    if(result.changes ===0 ){
        return res.status(404).jsom({ error : 'expense not found'});
    }

    res.json({ message: 'deleted'});
});

module.exports = router;