import Link from "next/link";
import styles from "../styles/MyDrink.module.scss";
import Image from "next/image";
import { useState } from 'react';

export default function MyDrink({ drink, handleDeleteDrink }) {
    const [loaded, setLoaded] = useState(false); // jeśli obrazek się załadował to zostanie usunięta animacja kropek
    return (
        <div className={styles.myDrink}>
            <Link href={`/przepisy/${drink.slug}`}>
                <div className={styles.myDrink__imageContainer}>
                    <Image onLoad={() => setLoaded(true)} loading="lazy" width="100%" height="100%" layout="responsive" objectFit="fill" className={styles.myDrink__image} src={drink.image.url} placeholder="blur" alt="Zdjęcie drinka" />

                    {!loaded &&
                        <div className={styles.myDrink__loader}>
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    }
                    {loaded && <div className={styles.myDrink__editDeleteContainer}>
                        <Link href={`/przepisy/edytuj/${drink.id}`}>
                            <a className={styles.myDrink__editDeleteButton}><button className={styles.myDrink__editButton}>Edytuj</button></a>
                        </Link>
                        <a className={styles.myDrink__editDeleteButton} href="#" onClick={() => handleDeleteDrink(drink.id)}><button className={styles.myDrink__deleteButton}>Usuń</button></a>
                    </div>}
                </div>
            </Link>
            <h2 className={styles.myDrink__name}>{drink.name}</h2>
        </div>

    )
}