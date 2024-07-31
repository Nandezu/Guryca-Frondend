import React, { createContext, useState, useContext } from 'react';

const TryOnContext = createContext();

export const TryOnProvider = ({ children }) => {
  const [selectedProfileIndex, setSelectedProfileIndex] = useState(0);
  const [profiles, setProfiles] = useState([]);

  return (
    <TryOnContext.Provider value={{ selectedProfileIndex, setSelectedProfileIndex, profiles, setProfiles }}>
      {children}
    </TryOnContext.Provider>
  );
};

export const useTryOn = () => useContext(TryOnContext);