import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const LogoutPopup = ({ open, onClose, onConfirm }) => {
  if (!open) return null;

  return (
    <Box className="logout-popup">
      <Typography variant="h6" className="popup-title">
        Are you sure you want to log out?
      </Typography>
      <Box className="popup-buttons">
        <Button
          variant="contained"
          color="primary"
          onClick={onConfirm}
          className="popup-button"
        >
          Yes
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={onClose}
          className="popup-button"
        >
          No
        </Button>
      </Box>
    </Box>
  );
};

export default LogoutPopup;
