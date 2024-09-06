import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../icon.png';
import '../App.css';
import { FaSun, FaMoon } from 'react-icons/fa';
import LogoutPopup from './LogoutPopup';
import './Calendar.css';
import ReminderModal from './ReminderModal';

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function generateCalendar(year, month) {
  const date = new Date(year, month);
  const calendar = [];
  const firstDay = date.getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  let week = Array(firstDay).fill(null);

  for (let day = 1; day <= lastDate; day++) {
    week.push(day);
    if (week.length === 7) {
      calendar.push(week);
      week = [];
    }
  }
  if (week.length) {
    calendar.push(week);
  }

  return calendar;
}

function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [tasks, setTasks] = useState({});
  const [darkMode, setDarkMode] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);

  const firstName = sessionStorage.getItem('firstName');
  const lastName = sessionStorage.getItem('lastName');
  const email = sessionStorage.getItem('userEmail');
  const navigate = useNavigate();

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

  useEffect(() => {
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

  const handleSaveTasks = (date, updatedTasks) => {
    const dateKey = date.toDateString();
    setTasks(prevTasks => ({
      ...prevTasks,
      [dateKey]: updatedTasks
    }));
  };

  const closeModal = () => {
    setShowModal(false);
  };

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
          <li><Link to="/user/contact">CONTACT</Link></li>
          <li><a href="#" onClick={handleLogoutClick}>LOGOUT</a></li>
        </ul>
        <div className="theme-toggle" onClick={toggleDarkMode}>
          {darkMode ? <FaSun /> : <FaMoon />}
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
                  className="day"
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
        open={popupOpen} // Add this line
        onConfirm={handleConfirmLogout}
        onClose={handleClosePopup}
      />
    </div>
  );
}

export default CalendarPage;
