require('dotenv').config();
const express = require('express');
const db = require('./db');

const authRoutes = require('./routes/auth');
const requireAuth = require('./middleware/auth');

const categoryRoutes = require('./routes/categories');
const expenseRoutes = require('./routes/expense');

const summaryRoutes = require('./routes/summary');

const budgetRoutes = require('./routes/budgets');

const incomeRoutes = require('./routes/income');

const goalRoutes = require('./routes/goals');

const app = express();
app.use(express.json());
app.use(express.static('public'));

app.use('/auth', authRoutes);
app.use('/categories', categoryRoutes);
app.use('/expenses', expenseRoutes);
app.use('/summary', summaryRoutes);
app.use('/budgets', budgetRoutes);
app.use('/income', incomeRoutes);
app.use('/goals', goalRoutes);

//temp route
app.get('/me', requireAuth, (req, res) => {
    res.json({ user: req.user})
});

// app.get('/', (req, res) => {
//     res.json({ message : 'Expense tracker API is running'});

// });

const PORT = process.env.PORT || 3000;

app.listen(PORT, () =>{
    console.log(`Server running on http://localhost:${PORT}`);
});