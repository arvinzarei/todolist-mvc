export default class View {
    constructor() {
        this.form = document.querySelector('#todo-form');
        this.titleInput = document.querySelector('#todo-title');
        this.descInput = document.querySelector('#todo-desc');
        this.todoList = document.querySelector('#todo-list');
        this.itemsLeft = document.querySelector('#items-left');
        this.filterBtns = document.querySelectorAll('.filter-btn');
        this.clearBtn = document.querySelector('#clear-completed');
        this.modal = document.querySelector('#edit-modal');
        this.modalTitle = document.querySelector('#modal-title');
        this.modalDesc = document.querySelector('#modal-desc');
        this.saveModalBtn = document.querySelector('#save-modal');
        this.closeModalBtn = document.querySelector('#close-modal');
        this.toastContainer = document.querySelector('#toast-container');
        this.currentEditId = null;
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `<span>${message}</span>`;
        this.toastContainer.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 500);
        }, 3000);
    }

    displayTodos(todosToShow, allTodos) {
        this.todoList.innerHTML = '';
        todosToShow.forEach(todo => {
            const li = document.createElement('li');
            li.id = todo.id;
            li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
            li.innerHTML = `
                <div class="todo-text-content">
                    <h3>${todo.title}</h3>
                    <p>${todo.description || ''}</p>
                    <span class="todo-meta"><i class="far fa-clock"></i> ${todo.createdAt || ''}</span>
                </div>
                <div class="actions">
                    <button class="complete-btn" title="تغییر وضعیت">
                        <i class="${todo.completed ? 'fas fa-check-circle' : 'far fa-circle'}"></i>
                    </button>
                    <button class="edit-btn"><i class="fas fa-edit"></i></button>
                    <button class="delete-btn"><i class="fas fa-trash"></i></button>
                </div>
            `;
            this.todoList.append(li);
        });

        const activeCount = allTodos.filter(t => !t.completed).length;
        this.itemsLeft.textContent = `${activeCount} مورد باقی مانده`;
        this.filterBtns.forEach(btn => {
            const f = btn.dataset.filter;
            if (f === 'all') btn.textContent = `همه (${allTodos.length})`;
            if (f === 'active') btn.textContent = `جاری (${activeCount})`;
            if (f === 'completed') btn.textContent = `انجام شده (${allTodos.length - activeCount})`;
        });
    }

    bindAddTodo(handler) {
        this.form.addEventListener('submit', e => {
            e.preventDefault();
            if (this.titleInput.value.trim()) {
                handler(this.titleInput.value, this.descInput.value);
                this.titleInput.value = ''; this.descInput.value = '';
                this.showToast('تسک جدید اضافه شد', 'success');
            }
        });
    }

    bindDeleteTodo(handler) {
        const deleteModal = document.querySelector('#delete-confirm-modal');
        let deleteId = null;

        this.todoList.addEventListener('click', e => {
            if (e.target.closest('.delete-btn')) {
                deleteId = Number(e.target.closest('.todo-item').id);
                deleteModal.classList.add('active');
            }
        });

        document.querySelector('#confirm-delete-btn').onclick = () => {
            handler(deleteId);
            deleteModal.classList.remove('active');
            this.showToast('تسک با موفقیت حذف شد', 'delete');
        };

        document.querySelector('#cancel-delete-btn').onclick = () => {
            deleteModal.classList.remove('active');
        };
    }

    bindEditTodo(handler) {
        this.todoList.addEventListener('click', e => {
            if (e.target.closest('.edit-btn')) {
                const li = e.target.closest('.todo-item');
                this.currentEditId = Number(li.id);
                this.modalTitle.value = li.querySelector('h3').textContent;
                this.modalDesc.value = li.querySelector('p').textContent;
                this.modal.classList.add('active');
            }
        });
        this.saveModalBtn.onclick = () => {
            handler(this.currentEditId, this.modalTitle.value, this.modalDesc.value);
            this.modal.classList.remove('active');
            this.showToast('تغییرات ذخیره شد', 'success');
        };
        this.closeModalBtn.onclick = () => this.modal.classList.remove('active');
    }
}