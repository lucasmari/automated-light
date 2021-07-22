import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { createBrowserHistory } from 'history';

const CREATE_NEWS_MUTATION = gql`
  mutation CreateNews($title: String!, $body: String!) {
    createNews(title: $title, body: $body) {
      success
      errors
    }
  }
`;

const CreateNews = () => {
  const history = createBrowserHistory({ forceRefresh: true });
  const [formState, setFormState] = useState({
    title: '',
    body: '',
  });

  const [createNews] = useMutation(CREATE_NEWS_MUTATION, {
    variables: {
      title: formState.title,
      body: formState.body,
    },
    onCompleted: (data, error) => {
      history.push('/');
      handleClose();
      if (error) alert(error);
      data.createNews.success
        ? alert('News created!')
        : alert(data.createNews.errors);
    },
  });

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

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
            onChange={(e) =>
              setFormState({
                ...formState,
                title: e.target.value,
              })
            }
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
            onChange={(e) =>
              setFormState({
                ...formState,
                body: e.target.value,
              })
            }
            InputLabelProps={{
              style: { color: 'white' },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={createNews}>Create</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CreateNews;
