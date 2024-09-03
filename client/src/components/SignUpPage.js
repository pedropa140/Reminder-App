import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUser } from '../api';
import { Button, TextField, Container, Typography, Box } from '@mui/material';
import { FaSun, FaMoon } from 'react-icons/fa';
import logo from '../logo.svg'; // Ensure the path to the logo is correct
import '../App.css'; // Ensure the path to the CSS file is correct
import bcrypt from 'bcryptjs';

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate hook

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      alert('Please fill in all fields.');
      return;
    }
    const hashedPassword = await bcrypt.hash(formData.password, 10); // 10 is the number of salt rounds
    formData.password = hashedPassword;
    formData.email = formData.email.trim();
    formData.firstName = formData.firstName.trim();
    formData.lastName = formData.lastName.trim();

    try {
      const response = await createUser(formData);
      if (response.status === 200) {
        alert('User created successfully!');
        navigate('/login'); // Redirect to the login page
      } else {
        alert('Failed to create user. Please try again.');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      alert('Failed to create user. Please try again.');
    }
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
            backgroundColor: darkMode ? '#f0f0f0' : '#fff',
            color: '#000',
          }}
        >
          <Typography variant="h5">Sign Up</Typography>
          <form onSubmit={handleSubmit} style={{ width: '100%', marginTop: '1rem' }}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              InputProps={{
                style: { backgroundColor: darkMode ? 'white' : 'inherit', color: darkMode ? 'black' : 'inherit' },
              }}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              InputProps={{
                style: { backgroundColor: darkMode ? 'white' : 'inherit', color: darkMode ? 'black' : 'inherit' },
              }}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              type="email"
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              InputProps={{
                style: { backgroundColor: darkMode ? 'white' : 'inherit', color: darkMode ? 'black' : 'inherit' },
              }}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              type="password"
              label="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              InputProps={{
                style: { backgroundColor: darkMode ? 'white' : 'inherit', color: darkMode ? 'black' : 'inherit' },
              }}
            />
            <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 2 }}>
              Sign Up
            </Button>
          </form>
        </Box>
      </Container>
    </div>
  );
};

export default SignUpPage;
