import Link from 'next/link';

export default function Header() {
    return (
        <div>
            <Link href="/">
                <a>Strona Główna </a>
            </Link>
            <Link href="/przepisy/dodaj-drinka">
                <a>Dodaj Drinka </a>
            </Link>
            <Link href="/konto/zaloguj" >
                <a>Zaloguj </a>
            </Link>
        </div>
    )
}
