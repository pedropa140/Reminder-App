import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../icon.png';
import '../App.css';
import { FaSun, FaMoon, FaCog } from 'react-icons/fa';
import LogoutPopup from './LogoutPopup';
import SettingsPopup from './SettingsPopup';
import './Calendar.css';
import ReminderModal from './ReminderModal';
import { addReminder, removeReminder, updateUserInfo } from '../api'; // Import API methods

const daysOfWeek = ['Sunday', 'Monday', 'Tueday', 'Wednesday', 'Thusday', 'Friday', 'Saturday'];

function generateCalendar(year, month) {
  const date = new Date(year, month);
  const calendar = [];
  const firstDay = date.getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  let week = Array(firstDay).fill(null); // Create initial week with empty days

  for (let day = 1; day <= lastDate; day++) {
    week.push(day);
    if (week.length === 7) {
      calendar.push(week);
      week = [];
    }
  }

  // Fill the last week with null values if it has less than 7 days
  if (week.length > 0) {
    while (week.length < 7) {
      week.push(null); // Add empty days to fill the week
    }
    calendar.push(week);
  }

  return calendar;
}

function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [tasks, setTasks] = useState({});
  const [firstName, setFirstName] = React.useState(sessionStorage.getItem('firstName'));
  const [lastName, setLastName] = React.useState(sessionStorage.getItem('lastName'));
  const [email, setEmail] = React.useState(sessionStorage.getItem('userEmail'));
  
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = React.useState(false);
  const [popupOpen, setPopupOpen] = React.useState(false);
  const [settingsOpen, setSettingsOpen] = React.useState(false); // State for settings popup

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleLogoutClick = () => {
    setPopupOpen(true);
  };

  const handleConfirmLogout = () => {
    sessionStorage.clear();
    setPopupOpen(false);
    navigate('/logged-out', { replace: true });
  };

  const handleClosePopup = () => {
    setPopupOpen(false);
  };

  const handleSettingsClick = () => {
    setSettingsOpen(true); // Open the settings popup
  };

  const handleCloseSettings = () => {
    setSettingsOpen(false); // Close the settings popup
  };

  // Function to handle user info update from SettingsPopup
  const handleUpdateUserInfo = async (updatedData) => {
    try {
      // Make API call to update user information
      const response = await updateUserInfo(updatedData);
      
      // Update the sessionStorage with the new data
      if (response.user) {
        sessionStorage.setItem('firstName', updatedData.name.split(' ')[0]);
        sessionStorage.setItem('lastName', updatedData.name.split(' ')[1] || '');
        sessionStorage.setItem('userEmail', updatedData.newEmail || email);

        // Update the local state to reflect the new data
        setFirstName(updatedData.name.split(' ')[0]);
        setLastName(updatedData.name.split(' ')[1] || '');
        setEmail(updatedData.newEmail || email);
      }

      setSettingsOpen(false); // Close the settings popup
    } catch (error) {
      console.error('Failed to update user info:', error);
    }
  };

  React.useEffect(() => {
    if (!sessionStorage.getItem('userEmail')) {
      navigate('/logged-out', { replace: true });
    }
  }, [navigate]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const calendar = generateCalendar(year, month);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1));
  };

  const handleDayClick = (day) => {
    if (day) {
      const date = new Date(year, month, day);
      setSelectedDate(date);
      setShowModal(true);
    }
  };

  const handleSaveTasks = async (date, updatedTasks, reminder) => {
    const dateKey = date.toDateString();
    setTasks(prevTasks => ({
        ...prevTasks,
        [dateKey]: updatedTasks
    }));

    // Save the reminder to the backend
    if (reminder) {
        const month = parseInt(date.getMonth() + 1, 10); // Ensure month is an integer
        const day = parseInt(date.getDate(), 10);        // Ensure day is an integer
        const year = parseInt(date.getFullYear(), 10);   // Ensure year is an integer

        try {
            await addReminder(email, month, day, year, reminder); // Call to save reminder
        } catch (error) {
            console.error('Error adding reminder:', error);
        }
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const today = new Date();

  return (
    <div className={darkMode ? 'app dark-mode' : 'app'}>
      <nav className="navbar">
        <div className="logo">
          <img src={logo} alt="Logo" />
        </div>
        <ul className="nav-links">
          <li><Link to="/user">HOME</Link></li>
          <li><Link to="/user/goal">TASKS</Link></li>
          <li><Link to="/user/calendar">CALENDAR</Link></li>
          <li><Link to="/user/pomodoro">POMODORO TIMER</Link></li>
          <li><Link to="/user/chatbot">CHATBOT</Link></li>
          <li><Link to="/user/contact">CONTACT</Link></li>
          <li><a href="#" onClick={handleLogoutClick}>LOGOUT</a></li>          
          <div className="settings-icon" onClick={handleSettingsClick}>
            <FaCog />
          </div>
        </ul>
        <div className="nav-actions">
          <div className="theme-toggle" onClick={toggleDarkMode}>
            {darkMode ? <FaSun /> : <FaMoon />}
          </div>
        </div>
      </nav>
      <div className="calendar">
        <div className="header">
          <button onClick={handlePrevMonth}>Prev</button>
          <h2>{`${currentDate.toLocaleString('default', { month: 'long' })} ${year}`}</h2>
          <button onClick={handleNextMonth}>Next</button>
        </div>
        <div className="days-of-week">
          {daysOfWeek.map(day => (
            <div key={day} className="day-header">{day}</div>
          ))}
        </div>
        <div className="calendar-grid">
          {calendar.map((week, weekIndex) => (
            <div key={weekIndex} className="week">
              {week.map((day, dayIndex) => (
                <div
                  key={dayIndex}
                  className={`day ${
                    day && today.getDate() === day && today.getMonth() === month && today.getFullYear() === year ? 'current-day' : ''
                  }`}
                  onClick={() => handleDayClick(day)}
                >
                  {day}
                  {tasks[`${year}-${month}-${day}`] && <div className="task-indicator">*</div>}
                </div>
              ))}
            </div>
          ))}
        </div>
        {showModal && selectedDate && (
          <ReminderModal
            date={selectedDate}
            tasks={tasks[selectedDate.toDateString()] || []}
            onClose={closeModal}
            onSave={handleSaveTasks}
          />
        )}
      </div>
      <LogoutPopup
        open={popupOpen}
        onClose={handleClosePopup}
        onConfirm={handleConfirmLogout}
      />

      {/* Popup for settings with user info */}
      <SettingsPopup
        open={settingsOpen}
        onClose={handleCloseSettings}
        firstName={firstName}
        lastName={lastName}
        email={email}
        onUpdateUserInfo={handleUpdateUserInfo} // Pass the update handler
      />
    </div>
  );
}

export default CalendarPage;
