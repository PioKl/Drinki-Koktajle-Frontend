import Link from 'next/link';
import { useContext, useState, useRef } from 'react';
import AuthContext from '@/context/AuthContext';
import Logo from '../icons/logo.svg';
import styles from '../styles/Header.module.scss';

export default function Header() {

    const { user, logout } = useContext(AuthContext)

    /* ==================================================================================================================================
                                                            Burger Menu obsługa
       ================================================================================================================================== */
    const [burgerOpened, setBurgerOpened] = useState(false);
    const handleBurgerClick = (event) => {
        event.currentTarget.firstChild.classList.toggle(`${styles['burgerMenu__iconContainer--open']}`);
        setBurgerOpened(!burgerOpened);

        //Wywołanie funkcji
        checkBurgerOpening();
    }
    const burgerMenuIconConatiner = useRef(null);

    const handleCloseBurgerClick = () => {
        burgerMenuIconConatiner.current.classList.remove(`${styles['burgerMenu__iconContainer--open']}`);
        setBurgerOpened(false);

        //Wywołanie funkcji
        checkBurgerOpening();
    }


    //Zablokowanie scrolla, gdy otwiera sie menu, a nastepnie jego odblokowanie, gdy menu jest juz zamykane
    const checkBurgerOpening = () => {
        const body = document.body;
        let scrollY = document.documentElement.style.getPropertyValue('--scroll-y');

        //Zablokowanie scrolla
        !burgerOpened && (
            body.style.position = 'fixed',
            body.style.width = '100%',
            body.style.top = `-${scrollY}`
        )

        //Odblokowanie scrolla
        burgerOpened && (
            scrollY = body.style.top,
            body.style.position = '',
            body.style.top = '',
            body.style.width = '',
            window.scrollTo(0, parseInt(scrollY || '0') * -1)
        )     
    }



    return (
        <>
            <header className={styles.header}>
                <div className={styles.navigationMobile}>
                    <Link href="/">
                        <a className={styles.navigationMobile__logoContainer}>
                            <Logo alt="logo" viewBox="0 0 23 38" className={`${styles.navigationMobile__logo}`} />
                            <h1 className={styles.navigationMobile__logoName}>Drink Share</h1>
                        </a>
                    </Link>
                </div>
                <div className={styles.navigation}>
                    <Link href="/">
                        <a className={styles.logoContainer}>
                            <Logo alt="logo" viewBox="0 0 23 38" className={`${styles.logoContainer__logo} ${styles.icon}`} />
                            <h1 className={styles.logoContainer__logoName}>Drink Share</h1>
                        </a>
                    </Link>
                    {user ?
                        //Jeśli użytkownik jest zalogowany
                        <div className={styles.navigation__items}>
                            <Link href="/przepisy/dodaj-drinka">
                                <a><button className={`${styles.navigation__item} ${styles['navigation__item--addDrink']}`}>Dodaj Drinka</button></a>
                            </Link>
                            <Link href="/konto/moje-drinki">
                                <a><button className={`${styles.navigation__item} ${styles['navigation__item--myDrinks']}`}>Moje Drinki</button></a>
                            </Link>
                            <button className={`${styles.navigation__item} ${styles['navigation__item--logout']}`} onClick={() => logout()}>Wyloguj</button>
                        </div>

                        :
                        //Jeśli użytkownik nie jest zalogowany
                        <div className={styles.navigation__items}>
                            <Link href="/konto/zaloguj" >
                                <a><button className={`${styles.navigation__item} ${styles['navigation__item--login']}`}>Zaloguj</button></a>
                            </Link>
                        </div>
                    }
                </div>

                <div className={styles.burgerMenu} onClick={handleBurgerClick}>
                    <div ref={burgerMenuIconConatiner} className={styles.burgerMenu__iconContainer}></div>
                </div>
            </header>
            {burgerOpened &&
                <div className={styles.mobileMenuContainer}>
                    {user ?
                        //Jeśli użytkownik jest zalogowany
                        <>
                            <Link href="/przepisy/dodaj-drinka">
                                <a className={`${styles.mobileMenuContainer__navButton} ${styles['mobileMenuContainer__navButton--addDrink']}`} onClick={handleCloseBurgerClick}><button>Dodaj Drinka</button></a>
                            </Link>
                            <Link href="/konto/moje-drinki">
                                <a className={`${styles.mobileMenuContainer__navButton} ${styles['mobileMenuContainer__navButton--myDrinks']}`} onClick={handleCloseBurgerClick}><button>Moje Drinki</button></a>
                            </Link>
                            <button className={`${styles.mobileMenuContainer__navButton} ${styles['mobileMenuContainer__navButton--logout']}`} onClick={() => { handleCloseBurgerClick(), logout() }}>Wyloguj</button>
                        </>
                        :
                        //Jeśli użytkownik nie jest zalogowany
                        <Link href="/konto/zaloguj" >
                            <a className={`${styles.mobileMenuContainer__navButton} ${styles['mobileMenuContainer__navButton--login']}`} onClick={handleCloseBurgerClick}><button>Zaloguj</button></a>
                        </Link>
                    }
                </div>
            }
        </>
    )
}
