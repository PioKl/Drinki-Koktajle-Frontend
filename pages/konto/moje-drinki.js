import { API_URL } from "@/config/index";
import { parseCookies } from "@/helpers/index";
import MyDrink from "@/components/MyDrink";
import router, { useRouter } from "next/router";

//Pobranie wszystkich drinków zalogowanego użytkownika przy pomocy jego tokena
export async function getServerSideProps({req}) {
    const {token} = parseCookies(req); //parsowanie tokena

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
            token
        },
    }
}

export default function MojeDrinki({ drinks, token }) {

    const router = useRouter();

    const deleteDrink = async (id) => {
        console.log(id)
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
        }
    }
    return (
        <div>
            <h1>Lista Twoich Drinków</h1>
            {drinks.map(drink => (
                <MyDrink key={drink.id} drink={drink} handleDeleteDrink={deleteDrink} />
            ))}
        </div>
    )
}