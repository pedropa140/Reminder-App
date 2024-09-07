import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';  // For redirection
import { updateUserInfo, deleteUser } from '../api';  // Import the updateUserInfo and deleteUser functions

const ConfirmationDialog = ({ open, onClose, onConfirm }) => (
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
        width: '400px',
        maxWidth: '90%',
        borderRadius: '16px',
        padding: '0',
      }
    }}
  >
    <DialogTitle sx={{ borderBottom: '1px solid #ddd', padding: '16px' }}>
      <Typography variant="h6">Confirm Deletion</Typography>
    </DialogTitle>
    <DialogContent sx={{ padding: '16px' }}>
      <Typography variant="body1">Are you sure you want to delete your account? This action cannot be undone.</Typography>
    </DialogContent>
    <DialogActions sx={{ padding: '16px', borderTop: '1px solid #ddd' }}>
      <Button onClick={onClose} color="primary" variant="outlined" sx={{ borderRadius: '8px' }}>
        Cancel
      </Button>
      <Button onClick={onConfirm} color="error" variant="contained" sx={{ borderRadius: '8px' }}>
        Delete
      </Button>
    </DialogActions>
  </Dialog>
);

const SettingsPopup = ({ open, onClose, firstName, lastName, email, onUpdateSuccess }) => {
  const [newFirstName, setNewFirstName] = useState(firstName || '');
  const [newLastName, setNewLastName] = useState(lastName || '');
  const [newEmail, setNewEmail] = useState(email || '');
  const [currentPassword, setCurrentPassword] = useState(''); // Current password
  const [newPassword, setNewPassword] = useState(''); // New password
  const [loading, setLoading] = useState(false); // For loading state
  const [error, setError] = useState(null); // For error handling
  const [deleteLoading, setDeleteLoading] = useState(false); // For delete button loading state
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false); // For confirmation dialog state

  const navigate = useNavigate(); // For redirecting

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
      const response = await updateUserInfo(updatedUserData);

      if (response && response.email) {
        sessionStorage.setItem('firstName', response.firstName);
        sessionStorage.setItem('lastName', response.lastName);
        sessionStorage.setItem('userEmail', response.email);

        if (onUpdateSuccess) onUpdateSuccess(response);

        onClose();
      } else {
        setError('Failed to update user info');
      }
    } catch (err) {
      setError('Failed to update user info');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    setError(null);

    try {
      await deleteUser(email);

      sessionStorage.removeItem('firstName');
      sessionStorage.removeItem('lastName');
      sessionStorage.removeItem('userEmail');

      if (onUpdateSuccess) onUpdateSuccess(null);

      // Redirect to home page
      navigate('/');
    } catch (err) {
      setError('Failed to delete user');
    } finally {
      setDeleteLoading(false);
      setConfirmDialogOpen(false); // Close confirmation dialog
    }
  };

  return (
    <>
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
            padding: '0',
          }
        }}
      >
        <DialogTitle sx={{ borderBottom: '1px solid #ddd', padding: '16px' }}>
          <Typography variant="h6">Settings</Typography>
        </DialogTitle>
        <DialogContent sx={{ padding: '16px', height: '400px', overflowY: 'auto' }}>
          <Typography variant="subtitle1" sx={{ borderBottom: '1px solid #ddd', paddingBottom: '8px', marginBottom: '16px' }}>
            <br />User Information
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
          <Typography variant="subtitle1" sx={{ borderBottom: '1px solid #ddd', paddingBottom: '8px', marginBottom: '16px' }}>
            <br />Password
          </Typography>
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
          <Button onClick={onClose} color="primary" disabled={loading || deleteLoading} variant="outlined" sx={{ borderRadius: '8px' }}>
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary" disabled={loading || deleteLoading} variant="contained" sx={{ borderRadius: '8px' }}>
            {loading ? 'Saving...' : 'Save'}
          </Button>
          <Button onClick={() => setConfirmDialogOpen(true)} color="error" disabled={deleteLoading} variant="contained" sx={{ borderRadius: '8px' }}>
            {deleteLoading ? 'Deleting...' : 'Delete Account'}
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmationDialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        onConfirm={handleDelete}
      />
    </>
  );
};

export default SettingsPopup;
