import { Dialog, DialogContent, DialogTitle, TextField } from '@material-ui/core';
import Button from '@mui/material/Button';
import * as React from 'react';
import { FirebaseService } from '../../../services/FirebaseService';
import './signupPopup.css';

export default function SignupPopup() {
  const [open, setOpen] = React.useState(false);
  const [hasTriedSignup, setHasTriedSignup] = React.useState(false);
  const [values, setValues] = React.useState({
    displayName: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = React.useState({
    displayName: '',
    email: '',
    password: '',
  });
  const [isBluredFields, setIsBluredFields] = React.useState({
    displayName: false,
    email: false,
    password: false,
  });

  const onOpen = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
    setValues({
      displayName: '',
      email: '',
      password: '',
    });
    setErrors({
      displayName: '',
      email: '',
      password: '',
    });
    setIsBluredFields({
      displayName: false,
      email: false,
      password: false,
    });
    setHasTriedSignup(false);
  };

  const onFieldBlur = (prop) => () => {
    setIsBluredFields({ ...isBluredFields, [prop]: true });
  };

  const onValueChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const signUp = async () => {
    setHasTriedSignup(true);

    const response = await FirebaseService.signUp(values.displayName, values.email, values.password);

    setErrors(response.errors);

    if (!Object.values(response.errors).find((error) => !!error)) {
      onClose();
    }
  };

  return (
    <>
      <Button variant="contained" onClick={onOpen}>
        Signup
      </Button>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth={'xs'}>
        <DialogTitle className="sign-up-dialog-title">Sign Up To Post Articles</DialogTitle>
        <DialogContent className="sign-up-dialog-content">
          <p>Create an account! It won't take long.</p>
          <div>
            <TextField
              label="Full name"
              value={values.displayName}
              onChange={onValueChange('displayName')}
              variant="outlined"
              fullWidth
              error={(!values.displayName && (isBluredFields.displayName || hasTriedSignup)) || !!errors.displayName}
              onBlur={onFieldBlur('displayName')}
              helperText={
                !values.displayName && (isBluredFields.displayName || hasTriedSignup)
                  ? 'Name field is required'
                  : errors.displayName
              }
            />
          </div>
          <div>
            <TextField
              label="Email"
              value={values.email}
              onChange={onValueChange('email')}
              variant="outlined"
              fullWidth
              error={(!values.email && (isBluredFields.email || hasTriedSignup)) || !!errors.email}
              onBlur={onFieldBlur('email')}
              helperText={
                !values.email && (isBluredFields.email || hasTriedSignup) ? 'Email field is required' : errors.email
              }
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
              error={(!values.password && (isBluredFields.password || hasTriedSignup)) || !!errors.password}
              onBlur={onFieldBlur('password')}
              helperText={!values.password && (isBluredFields.password || hasTriedSignup) ? 'error' : errors.password}
            />
          </div>
          <div>
            <Button variant="contained" color="primary" onClick={signUp}>
              Sign Up
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
