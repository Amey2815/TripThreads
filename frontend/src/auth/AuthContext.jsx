import React, { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [user, setuser] = useState(()=> JSON.parse(localStorage.getItem("user")) || null);
    const [token, settoken] = useState(()=> localStorage.getItem("token") || "" );

    const login = (userData, token) => {
        settoken(token);
        setuser(userData);
        localStorage.setItem('user',JSON.stringify(userData));
        localStorage.setItem('token',token);
    }

    const logout = () => {
        setuser(null);
        settoken("");
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    }

  return (
    <AuthContext.Provider value={{user , token , login , logout}}>
        {children}
    </AuthContext.Provider>
  )
}


export const useAuth = () => useContext(AuthContext);