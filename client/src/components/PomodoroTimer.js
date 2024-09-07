import React, { useState, useEffect, useRef } from 'react';
import { Container, Box, Typography, Button, TextField } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { FaSun, FaMoon, FaCog } from 'react-icons/fa';
import logo from '../icon.png';
import '../App.css';
import TimerAlertPopup from './TimerAlertPopup';
import LogoutPopup from './LogoutPopup';
import SettingsPopup from './SettingsPopup';  // Import SettingsPopup

const PomodoroTimer = () => {
    const [darkMode, setDarkMode] = useState(false);
    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    const [firstName, setFirstName] = useState(sessionStorage.getItem('firstName'));
    const [lastName, setLastName] = useState(sessionStorage.getItem('lastName'));
    const [email, setEmail] = useState(sessionStorage.getItem('userEmail'));

    // States for popups
    const [settingsOpen, setSettingsOpen] = useState(false); // Settings popup state
    const [popupOpen, setPopupOpen] = useState(false);       // Logout popup state

    // Pomodoro Timer States
    const [workDuration, setWorkDuration] = useState(25); // Default work duration in minutes
    const [breakDuration, setBreakDuration] = useState(5); // Default break duration in minutes
    const [time, setTime] = useState(workDuration * 60); // Time in seconds
    const [isActive, setIsActive] = useState(false); // Is the timer running?
    const [isBreak, setIsBreak] = useState(false); // Is it break time?
    const [openAlert, setOpenAlert] = useState(false); // Is the alert open?
    const [alertMessage, setAlertMessage] = useState(''); // Message for the alert
    const [logoutPopupOpen, setLogoutPopupOpen] = useState(false); // Is the logout popup open?
    const alarmSound = useRef(null); // Ref for the alarm sound

    const navigate = useNavigate(); // Hook for navigation

    // Timer Logic (Effect to handle time countdown)
    useEffect(() => {
        let interval = null;

        if (isActive) {
            interval = setInterval(() => {
                setTime((time) => time - 1);
            }, 1000);

            if (time === 0) {
                clearInterval(interval);
                playAlarm(); // Play alarm sound when timer hits zero
                if (isBreak) {
                    setAlertMessage('Break time is over! Time to get back to work.');
                    setTime(workDuration * 60); // Reset timer to work duration
                    setIsBreak(false);
                } else {
                    setAlertMessage('Work session is over! Time for a break.');
                    setTime(breakDuration * 60); // Reset timer to break duration
                    setIsBreak(true);
                }
                setOpenAlert(true); // Show alert
                setIsActive(false); // Pause the timer
            }
        }

        return () => clearInterval(interval); // Cleanup on unmount
    }, [isActive, time, isBreak, workDuration, breakDuration]);

    // Function to handle opening settings
    const handleSettingsClick = () => {
        if (isActive) {
            setIsActive(false); // Pause the timer
        }
        setSettingsOpen(true); // Open the settings popup
    };

    // Function to handle closing settings
    const handleCloseSettings = () => {
        setSettingsOpen(false); // Close the settings popup
        if (!isBreak && !isActive && time > 0) {
            setIsActive(true); // Resume the timer if it was paused
        }
    };

    // Function to toggle timer start/pause
    const toggleTimer = () => {
        setIsActive(!isActive);
    };

    // Function to reset the timer
    const resetTimer = () => {
        setIsActive(false);
        setIsBreak(false);
        setTime(workDuration * 60);
    };

    // Handle changes to work duration
    const handleWorkDurationChange = (e) => {
        setWorkDuration(e.target.value);
        if (!isActive) {
            setTime(e.target.value * 60);
        }
    };

    // Handle changes to break duration
    const handleBreakDurationChange = (e) => {
        setBreakDuration(e.target.value);
    };

    // Function to play the alarm sound
    const playAlarm = () => {
        if (alarmSound.current) {
            alarmSound.current.play();
        }
    };

    // Close the alert and resume the timer
    const handleCloseAlert = () => {
        setOpenAlert(false);
        setIsActive(true);
    };

    // Cancel the alert and stop the timer
    const handleCancelAlert = () => {
        setOpenAlert(false);
        setIsActive(false);
    };

    // Pause the timer and open the logout popup
    const handleLogoutClick = () => {
        if (isActive) {
            setIsActive(false); // Pause the timer
        }
        setLogoutPopupOpen(true); // Open logout popup
    };

    // Confirm logout and clear session storage
    const handleConfirmLogout = () => {
        sessionStorage.clear();
        setLogoutPopupOpen(false);
        navigate('/logged-out', { replace: true });
    };

    // Close the logout popup and resume timer if paused
    const handleCloseLogoutPopup = () => {
        setLogoutPopupOpen(false);
        if (!isActive && time > 0) {
            setIsActive(true); // Resume the timer if it was paused
        }
    };

    // Handle closing the popup
    const handleClosePopup = () => {
        setPopupOpen(false);
    };

    // Function to handle updating user info from settings
    const handleUpdateUserInfo = (updatedFirstName, updatedLastName, updatedEmail) => {
        setFirstName(updatedFirstName);
        setLastName(updatedLastName);
        setEmail(updatedEmail);

        // Optionally update sessionStorage
        sessionStorage.setItem('firstName', updatedFirstName);
        sessionStorage.setItem('lastName', updatedLastName);
        sessionStorage.setItem('userEmail', updatedEmail);

        setSettingsOpen(false); // Close settings popup after update
    };

    // Format time for display (MM:SS)
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainderSeconds = seconds % 60;
        return `${minutes < 10 ? '0' : ''}${minutes}:${remainderSeconds < 10 ? '0' : ''}${remainderSeconds}`;
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

            <Container maxWidth="sm" sx={{ mt: 8 }}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        p: 4,
                        border: '1px solid',
                        borderRadius: '12px',
                        boxShadow: 3,
                        backgroundColor: '#fff',
                    }}
                >
                    <Typography variant="h4" gutterBottom>
                        {isBreak ? 'Break Time' : 'Work Time'}
                    </Typography>
                    <Typography variant="h1" gutterBottom>
                        {formatTime(time)}
                    </Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mt: 2 }}>
                        <TextField
                            label="Work Duration (minutes)"
                            type="number"
                            value={workDuration}
                            onChange={handleWorkDurationChange}
                            disabled={isActive}
                            sx={{ mr: 2 }}
                            inputProps={{ min: 1 }}
                            fullWidth
                        />
                        <TextField
                            label="Break Duration (minutes)"
                            type="number"
                            value={breakDuration}
                            onChange={handleBreakDurationChange}
                            disabled={isActive}
                            inputProps={{ min: 1 }}
                            fullWidth
                        />
                    </Box>

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={toggleTimer}
                        sx={{ mt: 2 }}
                    >
                        {isActive ? 'Pause' : 'Start'}
                    </Button>
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={resetTimer}
                        sx={{ mt: 2 }}
                    >
                        Reset
                    </Button>

                    <TimerAlertPopup
                        open={openAlert}
                        onClose={handleCancelAlert}
                        alertMessage={alertMessage}
                        onConfirm={handleCloseAlert}
                    />

                    <LogoutPopup
                        open={logoutPopupOpen}
                        onClose={handleCloseLogoutPopup}
                        onConfirm={handleConfirmLogout}
                    />
                </Box>
            </Container>

            {/* Popup for settings with user info */}
            <SettingsPopup
                open={settingsOpen}
                onClose={handleCloseSettings} // Pass the close handler
                firstName={firstName}
                lastName={lastName}
                email={email}
                onUpdateUserInfo={handleUpdateUserInfo} // Pass the update handler
            />
        </div>
    );
};

export default PomodoroTimer;
