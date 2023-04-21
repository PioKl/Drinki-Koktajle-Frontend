import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useState, useEffect, useContext, useRef } from "react";
import Link from 'next/link';
import AuthContext from "@/context/AuthContext";
import styles from '../../styles/Forms.module.scss';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const {login, error, authLoader} = useContext(AuthContext);

    const buttonSubmitRef = useRef();

    //Jeśli istnieje błąd, błąd się zmienił wyświetl
    useEffect(() => error && toast.error(error));
    
    const handleSubmit = (e) => {
        e.preventDefault();
        login({email, password});
    }

    return (
        <>
            <ToastContainer />
            <div className={styles.forms}>
                <div className={styles.formContainer}>
                    <h1 className={styles.formContainer__heading}>Logowanie</h1>
                    
                    <form onSubmit={handleSubmit}>
                        <div className={styles.formContainer__formField}>
                            <label className={styles.formContainer__label} htmlFor="email">Adres email</label>
                            <input className={styles.formContainer__input} placeholder="Adres e-mail" type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                        </div>
                        <div className={styles.formContainer__formField}>
                            <label className={styles.formContainer__label} htmlFor="password">Hasło</label>
                            <input className={styles.formContainer__input} placeholder="Hasło" type="password" id="password" autoComplete="on" value={password} onChange={(e) => setPassword(e.target.value)}/>
                        </div>
                        <div className={styles.formContainer__buttonContainer}>
                            <button ref={buttonSubmitRef} className={styles.formContainer__button} type="submit">Zaloguj</button>
                            { authLoader && <div className={styles.formContainer__buttonLoader}></div>}
                        </div>
                    </form>
                    <div className={styles.formContainer__linkContainer}>
                        <p>Nie masz konta? <Link href="/konto/zarejestruj"><a className={styles.formContainer__link}>Rejestracja</a></Link> </p>
                        <p className={styles.formContainer__loginAddinationalInfo}>Użytkownik zalogowany posiada możliwość tworzenia i edycji swoich drinków.</p>
                    </div>
                    
                </div>
            </div>
        </>
    )
}
