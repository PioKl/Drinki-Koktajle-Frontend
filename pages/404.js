import Link from 'next/link'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function SiteNotFound() {
    const router = useRouter();
    useEffect(() => {
        const timer = setTimeout(() => {
            router.push('/');
        }, 5000);
        return () => clearTimeout(timer);
    }, [])
    return (
        <div>
            <h1>Nie ma takiej strony</h1>
            <Link href="/">Strona Główna</Link>
        </div>
    )
}
