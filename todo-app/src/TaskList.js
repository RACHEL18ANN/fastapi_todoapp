import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
// ...existing code...

const socket = io('http://localhost:5173');

function TaskList() {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        // Fetch initial tasks
        fetch('/tasks')
            .then((res) => res.json())
            .then((data) => setTasks(data));

        // Listen for real-time updates
        socket.on('taskAdded', (newTask) => {
            setTasks((prevTasks) => [...prevTasks, newTask]);
        });

        socket.on('taskUpdated', (updatedTask) => {
            setTasks((prevTasks) =>
                prevTasks.map((task) =>
                    task.id === updatedTask.id ? updatedTask : task
                )
            );
        });

        return () => {
            socket.off('taskAdded');
            socket.off('taskUpdated');
        };
    }, []);

    const addTask = (task) => {
        // Optimistic update
        const tempId = Date.now();
        const optimisticTask = { ...task, id: tempId };
        setTasks((prevTasks) => [...prevTasks, optimisticTask]);

        // Send to server
        fetch('/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(task),
        })
            .then((res) => res.json())
            .then((newTask) => {
                // Reconcile optimistic update
                setTasks((prevTasks) =>
                    prevTasks.map((t) => (t.id === tempId ? newTask : t))
                );
            })
            .catch(() => {
                // Rollback on error
                setTasks((prevTasks) =>
                    prevTasks.filter((t) => t.id !== tempId)
                );
            });
    };

    const editTask = (id, updatedData) => {
        // Optimistic update
        setTasks((prevTasks) =>
            prevTasks.map((task) =>
                task.id === id ? { ...task, ...updatedData } : task
            )
        );

        // Send to server
        fetch(`/tasks/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData),
        }).catch(() => {
            // Rollback on error (optional)
            // Fetch tasks again or handle rollback logic
        });
    };

    return (
        <div>
            {/* ...existing code to render tasks and add/edit UI... */}
        </div>
    );
}

export default TaskList;
