import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useState, useEffect, useContext } from "react";
import Link from 'next/link';
import AuthContext from "@/context/AuthContext";
import styles from '../../styles/Forms.module.scss';

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
            toast.error('Hasła się nie zgadzają');
            return
        }
        else if (username === '') {
            toast.error('Podaj nazwę użytkownika');
            return
        }
        else if (email === '') {
            toast.error('Podaj adres email');
            return
        }

        register({username, email, password});
    }

    return (
        <>
        <ToastContainer />
        <div className={styles.forms}>
            <div className={styles.formContainer}>
                <h1 className={styles.formContainer__heading}>Zarejestruj</h1>
                <form onSubmit={handleSubmit}>
                    <div className={styles.formContainer__formField}>
                        <label className={styles.formContainer__label} htmlFor="userName">Nazwa użytkownika</label>
                        <input className={styles.formContainer__input} placeholder="Nazwa użytkownika" type="text" id="userName" value={username} onChange={(e) => setUserName(e.target.value)}/>
                    </div>
                    <div className={styles.formContainer__formField}>
                        <label className={styles.formContainer__label} htmlFor="email">Adres email</label>
                        <input className={styles.formContainer__input} placeholder="Adres e-mail" type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                    </div>
                    <div className={styles.formContainer__formField}>
                        <label className={styles.formContainer__label} htmlFor="password">Hasło</label>
                        <input className={styles.formContainer__input} placeholder="Hasło" type="password" id="password" autoComplete="on" value={password} onChange={(e) => setPassword(e.target.value)}/>
                    </div>
                    <div className={styles.formContainer__formField}>
                        <label className={styles.formContainer__label} htmlFor="passwordConfirm">Potwierdź Hasło</label>
                        <input className={styles.formContainer__input} placeholder="Potwierdź hasło" type="password" id="passwordConfirm" autoComplete="on" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)}/>
                    </div>
                    <button className={styles.formContainer__button} type="submit">Zarejestruj</button>
                </form>
                <div className={styles.formContainer__linkContainer}>
                    <p>Masz już konto? <Link href="/konto/zaloguj"><a className={styles.formContainer__link}>Zaloguj</a></Link></p>
                </div>
                
            </div>
        </div>
        </>
    )
}
