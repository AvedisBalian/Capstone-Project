import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import * as React from 'react';
import { Link, useParams } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import { FirebaseService } from '../../services/FirebaseService';
import AddPostPopup from '../popup/addPost/addPostPopup';
import LoginPopup from '../popup/login/loginPopup';
import SignupPopup from '../popup/signUp/signupPopup';
import './header.css';

const categories = ['food', 'music', 'sport', 'technology'];

const Header = () => {
  const { category } = useParams();
  const { profileUser } = React.useContext(UserContext);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const onOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const onCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const onLogout = async () => {
    await FirebaseService.signOut();

    onCloseUserMenu();
  };

  return (
    <>
      <AppBar position="sticky" color="default">
        <Container maxWidth="xl">
          <div className="header-content">
            <div className="header-logo">
              <Link to={'/'} color="#333" underline="none">
                <h1>Pluto</h1>
              </Link>
            </div>
            <div className="header-categories">
              <ul>
                {categories.map((c) => (
                  <li key={c}>
                    <Link key={c} to={`/category/${c}`} color="#666" underline="none">
                      <Button color={c === category ? 'primary' : 'inherit'}>{c}</Button>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="header">
              {profileUser === null && (
                <div className="header-buttons">
                  <LoginPopup />
                  <SignupPopup />
                </div>
              )}
              {!!profileUser && (
                <div>
                  <div className="header-add-post-button">
                    <AddPostPopup />
                  </div>
                  <IconButton onClick={onOpenUserMenu}>
                    <Avatar alt={profileUser.name} src={profileUser.photoURL} />
                  </IconButton>
                  <Menu
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={onCloseUserMenu}
                  >
                    <MenuItem onClick={onCloseUserMenu}>
                      <Link to={'/user-profile'}>Profile</Link>
                    </MenuItem>
                    <MenuItem onClick={onLogout}>Logout</MenuItem>
                  </Menu>
                </div>
              )}
            </div>
          </div>
        </Container>
      </AppBar>
    </>
  );
};

export default Header;
