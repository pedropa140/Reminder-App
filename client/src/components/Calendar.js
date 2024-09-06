// Calendar.js
import React, { useState } from 'react';
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

function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [tasks, setTasks] = useState({});

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
  );
}

export default Calendar;
