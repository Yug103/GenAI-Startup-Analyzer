import { createContext, useState, useEffect, useContext } from 'react';
import * as api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('ideavalidator_user');
    const savedToken = localStorage.getItem('ideavalidator_token');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    if (savedToken) {
      setToken(savedToken);
    }
    setLoading(false);
  }, []);

  const loginUser = async (email, password) => {
    const result = await api.login(email, password);
    setUser(result.user);
    setToken(result.token);
    localStorage.setItem('ideavalidator_token', result.token);
  };

  const registerUser = async (firstName, lastName, email, password, role) => {
    const result = await api.register(firstName, lastName, email, password, role);
    setUser(result.user);
    setToken(result.token);
    localStorage.setItem('ideavalidator_token', result.token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('ideavalidator_user');
    localStorage.removeItem('ideavalidator_token');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, loginUser, registerUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
