import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useState, useEffect, useContext } from "react";
import Link from 'next/link';
import AuthContext from "@/context/AuthContext";

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const {login, error} = useContext(AuthContext);

    //Jeśli istnieje błąd, błąd się zmienił wyświetl
    useEffect(() => error && toast.error(error));
    
    const handleSubmit = (e) => {
        e.preventDefault();
        login({email, password})
    }

    return (
        <div>
            <h1>Logowanie</h1>
            <ToastContainer />
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">Adres email</label>
                    <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                </div>
                <div>
                    <label htmlFor="password">Hasło</label>
                    <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                </div>
                <input type="submit" value="Zaloguj" />
            </form>
            <p>Nie masz konta? <Link href="/konto/zarejestruj"><a>Rejestracja</a></Link> </p>
        </div>
    )
}
