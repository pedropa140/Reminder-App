import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const LogoutPopup = ({ open, onClose, onConfirm }) => {
  if (!open) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Grey overlay with transparency
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1200, // Ensure it appears above other elements
      }}
    >
      <Box
        sx={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          padding: '24px',
          textAlign: 'center',
          minWidth: '300px',
        }}
      >
        <Typography variant="h6" sx={{ marginBottom: '16px' }}>
          Are you sure you want to log out?
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={onConfirm}
            sx={{ borderRadius: '8px' }}
          >
            Yes
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={onClose}
            sx={{ borderRadius: '8px' }}
          >
            No
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default LogoutPopup;
