import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const LoggedOutPage = () => {
  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          p: 4,
          border: '1px solid',
          borderRadius: '12px',
          boxShadow: 3,
          backgroundColor: '#fff',
          textAlign: 'center',
          maxWidth: '600px',
          margin: 'auto',
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ mb: 2, color: 'black' }}>
          You have been logged out.
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Thank you for using our application. Please <a href="/login" style={{ color: '#007bff', textDecoration: 'none' }}>log in</a> again to access your dashboard.
        </Typography>
        <Typography variant="body2" sx={{ color: '#888' }}>
          If you need assistance, feel free to <a href="/contact" style={{ color: '#007bff', textDecoration: 'none' }}>contact us</a>.
        </Typography>
      </Box>
    </Container>
  );
};

export default LoggedOutPage;
