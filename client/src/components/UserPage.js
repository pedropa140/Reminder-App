import React from 'react';
import { Container, Box, Typography, Grid, Button, Paper } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../icon.png';
import '../App.css';
import { FaSun, FaMoon, FaCog } from 'react-icons/fa';
import LogoutPopup from './LogoutPopup';
import SettingsPopup from './SettingsPopup';
import { updateUserInfo, getStreakAndLastActivity } from '../api';
import { FaTasks, FaCalendarAlt, FaClock, FaComments, FaFilePdf, FaPhoneAlt, FaSignOutAlt, FaCogs } from 'react-icons/fa'; // Added icons

const UserPage = () => {
  const [firstName, setFirstName] = React.useState(sessionStorage.getItem('firstName'));
  const [lastName, setLastName] = React.useState(sessionStorage.getItem('lastName'));
  const [email, setEmail] = React.useState(sessionStorage.getItem('userEmail'));
  const [streak, setStreak] = React.useState(0);

  const navigate = useNavigate();
  const [darkMode, setDarkMode] = React.useState(false);
  const [popupOpen, setPopupOpen] = React.useState(false);
  const [settingsOpen, setSettingsOpen] = React.useState(false);

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
    setSettingsOpen(true);
  };

  const handleCloseSettings = () => {
    setSettingsOpen(false);
  };

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

  React.useEffect(() => {
    if (!sessionStorage.getItem('userEmail')) {
      navigate('/logged-out', { replace: true });
    } else {
      getStreakAndLastActivity(email)
        .then(({ streak }) => {
          setStreak(streak);
        })
        .catch(error => {
          console.error('Error fetching streak information:', error);
        });
    }
  }, [email, navigate]);

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

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Paper elevation={6} sx={{ p: 4, mb: 4, backgroundColor: darkMode ? '#333' : '#fff' }}>
          <Typography variant="h3" align="center" gutterBottom sx={{
            fontWeight: 'bold',
            color: darkMode ? '#fff' : '#000'
          }}>
            Welcome, {firstName}!
          </Typography>

          <Typography variant="h6" align="center" gutterBottom sx={{ color: darkMode ? '#ddd' : '#555' }}>
            {streak > 0
              ? `You're on a ${streak}-day streak! Keep up the great work!`
              : 'Start completing your goals to build a streak!'}
          </Typography>
          <Typography variant="h6" align="center" gutterBottom sx={{ color: darkMode ? '#ddd' : '#555' }}>
            Email: {email}
          </Typography>
          <Typography variant="body1" align="center" sx={{ mt: 2, color: darkMode ? '#aaa' : '#666' }}>
            Use the taskbar above to navigate to the different tools available.
          </Typography>
        </Paper>

        <Grid container spacing={3}>
          {[
            { label: 'Tasks', description: 'Manage and track your tasks here.', path: '/user/goal', icon: <FaTasks /> },
            { label: 'Pair', description: 'Connect with friends to collaborate on tasks.', path: '/user/pair', icon: <FaComments /> },
            { label: 'Calendar', description: 'View and manage your calendar events.', path: '/user/calendar', icon: <FaCalendarAlt /> },
            { label: 'Pomodoro Timer', description: 'Focus on your tasks with the Pomodoro timer.', path: '/user/pomodoro', icon: <FaClock /> },
            { label: 'Chatbot', description: 'Get help and answers from the chatbot.', path: '/user/chatbot', icon: <FaComments /> },
            { label: 'PDF Summarizer', description: 'Summarizes PDFs using Gemini AI.', path: '/user/pdfsummarizer', icon: <FaFilePdf /> },
            { label: 'Contact', description: 'Get in touch with support or feedback.', path: '/user/contact', icon: <FaPhoneAlt /> },
            { label: 'Logout', description: 'Log out of your account securely.', path: '', onClick: handleLogoutClick, icon: <FaSignOutAlt /> },
            { label: 'Settings', description: 'Update your profile and application settings.', path: '', onClick: handleSettingsClick, icon: <FaCogs /> }
          ].map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Button
                variant="contained"
                sx={{
                  p: 4,
                  borderRadius: '12px',
                  boxShadow: 3,
                  backgroundColor: '#1976d2',
                  color: '#fff',
                  textAlign: 'center',
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: '#155a8a',
                    transform: 'scale(1.05)',
                    boxShadow: 6,
                  },
                }}
                onClick={() => item.onClick ? item.onClick() : navigate(item.path)}
              >
                <Box sx={{ mb: 1, fontSize: '2rem' }}>
                  {item.icon}
                </Box>
                <Typography variant="h6" color="#fff" sx={{ mb: 0.5 }}>{item.label}</Typography>
                <Typography variant="body2" color="#fff">{item.description}</Typography>
              </Button>
            </Grid>
          ))}
        </Grid>
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

export default UserPage;
