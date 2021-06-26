import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useState, useEffect, useContext } from "react";
import Link from 'next/link';
import AuthContext from "@/context/AuthContext";

export default function RegisterPage() {
    const [username, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');

    const { register, error } = useContext(AuthContext);

    useEffect(() => error && toast.error(error));
    
    const handleSubmit = (e) => {
        e.preventDefault();
        if (password !== passwordConfirm) {
            toast.error('Hasła się nie zgadzają')
            return
        }
        else if (username === '') {
            toast.error('Podaj nazwę użytkownika')
            return
        }
        else if (email === '') {
            toast.error('Podaj adres email')
            return
        }

        register({username, email, password})
    }

    return (
        <div>
            <h1>Zarejestruj</h1>
            <ToastContainer />
            <form onSubmit={handleSubmit}>
            <div>
                    <label htmlFor="userName">Nazwa użytkownika</label>
                    <input type="text" id="userName" value={username} onChange={(e) => setUserName(e.target.value)}/>
                </div>
                <div>
                    <label htmlFor="email">Adres email</label>
                    <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                </div>
                <div>
                    <label htmlFor="password">Hasło</label>
                    <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                </div>
                <div>
                    <label htmlFor="passwordConfirm">Potwierdź Hasło</label>
                    <input type="password" id="passwordConfirm" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)}/>
                </div>
                <input type="submit" value="Zarejestruj" />
            </form>
            <p>Masz już konto? <Link href="/konto/zaloguj"><a>Zaloguj</a></Link></p>
        </div>
    )
}
