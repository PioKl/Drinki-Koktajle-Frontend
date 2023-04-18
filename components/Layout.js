import Head from 'next/head'
import Header from './Header';
import Footer from './Footer';
import {useState, useEffect} from 'react';
import styles from '../styles/Layout.module.scss';

export default function Layout({ title, keywords, description, children }) {

    const [scroll, setScroll] = useState(false);

    //Nasłuchiwanie eventlistenera scroll
    useEffect(() => {
        window.addEventListener('scroll', scrollCheck);
        return () => window.removeEventListener("scroll", scrollCheck);
      }, [scroll]);

    //Sprawdzenie, czy użytkownik zaczął "przewijać stronę", jeśli tak ustawienie stanu scroll na odpowiednią wartość boolean
    const scrollCheck = () => {
        let beginScroll = window.pageYOffset > 10;

        if (beginScroll) {
            setScroll(true);
        }
        else {
            setScroll(false);
        }
    }

    //Powrót na samą górę strony za pomocą przycisku
    const handleReturnToTop = () => {
        window.scrollTo(0, 0);
    }
    
    return (
        <>
            <Head>
                <title>{title}</title>
                <meta name='description' content={description} />
                <meta name='keywords' content={keywords} />

                
                {/* FontAwesome */}
                <link href="https://use.fontawesome.com/releases/v5.8.1/css/all.css" rel="stylesheet"></link>
                
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />

                <link href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,600;0,700;0,800;1,300;1,400;1,600;1,700;1,800&family=Rasa:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,600;1,700&family=Kalam:wght@300;400;700&display=swap" rel="stylesheet" />
            </Head>

            <Header />
            <main className={styles.main}>
                {scroll && <button onClick={handleReturnToTop} className={styles.main__scrollBackToTop}></button>}
                {children}
            </main>
            <Footer/>
        </>
    )
}

Layout.defaultProps = {
    title: 'Drink Share',
    description: 'Wyszukaj różne drinki i koktajle',
    keywords: 'drink, koktajl'
}
