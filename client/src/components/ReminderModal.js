import React, { useState, useEffect } from 'react';
import { addReminder, removeReminder } from '../api'; // Import API methods

function ReminderModal({ date, tasks, onClose, onSave }) {
    const [reminder, setReminder] = useState("");
    const [userEmail, setUserEmail] = useState(sessionStorage.getItem('userEmail'));

    const handleSave = async () => {
        const { day, month, year } = date;
        try {
            await addReminder(userEmail, month + 1, day, year, reminder); // Add 1 to month for 1-based index
            onSave(date, [...tasks, reminder]); // Update tasks and close modal
        } catch (error) {
            console.error('Failed to add reminder:', error);
        }
        onClose();
    };

    const handleRemove = async () => {
        const { day, month, year } = date;
        try {
            await removeReminder(userEmail, month + 1, day, year); // Add 1 to month for 1-based index
            onSave(date, tasks.filter(task => task !== reminder)); // Update tasks and close modal
        } catch (error) {
            console.error('Failed to remove reminder:', error);
        }
        onClose();
    };

    return (
        <div className="modal">
            <h2>Reminders for {date.toDateString()}</h2>
            <textarea
                value={reminder}
                onChange={(e) => setReminder(e.target.value)}
                placeholder="Add a new reminder"
            />
            <button onClick={handleSave}>Save Reminder</button>
            <button onClick={handleRemove}>Remove Reminder</button>
            <button onClick={onClose}>Close</button>
        </div>
    );
}

export default ReminderModal;
