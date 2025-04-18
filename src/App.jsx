import { useState, useEffect } from "react";
import axios from "axios";
import TodoList from "./TodoList";

function App() {
  const [tasks, setTasks] = useState([]);
  const API_URL = "https://fastapi-todoapp-3elh.onrender.com/";

  // Fetch tasks from the backend
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(API_URL);
        setTasks(response.data);
      } catch (error) {
        console.error("Error fetching tasks:", error.message);
      }
    };
    fetchTasks();
  }, []);

  // Add a new task
  const addTask = async (newTask) => {
    try {
      const response = await axios.post(API_URL, newTask);
      setTasks((prevTasks) => [...prevTasks, response.data]);
    } catch (error) {
      console.error("Error adding task:", error.message);
    }
  };

  // Update an existing task
  const updateTask = async (id, updatedTask) => {
    try {
      const response = await axios.put(`${API_URL}${id}/`, updatedTask);
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === id ? response.data : task))
      );
    } catch (error) {
      console.error("Error updating task:", error.message);
    }
  };

  // Delete a task
  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}${id}/`);
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Error deleting task:", error.message);
    }
  };

  return (
    <div className="app-container">
      <h1>React TODO App</h1>
      <TodoList
        tasks={tasks}
        onAdd={addTask}
        onUpdate={updateTask}
        onDelete={deleteTask}
      />
    </div>
  );
}

export default App;
