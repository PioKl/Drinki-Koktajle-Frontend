import { API_URL } from "@/config/index";
import { useRouter } from 'next/router';
import Link from 'next/link';


export async function getStaticPaths() {
    const res = await fetch(`${API_URL}/drinks`)
    const drinks = await res.json()

    const paths = drinks.map(drink => ({
        params: { slug: drink.slug }
    }));

    return {
        paths,
        fallback: true,
    }
}

//te params ponizej pochodza, z paramsów z getStaticPaths
export async function getStaticProps({ params: { slug } }) {

    const res = await fetch(`${API_URL}/drinks?slug=${slug}`);
    const drinks = await res.json();
    return {
        props: {
            drink: drinks[0],
            revalidate: 1,
        }
    }
}



export default function DrinkDetails({ drink }) {
    console.log(drink)
    const { ingredient1, ingredient2, ingredient3, ingredient4, ingredient5, ingredient6 } = drink;
    const ingredientList = [ingredient1, ingredient2, ingredient3, ingredient4, ingredient5, ingredient6,];
    console.log(ingredientList)

    //USUWANIE
    const router = useRouter();

    const handleDeleteDrink = async (e) => {
        if (confirm('Na pewno')) {
            const res = await fetch(`${API_URL}/drinks/${drink.id}`, {
                method: 'DELETE'
            })

            const data = await res.json()

            if (!res.ok) {
                console.log(data.message)
            } else {
                router.push('/')
            }
        }
    }
    return (
        <div>
            <button onClick={handleDeleteDrink}>Delete</button>
            <Link href={`/przepisy/edytuj/${drink.id}`}><a><button>Edit</button></a></Link>
            <h1>{drink.name}</h1>
            {/*             {drink.ingredients.map((ingredient, id) => (
                <li key={id}>{ingredient}</li>
            ))} */}

            {ingredientList.map((ingredient, id) => ingredient ?
                <li key={id}>{ingredient}</li> : null
            )}
            {drink.image && <img src={drink.image.formats.thumbnail.url} width="200px" height="200px" alt="" />}
        </div>
    )
}
