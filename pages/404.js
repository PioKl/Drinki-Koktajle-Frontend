import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import styles from '@/styles/WrongSite.module.scss';

export default function SiteNotFound() {
    const router = useRouter();
    const [counter, setCounter] = useState(5);
    useEffect(() => {
        const timer = setInterval(() => {
            setCounter(counter - 1);
        }, 1000);

        counter === 0 && router.push('/');

        return () => clearInterval(timer);
    }, [counter]);
    return (
        <div className={styles.wrongPage}>
            <h1 className={styles.wrongPage__title}>Nie ma takiej strony</h1>
            <div className={styles.wrongPage__mainSiteLinkContainer}>
               <span>Powrót do </span><Link href="/"><a className={styles.wrongPage__mainSiteLink}>strony głównej </a></Link><span>za {counter}s.</span> 
            </div>
            
        </div>
    )
}
