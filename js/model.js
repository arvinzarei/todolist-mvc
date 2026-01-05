export default class Model {
    constructor() {
        this.todos = [];
        this.observers = [];
        this.apiUrL = 'http://localhost:3000/api/todos';
        
        // بارگذاری اولیه داده‌ها از سرور
        this.loadTodos();
    }

    addObserver(observer) {
        this.observers.push(observer);
    }

    notify() {
        this.observers.forEach(observer => observer(this.todos));
    }

    // متد جدید برای خواندن دیتا از SQLite
    async loadTodos() {
        try {
            const response = await fetch(this.apiUrL);
            this.todos = await response.json();
            this.notify();
        } catch (error) {
            console.error("خطا در بارگذاری داده‌ها:", error);
        }
    }

    async addTodo(title, description) {
        const newTodo = {
            id: Date.now(),
            title,
            description: description || '',
            completed: false
        };

        try {
            await fetch(this.apiUrL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newTodo)
            });
            this.todos.push(newTodo);
            this.notify();
        } catch (error) {
            console.error("خطا در ذخیره تسک:", error);
        }
    }

    async editTodo(id, updatedTitle, updatedDesc) {
        const todo = this.todos.find(t => t.id === id);
        const updatedData = { 
            title: updatedTitle, 
            description: updatedDesc, 
            completed: todo.completed 
        };

        try {
            await fetch(`${this.apiUrL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedData)
            });
            this.todos = this.todos.map(t => t.id === id ? { ...t, ...updatedData } : t);
            this.notify();
        } catch (error) {
            console.error("خطا در ویرایش:", error);
        }
    }

    async deleteTodo(id) {
        try {
            await fetch(`${this.apiUrL}/${id}`, { method: 'DELETE' });
            this.todos = this.todos.filter(t => t.id !== id);
            this.notify();
        } catch (error) {
            console.error("خطا در حذف:", error);
        }
    }

    async toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        const updatedData = { 
            title: todo.title, 
            description: todo.description, 
            completed: !todo.completed 
        };

        try {
            await fetch(`${this.apiUrL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedData)
            });
            this.todos = this.todos.map(t => t.id === id ? { ...t, ...updatedData } : t);
            this.notify();
        } catch (error) {
            console.error("خطا در تغییر وضعیت:", error);
        }
    }

    async clearCompleted() {
        // برای سادگی، تک‌تک تسک‌های انجام شده را حذف می‌کنیم
        const completedTodos = this.todos.filter(t => t.completed);
        for (const todo of completedTodos) {
            await this.deleteTodo(todo.id);
        }
    }
}