import Link from 'next/link';
import { useContext } from 'react';
import AuthContext from '@/context/AuthContext';

export default function Header() {

    const { user, logout } = useContext(AuthContext)

    return (
        <div>
            <Link href="/">
                <a>Strona Główna </a>
            </Link>
            {user ?
                //Jeśli użytkownik jest zalogowany
                <>
                    <Link href="/przepisy/dodaj-drinka">
                        <a>Dodaj Drinka </a>
                    </Link>
                    <Link href="/konto/moje-drinki">
                        <a>Moje Drinki </a>
                    </Link>
                    <button onClick={() => logout()}>Wyloguj</button>
                </>
                :
                //Jeśli użytkownik nie jest zalogowany
                <Link href="/konto/zaloguj" >
                    <a>Zaloguj </a>
                </Link>
            }
        </div>
    )
}
