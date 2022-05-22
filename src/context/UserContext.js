import React from 'react';
import { FirebaseService } from '../services/FirebaseService';

export const UserContext = React.createContext();

export const UserContextProvider = (props) => {
  const { children } = props;
  const [user, setUser] = React.useState(undefined);
  const [profileUser, setProfileUser] = React.useState(undefined);

  React.useEffect(() => {
    FirebaseService.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        updateProfileUser(user.uid);
      } else {
        setUser(null);
        updateProfileUser(null);
      }
    });
  }, []);


  const updateProfileUser = async (userId) => {
    const profileUser = userId ? await FirebaseService.getUser(userId) : null;

    setProfileUser(profileUser);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        profileUser,
        setProfileUser
      }}
    >
      {user !== undefined && children}
    </UserContext.Provider>
  );
};
