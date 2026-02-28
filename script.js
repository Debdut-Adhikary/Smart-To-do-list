const taskInput = document.getElementById("taskInput");
const dueDate = document.getElementById("dueDate");
const priority = document.getElementById("priority");
const category = document.getElementById("category");
const addTaskBtn = document.getElementById("addTask");
const taskList = document.getElementById("taskList");
const searchInput = document.getElementById("search");
const filterSelect = document.getElementById("filter");
const progressBar = document.getElementById("progressBar");
const clearCompletedBtn = document.getElementById("clearCompleted");
const themeToggle = document.getElementById("themeToggle");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
    taskList.innerHTML = "";

    let filtered = tasks.filter(task => {
        if (filterSelect.value === "Completed") return task.completed;
        if (filterSelect.value === "Pending") return !task.completed;
        return true;
    });

    filtered = filtered.filter(task =>
        task.text.toLowerCase().includes(searchInput.value.toLowerCase())
    );

    filtered.forEach((task, index) => {
        const li = document.createElement("li");
        li.classList.add(`priority-${task.priority}`);
        if (task.completed) li.classList.add("completed");

        li.draggable = true;

        li.innerHTML = `
            <div class="task-info">
                <strong>${task.text}</strong>
                <small>Due: ${task.due || "No date"} | ${task.category}</small>
            </div>
            <div>
                <button onclick="editTask(${index})">Edit</button>
                <button onclick="deleteTask(${index})">Delete</button>
            </div>
        `;

        li.addEventListener("click", () => {
            task.completed = !task.completed;
            saveTasks();
            renderTasks();
        });

        taskList.appendChild(li);
    });

    updateProgress();
}

function updateProgress() {
    const completed = tasks.filter(t => t.completed).length;
    const total = tasks.length;
    const percent = total === 0 ? 0 : (completed / total) * 100;
    progressBar.style.width = percent + "%";
}

addTaskBtn.addEventListener("click", () => {
    if (taskInput.value.trim() === "") return;

    tasks.push({
        text: taskInput.value,
        due: dueDate.value,
        priority: priority.value,
        category: category.value,
        completed: false
    });

    taskInput.value = "";
    dueDate.value = "";
    saveTasks();
    renderTasks();
});

function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
}

function editTask(index) {
    const newText = prompt("Edit task:", tasks[index].text);
    if (newText) {
        tasks[index].text = newText;
        saveTasks();
        renderTasks();
    }
}

clearCompletedBtn.addEventListener("click", () => {
    tasks = tasks.filter(task => !task.completed);
    saveTasks();
    renderTasks();
});

searchInput.addEventListener("input", renderTasks);
filterSelect.addEventListener("change", renderTasks);

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
});

renderTasks();