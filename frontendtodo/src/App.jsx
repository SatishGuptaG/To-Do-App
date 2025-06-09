import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [filter, setFilter] = useState('');
  const [initialTasks, setInitialTasks] = useState([]);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/tasks${filter ? '?filter=' + filter : ''}`);
      setTasks(res.data);
      setInitialTasks(res.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [filter]);

  const handleAdd = async () => {
    if (!title.trim()) return;
    try {
      await axios.post('http://localhost:5000/api/tasks', { title: title.trim() });
      setTitle('');
      fetchTasks();
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleUpdate = async (id, updatedData) => {
    try {
      await axios.put(`http://localhost:5000/api/tasks/${id}`, updatedData);
      fetchTasks();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`);
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAdd();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">To-Do List</h1>
          <p className="text-gray-600">Stay organized and productive</p>
        </div>

        {/* Add Task Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex gap-3">
            <input
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter a new task..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button 
              onClick={handleAdd}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 font-medium"
            >
              Add Task
            </button>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex gap-2 justify-center">
            <button 
              onClick={() => setFilter('')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                filter === '' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Tasks
            </button>
            <button 
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                filter === 'pending' 
                  ? 'bg-yellow-500 text-white shadow-md' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Pending
            </button>
            <button 
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                filter === 'completed' 
                  ? 'bg-green-500 text-white shadow-md' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Completed
            </button>
          </div>
        </div>

        {/* Tasks List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {tasks.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <div className="text-6xl mb-4">📝</div>
              <p className="text-lg">No tasks found</p>
              <p className="text-sm">Add a task to get started!</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {tasks.map(task => (
                <li key={task._id} className="p-4 hover:bg-gray-50 transition-colors duration-150">
                  <div className="flex items-center gap-4">
                    {/* Checkbox */}
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => handleUpdate(task._id, { completed: !task.completed })}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    />
                    
                    {/* Task Title */}
                    <span 
                      className={`flex-1 text-lg transition-all duration-200 ${
                        task.completed 
                          ? 'line-through text-gray-500' 
                          : 'text-gray-800'
                      }`}
                    >
                      {task.title}
                    </span>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          const newTitle = prompt("Edit Task", task.title);
                          if (newTitle && newTitle.trim()) {
                            handleUpdate(task._id, { title: newTitle.trim() });
                          }
                        }}
                        className="px-3 py-1 text-sm bg-yellow-100 text-yellow-700 rounded-md hover:bg-yellow-200 transition-colors duration-150 font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(task._id)}
                        className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors duration-150 font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Stats */}
        {initialTasks.length > 0 && (
          <div className="mt-6 bg-white rounded-lg shadow-md p-4">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Total: {initialTasks.length} tasks</span>
              <span>Pending: {initialTasks.filter(t => !t.completed).length}</span>
              <span>Completed: {initialTasks.filter(t => t.completed).length}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
