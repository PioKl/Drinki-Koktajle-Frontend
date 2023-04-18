import { API_URL } from "@/config/index";
import { parseCookies } from "@/helpers/index";
import MyDrink from "@/components/MyDrink";
import { useEffect } from "react";
import { useRouter } from "next/router";
import styles from "../../styles/ListOfMyDrinks.module.scss";

//Pobranie wszystkich drinków zalogowanego użytkownika przy pomocy jego tokena
export async function getServerSideProps({ req }) {
    const { token } = parseCookies(req); //parsowanie tokena

    //pobranie drinków zalogowanego użytkownika
    const response = await fetch(`${API_URL}/drinks/me`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
        }
    })

    //znalezione drinki znajdują się teraz w zmiennej drinks
    const drinks = await response.json();

    return {
        props: {
            drinks,
            token: token || null,
        },
    }
}

export default function MojeDrinki({ drinks, token }) {

    const router = useRouter();

    //Jeśli użytkownik nie jest zalogowany to przekierwoanie na stronę logowania
    useEffect(() => {
        if (token === null) {
            router.push("/konto/zaloguj");
        }
    }, []);

    const deleteDrink = async (id) => {
        if (confirm('Na pewno')) {
            const res = await fetch(`${API_URL}/drinks/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`
                },
            })

            const data = await res.json()

            if (!res.ok) {
                console.log(data.message)
            } else {
                router.reload();
            }
        } else {
            return router.reload(false); //jeśli użytkownik wciśnie anuluj
        }
    }

    return (
        <>
            {/* Jeśli użytkownik jest zalogowany, czyli token jest różny od null */}
            {token !== null &&
                <>
                    <h1 className={styles.myDrinksHeading}>Lista Twoich Drinków</h1>
                    <div className={styles.myDrinksContainer}>
                        {drinks.map(drink => (
                            <MyDrink key={drink.id} drink={drink} handleDeleteDrink={deleteDrink} />
                        ))}
                    </div>
                </>
            }

        </>
    )
}