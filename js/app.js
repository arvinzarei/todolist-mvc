import Model from './model.js';
import View from './view.js';
import Controller from './controller.js';

document.addEventListener('DOMContentLoaded', () => {
    const model = new Model();
    const view = new View();
    new Controller(model, view);

    // ۲- نمایش تاریخ کاملاً عددی در هدر
    document.getElementById('date-display').textContent = new Date().toLocaleDateString('fa-IR');

    // مدیریت Progress Ring
    const circle = document.querySelector('.progress-ring__circle');
    const radius = circle.r.baseVal.value;
    const circum = radius * 2 * Math.PI;
    circle.style.strokeDasharray = `${circum} ${circum}`;

    const updateProgress = (todos) => {
        const total = todos.length;
        const completed = todos.filter(t => t.completed).length;
        const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
        circle.style.strokeDashoffset = circum - (percent / 100) * circum;
        document.getElementById('progress-text').textContent = `${percent}%`;
    };

    model.addObserver(updateProgress);
    updateProgress(model.todos);

    // مدیریت تم
    const themeBtn = document.getElementById('theme-btn');
    const setTheme = (t) => {
        document.documentElement.setAttribute('data-theme', t);
        localStorage.setItem('theme', t);
        themeBtn.innerHTML = t === 'light' ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
    };
    setTheme(localStorage.getItem('theme') || 'light');
    themeBtn.onclick = () => {
        const current = document.documentElement.getAttribute('data-theme');
        setTheme(current === 'light' ? 'dark' : 'light');
    };
});