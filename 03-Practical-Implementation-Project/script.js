
const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const clearBtn = document.getElementById("clearBtn");

// Load saved tasks from browser storage
let tasks = [];

try {
    const savedTasks = localStorage.getItem("todoTasks");
    tasks = savedTasks ? JSON.parse(savedTasks) : [];

    if (!Array.isArray(tasks)) {
        tasks = [];
    }
} catch (error) {
    tasks = [];
}

// Save tasks in browser storage
function saveTasks() {
    localStorage.setItem("todoTasks", JSON.stringify(tasks));
}

// Display tasks on the webpage
function displayTasks() {
    taskList.innerHTML = "";

    tasks.forEach(function(task) {
        const li = document.createElement("li");

        if (task.completed) {
            li.classList.add("completed");
        }

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.setAttribute("aria-label", "Mark task complete");

        checkbox.addEventListener("change", function() {
            task.completed = checkbox.checked;
            saveTasks();
            displayTasks();
        });

        const span = document.createElement("span");
        span.textContent = task.text;

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.className = "delete-btn";

        deleteBtn.addEventListener("click", function() {
            tasks = tasks.filter(function(item) {
                return item.id !== task.id;
            });

            saveTasks();
            displayTasks();
        });

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    });

    totalTasks.textContent = "Total: " + tasks.length;

    const completedCount = tasks.filter(function(task) {
        return task.completed;
    }).length;

    completedTasks.textContent = "Completed: " + completedCount;
}

// Add a new task
function addTask() {
    const text = taskInput.value.trim();

    if (text === "") {
        alert("Please enter a task!");
        taskInput.focus();
        return;
    }

    tasks.push({
        id: Date.now() + Math.random(),
        text: text,
        completed: false
    });

    saveTasks();
    displayTasks();

    taskInput.value = "";
    taskInput.focus();
}

// Add task using the button
addBtn.addEventListener("click", addTask);

// Add task by pressing Enter
taskInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        addTask();
    }
});

// Clear all tasks
clearBtn.addEventListener("click", function() {
    if (tasks.length === 0) {
        alert("There are no tasks to clear.");
        return;
    }

    const confirmed = confirm("Are you sure you want to delete all tasks?");

    if (confirmed) {
        tasks = [];
        saveTasks();
        displayTasks();
    }
});

// Show saved tasks when the page opens
displayTasks();
