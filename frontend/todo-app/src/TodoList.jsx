import React, { useState, useEffect } from 'react';
import './App.css';

const TaskItem = ({ task, onEdit, onRemove, onToggleComplete }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'red';
      case 'medium':
        return 'yellow';
      case 'low':
        return 'green';
      default:
        return 'gray';
    }
  };

  return (
    <li className={`task-item ${task.completed ? 'completed' : ''}`}>
      <div className="task-content">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={(e) => onToggleComplete(task.id, e.target.checked)}
        />
        <div className="task-details">
          <span>{task.title}</span>
          <small>Priority: {task.priority} | Deadline: {task.deadline}</small>
          <p>{task.comments}</p>
        </div>
        <div className="task-actions">
          <button className="edit-btn" onClick={() => onEdit(task)}>✏️</button>
          <button className="delete-btn" onClick={() => onRemove(task.id)}>🗑️</button>
        </div>
      </div>
      <div className="priority-indicator" style={{ backgroundColor: getPriorityColor(task.priority) }}></div>
    </li>
  );
};

export default function TodoList({ tasks, onAdd, onUpdate, onDelete }) {
  const [filter, setFilter] = useState('all');
  const [darkMode, setDarkMode] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', priority: '', deadline: '', comments: '', completed: false });
  const [editingTaskId, setEditingTaskId] = useState(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const handleAddOrEditTask = () => {
    if (newTask.title.trim() === '') return;

    if (editingTaskId) {
      onUpdate(editingTaskId, newTask);
    } else {
      onAdd(newTask);
    }
    setNewTask({ title: '', priority: '', deadline: '', comments: '', completed: false });
    setEditingTaskId(null);
    setShowPopup(false);
  };

  const handleDeleteTask = (taskId) => {
    onDelete(taskId);
  };

  const handleToggleComplete = (taskId, completed) => {
    const taskToUpdate = tasks.find((task) => task.id === taskId);
    if (!taskToUpdate) return;
    const updatedTask = { ...taskToUpdate, completed };
    onUpdate(taskId, updatedTask);
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'completed') return task.completed;
    if (filter === 'pending') return !task.completed;
    return true;
  });

  return (
    <div className="todo-container" style={{ boxShadow: darkMode ? 'var(--dark-box-shadow)' : 'var(--light-box-shadow)' }}>
      <div className="task-container">
        <h2>✅ Manage Your Tasks</h2>
        <div className="header">
          <button className="add-task" onClick={() => setShowPopup(true)}>➕ Add Task</button>
          <button className="toggle-darkmode" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
        </div>

        {showPopup && (
          <div className="popup">
            <div className="popup-content">
              <h3>Task Details</h3>
              <div className="input-group">
                <label htmlFor="task-title">Title</label>
                <input
                  id="task-title"
                  type="text"
                  placeholder="Add a task title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                />
              </div>
              <div className="input-row">
                <div className="input-group">
                  <label htmlFor="task-priority">Priority</label>
                  <select
                    id="task-priority"
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                  >
                    <option value="">Select priority</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div className="input-group">
                  <label htmlFor="task-deadline">Deadline</label>
                  <input
                    id="task-deadline"
                    type="date"
                    value={newTask.deadline || ''}
                    onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
                  />
                </div>
              </div>
              <div className="input-group">
                <label htmlFor="task-comments">Comments</label>
                <textarea
                  id="task-comments"
                  placeholder="Add any comments to your task"
                  value={newTask.comments}
                  onChange={(e) => setNewTask({ ...newTask, comments: e.target.value })}
                />
              </div>
              <div className="popup-buttons">
                <button className="close-btn" onClick={() => setShowPopup(false)}>Close</button>
                <button className="add-btn" onClick={handleAddOrEditTask}>
                  {editingTaskId ? 'Save Changes' : 'Add Task'}
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="filters">
          <button className="filter-btn" onClick={() => setFilter('all')}>All</button>
          <button className="filter-btn" onClick={() => setFilter('completed')}>Completed</button>
          <button className="filter-btn" onClick={() => setFilter('pending')}>Pending</button>
        </div>
        <ul>
          {filteredTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onEdit={(task) => {
                setNewTask(task);
                setEditingTaskId(task.id);
                setShowPopup(true);
              }}
              onRemove={handleDeleteTask}
              onToggleComplete={handleToggleComplete}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}
