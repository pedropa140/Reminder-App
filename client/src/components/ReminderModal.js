import React, { useState, useEffect } from 'react';
import { addReminder, removeReminder } from '../api'; // Import API methods

function ReminderModal({ date, tasks, onClose, onSave }) {
    const [reminder, setReminder] = useState("");
    const [userEmail, setUserEmail] = useState(sessionStorage.getItem('userEmail'));

    // Extract the day, month, and year from the Date object
    const day = date.getDate(); // Get day of the month
    const month = date.getMonth() + 1; // Get month (0-based, so add 1)
    const year = date.getFullYear(); // Get full year

    const handleSave = async () => {
        try {
            // Add reminder with proper month, day, and year values
            await addReminder(userEmail, month, day, year, reminder);
            onSave(date, [...tasks, reminder]); // Update tasks and close modal
        } catch (error) {
            console.error('Failed to add reminder:', error);
        }
        onClose();
    };

    const handleRemove = async () => {
        try {
            // Remove reminder with proper month, day, and year values
            await removeReminder(userEmail, month, day, year);
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
