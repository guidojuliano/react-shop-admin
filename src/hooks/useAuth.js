import React, { useState, useContext, createContext } from 'react';
import Cookie from 'js-cookie';
import axios from 'axios';
import endPoints from '@services/api/';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export function ProviderAuth({ children }) {
  const auth = useProvideAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  return useContext(AuthContext);
};

function useProvideAuth() {
  const [user, setUser] = useState(null);
  const signIn = async (email, password) => {
    const url = endPoints.auth.login(email, password);
    const options = {
      headers: {
        accept: '*/*',
        'Content-type': 'application/json',
      },
    };

    try {
      const { data: access_token } = await axios.post(url, {}, options);

      if (access_token) {
        const token = access_token.access_token;
        Cookie.set('token', token, { expires: 5 });

        axios.defaults.headers.Authorization = `Bearer ${token}`;
        const { data: user } = await axios.get(endPoints.auth.profile);
        setUser(user);

        toast.success(`Usuario ${user.name} Logeado!`);
      }
      // Realiza las acciones necesarias con el token y actualiza el estado del usuario
    } catch (error) {
      toast.error('Error de Login', {
        autoClose: false, // Puedes ajustar el tiempo que permanece abierto
      });
      // Maneja el error
    }
  };

  const logout = () => {
    Cookie.remove('token');
    setUser(null);
    delete axios.defaults.headers.Authorization;
    window.location.href = '/login';
  };

  return {
    user,
    signIn,
    logout,
  };
}
