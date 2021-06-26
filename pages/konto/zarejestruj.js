import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useState, useEffect, useContext } from "react";
import Link from 'next/link';

export default function RegisterPage() {
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    
    const handleSubmit = (e) => {
        e.preventDefault();
        if (password !== passwordConfirm) {
            toast.error('Hasła się nie zgadzają')
            return
        }
    }

    return (
        <div>
            <h1>Zarejestruj</h1>
            <ToastContainer />
            <form onSubmit={handleSubmit}>
            <div>
                    <label htmlFor="userName">Nazwa użytkownika</label>
                    <input type="text" id="userName" value={userName} required onChange={(e) => setUserName(e.target.value)}/>
                </div>
                <div>
                    <label htmlFor="email">Adres email</label>
                    <input type="email" id="email" value={email} required onChange={(e) => setEmail(e.target.value)}/>
                </div>
                <div>
                    <label htmlFor="password">Hasło</label>
                    <input type="password" id="password" value={password} required onChange={(e) => setPassword(e.target.value)}/>
                </div>
                <div>
                    <label htmlFor="passwordConfirm">Potwierdź Hasło</label>
                    <input type="password" id="passwordConfirm" value={passwordConfirm} required onChange={(e) => setPasswordConfirm(e.target.value)}/>
                </div>
                <input type="submit" value="Zarejestruj" />
            </form>
            <p>Masz już konto? <Link href="/konto/zaloguj"><a>Zaloguj</a></Link></p>
        </div>
    )
}
