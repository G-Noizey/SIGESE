// useAuth.js

import { useState } from 'react';

const useAuth = () => {
    const [authToken, setAuthToken] = useState(localStorage.getItem('token'));

    const login = (token) => {
        localStorage.setItem('token', token);
        setAuthToken(token);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setAuthToken(null);
    };

    const isAuthenticated = () => {
        return !!authToken;
    };

    return {
        login,
        logout,
        isAuthenticated,
    };
};

export { useAuth };
