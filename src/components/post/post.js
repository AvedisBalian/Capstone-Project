import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
} from '@material-ui/core';
import DeleteIcon from '@mui/icons-material/Delete';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import { FirebaseService } from '../../services/FirebaseService';
import './post.css';

const Post = ({ id, image, title, description, authorId }) => {
  const { user } = React.useContext(UserContext);
  const navigate = useNavigate();
  const goToPage = () => navigate({ search: `?postId=${id}` });
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);

  const onOpenDeleteDialog = (event) => {
    setIsDeleteDialogOpen(true);

    event.stopPropagation();
  };

  const onCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
  };

  const onDelete = () => {
    FirebaseService.deletePost(id);

    onCloseDeleteDialog();
  };

  return (
    <>
      <div className="post" onClick={goToPage}>
        <div className="post-image">
          <img src={image} />
        </div>
        <div className="post-content">
          <h2>
            <span>{title}</span>
            {user && user.uid === authorId && (
              <IconButton className="post-delete-button" onClick={onOpenDeleteDialog}>
                <DeleteIcon />
              </IconButton>
            )}
          </h2>
          <p>{description}</p>
        </div>
      </div>
      <Dialog open={isDeleteDialogOpen} onClose={onCloseDeleteDialog}>
        <DialogTitle>Delete a post</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this post?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onCloseDeleteDialog}>Cancel</Button>
          <Button variant="contained" onClick={onDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Post;
