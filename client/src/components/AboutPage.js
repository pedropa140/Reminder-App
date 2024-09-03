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
            pb: '50px',
            textAlign: 'center',
            position: 'relative', // Allows for adding overlay or other design elements
            overflow: 'hidden', // Ensures elements do not overflow the box
          }}
        >
          {/* Optional design element */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: darkMode ? 'linear-gradient(to bottom right, #444, #222)' : 'linear-gradient(to bottom right, #f0f0f0, #fff)',
              zIndex: -1,
              opacity: 0.1,
            }}
          />

          <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>
            About Us
          </Typography>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'normal' }}>
            Welcome to ReminderApp!
          </Typography>
          <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6 }}>
            At ReminderApp, our mission is to help you stay organized and on top of your tasks with ease. We understand that managing daily responsibilities can be overwhelming, and we're here to simplify that process for you.
          </Typography>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
            Who We Are
          </Typography>
          <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6 }}>
            We're a team of passionate individuals committed to making productivity tools that enhance your daily life. Our team combines expertise in technology, design, and user experience to bring you a reliable and intuitive platform.
          </Typography>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
            What We Do
          </Typography>
          <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6 }}>
            ReminderApp is designed to be your personal assistant in managing tasks and reminders. Whether you're keeping track of important deadlines, planning daily activities, or simply trying to stay organized, our app provides a seamless experience to ensure you never miss a beat.
          </Typography>
          <ul style={{
            textAlign: 'left',
            paddingLeft: '20px',
            listStyleType: 'none',
            marginTop: '20px',
            marginLeft: 'auto',
            marginRight: 'auto',
            border: '1px solid #ddd',
            borderRadius: '8px',
            backgroundColor: '#f9f9f9',
            padding: '20px',
            maxWidth: '600px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Subtle shadow
          }}>
            <li style={{
              marginBottom: '10px',
              padding: '10px',
              borderBottom: '1px solid #ddd',
              fontSize: '16px',
              lineHeight: '1.5',
              transition: 'background-color 0.3s, color 0.3s', // Smooth transition for hover effect
            }}>
              <strong>Task Management:</strong> Create, edit, and organize tasks with ease.
            </li>
            <li style={{
              marginBottom: '10px',
              padding: '10px',
              borderBottom: '1px solid #ddd',
              fontSize: '16px',
              lineHeight: '1.5',
              transition: 'background-color 0.3s, color 0.3s',
            }}>
              <strong>Reminders:</strong> Set reminders to ensure you stay on track with your commitments.
            </li>
            <li style={{
              marginBottom: '10px',
              padding: '10px',
              borderBottom: '1px solid #ddd',
              fontSize: '16px',
              lineHeight: '1.5',
              transition: 'background-color 0.3s, color 0.3s',
            }}>
              <strong>Customizable:</strong> Tailor your experience with customizable themes and settings.
            </li>
            <li style={{
              marginBottom: '10px',
              padding: '10px',
              fontSize: '16px',
              lineHeight: '1.5',
              transition: 'background-color 0.3s, color 0.3s',
            }}>
              <strong>User-Friendly Interface:</strong> Navigate effortlessly with a clean and intuitive design.
            </li>
          </ul>

          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
            Our Vision
          </Typography>
          <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6 }}>
            We believe in empowering users to take control of their time and achieve their goals efficiently. Our vision is to continuously innovate and improve our platform to meet the evolving needs of our users. We are dedicated to providing tools that are not only effective but also enjoyable to use.
          </Typography>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
            Join Us
          </Typography>
          <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6 }}>
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
          <Grid container spacing={4} sx={{ width: '100%' }}>
            {[
              { name: 'Kusum Gandham', role: 'Lead Developer', description: 'Kusum is a skilled developer with a passion for creating efficient and scalable code.' },
              { name: 'Pedro Pajarillo', role: 'UI/UX Designer', description: 'Pedro is an expert in designing intuitive and visually appealing user interfaces.' },
              { name: 'YeJu Lee', role: 'Backend Engineer', description: 'YeJu specializes in backend development, ensuring robust and secure server-side logic.' },
              { name: 'Elizabeth Laub', role: 'Project Manager', description: 'Elizabeth excels in managing projects and coordinating team efforts to achieve project goals.' },
            ].map((creator, index) => (
              <Grid item xs={12} key={index}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    p: 3,
                    borderRadius: '8px',
                    backgroundColor: darkMode ? '#555' : '#fff',
                    boxShadow: 1,
                    textAlign: 'center', // Center-align text
                    width: '100%', // Makes the box span the full width of its container
                    maxWidth: '500px', // Sets a maximum width to prevent overflow
                    margin: 'auto', // Centers the box horizontally
                  }}
                >
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    {creator.name}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    {creator.role}
                  </Typography>
                  <Typography variant="body2">
                    {creator.description}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </div>
  );
};

export default AboutPage;
