import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      authApi.getMe()
        .then((res) => {
          if (res.data) {
            setUser(res.data);
            localStorage.setItem('user', JSON.stringify(res.data));
          }
        })
        .catch(() => {
          logout();
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (email, password) => {
    const res = await authApi.login({ email, password });
    if (res.data) {
      const authData = res.data;
      setToken(authData.token);
      localStorage.setItem('token', authData.token);
      
      const userObj = {
        id: authData.userId,
        email: authData.email,
        fullName: authData.fullName,
        role: authData.role
      };
      setUser(userObj);
      localStorage.setItem('user', JSON.stringify(userObj));
      return userObj;
    }
  };

  const register = async (data) => {
    const res = await authApi.register(data);
    if (res.data) {
      const authData = res.data;
      setToken(authData.token);
      localStorage.setItem('token', authData.token);
      
      const userObj = {
        id: authData.userId,
        email: authData.email,
        fullName: authData.fullName,
        role: authData.role
      };
      setUser(userObj);
      localStorage.setItem('user', JSON.stringify(userObj));
      return userObj;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const isRole = (role) => user?.role === role;

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        isAuthenticated: !!token && !!user,
        isCustomer: isRole('ROLE_CUSTOMER'),
        isShopkeeper: isRole('ROLE_SHOPKEEPER'),
        isAdmin: isRole('ROLE_ADMIN'),
        login,
        register,
        logout,
        setUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
