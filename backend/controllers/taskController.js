const Task = require('../models/Task');

// Get all tasks
exports.getTasks = async (req, res) => {
  const { filter } = req.query;
  const query = filter === 'completed' ? { completed: true } :
                filter === 'pending' ? { completed: false } : {};
  const tasks = await Task.find(query);
  res.json(tasks);
};

// Create task
exports.createTask = async (req, res) => {
  const task = new Task(req.body);
  await task.save();
  res.status(201).json(task);
};

// Update task
exports.updateTask = async (req, res) => {
  const { id } = req.params;
  const updatedTask = await Task.findByIdAndUpdate(id, req.body, { new: true });
  res.json(updatedTask);
};

// Delete task
exports.deleteTask = async (req, res) => {
  const { id } = req.params;
  await Task.findByIdAndDelete(id);
  res.json({ message: 'Task deleted' });
};
