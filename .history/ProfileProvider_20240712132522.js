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

export const useProfile = () => useContext(ProfileContext);