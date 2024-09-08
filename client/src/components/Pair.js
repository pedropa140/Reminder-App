import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, Button, List, ListItem, ListItemText, Card, CardContent } from '@mui/material';
import { getPair, setPair, getGoals } from '../api';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../icon.png';
import '../App.css';
import { FaSun, FaMoon, FaCog } from 'react-icons/fa';
import LogoutPopup from './LogoutPopup';
import SettingsPopup from './SettingsPopup'; // Import the SettingsPopup component
import { updateUserInfo } from '../api';

const PairPage = () => {
    const [firstName, setFirstName] = useState(sessionStorage.getItem('firstName'));
    const [lastName, setLastName] = useState(sessionStorage.getItem('lastName'));
    const [email, setEmail] = useState(sessionStorage.getItem('userEmail'));
    const [partner, setPartner] = useState(null);
    const [pairingStatus, setPairingStatus] = useState(false);
    const [userGoals, setUserGoals] = useState([]);
    const [partnerGoals, setPartnerGoals] = useState([]);
    const [noPartnerMessage, setNoPartnerMessage] = useState("");
    const [noGoalsMessage, setNoGoalsMessage] = useState("");
    const navigate = useNavigate();
    const [darkMode, setDarkMode] = useState(false);
    const [popupOpen, setPopupOpen] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);

    const toggleDarkMode = () => setDarkMode(!darkMode);
    const handleLogoutClick = () => setPopupOpen(true);
    const handleConfirmLogout = () => {
        sessionStorage.clear();
        setPopupOpen(false);
        navigate('/logged-out', { replace: true });
    };
    const handleClosePopup = () => setPopupOpen(false);
    const handleSettingsClick = () => setSettingsOpen(true);
    const handleCloseSettings = () => setSettingsOpen(false);

    const handleUpdateUserInfo = async (updatedData) => {
        try {
            const response = await updateUserInfo(updatedData);
            if (response.user) {
                sessionStorage.setItem('firstName', updatedData.name.split(' ')[0]);
                sessionStorage.setItem('lastName', updatedData.name.split(' ')[1] || '');
                sessionStorage.setItem('userEmail', updatedData.newEmail || email);
                setFirstName(updatedData.name.split(' ')[0]);
                setLastName(updatedData.name.split(' ')[1] || '');
                setEmail(updatedData.newEmail || email);
            }
            setSettingsOpen(false);
        } catch (error) {
            console.error('Failed to update user info:', error);
        }
    };

    useEffect(() => {
        if (!sessionStorage.getItem('userEmail')) {
            navigate('/logged-out', { replace: true });
        }
    }, [navigate]);

    useEffect(() => {
        getPair(email)
            .then(response => {
                const partnerData = response.data.partner;
                setPartner(partnerData);
                setPairingStatus(partnerData.pair.enable);

                getGoals(email).then(response => {
                    const activeGoals = response.data.activeGoals;
                    setUserGoals(activeGoals);
                    if (activeGoals.length === 0) {
                        setNoGoalsMessage("You must have an active goal to pair with someone.");
                    } else {
                        setNoGoalsMessage("");
                    }
                });

                if (partnerData && partnerData.email) {
                    getGoals(partnerData.email).then(response => {
                        setPartnerGoals(response.data.activeGoals);
                    });
                }
            })
            .catch(error => {
                if (error.response && error.response.status === 404) {
                    setNoPartnerMessage("There are no active partners to pair with at the moment.");
                } else {
                    console.error("Error fetching pairing status:", error);
                }
            });
    }, [email]);

    const handlePair = () => {
        setPair(email)
            .then(response => {
                setPartner(response.data.partner);
                setPairingStatus(response.data.partner.pair.enable);
                getGoals(response.data.partner.email).then(response => {
                    setPartnerGoals(response.data);
                });
            })
            .catch(error => {
                if (error.response && error.response.status === 404) {
                    setNoPartnerMessage("There are no active partners to pair with at the moment.");
                } else {
                    console.error("Error pairing:", error);
                }
            });
    };

    const renderTasks = (tasks) => (
        <List>
            {tasks.map((task, index) => (
                <ListItem key={index}>
                    <ListItemText
                        primary={task.name}
                        style={{ textDecoration: task.completed ? 'line-through' : 'none' }}
                    />
                </ListItem>
            ))}
        </List>
    );

    return (
        <div className={darkMode ? 'app dark-mode' : 'app'}>
      <nav className="navbar">
        <div className="logo">
          <img src={logo} alt="Logo" />
        </div>
        <ul className="nav-links">
          <li><Link to="/user">HOME</Link></li>
          <li><Link to="/user/goal">TASKS</Link></li>
          <li><Link to="/user/pair">PAIR</Link></li>
          <li><Link to="/user/calendar">CALENDAR</Link></li>
          <li><Link to="/user/pomodoro">POMODORO TIMER</Link></li>
          <li><Link to="/user/chatbot">CHATBOT</Link></li>          
          <li><Link to="/user/pdfsummarizer">PDF SUMMARIZER</Link></li>
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
            <Container className="container">
                <Box my={4}>
                    <Typography variant="h4" gutterBottom align="center">Pair with a Partner</Typography>

                    {/* No Partner Available Message */}
                    {noPartnerMessage && (
                        <Typography variant="h6" color="error" align="center" paragraph className="error-message">
                            {noPartnerMessage}
                        </Typography>
                    )}

                    {/* No Active Goals Message */}
                    {noGoalsMessage && (
                        <Typography variant="h6" color="error" align="center" paragraph className="error-message">
                            {noGoalsMessage}
                        </Typography>
                    )}

                    {/* Pairing Status Section */}
                    {pairingStatus ? (
                        <Box textAlign="center" mb={4}>
                            <Typography variant="h6">You are paired with:</Typography>
                            <Typography variant="h5">{partner.firstName} {partner.lastName}</Typography>
                            <Typography variant="body1" color="textSecondary">{partner.email}</Typography>
                        </Box>
                    ) : (
                        !noPartnerMessage && !noGoalsMessage && (
                            <Box textAlign="center" mb={4}>
                                <Button variant="contained" className="button" onClick={handlePair}>
                                    Pair with a Partner
                                </Button>
                            </Box>
                        )
                    )}

                    {/* User's Active Goals */}
                    <Box mt={4}>
                        <Typography variant="h5" gutterBottom>Your Active Goals</Typography>
                        {userGoals.length > 0 ? (
                            userGoals.map((goal, index) => (
                                <Card key={index} variant="outlined" className="card">
                                    <CardContent>
                                        <Typography variant="h6">{goal.title}</Typography>
                                        {renderTasks(goal.activeTasks)}
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <Typography>No active goals.</Typography>
                        )}
                    </Box>

                    {/* Partner's Active Goals */}
                    {partner && (
                        <Box mt={4}>
                            <Typography variant="h5" gutterBottom>Partner's Active Goals</Typography>
                            {partnerGoals.length > 0 ? (
                                partnerGoals.map((goal, index) => (
                                    <Card key={index} variant="outlined" className="card">
                                        <CardContent>
                                            <Typography variant="h6">{goal.title}</Typography>
                                            {renderTasks(goal.activeTasks)}
                                        </CardContent>
                                    </Card>
                                ))
                            ) : (
                                <Typography>Your partner has no active goals.</Typography>
                            )}
                        </Box>
                    )}
                </Box>
            </Container>
            <LogoutPopup
                open={popupOpen}
                onClose={handleClosePopup}
                onConfirm={handleConfirmLogout}
            />
            <SettingsPopup
                open={settingsOpen}
                onClose={handleCloseSettings}
                firstName={firstName}
                lastName={lastName}
                email={email}
                onUpdateUserInfo={handleUpdateUserInfo}
            />
        </div>
    );
};

export default PairPage;
