import React, { createContext, useState, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const [profiles, setProfiles] = useState([]);

  const deleteProfile = async (index) => {
    const newProfiles = profiles.filter((_, i) => i !== index);
    setProfiles(newProfiles);
    await AsyncStorage.setItem('profiles', JSON.stringify(newProfiles));
  };

  return (
    <ProfileContext.Provider value={{ profiles, setProfiles, deleteProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfiles = () => useContext(ProfileContext);