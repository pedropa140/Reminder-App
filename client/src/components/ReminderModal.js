// TaskModal.js
import React, { useState } from 'react';
import './ReminderModal.css'; // Add your CSS styling here

function ReminderModal({ date, tasks, onClose, onSave }) {
  const [taskInput, setTaskInput] = useState('');
  const [localTasks, setLocalTasks] = useState(tasks);

  const handleAddTask = () => {
    if (taskInput) {
      setLocalTasks([...localTasks, taskInput]);
      setTaskInput('');
    }
  };

  const handleRemoveTask = (index) => {
    setLocalTasks(localTasks.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    onSave(date, localTasks);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Tasks for {date.toDateString()}</h2>
        <input
          type="text"
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
          placeholder="New task"
        />
        <button onClick={handleAddTask}>Add Task</button>
        <ul>
          {localTasks.map((task, index) => (
            <li key={index}>
              {task}
              <button onClick={() => handleRemoveTask(index)}>Remove</button>
            </li>
          ))}
        </ul>
        <button onClick={handleSave}>Save</button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default ReminderModal;
