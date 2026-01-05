import Model from './model.js';
import View from './view.js';
import Controller from './controller.js';

document.addEventListener('DOMContentLoaded', () => {
    const model = new Model();
    const view = new View();
    const controller = new Controller(model, view);

    // مدیریت دایره پیشرفت (Progress Ring)
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

    // ثبت یک مشاهده‌گر دیگر مخصوص آپدیت دایره پیشرفت (Observer Pattern)
    model.addObserver(updateProgress);
    updateProgress(model.todos);

    // تم (Dark/Light)
    const themeBtn = document.getElementById('theme-btn');
    const setTheme = (t) => {
        document.documentElement.setAttribute('data-theme', t);
        localStorage.setItem('theme', t);
        themeBtn.innerHTML = t === 'light' ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
    };
    setTheme(localStorage.getItem('theme') || 'light');
    themeBtn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        setTheme(current === 'light' ? 'dark' : 'light');
    });

    // نمایش تاریخ فارسی
    document.getElementById('date-display').textContent = new Date().toLocaleDateString('fa-IR', { 
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
    });
});