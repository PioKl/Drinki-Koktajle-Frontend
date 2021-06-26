import { createContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { API_URL } from '@/config/index';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);

    //Rejestracja użytkownika
    const register = async (user) => {
        console.log(user)
    }

    //Logowanie użytkownika
    //zmiana email na identifier, ponieważ strapi podczas prośby/żądania logowania potrzebuje zmiennej identifier, jest to tak zrobione ponieważ można się zalogować poprzez email, bądź nazwę użytkownika i robiąc email:identifier będzie to oznaczało, że indentifier potrzebny do logowania to będzie email, a email zostanie zmieniony na indenfitifer
    const login = async ({ email: identifier, password }) => {
        console.log({ identifier, password })
    }

    //Wylogowanie użytkownika
    const logout = async () => {
        console.log('Wylogowano')
    }

    //Sprawdzenie, czy użytkownik jest zalogowany
    const checkUserLoggedIn = async (user) => {
        console.log('Sprawdź')
    }

    return (
        <AuthContext.Provider value={{ user, error, register, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;