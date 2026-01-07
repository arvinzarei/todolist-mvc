export default class Model {
    constructor() {
        this.todos = JSON.parse(localStorage.getItem('todos')) || [];
        this.observers = [];
        this.apiUrL = 'http://localhost:3000/api/todos';
        this.loadTodos();
    }

    addObserver(observer) { this.observers.push(observer); }

    notify() {
        localStorage.setItem('todos', JSON.stringify(this.todos));
        this.observers.forEach(observer => observer(this.todos));
    }

    async loadTodos() {
        try {
            const response = await fetch(this.apiUrL);
            if(response.ok) {
                this.todos = await response.json();
                this.notify();
            }
        } catch (error) {
            console.log("Using Local Storage mode.");
            this.notify();
        }
    }

    async addTodo(title, description) {
        const now = new Date();
        const newTodo = {
            id: Date.now(),
            title,
            description: description || '',
            completed: false,
            createdAt: now.toLocaleDateString('fa-IR') + ' ' + now.toLocaleTimeString('fa-IR', {hour: '2-digit', minute:'2-digit'})
        };

        this.todos.push(newTodo);
        this.notify();

        try {
            await fetch(this.apiUrL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newTodo)
            });
        } catch (e) {}
    }

    async editTodo(id, updatedTitle, updatedDesc) {
        this.todos = this.todos.map(t => t.id === id ? { ...t, title: updatedTitle, description: updatedDesc } : t);
        this.notify();
        try {
            await fetch(`${this.apiUrL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(this.todos.find(t => t.id === id))
            });
        } catch(e){}
    }

    async deleteTodo(id) {
        this.todos = this.todos.filter(t => t.id !== id);
        this.notify();
        try {
            await fetch(`${this.apiUrL}/${id}`, { method: 'DELETE' });
        } catch(e){}
    }

    async toggleTodo(id) {
        this.todos = this.todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
        this.notify();
        try {
            const todo = this.todos.find(t => t.id === id);
            await fetch(`${this.apiUrL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(todo)
            });
        } catch(e){}
    }

    async clearCompleted() {
        const toDelete = this.todos.filter(t => t.completed);
        this.todos = this.todos.filter(t => !t.completed);
        this.notify();
        for(const t of toDelete) {
            try { await fetch(`${this.apiUrL}/${t.id}`, { method: 'DELETE' }); } catch(e){}
        }
    }
}