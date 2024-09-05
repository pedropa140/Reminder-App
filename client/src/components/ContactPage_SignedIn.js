import React, { useState } from 'react';
import { Button, TextField, Container, Typography, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { FaSun, FaMoon } from 'react-icons/fa';
import logo from '../icon.png';
import '../App.css';

const ContactPage_SignedIn = () => {
    const [darkMode, setDarkMode] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('Name:', name);
        console.log('Email:', email);
        console.log('Message:', message);
    };

    return (
        <div className={darkMode ? 'app dark-mode' : 'app'}>
            <nav className="navbar">
                <div className="logo">
                    <img src={logo} alt="Logo" />
                </div>
                <ul className="nav-links">
                    <li><Link to="/user">HOME</Link></li>
                    <li><Link to="/user/pomodoro">POMODORO TIMER</Link></li>
                    <li><Link to="/user/contact">CONTACT</Link></li>
                </ul>
                <div className="theme-toggle" onClick={toggleDarkMode}>
                    {darkMode ? <FaSun /> : <FaMoon />}
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
                            value={name}
                            onChange={(e) => setName(e.target.value)}
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
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
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
        </div>
    );
};

export default ContactPage_SignedIn;
