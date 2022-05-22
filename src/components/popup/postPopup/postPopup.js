import { Avatar, CircularProgress, Dialog } from '@material-ui/core';
import { DialogContent } from '@mui/material';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FirebaseService } from '../../../services/FirebaseService';
import './postPopup.css';

const PostPopup = ({ postId }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState();
  const [post, setPost] = React.useState();
  const [author, setAuthor] = React.useState();

  const formatDate = (milliseconds) => {
    const publishedDate = milliseconds ? new Date(milliseconds) : null;
    let date = publishedDate.getDate().toString();
    let month = (publishedDate.getMonth() + 1).toString();
    const year = publishedDate.getFullYear();

    if (date.length < 2) {
      date = '0' + date;
    }

    if (month.length < 2) {
      month = '0' + month;
    }

    return `${date}.${month}.${year}`;
  };

  React.useEffect(() => {
    (async () => {
      let post;
      let author;

      if (postId) {
        setIsLoading(true);

        post = await FirebaseService.getPost(postId);
        author = await FirebaseService.getUser(post.authorId);

        setIsLoading(false);
      }

      setPost(post);
      setAuthor(author);
    })();
  }, [postId]);

  const onClose = () => {
    navigate({
      search: '',
    });
    setPost(undefined);
    setIsLoading(true);
  };

  return (
    <>
      <Dialog open={!!postId} onClose={onClose} maxWidth={'sm'} fullWidth>
        <DialogContent className="post-popup-content">
          {isLoading && (
            <div className="post-popup-loading">
              <CircularProgress />
            </div>
          )}
          {!isLoading && !post && <div className="post-popup-doesnt-exist">The post doesn't exist</div>}
          {!isLoading && post && (
            <>
              <div>
                <img src={post.image} />
              </div>
              <div className="post-popup-title">
                <h3>{post.title}</h3>
                <Link className="post-popup-user" to={`/user-profile/${post.authorId}`}>
                  {author && <Avatar alt={author.displayName} src={author.photoURL} fontSize="large" />}
                  <span>{post.authorDisplayName}</span>
                </Link>
              </div>
              <p className="post-popup-description">{post.description}</p>
              <p className="post-popup-published">Published: {formatDate(post.published)}</p>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PostPopup;
