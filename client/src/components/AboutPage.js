import React from 'react';
import { Container, Typography, Box, Grid } from '@mui/material';
import { Link } from 'react-router-dom';
import { FaSun, FaMoon } from 'react-icons/fa';
import logo from '../icon.png';
import '../App.css';

const AboutPage = () => {
  const [darkMode, setDarkMode] = React.useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={darkMode ? 'app dark-mode' : 'app'}>
      <nav className="navbar">
        <div className="logo">
          <img src={logo} alt="Logo" />
        </div>
        <ul className="nav-links">
          <li><Link to="/">HOME</Link></li>
          <li><Link to="/about">ABOUT</Link></li>
          <li><Link to="/login">LOGIN</Link></li>
          <li><Link to="/signup">SIGN UP</Link></li>
          <li><Link to="/contact">CONTACT</Link></li>
        </ul>
        <div className="theme-toggle" onClick={toggleDarkMode}>
          {darkMode ? <FaSun /> : <FaMoon />}
        </div>
      </nav>

      <Container maxWidth="md" sx={{ mb: '50px' }}>
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
            pb: '50px', // Padding-bottom of 50px to create the gap
          }}
        >
          <Typography variant="h4" sx={{ mb: 2 }}>
            About Us
          </Typography>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Welcome to ReminderApp!
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            At ReminderApp, our mission is to help you stay organized and on top of your tasks with ease. We understand that managing daily responsibilities can be overwhelming, and we're here to simplify that process for you.
          </Typography>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Who We Are
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            We're a team of passionate individuals committed to making productivity tools that enhance your daily life. Our team combines expertise in technology, design, and user experience to bring you a reliable and intuitive platform.
          </Typography>
          <Typography variant="h6" sx={{ mb: 2 }}>
            What We Do
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            ReminderApp is designed to be your personal assistant in managing tasks and reminders. Whether you're keeping track of important deadlines, planning daily activities, or simply trying to stay organized, our app provides a seamless experience to ensure you never miss a beat.
            <ul>
              <li><strong>Task Management:</strong> Create, edit, and organize tasks with ease.</li>
              <li><strong>Reminders:</strong> Set reminders to ensure you stay on track with your commitments.</li>
              <li><strong>Customizable:</strong> Tailor your experience with customizable themes and settings.</li>
              <li><strong>User-Friendly Interface:</strong> Navigate effortlessly with a clean and intuitive design.</li>
            </ul>
          </Typography>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Our Vision
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            We believe in empowering users to take control of their time and achieve their goals efficiently. Our vision is to continuously innovate and improve our platform to meet the evolving needs of our users. We are dedicated to providing tools that are not only effective but also enjoyable to use.
          </Typography>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Join Us
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Thank you for choosing ReminderApp! We’re excited to be a part of your journey towards better organization and productivity. If you have any feedback or suggestions, please feel free to reach out to us. Your input helps us improve and deliver the best experience possible.
          </Typography>
        </Box>
      </Container>

      {/* Additional section for creators */}
      <Container maxWidth="md" sx={{ mb: '50px' }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            p: 4,
            borderRadius: '12px',
            backgroundColor: darkMode ? '#444' : '#f9f9f9',
            color: darkMode ? '#f0f0f0' : '#333',
            boxShadow: 3,
            mb: '50px', // Margin-bottom of 50px to create the gap
          }}
        >
          <Typography variant="h5" sx={{ mb: 2 }}>
            Meet the Creators
          </Typography>
          <Typography variant="body1" sx={{ mb: 4 }}>
            Our team of dedicated developers and designers worked hard to bring ReminderApp to life. Here are the talented individuals who made it all happen:
          </Typography>
          <Grid container spacing={4} sx={{ maxWidth: '800px' }}>
            {[
              { name: 'Kusum Gandham', role: 'Lead Developer' },
              { name: 'Pedro Pajarillo', role: 'UI/UX Designer' },
              { name: 'YeJu Lee', role: 'Backend Engineer' },
              { name: 'Elizabeth Laub', role: 'Project Manager' },
            ].map((creator, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    p: 3,
                    borderRadius: '8px',
                    backgroundColor: darkMode ? '#555' : '#fff',
                    boxShadow: 1,
                    textAlign: 'center',
                    height: '100%', // Ensures boxes take full height of the Grid item
                    flex: 1, // Equalizes the size of the boxes
                    maxWidth: '200px', // Sets a maximum width for each box
                    margin: 'auto', // Centers the box horizontally
                  }}
                >
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    {creator.name}
                  </Typography>
                  <Typography variant="body2">
                    {creator.role}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
          <br /><br /><br />
        </Box>
      </Container>
    </div>
  );
};

export default AboutPage;
