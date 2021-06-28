import Link from "next/link";

export default function MyDrink({ drink, handleDeleteDrink }) {
    return (
        <div>
            <h3>
                <Link href={`/przepisy/${drink.slug}`}>
                    <a>{drink.name} </a>
                </Link>
                <Link href={`/przepisy/edytuj/${drink.id}`}>
                    <a>Edytuj drinka </a>
                </Link>
                <a href="#" onClick={() => handleDeleteDrink(drink.id)}>Usuń drinka</a>
            </h3>
        </div>
    )
}