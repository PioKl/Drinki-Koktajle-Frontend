import { API_URL } from "@/config/index";
import Link from "next/link";
import DrinkCard from "@/components/DrinkCard";
import { useState } from 'react';
import Select from 'react-select';


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

  /*==================================================================================================================================
                                                Pofiltrowane wszystkie składniki 
  ===================================================================================================================================*/
  let allIngredients = [];
  let filteredIngredients = [];
  drinks.forEach(drink => {
    allIngredients.push(drink.ingredient1, drink.ingredient2, drink.ingredient3, drink.ingredient4, drink.ingredient5, drink.ingredient6);

    filteredIngredients = allIngredients.filter(drink => {
      //zwróci drinki bez null, pustych stringów (ponieważ null i "", są false, a tu zwraca same true)
      return drink;
    });
  })

  //usuwa powtarzające się składniki
  let uniqueIngredients = [...new Set(filteredIngredients)];

  //Posortowanie alfabetycznie
  uniqueIngredients.sort(function (a, b) {
    if (a < b) { return -1; }
    if (a > b) { return 1; }
    return 0;
  })
  console.log(uniqueIngredients)
  /*================================================================================================================================= */

  /*==================================================================================================================================
                                                Wybór filtrów do zaawansowanego wyszukiwania
  ===================================================================================================================================*/
  let options = uniqueIngredients.map(drink => (
    { value: drink, label: drink.charAt(0).toUpperCase() + drink.slice(1) }
  ));
  console.log(options)

  const [selectedFilters, setSelectedFilters] = useState([]);

  //przekazywanie do tablicy selectedFilters wybranych filtrów
  const handleChangeSelectedFilters = (e) => {
    setSelectedFilters(Array.isArray(e) ? e.map(x => x.value) : []);
  }
  /*================================================================================================================================= */

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

    return selectedFilters.every(ingredient => ingredientsTableWithoutNull.includes(ingredient)) && drink.name.toLocaleLowerCase().includes(value.toLocaleLowerCase());

  })
  console.log(filteredDrinksSearch);
  console.log(selectedFilters)


  return (
    <div>
      <Link href="/przepisy/dodaj-drinka">
        <button>Dodaj Drinka</button>
      </Link>
      <Select id="long-value-select" instanceId="long-value-select"
        placeholder="Szukaj po składnikach"
        value={options.filter(obj => selectedFilters.includes(obj.value))} // ustawia wartości (filtry) wybrane przez użytkownika (ustawi je dodatkowo alfabetycznie)
        options={options} // opcje (filtry) do wyboru
        onChange={handleChangeSelectedFilters}
        isMulti
        noOptionsMessage={() => 'Nie ma więcej filtrów'}
      />
      <input type="text" value={value} onChange={handleChange} />
      <h1>Main Page</h1>
      {drinks.length === 0 && <h1>Nie ma drinków</h1>}
      {filteredDrinksSearch.map(drink => (
        <DrinkCard key={drink.id} drink={drink} />
      ))}
    </div>
  )
}
