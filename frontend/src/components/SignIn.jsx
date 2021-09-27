import { useMutation } from '@apollo/client';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import gql from 'graphql-tag';
import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import Cookies from 'universal-cookie';
import {
  COOKIE_CSRF_NAME,
  COOKIE_PATH,
  COOKIE_SAME_SITE,
  COOKIE_SIGNED_IN_NAME,
} from '../constants';

const SIGNUP_MUTATION = gql`
  mutation CreateUser($name: String!, $email: String!, $password: String!) {
    createUser(
      name: $name
      authProvider: { credentials: { email: $email, password: $password } }
    ) {
      success
      errors
    }
  }
`;

const SIGNIN_MUTATION = gql`
  mutation SignInUser($email: String!, $password: String!) {
    signInUser(credentials: { email: $email, password: $password }) {
      access
      csrf
      error
      success
    }
  }
`;

const SignIn = () => {
  const history = useHistory();

  const cookies = new Cookies();

  const [formState, setFormState] = useState({
    signin: true,
    email: '',
    password: '',
    name: '',
  });

  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [signin] = useMutation(SIGNIN_MUTATION, {
    variables: {
      email: formState.email,
      password: formState.password,
    },
    onCompleted: (data) => {
      if (data.signInUser.success) {
        cookies.set(COOKIE_SIGNED_IN_NAME, true, {
          path: COOKIE_PATH,
          sameSite: COOKIE_SAME_SITE,
        });
        cookies.set(COOKIE_CSRF_NAME, data.signInUser.csrf, {
          path: COOKIE_PATH,
          sameSite: COOKIE_SAME_SITE,
        });
        history.push('/');
        handleClose();
      } else alert(data.signInUser.error);
    },
  });

  const [signup] = useMutation(SIGNUP_MUTATION, {
    variables: {
      name: formState.name,
      email: formState.email,
      password: formState.password,
    },
    onCompleted: (data) => {
      if (data.createUser.success) {
        alert('Account created!');
        history.push('/');
        handleClose();
      } else alert(data.createUser.errors);
    },
  });

  const changeContext = () => {
    setFormState({
      ...formState,
      signin: !formState.signin,
    });
  };

  return (
    <div>
      <Link className="signin" to="/" onClick={handleOpen}>
        Sign In
      </Link>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          {formState.signin ? 'Sign In' : 'Sign Up'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {formState.signin
              ? 'Please enter your email and password'
              : 'Welcome, please enter name, email and password'}
          </DialogContentText>
          {!formState.signin && (
            <TextField
              margin="dense"
              id="name"
              label="Name"
              type="text"
              fullWidth
              value={formState.name}
              onChange={(e) => setFormState({
                ...formState,
                name: e.target.value,
              })}
              InputLabelProps={{
                style: { color: 'white' },
              }}
            />
          )}
          <TextField
            margin="dense"
            id="email"
            label="Email"
            type="text"
            fullWidth
            value={formState.email}
            onChange={(e) => setFormState({
              ...formState,
              email: e.target.value,
            })}
            InputLabelProps={{
              style: { color: 'white' },
            }}
          />
          <TextField
            margin="dense"
            id="password"
            label="Password"
            type="text"
            fullWidth
            value={formState.password}
            onChange={(e) => setFormState({
              ...formState,
              password: e.target.value,
            })}
            InputLabelProps={{
              style: { color: 'white' },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={formState.signin ? signin : signup}>
            {formState.signin ? 'Sign in' : 'Create account'}
          </Button>
          <Button onClick={changeContext}>
            {formState.signin
              ? 'Need to create an account?'
              : 'Already have an account?'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default SignIn;
