import React, { useState } from 'react';
import { Button, TextField, Container, Typography, Box } from '@mui/material';
import { getUser } from '../api';
import { Link, useNavigate } from 'react-router-dom';
import bcrypt from 'bcryptjs';
import { FaSun, FaMoon } from 'react-icons/fa';
import logo from '../icon.png';
import '../App.css';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formData.email || !formData.password) {
        alert('Please fill in all fields.');
        return;
      }
      formData.email = formData.email.trim();
      formData.password = formData.password.trim();
      const response = await getUser(formData.email);
      if (response.status === 200) {
        const user = response.data;
        const isPasswordMatch = await bcrypt.compare(formData.password, user.password);
        if (isPasswordMatch) {
          sessionStorage.setItem('userEmail', formData.email);
          sessionStorage.setItem('firstName', user.firstName);
          sessionStorage.setItem('lastName', user.lastName);
  
          navigate('/user');
        } else {
          alert('Incorrect password. Please try again.');
        }
      } else {
        alert('Failed to log in. Please try again.');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      alert('Failed to log in. Please try again.');
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
            backgroundColor: darkMode ? '#333' : '#fff',
            color: darkMode ? '#f0f0f0' : '#000',
          }}
        >
          <Typography variant="h5" sx={{ color: darkMode ? 'white' : 'text.primary' }}>
            Login
          </Typography>
          <form onSubmit={handleSubmit} style={{ width: '100%', marginTop: '1rem' }}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              InputProps={{
                style: { color: darkMode ? 'white' : 'black' },
              }}
              InputLabelProps={{
                style: { color: darkMode ? 'white' : 'black' },
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
                style: { color: darkMode ? 'white' : 'black' },
              }}
              InputLabelProps={{
                style: { color: darkMode ? 'white' : 'black' },
              }}
            />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 2, backgroundColor: darkMode ? '#007bff' : '#0056b3', color: 'white' }}>
              Login
            </Button>
          </form>
          <Link to="/signup" style={{ marginTop: '1rem', color: darkMode ? '#007bff' : '#0056b3' }}>
            Don't have an account? Sign Up
          </Link>
        </Box>
      </Container>
    </div>
  );
};

export default LoginPage;
