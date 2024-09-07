import React, { useState, useEffect } from 'react';
import { addReminder, removeReminder, getReminders } from '../api'; // Import API methods
import './ReminderModal.css'; // Import the CSS file

function ReminderModal({ date, tasks, onClose, onSave }) {
    const [reminder, setReminder] = useState("");
    const [userEmail, setUserEmail] = useState(sessionStorage.getItem('userEmail'));
    const [dailyReminders, setDailyReminders] = useState([]);

    // Extract the day, month, and year from the Date object
    const day = date.getDate(); // Get day of the month
    const monthIndex = date.getMonth(); // Get month index (0-based)
    const year = date.getFullYear(); // Get full year

    // Arrays for full names of days and months
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const monthsOfYear = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    // Get the full name of the day and month
    const dayName = daysOfWeek[date.getDay()];
    const monthName = monthsOfYear[monthIndex];

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
                            rem.month === monthIndex + 1 && rem.day === day && rem.year === year
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
    }, [userEmail, monthIndex, day, year]);

    const handleSave = async () => {
        try {
            await addReminder(userEmail, monthIndex + 1, day, year, reminder);
            const updatedReminders = [...dailyReminders, { reminder, month: monthIndex + 1, day, year }];
            setDailyReminders(updatedReminders);
            onSave(date, [...tasks, reminder]); // Update tasks and close modal
        } catch (error) {
            console.error('Failed to add reminder:', error);
        }
        onClose();
    };

    const handleRemove = async (reminderToRemove) => {
        try {
            await removeReminder(userEmail, monthIndex + 1, day, year);
            const updatedReminders = dailyReminders.filter(rem => rem.reminder !== reminderToRemove);
            setDailyReminders(updatedReminders);
            onSave(date, tasks.filter(task => task !== reminderToRemove)); // Update tasks and close modal
        } catch (error) {
            console.error('Failed to remove reminder:', error);
        }
        onClose();
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Reminders for {dayName}, {monthName} {day}, {year}</h2>
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
        </div>
    );
}

export default ReminderModal;
