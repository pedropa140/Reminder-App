import React, { useState, useEffect, useRef } from 'react';
import { Container, Box, Typography, Button, TextField } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { FaSun, FaMoon } from 'react-icons/fa';
import logo from '../icon.png';
import '../App.css';
import TimerAlertPopup from './TimerAlertPopup';
import LogoutPopup from './LogoutPopup'; // Import LogoutPopup

const PomodoroTimer = () => {
    const [workDuration, setWorkDuration] = useState(25);
    const [breakDuration, setBreakDuration] = useState(5);
    const [time, setTime] = useState(workDuration * 60);
    const [isActive, setIsActive] = useState(false);
    const [isBreak, setIsBreak] = useState(false);
    const [openAlert, setOpenAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [logoutPopupOpen, setLogoutPopupOpen] = useState(false);
    const alarmSound = useRef(null);
    const navigate = useNavigate(); // Hook for navigation

    const [darkMode, setDarkMode] = useState(false);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    useEffect(() => {
        let interval = null;

        if (isActive) {
            interval = setInterval(() => {
                setTime((time) => time - 1);
            }, 1000);

            if (time === 0) {
                clearInterval(interval);
                playAlarm();
                if (isBreak) {
                    setAlertMessage('Break time is over! Time to get back to work.');
                    setTime(workDuration * 60);
                    setIsBreak(false);
                } else {
                    setAlertMessage('Work session is over! Time for a break.');
                    setTime(breakDuration * 60);
                    setIsBreak(true);
                }
                setOpenAlert(true);
                setIsActive(false);
            }
        }

        return () => clearInterval(interval);
    }, [isActive, time, isBreak, workDuration, breakDuration]);

    const toggleTimer = () => {
        setIsActive(!isActive);
    };

    const resetTimer = () => {
        setIsActive(false);
        setIsBreak(false);
        setTime(workDuration * 60);
    };

    const handleWorkDurationChange = (e) => {
        setWorkDuration(e.target.value);
        if (!isActive) {
            setTime(e.target.value * 60);
        }
    };

    const handleBreakDurationChange = (e) => {
        setBreakDuration(e.target.value);
    };

    const playAlarm = () => {
        if (alarmSound.current) {
            alarmSound.current.play();
        }
    };

    const handleCloseAlert = () => {
        setOpenAlert(false);
        setIsActive(true);
    };

    const handleCancelAlert = () => {
        setOpenAlert(false);
        setIsActive(false);
    };

    // Function to pause the timer and open the logout popup
    const handleLogoutClick = () => {
        if (isActive) {
            setIsActive(false); // Pause the timer
        }
        setLogoutPopupOpen(true);
    };

    const handleConfirmLogout = () => {
        sessionStorage.clear();
        setLogoutPopupOpen(false);
        navigate('/logged-out', { replace: true });
    };

    const handleCloseLogoutPopup = () => {
        setLogoutPopupOpen(false);
        if (!isActive && time > 0) {
            setIsActive(true); // Resume the timer if it was paused
        }
    };

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
                    <li><Link to="/user/pomodoro">POMODORO TIMER</Link></li>
                    <li><Link to="/user/contact">CONTACT</Link></li>
                    <li><a href="#" onClick={handleLogoutClick}>LOGOUT</a></li>
                </ul>
                <div className="theme-toggle" onClick={toggleDarkMode}>
                    {darkMode ? <FaSun /> : <FaMoon />}
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
        </div>
    );
};

export default PomodoroTimer;
