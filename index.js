const express = require('express');
const { resolve } = require('path');
let cors = require('cors');

const app = express();
const port = 3000;

app.use(express.static('static'));
app.use(cors());

let tasks = [
  { taskId: 1, text: 'Fix bug #101', priority: 2 },
  { taskId: 2, text: 'Implement feature #202', priority: 1 },
  { taskId: 3, text: 'Write documentation', priority: 3 },
];

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

app.get('/tasks/add', (req, res) => {
  let taskId = req.query.taskId;
  let text = req.query.text;
  let priority = req.query.priority;

  tasks.push({ taskId: taskId, text: text, priority: priority });

  res.json(tasks);
});

app.get('/tasks', (req, res) => {
  res.json(tasks);
});

function priorityComparator(t1, t2) {
  return t1.priority - t2.priority;
}

app.get('/tasks/sort-by-priority', (req, res) => {
  let tasksList = tasks.slice();
  tasksList.sort(priorityComparator);
  res.json(tasksList);
});

app.get('/tasks/edit-priority', (req, res) => {
  let taskId = parseFloat(req.query.taskId);
  let priority = parseFloat(req.query.priority);

  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].taskId === taskId) {
      tasks[i].priority = priority;
    }
  }

  res.json(tasks);
});

app.get('/tasks/edit-text', (req, res) => {
  let taskId = parseFloat(req.query.taskId);
  let text = req.query.text;

  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].taskId === taskId) {
      tasks[i].text = text;
    }
  }

  res.json(tasks);
});

function taskDeleteFilter(task, taskId) {
  return task.taskId !== taskId;
}

app.get('/tasks/delete', (req, res) => {
  let taskId = parseFloat(req.query.taskId);

  tasks = tasks.filter((task) => taskDeleteFilter(task, taskId));

  res.json(tasks);
});

function priorityFilter(task, priority) {
  return task.priority === priority;
}

app.get('/tasks/filter-by-priority', (req, res) => {
  let priority = parseFloat(req.query.priority);

  let result = tasks.filter((task) => priorityFilter(task, priority));

  res.json(result);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
