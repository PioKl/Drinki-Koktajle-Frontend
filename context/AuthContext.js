import { createContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { NEXT_URL } from '@/config/index';

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

        //komunikacja z api (z login)
        //przesłanie identifier i password do api/login
        const response = await fetch(`${NEXT_URL}/api/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                identifier,
                password
            })
        })
        //w data są dane zwrotne z api/login
        const data = await response.json();

        console.log(data);

        //Jeśli odpowiedź jest prawidłowa, dane z bazy danych w strapi są prawidłowe z tymi z api/login to ustaw te dane za pomocą setUser, user dysponuje w tym momencie poprawnymi danymi z zalogowania
        if (response.ok) {
            setUser(data.user);
        }
        //jeśli natomiast odpowiedź była nieprawidłowa (błędny login, czy hasło), to ustaw te błędy w zmiennej error za pomocą setError
        else {
            if (data.message === "Identifier or password invalid.") {
                setError("Nieprawidłowy login lub hasło");
            }
            else if (data.message === "Please provide your username or your e-mail.") {
                setError("Prosze wpisać e-mail");
            }
            else if (data.message === "Please provide your password.") {
                setError("Proszę wpisać hasło")
            } else return

            setError(null);
        }
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