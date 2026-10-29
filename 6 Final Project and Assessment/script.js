
const form = document.getElementById("taskForm");
const input = document.getElementById("taskInput");
const priority = document.getElementById("priority");
const dueDate = document.getElementById("dueDate");
const taskList = document.getElementById("taskList");
const search = document.getElementById("search");
const filter = document.getElementById("filter");

let tasks = [];

try {
  const saved = JSON.parse(localStorage.getItem("advancedTasks") || "[]");
  if (Array.isArray(saved)) {
    tasks = saved.filter(t =>
      t && typeof t.id === "string" &&
      typeof t.text === "string" &&
      typeof t.completed === "boolean"
    );
  }
} catch {
  tasks = [];
}

function saveTasks() {
  localStorage.setItem("advancedTasks", JSON.stringify(tasks));
}

function renderTasks() {
  taskList.replaceChildren();

  const query = search.value.trim().toLowerCase();
  const selected = filter.value;

  const visibleTasks = tasks.filter(task => {
    const matchesSearch = task.text.toLowerCase().includes(query);
    const matchesFilter =
      selected === "All" ||
      (selected === "Completed" && task.completed) ||
      (selected === "Pending" && !task.completed);

    return matchesSearch && matchesFilter;
  });

  visibleTasks.forEach(task => {
    const li = document.createElement("li");
    if (task.completed) li.classList.add("done");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.setAttribute("aria-label", "Mark task completed");
    checkbox.addEventListener("change", () => {
      task.completed = checkbox.checked;
      saveTasks();
      renderTasks();
    });

    const details = document.createElement("span");
    details.append(document.createTextNode(task.text));

    const info = document.createElement("small");
    info.textContent = `${task.priority} Priority | Due: ${task.dueDate || "Not set"}`;
    details.append(info);

    const edit = document.createElement("button");
    edit.textContent = "Edit";
    edit.addEventListener("click", () => {
      const updated = prompt("Edit task:", task.text);
      if (updated !== null && updated.trim()) {
        task.text = updated.trim();
        saveTasks();
        renderTasks();
      }
    });

    const remove = document.createElement("button");
    remove.textContent = "Delete";
    remove.addEventListener("click", () => {
      tasks = tasks.filter(t => t.id !== task.id);
      saveTasks();
      renderTasks();
    });

    li.append(checkbox, details, edit, remove);
    taskList.append(li);
  });

  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const percent = total ? Math.round(completed / total * 100) : 0;

  document.getElementById("total").textContent = total;
  document.getElementById("completed").textContent = completed;
  document.getElementById("pending").textContent = total - completed;
  document.getElementById("progressBar").style.width = percent + "%";
  document.getElementById("progressText").textContent =
    percent + "% completed";
}

form.addEventListener("submit", event => {
  event.preventDefault();

  const text = input.value.trim();
  if (!text) {
    alert("Please enter a task!");
    return;
  }

  tasks.push({
    id: crypto.randomUUID(),
    text,
    priority: priority.value,
    dueDate: dueDate.value,
    completed: false
  });

  saveTasks();
  form.reset();
  renderTasks();
  input.focus();
});

search.addEventListener("input", renderTasks);
filter.addEventListener("change", renderTasks);

document.getElementById("clearBtn").addEventListener("click", () => {
  if (tasks.length && confirm("Delete all tasks?")) {
    tasks = [];
    saveTasks();
    renderTasks();
  }
});

renderTasks();
