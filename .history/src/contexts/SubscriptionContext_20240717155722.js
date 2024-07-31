import React, { createContext, useState, useContext } from 'react';

const SubscriptionContext = createContext();

export const useSubscription = () => useContext(SubscriptionContext);

export const SubscriptionProvider = ({ children }) => {
  const [virtualTryOnsRemaining, setVirtualTryOnsRemaining] = useState(null);
  const [profileImagesRemaining, setProfileImagesRemaining] = useState(null);
  const [tryOnResultsRemaining, setTryOnResultsRemaining] = useState(null);

  const updateSubscriptionLimits = (limits) => {
    setVirtualTryOnsRemaining(limits.virtual_try_ons_remaining);
    setProfileImagesRemaining(limits.profile_images_remaining);
    setTryOnResultsRemaining(limits.try_on_results_remaining);
  };

  return (
    <SubscriptionContext.Provider 
      value={{ 
        virtualTryOnsRemaining, 
        profileImagesRemaining, 
        tryOnResultsRemaining,
        updateSubscriptionLimits 
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};