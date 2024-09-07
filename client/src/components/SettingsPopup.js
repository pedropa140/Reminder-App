import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Typography } from '@mui/material';
import { updateUserInfo } from '../api';  // Import the updateUserInfo function

const SettingsPopup = ({ open, onClose, firstName, lastName, email, onUpdateSuccess }) => {
  const [newFirstName, setNewFirstName] = useState(firstName || '');
  const [newLastName, setNewLastName] = useState(lastName || '');
  const [newEmail, setNewEmail] = useState(email || '');
  const [currentPassword, setCurrentPassword] = useState(''); // Current password
  const [newPassword, setNewPassword] = useState(''); // New password
  const [loading, setLoading] = useState(false); // For loading state
  const [error, setError] = useState(null); // For error handling

  useEffect(() => {
    setNewFirstName(firstName || '');
    setNewLastName(lastName || '');
    setNewEmail(email || '');
  }, [firstName, lastName, email]);

  const handleSave = async () => {
    setLoading(true);
    setError(null);

    const updatedUserData = {
      firstName: newFirstName,
      lastName: newLastName,
      email: newEmail,
      currentEmail: email,  // Use this to identify the current user
      currentPassword,
      newPassword
    };

    try {
      // Call the API function to update user information
      const response = await updateUserInfo(updatedUserData);

      // Check if the API response contains the updated user information
      if (response && response.email) {
        // Update sessionStorage with the new values
        sessionStorage.setItem('firstName', response.firstName);
        sessionStorage.setItem('lastName', response.lastName);
        sessionStorage.setItem('userEmail', response.email);

        // Notify the parent component or take other actions on success
        if (onUpdateSuccess) onUpdateSuccess(response);

        // Close the popup
        onClose();
      } else {
        // Handle unexpected response format
        setError('Failed to update user info');
      }
    } catch (err) {
      setError('Failed to update user info');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDialog-container': {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        },
        '& .MuiPaper-root': {
          width: '600px', // Set the desired width
          maxWidth: '90%', // Ensure it doesn't exceed viewport width
          borderRadius: '16px',
          padding: '16px',
        }
      }}
    >
      <DialogTitle sx={{ borderBottom: '1px solid #ddd' }}>
        <Typography variant="h6">Settings</Typography>
      </DialogTitle>
      <DialogContent sx={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Typography variant="subtitle1" sx={{ borderBottom: '1px solid #ddd', paddingBottom: '8px' }}>
          <br />
          User Information
        </Typography>
        {error && <Typography color="error">{error}</Typography>}
        <TextField
          margin="dense"
          label="First Name"
          type="text"
          fullWidth
          value={newFirstName}
          onChange={(e) => setNewFirstName(e.target.value)}
          sx={{ borderRadius: '8px', backgroundColor: '#f5f5f5' }}
        />
        <TextField
          margin="dense"
          label="Last Name"
          type="text"
          fullWidth
          value={newLastName}
          onChange={(e) => setNewLastName(e.target.value)}
          sx={{ borderRadius: '8px', backgroundColor: '#f5f5f5' }}
        />
        <TextField
          margin="dense"
          label="Email"
          type="email"
          fullWidth
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          sx={{ borderRadius: '8px', backgroundColor: '#f5f5f5' }}
        />
        <TextField
          margin="dense"
          label="Current Password"
          type="password"
          fullWidth
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          sx={{ borderRadius: '8px', backgroundColor: '#f5f5f5' }}
        />
        <TextField
          margin="dense"
          label="New Password"
          type="password"
          fullWidth
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          sx={{ borderRadius: '8px', backgroundColor: '#f5f5f5' }}
        />
      </DialogContent>
      <DialogActions sx={{ padding: '16px', borderTop: '1px solid #ddd' }}>
        <Button onClick={onClose} color="primary" disabled={loading} variant="outlined" sx={{ borderRadius: '8px' }}>
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary" disabled={loading} variant="contained" sx={{ borderRadius: '8px' }}>
          {loading ? 'Saving...' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SettingsPopup;
