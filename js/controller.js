export default class Controller {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.filter = 'all';

        this.model.addObserver(this.onTodoListChanged);
        this.view.bindAddTodo(this.handleAddTodo);
        this.view.bindDeleteTodo(this.handleDeleteTodo);
        this.view.bindEditTodo(this.handleEditTodo);
        
        this.initClickHandlers();
        this.initClearModal();
        this.initFilters();
        
        this.onTodoListChanged(this.model.todos);
    }

    onTodoListChanged = (todos) => {
        let f = todos;
        if (this.filter === 'active') f = todos.filter(t => !t.completed);
        if (this.filter === 'completed') f = todos.filter(t => t.completed);
        this.view.displayTodos(f, todos);
    }

    handleAddTodo = (t, d) => this.model.addTodo(t, d);
    handleDeleteTodo = (id) => this.model.deleteTodo(id);
    handleEditTodo = (id, t, d) => this.model.editTodo(id, t, d);
    handleToggleTodo = (id) => this.model.toggleTodo(id);

    initClickHandlers() {
        this.view.todoList.addEventListener('click', e => {
            const btn = e.target.closest('.complete-btn');
            if (btn) {
                const id = Number(btn.closest('.todo-item').id);
                const todo = this.model.todos.find(t => t.id === id);
                this.handleToggleTodo(id);
                
                // نمایش توست بر اساس وضعیت جدید
                const statusText = !todo.completed ? 'تسک انجام شد' : 'تسک به لیست جاری برگشت';
                this.view.showToast(statusText, 'info');
            }
        });
    }

    initClearModal() {
        const modal = document.querySelector('#clear-modal');
        this.view.clearBtn.addEventListener('click', () => {
            if(this.model.todos.some(t => t.completed)) modal.classList.add('active');
        });
        document.querySelector('#confirm-clear').onclick = () => {
            this.model.clearCompleted();
            modal.classList.remove('active');
            this.view.showToast('انجام شده‌ها پاکسازی شدند', 'delete');
        };
        document.querySelector('#close-clear').onclick = () => modal.classList.remove('active');
    }

    initFilters() {
        this.view.filterBtns.forEach(btn => {
            btn.addEventListener('click', e => {
                this.filter = e.target.dataset.filter;
                this.view.filterBtns.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.onTodoListChanged(this.model.todos);
            });
        });
    }
}