import { useState, useEffect } from "react";

const TOKEN_KEY = "accessToken";

export const useAuth = () => {
    const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));

    useEffect(() => {
        if (token) {
            localStorage.setItem(TOKEN_KEY, token);
        } else {
            localStorage.removeItem(TOKEN_KEY);
        }
    }, [token]);

    const login = (newToken: string) => {
        setToken(newToken);
    };

    const logout = () => {
        setToken(null);
    };

    return { token, login, logout, isAuthenticated: !!token };
};
