const form = document.querySelector('#form');
const taskInput = document.querySelector('#input');
const tasksList = document.querySelector('.tasksList');
const filterButtons = document.querySelectorAll('.main__filter-item button');


form.addEventListener('submit', hundleForm);
tasksList.addEventListener('click', deleteTasks);
tasksList.addEventListener('click', doneTasks);

let tasks = [];

document.addEventListener('DOMContentLoaded', () => {
    const defaultFilter = 'All';
    document.querySelector(`.${defaultFilter}`).setAttribute('aria-selected', 'true');
    filterTasks(defaultFilter); 
});


if (localStorage.getItem('tasks')){
    tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks.forEach((task) => {
        renderTask(task)
    })
}



function hundleForm(e) {
    e.preventDefault();

    const taskText = taskInput.value.trim();
    if (!taskText) return;

    const newTask = {
        id: Date.now(),
        text: taskText,
        done: false,
    };

    tasks.push(newTask);

    renderTask(newTask);

    taskInput.value = '';
    taskInput.focus();
    saveToLocalStorage(tasks);
}

function deleteTasks(e) {
    if (e.target.closest('button')?.dataset.action === 'delete') {
        const parentElement = e.target.closest('.task__items');
        const id = Number(parentElement.id);

        tasks = tasks.filter((task) => task.id !== id); 
        parentElement.remove();
        
        saveToLocalStorage(tasks);
    }
    
}

function doneTasks(e) {
    if (e.target.closest('button')?.dataset.action === 'done') {
        const parentElement = e.target.closest('.task__items');
        const id = Number(parentElement.id);

        const task = tasks.find((task) => task.id === id);
        if (task) task.done = true; 

        parentElement.classList.add('done');
        const innerTask = parentElement.querySelector('.task__input');
        innerTask.classList.add('done');
        
        saveToLocalStorage(tasks);

    }
}

function saveToLocalStorage(tasks){
    localStorage.setItem('tasks',JSON.stringify(tasks));
}

function renderTask(task){
    const cssClass = task.done ? 'done' : '';

    const taskHtml = `<li id='${task.id}' class="task__items ${cssClass}">
                        <input type="text" class="task__input ${cssClass}" value="${task.text}">
                        <div class="task__button">
                            <button type="button" data-action="done" class="btn-action">
                                <img src="Images/tick.svg" alt="Done">
                            </button>
                            <button type="button" data-action="delete" class="btn-action">
                                <img src="Images/cross.svg" alt="Delete">
                            </button>
                        </div>
                    </li>`;

    tasksList.insertAdjacentHTML('beforeend', taskHtml);

}



function filterTasks(filter) {
    tasksList.innerHTML = ''; 

    let filteredTasks = [];
    if (filter === 'All') {
        filteredTasks = tasks;
    } else if (filter === 'Active') {
        filteredTasks = tasks.filter(task => !task.done);
    } else if (filter === 'Completed') {
        filteredTasks = tasks.filter(task => task.done);
    }

    filteredTasks.forEach(task => renderTask(task)); 
}


filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        const filter = button.className; 

        
        filterButtons.forEach(btn => btn.setAttribute('aria-selected', 'false'));
        button.setAttribute('aria-selected', 'true');

        filterTasks(filter); 
    });
});


