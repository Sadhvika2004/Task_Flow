import { createContext, useContext, useState, useEffect } from 'react';

const ProfileContext = createContext();

export function ProfileProvider({ children }) {
  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  // keep userProfile synced with auth user
  useEffect(() => {
    if (userProfile) localStorage.setItem('user', JSON.stringify(userProfile));
  }, [userProfile]);

  const updateProfile = (updatedProfile) => {
    setUserProfile(updatedProfile);
  };

  const value = {
    userProfile,
    updateProfile,
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}
