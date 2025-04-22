const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const searchBar = document.getElementById('search-bar');
const filterPriority = document.getElementById('filter-priority');

// Load tasks from localStorage
const loadTasks = () => {
  taskList.innerHTML = '';
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.forEach((task) => {
    addTaskToDOM(task);
  });
};

// Add a task to the DOM
const addTaskToDOM = (task) => {
  const li = document.createElement('li');
  li.classList.add(task.completed ? 'completed' : 'active');
  li.textContent = `${task.text} - ${task.category} - ${task.priority} - Due: ${task.deadline}`;

  // Completed checkbox
  const completeBtn = document.createElement('input');
  completeBtn.type = 'checkbox';
  completeBtn.checked = task.completed;
  completeBtn.onclick = () => toggleTaskCompletion(task);

  // Delete button
  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Delete';
  deleteBtn.classList.add('delete-btn');
  deleteBtn.onclick = () => deleteTask(task);

  li.appendChild(completeBtn);
  li.appendChild(deleteBtn);
  taskList.appendChild(li);
};

// Add task to localStorage
const addTask = (taskText, category, priority, deadline) => {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  const newTask = { text: taskText, category, priority, deadline, completed: false };
  tasks.push(newTask);
  localStorage.setItem('tasks', JSON.stringify(tasks));
  addTaskToDOM(newTask);
};

// Toggle task completion
const toggleTaskCompletion = (task) => {
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks = tasks.map(t => {
    if (t.text === task.text) {
      t.completed = !t.completed;
    }
    return t;
  });
  localStorage.setItem('tasks', JSON.stringify(tasks));
  loadTasks();
};

// Delete task from localStorage
const deleteTask = (task) => {
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks = tasks.filter(t => t.text !== task.text);
  localStorage.setItem('tasks', JSON.stringify(tasks));
  loadTasks();
};

// Handle form submission
taskForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const taskText = taskInput.value.trim();
  const category = document.getElementById('task-category').value;
  const priority = document.getElementById('task-priority').value;
  const deadline = document.getElementById('task-date').value;

  if (taskText) {
    addTask(taskText, category, priority, deadline);
    taskInput.value = '';
    document.getElementById('task-date').value = '';
  }
});

// Search and filter tasks
const filterTasks = () => {
  const searchTerm = searchBar.value.toLowerCase();
  const priorityFilter = filterPriority.value;

  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  taskList.innerHTML = '';

  tasks
    .filter(task => {
      return (
        task.text.toLowerCase().includes(searchTerm) &&
        (priorityFilter === 'All' || task.priority === priorityFilter)
      );
    })
    .forEach(task => {
      addTaskToDOM(task);
    });
};

searchBar.addEventListener('input', filterTasks);
filterPriority.addEventListener('change', filterTasks);

// Load tasks on page load
window.onload = loadTasks;

// Initialize drag-and-drop functionality
new Sortable(taskList, {
  handle: 'li',
  onEnd(evt) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const orderedTasks = Array.from(taskList.children).map(li => {
      const taskText = li.textContent.split(' - ')[0];
      return tasks.find(task => task.text === taskText);
    });
    localStorage.setItem('tasks', JSON.stringify(orderedTasks));
  },
});
