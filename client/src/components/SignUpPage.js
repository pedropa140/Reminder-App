// SignUpPage.js
import React, { useState } from 'react';
import { Button, TextField, Container, Typography, Box } from '@mui/material';

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
});
  const navigate = useNavigate();

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


    const response = await createUser(formData);
    if (response.status===200)
    {
        alert('User created successfully!');
        navigate('/login');
    } else{
        alert('Failed to create user. Please try again.');
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
        <Typography variant="h5">Sign Up</Typography>
        <form onSubmit={handleSubmit} style={{ width: '100%', marginTop: '1rem' }}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Username"
            value={username}
            onChange={handleChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            type="email"
            label="Email"
            value={email}
            onChange={handleChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            type="password"
            label="Password"
            value={password}
            onChange={handleChange}
          />
          <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 2 }}>
            Sign Up
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default SignUpPage;
