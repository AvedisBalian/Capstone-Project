import { Avatar, CircularProgress, IconButton } from '@material-ui/core';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import Container from '@mui/material/Container';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { UserContext } from '../../../context/UserContext';
import { FirebaseService } from '../../../services/FirebaseService';
import { Utils } from '../../../utils/utils';
import PostsGrid from '../../postsGrid/postsGrid';
import './userProfilePage.css';

export default function UserProfilePage() {
  const { userId } = useParams();
  const userContext = React.useContext(UserContext);
  const navigate = useNavigate();
  const goBack = () => navigate('/');
  const [profileUser, setProfileUser] = React.useState();
  const isLoggedInUser = userContext.user && userId === userContext.user.id;

  React.useEffect(() => {
    if (!userId && !userContext.user) {
      navigate('/');
      return;
    }

    (async () => {
      updateProfileUser();
    })();
  }, [userId, userContext.user]);

  const updateProfileUser = async () => {
    const profileUser = await FirebaseService.getUser(userId || userContext.user.uid);

    setProfileUser(profileUser);
  };

  const onPhotoChange = async (event) => {
    const file = event.target.files[0];
    const fileBase64 = await Utils.fileToBase64(file);
    const image = await Utils.optimizeImage(fileBase64);

    updateUserPhoto(image);
  };

  const removePhoto = async () => {
    updateUserPhoto(null);
  };

  const updateUserPhoto = async (photo) => {
    await FirebaseService.updateUserPhoto(userContext.profileUser, photo);

    userContext.setProfileUser({
      ...userContext.profileUser,
      photoURL: photo
    });

    updateProfileUser();
  }

  return !profileUser ? (
    <div className="user-profile-page-loading">
      <CircularProgress />
    </div>
  ) : (
    <>
      <IconButton className="user-profile-page-back-button" onClick={goBack}>
        <ArrowBackIcon style={{ fontSize: 35 }} />
      </IconButton>
      <Container maxWidth="lg" className="user-profile-page">
        <div className="user-profile-page-title">
          <span>
            {!isLoggedInUser && <Avatar alt={profileUser.displayName} src={profileUser.photoURL} fontSize="large" />}
            {isLoggedInUser && !profileUser.photoURL && (
              <IconButton>
                <label htmlFor="user-profile-page-photo">
                  <Avatar alt={profileUser.displayName} src={profileUser.photoURL} fontSize="large" />
                  <input id="user-profile-page-photo" accept="image/*" type="file" onChange={onPhotoChange} />
                </label>
              </IconButton>
            )}
            {isLoggedInUser && profileUser.photoURL && (
              <IconButton onClick={removePhoto}>
                <Avatar alt={profileUser.displayName} src={profileUser.photoURL} fontSize="large" />
                <span className="user-profile-page-delete-photo-icon">
                  <DeleteIcon />
                </span>
              </IconButton>
            )}
          </span>
          <span>{`${profileUser.displayName}`}</span>
        </div>
        <div className="user-profile-page-published">
          <PostsGrid title="Published" authorId={profileUser.id} />
        </div>
      </Container>
    </>
  );
}
