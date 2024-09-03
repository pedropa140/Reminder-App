// LoginPage.js
import React, { useState } from 'react';
import { Button, TextField, Container, Typography, Box } from '@mui/material';
import { getUser} from '../api';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import bcrypt from 'bcryptjs';


const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
});
const handleChange = (e) => {
  setFormData({ ...formData, [e.target.name]: e.target.value });
};
  
const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle login logic here
    try{
      if(!formData.netID || !formData.password|| !formData.secpass) {
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
            sessionStorage.setItem('isUser', formData.netID);

            //sessionStorage.setItem('cachedPassword', formData.password);
            //navigate(`/user/${formData.netID}`); // Redirect to User.js with netID
        } else {
            alert('Incorrect password. Please try again.');
        }
    } else {
        alert('Failed to log in. Please try again.');
    }
      
    }
    catch(error)
    {
      console.error('Error logging in:', error);
      alert('Failed to log in. Please try again.');
    }
  };

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mt: 8,
          p: 2,
          border: '1px solid',
          borderRadius: '8px',
          boxShadow: 3,
        }}
      >
        <Typography variant="h5">Login</Typography>
        <form onSubmit={handleSubmit} style={{ width: '100%', marginTop: '1rem' }}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Email"
            name = "email"
            value={formData.email}
            onChange={handleChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            type="password"
            label="Password"
            name = "password"
            value={formData.password}
            onChange={handleChange}
          />
          <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 2 }}>
            Login
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default LoginPage;
