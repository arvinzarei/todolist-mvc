const express = require('express');
const Database = require('better-sqlite3');
const cors = require('cors');
const path = require('path');

const app = express();
const db = new Database('todos.db'); // ایجاد فایل دیتابیس

app.use(cors());
app.use(express.json());
app.use(express.static('.')); // برای اجرای فایل‌های HTML/JS

// ایجاد جدول در دیتابیس اگر وجود نداشته باشد
db.exec(`
  CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    completed INTEGER DEFAULT 0
  )
`);

// مسیر (Route) برای دریافت همه تسک‌ها
app.get('/api/todos', (req, res) => {
    const todos = db.prepare('SELECT * FROM todos').all();
    // تبدیل 0 و 1 به false و true برای هماهنگی با فرانت‌اند
    res.json(todos.map(t => ({...t, completed: !!t.completed})));
});

// مسیر برای افزودن تسک جدید
app.post('/api/todos', (req, res) => {
    const { id, title, description, completed } = req.body;
    const insert = db.prepare('INSERT INTO todos (id, title, description, completed) VALUES (?, ?, ?, ?)');
    insert.run(id, title, description, completed ? 1 : 0);
    res.status(201).json({ message: 'Saved!' });
});

// مسیر برای حذف تسک
app.delete('/api/todos/:id', (req, res) => {
    db.prepare('DELETE FROM todos WHERE id = ?').run(req.params.id);
    res.json({ message: 'Deleted!' });
});

// مسیر برای آپدیت تسک (تغییر وضعیت یا ویرایش متن)
app.put('/api/todos/:id', (req, res) => {
    const { title, description, completed } = req.body;
    const update = db.prepare('UPDATE todos SET title = ?, description = ?, completed = ? WHERE id = ?');
    update.run(title, description, completed ? 1 : 0, req.params.id);
    res.json({ message: 'Updated!' });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});