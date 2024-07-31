import React, { useState, useContext, createContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Vytvoření kontextu
const ProfileContext = createContext();

// Definice poskytovatele
export const ProfileProvider = ({ children }) => {
  const [profiles, setProfiles] = useState([]);
  const [selectedProfileIndex, setSelectedProfileIndex] = useState(0);

  const deleteProfile = async (index) => {
    const newProfiles = profiles.filter((_, i) => i !== index);
    setProfiles(newProfiles);
    await AsyncStorage.setItem('profiles', JSON.stringify(newProfiles));
  };

  return (
    <ProfileContext.Provider value={{ 
      profiles, 
      setProfiles, 
      deleteProfile, 
      selectedProfileIndex, 
      setSelectedProfileIndex 
    }}>
      {children}
    </ProfileContext.Provider>
  );
};

// Definice hooku pro použití kontextu
export const useProfile = () => useContext(ProfileContext);
