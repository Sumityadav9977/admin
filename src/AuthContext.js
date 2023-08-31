import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
   sessionStorage.getItem('isAuthenticated') === 'true'
  );;

  const login = () => {
    setIsAuthenticated(true);
   sessionStorage.setItem('isAuthenticated', 'true');
  };

  const logout = () => {
    setIsAuthenticated(false);
  };
  useEffect(() => {
 
    if (isAuthenticated) {
     sessionStorage.setItem('isAuthenticated', 'true');
    } else {
     sessionStorage.removeItem('isAuthenticated');
    }
  }, [isAuthenticated]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}