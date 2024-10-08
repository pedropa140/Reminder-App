import React from 'react';
import { Container, Typography, Box, Grid } from '@mui/material';
import { Link } from 'react-router-dom';
import { FaSun, FaMoon } from 'react-icons/fa';
import logo from '../icon.png';
import kusumPhoto from '../assets/kusum.jpg'; // Placeholder for Kusum's photo
import pedroPhoto from '../assets/pedro.jpg'; // Placeholder for Pedro's photo
import yejuPhoto from '../assets/yeju.jpg'; // Placeholder for YeJu's photo
import elizabethPhoto from '../assets/liz.png'; // Placeholder for Elizabeth's photo
import '../App.css';

const AboutPage = () => {
  const [darkMode, setDarkMode] = React.useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const creators = [
    { name: 'Kusum Gandham', role: 'Lead Developer', description: 'Kusum is a skilled developer with a passion for creating efficient and scalable code.', photo: kusumPhoto },
    { name: 'Pedro Pajarillo', role: 'UI/UX Designer', description: 'Pedro is an expert in designing intuitive and visually appealing user interfaces.', photo: pedroPhoto },
    { name: 'YeJu Lee', role: 'Backend Engineer', description: 'YeJu is a learning software engineer with growing skills in connecting the frontend with the backend.', photo: yejuPhoto },
    { name: 'Elizabeth Laub', role: 'Project Manager', description: 'Elizabeth excels in managing projects and coordinating team efforts to achieve project goals.', photo: elizabethPhoto },
  ];

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
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>
            About Us
          </Typography>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'normal' }}>
            Welcome to TaskBuddy!
          </Typography>
          <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6 }}>
            At TaskBuddy, our mission is to help you stay organized and on top of your tasks with ease. We understand that managing daily responsibilities can be overwhelming, and we're here to simplify that process for you.
          </Typography>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
            Who We Are
          </Typography>
          <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6 }}>
            {/* We're a team of passionate individuals committed to making productivity tools that enhance your daily life. Our team combines expertise in technology, design, and user experience to bring you a reliable and intuitive platform. */}
            We are a mix of recent and upcoming graduates from Rutgers University-New Brunswick who are inspired to make productivity tools to enhance daily life. Aimed at creating meaningful projects, our team has crafted this platform to promote better time management and organization.
          </Typography>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
            What We Do
          </Typography>
          <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6 }}>
            TaskBuddy is designed to be your personal assistant in managing tasks and reminders. Whether you're keeping track of important deadlines, planning daily activities, or simply trying to stay organized, our app provides a seamless experience to ensure you never miss a beat.
          </Typography>
          <ul style={{
            textAlign: 'left',
            paddingLeft: '20px',
            listStyleType: 'none',
            marginTop: '20px',
            marginLeft: 'auto',
            marginRight: 'auto',
            border: darkMode ? '1px solid #555' : '1px solid #ddd',
            borderRadius: '8px',
            backgroundColor: darkMode ? '#222' : '#f9f9f9',
            padding: '20px',
            maxWidth: '600px',
            boxShadow: darkMode ? '0 4px 8px rgba(0, 0, 0, 0.3)' : '0 4px 8px rgba(0, 0, 0, 0.1)',
          }}>
            <li style={{
              marginBottom: '10px',
              padding: '10px',
              borderBottom: darkMode ? '1px solid #444' : '1px solid #ddd',
              fontSize: '16px',
              lineHeight: '1.5',
              color: darkMode ? '#f0f0f0' : '#000',
              backgroundColor: darkMode ? '#333' : '#fff',
              transition: 'background-color 0.3s, color 0.3s',
            }}>
              <strong>Task Management:</strong> Create, edit, and organize current and upcoming tasks.
            </li>
            <li style={{
              marginBottom: '10px',
              padding: '10px',
              borderBottom: darkMode ? '1px solid #444' : '1px solid #ddd',
              fontSize: '16px',
              lineHeight: '1.5',
              color: darkMode ? '#f0f0f0' : '#000',
              backgroundColor: darkMode ? '#333' : '#fff',
            }}>
              <strong>Reminders:</strong> Set reminders to ensure you stay on track with your commitments.
            </li>
            <li style={{
              marginBottom: '10px',
              padding: '10px',
              borderBottom: darkMode ? '1px solid #444' : '1px solid #ddd',
              fontSize: '16px',
              lineHeight: '1.5',
              color: darkMode ? '#f0f0f0' : '#000',
              backgroundColor: darkMode ? '#333' : '#fff',
            }}>
              <strong>Customizable:</strong> Tailor your experience with customizable themes and settings.
            </li>
            <li style={{
              marginBottom: '10px',
              padding: '10px',
              fontSize: '16px',
              lineHeight: '1.5',
              color: darkMode ? '#f0f0f0' : '#000',
              backgroundColor: darkMode ? '#333' : '#fff',
            }}>
              <strong>User-Friendly Interface:</strong> Navigate effortlessly with a clean and intuitive design.
            </li>
          </ul>

          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
            Our Vision
          </Typography>
          <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6 }}>
            {/* We believe in empowering users to take control of their time and achieve their goals efficiently. Our vision is to continuously innovate and improve our platform to meet the evolving needs of our users. We are dedicated to providing tools that are not only effective but also enjoyable to use. */}
            We believe in empowering users to stay organized, focused, and achieve their goals, whether they be personal or academic. Our vision is to give users the most personalized experience by receiving feedback of their evolving needs. 
          </Typography>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
            Send Feedback
          </Typography>
          <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6 }}>
            Thank you for choosing TaskBuddy! We’re excited to be a part of your journey towards better organization and productivity. If you have any feedback or suggestions, please feel free to reach out to us. Your input helps us improve and deliver the best experience possible.
          </Typography>
        </Box>
      </Container>

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
      mb: '50px',
    }}
  >
    <Typography variant="h5" sx={{ mb: 2 }}>
      Meet the Creators
    </Typography>
    <Typography variant="body1" sx={{ mb: 4 }}>
      Our team of dedicated developers and designers worked hard to bring TaskBuddy to life. Here are the talented individuals who made it all happen:
    </Typography>
    <Grid container spacing={4} sx={{ width: '100%' }}>
      {creators.map((creator, index) => (
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
              textAlign: 'center',
              width: '100%',
              maxWidth: '500px', // Maximum width for each box
              margin: 'auto',
            }}
          >
            <img
              src={creator.photo}
              alt={creator.name}
              style={{
                width: '150px', // Square width
                height: '200px', // Square height
                borderRadius: '5px', // Rounded corners
                objectFit: 'cover',
                marginBottom: '10px',
              }}
            />
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
