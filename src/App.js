import { Box, createTheme, CssBaseline, ThemeProvider } from '@material-ui/core';
import { Route, Routes, useSearchParams } from 'react-router-dom';
import './App.css';
import HomePage from './components/pages/homePage/homePage';
import UserProfilePage from './components/pages/userProfilePage/userProfilePage';
import PostPopup from './components/popup/postPopup/postPopup';
import { UserContextProvider } from './context/UserContext';
import Layout from './layout';

const theme = createTheme({
  typography: {
    fontFamily: 'Serif',
    button: {
      fontFamily: 'Serif',
    },
  },
});

function App() {
  const [searchParams] = useSearchParams();
  const postId = searchParams.get('postId');

  return (
    <UserContextProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          sx={{
            fontFamily: 'Serif',
          }}
        >
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="/user-profile" element={<UserProfilePage />} />
              <Route path="/user-profile/:userId" element={<UserProfilePage />} />
              <Route path="/category/:category" element={<HomePage />} />
            </Route>
          </Routes>
          <PostPopup postId={postId} />
        </Box>
      </ThemeProvider>
    </UserContextProvider>
  );
}

export default App;
