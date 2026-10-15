const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

const router = express.Router();

function createToken(user) {
    return jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn : '7d' }
    );
}

// ---POST /auth/register---

router.post('/register', (req, res) => {
    const { name, email, password } = req.body;

    if(!name || !email || !password) {
        return res.status(400).json({ error: 'Name, email and password are required'});
    }
    if(password.length < 8) {
        return res.status(400).json({ error : 'Password length must be atleast 8 characters'});
    }
    
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) {
        return res.status(409).json({ error: 'email already registered'});
    }

    const passwordHash = bcrypt.hashSync(password, 10);

    const result = db
        .prepare('INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)')
        .run(name, email, passwordHash);

    const user = { id: result.lastInsertRowid, email };
    res.status(201).json({ message: 'registered', token: createToken(user)});
});

// --- POST /auth/login ---

router.post('/login', (req, res) => {
    const { email, password } = req.body;

    if( !email || !password ){
        return res.status(400).json({ error: "Email and password both are required"});

    }

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);

    if( !user || !bcrypt.compareSync(password, user.password_hash)) {
        return res.status(401).json({ error: 'Invalid email or password'});
    }

    res.json({ message: 'logged in', token: createToken(user)});
});

module.exports = router;