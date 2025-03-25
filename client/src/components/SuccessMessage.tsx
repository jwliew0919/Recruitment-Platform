import React from 'react';
import { Alert, Snackbar } from '@mui/material';

interface SuccessMessageProps {
  message: string;
  open: boolean;
  onClose: () => void;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({ message, open, onClose }) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert onClose={onClose} severity="success" sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default SuccessMessage; 