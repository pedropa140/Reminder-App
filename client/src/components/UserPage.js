import React from 'react';
import { Container, Box, Typography, Grid, Button, Paper } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../icon.png';
import '../App.css';
import { FaSun, FaMoon, FaCog } from 'react-icons/fa';
import LogoutPopup from './LogoutPopup';
import SettingsPopup from './SettingsPopup'; 
import { updateUserInfo, getStreakAndLastActivity } from '../api'; // Import the streak API call

const UserPage = () => {
  const [firstName, setFirstName] = React.useState(sessionStorage.getItem('firstName'));
  const [lastName, setLastName] = React.useState(sessionStorage.getItem('lastName'));
  const [email, setEmail] = React.useState(sessionStorage.getItem('userEmail'));
  const [streak, setStreak] = React.useState(0); // State for user's streak

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

  // Fetch streak information when the page loads
  React.useEffect(() => {
    if (!sessionStorage.getItem('userEmail')) {
      navigate('/logged-out', { replace: true });
    } else {
      // Call API to fetch streak data
      getStreakAndLastActivity(email)
        .then(({ streak }) => {
          setStreak(streak); // Set the streak from the API response
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

      <Container maxWidth="lg" sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Welcome to your dashboard, {firstName}!
          </Typography>

          {/* Display Streak Under the Welcome Message */}
          <Typography variant="h6" align="center" gutterBottom>
            {streak > 0 
              ? `You're on a ${streak}-day streak! Keep up the good work!` 
              : 'Start completing your goals to build a streak!'}
          </Typography>

          <Typography variant="h6" align="center" gutterBottom>
            Email: {email}
          </Typography>
          <Typography variant="body1" align="center" sx={{ mt: 2 }}>
            Use the taskbar above to navigate to the different tools available.
          </Typography>
        </Paper>

        <Grid container spacing={3}>
          {[
            { label: 'Tasks', description: 'Manage and track your tasks here.', path: '/user/goal' },
            { label: 'pair', description: 'Connects users with friends to collaborate on tasks together.', path: '/user/pair' },
            { label: 'Calendar', description: 'View and manage your calendar events.', path: '/user/calendar' },
            { label: 'Pomodoro Timer', description: 'Focus on your tasks with the Pomodoro timer.', path: '/user/pomodoro' },
            { label: 'Chatbot', description: 'Get help and answers from the chatbot.', path: '/user/chatbot' },
            { label: 'Contact', description: 'Get in touch with support or feedback.', path: '/user/contact' },
            { label: 'Settings', description: 'Update your profile and application settings.', path: '', onClick: handleSettingsClick },
            { label: 'Logout', description: 'Log out of your account securely.', path: '', onClick: handleLogoutClick }
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
                  '&:hover': {
                    backgroundColor: '#155a8a',
                  },
                }}
                onClick={() => item.onClick ? item.onClick() : navigate(item.path)}
              >
                <Typography variant="h6" color="#fff">{item.label}</Typography>
                <Typography variant="body2" color="#fff">{item.description}</Typography>
              </Button>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Popup for logout confirmation */}
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

export default UserPage;
