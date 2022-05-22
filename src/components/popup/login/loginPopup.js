import { TextField } from '@material-ui/core';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import Button from '@mui/material/Button';
import * as React from 'react';
import { FirebaseService } from '../../../services/FirebaseService';
import './loginPopup.css';

export default function LoginPopup() {
  const [open, setOpen] = React.useState(false);
  const [hasTriedLogin, setHasTriedLogin] = React.useState(false);
  const [values, setValues] = React.useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = React.useState({
    email: false,
    password: false,
  });

  const onOpen = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
    setValues({
      email: '',
      password: '',
    });
    setErrors({
      email: false,
      password: false,
    });
    setHasTriedLogin(false);
  };

  const onValueChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const login = async () => {
    setHasTriedLogin(true);

    const response = await FirebaseService.signIn(values.email, values.password);
    setErrors(response.errors);

    if (!Object.values(response.errors).includes(true)) {
      onClose();
    }
  };

  return (
    <>
      <Button variant="outlined" onClick={onOpen}>
        Login
      </Button>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth={'xs'}>
        <DialogTitle className="login-dialog-title">Login</DialogTitle>
        <DialogContent className="login-dialog-content">
          <p>Already have an account? Log In!</p>
          <div>
            <TextField
              label="Email"
              value={values.email}
              onChange={onValueChange('email')}
              variant="outlined"
              fullWidth
              error={(!values.email && hasTriedLogin) || errors.email}
              helperText={!values.email && hasTriedLogin ? 'Email is required' : errors.email ? 'Wrong email' : ''}
            />
          </div>
          <div>
            <TextField
              type="password"
              label="Password"
              value={values.password}
              onChange={onValueChange('password')}
              variant="outlined"
              fullWidth
              error={(!values.password && hasTriedLogin) || errors.password}
              helperText={
                !values.password && hasTriedLogin ? 'Password is required' : errors.password ? 'Wrong password' : ''
              }
            />
          </div>
          <div>
            <Button onClick={login} variant="contained">
              Login
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
