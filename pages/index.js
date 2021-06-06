import { API_URL } from "@/config/index";
import Link from "next/link";
import DrinkCard from "@/components/DrinkCard";
import { useState } from 'react';


export async function getStaticProps() {
  const res = await fetch(`${API_URL}/drinks`);
  const drinks = await res.json()

  return {
    props: { drinks },
    revalidate: 1,
  }
}

export default function Home({ drinks }) {

  const [value, setValue] = useState("");

  const handleChange = (e) => {
    console.log(e.target.value)
    setValue(e.target.value);
  }


  //wyszukiwanie drinka po nazwie
  const searchDrink = drinks.filter(drink => {
    return drink.name.toLocaleLowerCase().includes(value.toLocaleLowerCase())
  })
  console.log("drin")
  console.log(searchDrink)

  const filters = ['woda gazowana', 'limonka', 'mięta', 'cytryna'];
  console.log(filters.length > 1 && "Istnieje")


  const filteredDrinksSearch = drinks.filter(drink => {
    const ingredientsTable = [drink.ingredient1, drink.ingredient2, drink.ingredient3, drink.ingredient4, drink.ingredient5, drink.ingredient6]

    //I sposób
    /*     const ingredientsTableWithoutNull = []
        for (let i = 0; i < ingredientsTable.length; i++) {
          if (ingredientsTable[i] !== null) {
            ingredientsTableWithoutNull.push(ingredientsTable[i])
          }
        }
        console.log(ingredientsTable)
        console.log(ingredientsTableWithoutNull) */

    //II sposób
    const ingredientsTableWithoutNull = ingredientsTable.filter(drink => {
      return drink != null;
    });
    console.log(ingredientsTableWithoutNull);

    return filters.every(ingredient => ingredientsTableWithoutNull.includes(ingredient)) && drink.name.toLocaleLowerCase().includes(value.toLocaleLowerCase());

  })
  console.log(filteredDrinksSearch);


  return (
    <div>
      <Link href="/przepisy/dodaj-drinka">
        <button>Dodaj Drinka</button>
      </Link>
      <input type="text" value={value} onChange={handleChange} />
      <h1>Main Page</h1>
      {drinks.length === 0 && <h1>Nie ma drinków</h1>}
      {drinks.map(drink => (
        <DrinkCard key={drink.id} drink={drink} />
      ))}
    </div>
  )
}
