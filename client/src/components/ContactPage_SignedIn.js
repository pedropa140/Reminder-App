import React, { useState, useEffect, useRef } from 'react';
import { Container, Box, Typography, Button, TextField, IconButton } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../icon.png';
import '../App.css';
import { FaSun, FaMoon, FaCog } from 'react-icons/fa';
import LogoutPopup from './LogoutPopup';
import SettingsPopup from './SettingsPopup';
import { updateUserInfo } from '../api';

const ContactPage_SignedIn = () => {
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userMessage, setUserMessage] = useState('');
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

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('Name:', userName);
        console.log('Email:', userEmail);  // Fix here
        console.log('Message:', userMessage);  // Fix here
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

            <Container maxWidth="xs">
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        mt: 8,
                        p: 4,
                        border: '1px solid',
                        borderRadius: '12px',
                        boxShadow: 3,
                        backgroundColor: darkMode ? '#333' : '#fff',
                        color: darkMode ? '#f0f0f0' : '#000',
                    }}
                >
                    <Typography variant="h4" sx={{ mb: 2, color: darkMode ? 'white' : 'text.primary' }}>
                        Contact Us
                    </Typography>
                    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            label="Name"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            InputProps={{
                                style: {
                                    backgroundColor: darkMode ? '#555' : '#fff',
                                    color: darkMode ? '#f0f0f0' : '#000',
                                    borderRadius: '8px',
                                },
                            }}
                            InputLabelProps={{
                                style: { color: darkMode ? '#f0f0f0' : '#000' },
                            }}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            type="email"
                            label="Email"
                            value={userEmail}
                            onChange={(e) => setUserEmail(e.target.value)}
                            InputProps={{
                                style: {
                                    backgroundColor: darkMode ? '#555' : '#fff',
                                    color: darkMode ? '#f0f0f0' : '#000',
                                    borderRadius: '8px',
                                },
                            }}
                            InputLabelProps={{
                                style: { color: darkMode ? '#f0f0f0' : '#000' },
                            }}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            multiline
                            rows={4}
                            label="Message"
                            value={userMessage}
                            onChange={(e) => setUserMessage(e.target.value)}
                            InputProps={{
                                style: {
                                    backgroundColor: darkMode ? '#555' : '#fff',
                                    color: darkMode ? '#f0f0f0' : '#000',
                                    borderRadius: '8px',
                                },
                            }}
                            InputLabelProps={{
                                style: { color: darkMode ? '#f0f0f0' : '#000' },
                            }}
                            sx={{ mb: 2 }}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 2, borderRadius: '8px', backgroundColor: darkMode ? '#007bff' : '#0056b3', color: 'white' }}
                        >
                            Send
                        </Button>
                    </form>
                </Box>
            </Container>

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
};

export default ContactPage_SignedIn;
