import React, { useState, useEffect } from 'react';
import { addReminder, removeReminder, getReminders } from '../api'; // Import API methods

function ReminderModal({ date, tasks, onClose, onSave }) {
    const [reminder, setReminder] = useState("");
    const [userEmail, setUserEmail] = useState(sessionStorage.getItem('userEmail'));
    const [dailyReminders, setDailyReminders] = useState([]);

    // Extract the day, month, and year from the Date object
    const day = date.getDate(); // Get day of the month
    const month = date.getMonth() + 1; // Get month (0-based, so add 1)
    const year = date.getFullYear(); // Get full year

    useEffect(() => {
        const fetchReminders = async () => {
            try {
                const response = await getReminders(userEmail);
                console.log('API Response:', response); // Log the entire response object

                if (response && response.reminders) {
                    console.log('Response Data:', response.reminders); // Log response data

                    // Access reminders from response.data
                    const reminders = response.reminders;
                    console.log('Reminders Array:', reminders); // Log the reminders array

                    if (Array.isArray(reminders)) {
                        const todayReminders = reminders.filter(rem => 
                            rem.month === month && rem.day === day && rem.year === year
                        );

                        console.log('Today\'s Reminders:', todayReminders); // Log today's reminders
                        setDailyReminders(todayReminders);
                    } else {
                        console.error('Reminders is not an array:', reminders);
                    }
                } else {
                    console.error('Unexpected response format:', response);
                }
            } catch (error) {
                console.error('Failed to fetch reminders:', error);
            }
        };

        fetchReminders();
    }, [userEmail, month, day, year]);

    const handleSave = async () => {
        try {
            await addReminder(userEmail, month, day, year, reminder);
            const updatedReminders = [...dailyReminders, { reminder, month, day, year }];
            setDailyReminders(updatedReminders);
            onSave(date, [...tasks, reminder]); // Update tasks and close modal
        } catch (error) {
            console.error('Failed to add reminder:', error);
        }
        onClose();
    };

    const handleRemove = async (reminderToRemove) => {
        try {
            await removeReminder(userEmail, month, day, year);
            const updatedReminders = dailyReminders.filter(rem => rem.reminder !== reminderToRemove);
            setDailyReminders(updatedReminders);
            onSave(date, tasks.filter(task => task !== reminderToRemove)); // Update tasks and close modal
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
            <button onClick={onClose}>Close</button>
            <div>
                <h3>Today's Reminders:</h3>
                {dailyReminders.length > 0 ? (
                    <ul>
                        {dailyReminders.map((rem, index) => (
                            <li key={index}>
                                {rem.reminder}
                                <button onClick={() => handleRemove(rem.reminder)}>Remove</button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No reminders for today.</p>
                )}
            </div>
        </div>
    );
}

export default ReminderModal;
