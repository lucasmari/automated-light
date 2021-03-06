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

const CREATE_NEWS_MUTATION = gql`
  mutation CreateNews($title: String!, $body: String!) {
    createNews(title: $title, body: $body) {
      success
      errors
    }
  }
`;

const NEWS_QUERY = gql`
  query NewsQuery($first: Int, $skip: Int) {
    news(first: $first, skip: $skip) {
      id
      title
      body
      user {
        name
      }
    }
    count {
      news
    }
  }
`;

const CreateNews = () => {
  const [formState, setFormState] = useState({
    title: '',
    body: '',
  });

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [createNews] = useMutation(CREATE_NEWS_MUTATION, {
    variables: {
      title: formState.title,
      body: formState.body,
    },
    refetchQueries: [
      NEWS_QUERY,
      'NewsQuery',
    ],
    onCompleted: () => {
      setFormState({
        title: '',
        body: '',
      });
      handleClose();
    },
    onError: (error) => {
      console.error(error);
    },
  });

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        +
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Create News</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Create some amazing content here...
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="title"
            label="Title"
            type="text"
            fullWidth
            value={formState.title}
            onChange={(e) => setFormState({
              ...formState,
              title: e.target.value,
            })}
            InputLabelProps={{
              style: { color: 'white' },
            }}
          />
          <TextField
            margin="dense"
            id="body"
            label="Body"
            type="text"
            fullWidth
            value={formState.body}
            onChange={(e) => setFormState({
              ...formState,
              body: e.target.value,
            })}
            InputLabelProps={{
              style: { color: 'white' },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={createNews}>Create</Button>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CreateNews;
