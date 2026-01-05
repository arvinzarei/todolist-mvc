export default class Controller {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.filter = 'all';

        // ثبت کنترلر به عنوان مشاهده‌گر در مدل
        this.model.addObserver(this.onTodoListChanged);

        // اتصال رویدادهای ویو به هندلرهای کنترلر
        this.view.bindAddTodo(this.handleAddTodo);
        this.view.bindDeleteTodo(this.handleDeleteTodo);
        this.view.bindToggleTodo(this.handleToggleTodo);
        this.view.bindEditTodo(this.handleEditTodo);
        
        this.initFilters();
        
        // نمایش اولیه
        this.onTodoListChanged(this.model.todos);
    }

    // این متد هر بار که مدل notify کند، اجرا می‌شود
    onTodoListChanged = (todos) => {
        let filtered = todos;
        if (this.filter === 'active') filtered = todos.filter(t => !t.completed);
        if (this.filter === 'completed') filtered = todos.filter(t => t.completed);
        
        this.view.displayTodos(filtered, todos);
    }

    handleAddTodo = (title, desc) => this.model.addTodo(title, desc);
    handleDeleteTodo = (id) => this.model.deleteTodo(id);
    handleToggleTodo = (id) => this.model.toggleTodo(id);
    handleEditTodo = (id, title, desc) => this.model.editTodo(id, title, desc);

    initFilters() {
        this.view.filterBtns.forEach(btn => {
            btn.addEventListener('click', e => {
                this.filter = e.target.dataset.filter;
                this.view.filterBtns.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.onTodoListChanged(this.model.todos);
            });
        });
        this.view.clearBtn.addEventListener('click', () => this.model.clearCompleted());
    }
}