import React, { createContext, useState, useContext, useEffect } from 'react';
import { user } from './data/userData';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(user.language);

  // You could add listeners here if needed to update when userData changes

  return (
    <LanguageContext.Provider value={language}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);