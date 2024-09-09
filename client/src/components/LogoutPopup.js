import React from 'react';
import { Box, Typography, Button, useTheme } from '@mui/material';

const LogoutPopup = ({ open, onClose, onConfirm }) => {
  const theme = useTheme(); // Get the current theme

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
          backgroundColor: theme.palette.background.paper, // Use theme background color
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          padding: '24px',
          textAlign: 'center',
          minWidth: '300px',
          position: 'relative',
        }}
      >
        <Typography
          variant="h6"
          sx={{ 
            marginBottom: '16px',
            color: theme.palette.mode === 'dark' ? 'white' : 'black' // Conditional text color
          }}
        >
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
      {/* This ensures the popup content doesn't shift on scroll */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -1,
        }}
      />
    </Box>
  );
};

export default LogoutPopup;
