const db = require('../src/db');

console.log('USERS:', db.prepare('SELECT id, name, email FROM users').all());
console.log('CATEGORIES: ', db.prepare('SELECT * FROM categories').all());
console.log('EXPENSES: ', db.prepare('SELECT * FROM expenses').all());
console.log('BUDGETS:', db.prepare('SELECT * FROM budgets').all());
console.log('INCOME:', db.prepare('SELECT * FROM income').all());
console.log('GOALS:', db.prepare('SELECT * FROM goals').all());