import { API_URL } from "@/config/index";
import DrinkCard from "@/components/DrinkCard";
import { useState, useEffect } from 'react';
import Select from 'react-select';

import styles from '../styles/MainPage.module.scss';
import SearchMagnifier from '../icons/searchIcon.svg';


export async function getServerSideProps() {
  const res = await fetch(`${API_URL}/drinks`);
  const drinks = await res.json()

  return {
    props: { drinks },
  }
}

export default function Home({ drinks }) {

  /* Znajdować się tu będzie string z inputa dotyczącego wyszukiwarki */
  const [value, setValue] = useState("");

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

  /*================================================================================================================================= */

  /*==================================================================================================================================
                                                Wybór filtrów do zaawansowanego wyszukiwania
  ===================================================================================================================================*/

  //Na podstawie tego zostaną utworzone odpowiednie opcje do wyboru w dropdown w filtrach
  let options = uniqueIngredients.map(drink => (
    { value: drink, label: drink.charAt(0).toUpperCase() + drink.slice(1) }
  ));

  const [selectedFilters, setSelectedFilters] = useState([]);

  //przekazywanie do tablicy selectedFilters wybranych filtrów
  const handleSelectedFiltersChange = (e) => {
    setSelectedFilters(Array.isArray(e) ? e.map(x => x.value) : []);
  }
  /*================================================================================================================================= */

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

    return selectedFilters.every(ingredient => ingredientsTableWithoutNull.includes(ingredient)) && drink.name.toLocaleLowerCase().includes(value.toLocaleLowerCase());

  })


  /* =========================================================================================================================================================
                                          Związane z wyszukiwarką w React Select (single value select)
  ===========================================================================================================================================================*/


  //Ustawienie wartości value podczas wpisywania wartości drinka w wyszukiwarce w react-select
  const handleSearchInputChange = (value, e) => {
    if (e.action === 'input-change') {
      setValue(value);
    } else {
      return
    }
  }

  //Ten stan będzie używany w useEffect i podczas wyboru drinka z dropdown menu w react select, gdy zostanie wybrana opcja z dropdown menu wtedy zmieni się stan i w useEffect zostanie to wykorzystane
  const [selectSingleValue, setSelectSingleValue] = useState("");

  //Ustawienie wartości value podczas wyboru drinka w wyszukiwarce poprzez dropdown menu w react-select
  const handleSearchChange = (e) => {
    setValue(e ? e.value : "");
    setSelectSingleValue(document.querySelector(".react-select__single-value"));
  }

  /*=======================================================================================================================================================
   Gdy użytkownik coś wpisuje w wyszukiwarce niech pokazują się odpowiednie podpowiedzi, będzie do użyte w react select dla zwykłej wyszukiwarki i będzie znajdowało się w options
  =========================================================================================================================================================*/

  //wyszukiwanie drinka po nazwie (będą znajdować się tu wszystkie drinki, które zawierają jakąś wartość z inputa)
  const searchDrink = drinks.filter(drink => {
    return drink.name.toLocaleLowerCase().includes(value.toLocaleLowerCase())
  })

  //Na podstawie tego zostaną utworzone odpowiednie opcje do wyboru w dropdown
  let searchOptions = searchDrink.map(drink => (
    { value: drink.name, label: drink.name.charAt(0).toUpperCase() + drink.name.slice(1) }
  ));


  //useEffect służacy do "nasłuchiwania" zmian w value i selectSingleValue, aby dostosować margines w celu dokładnego wyrównania podczas wyboru wartości z dropdown menu w react select oraz zwykłego wpisywania wartości w inpucie związanym w react select (inaczej kontenery są zbudowane, gdy dokonywany jest wybór z drop down menu, a wpisywaniem w inpucie)
  useEffect(() => {

    const reactSelectValueContainer = document.querySelector(".react-select__value-container");
    const reactSelectContainerWithValue = document.querySelector(".react-select__value-container--has-value");
    const reactSelectSingleValue = document.querySelector(".react-select__single-value");

    let width = '';

    if (reactSelectContainerWithValue && reactSelectSingleValue) {
      width = reactSelectSingleValue.clientWidth;
      reactSelectContainerWithValue.style.marginLeft = `${width + 35.5}px`; //szerokosc ile zajmuje teskt + 35.5px (szerokość jednego z "indicators")
    }
    else if (document.querySelector(".react-select-single-select-container .react-select__value-container--has-value")) {
      document.querySelector(".react-select-single-select-container .react-select__value-container--has-value").style.marginLeft = '36px'; //ta wartość wynika z szerokości jednego z indicators
    }
    else {
      reactSelectValueContainer.style.marginLeft = '0px';
    }

  }, [selectSingleValue, value]);

  return (
    <>
      <div className={styles.container}>

        <div className={styles.drinkFinderContainer}>
          <SearchMagnifier className={styles.drinkFinderContainer__icon} />
          <div className={styles.searchAndFiltersContainer}>
            <div className={styles.searchAndFiltersContainer__searchContainer}>


              <Select id="single-value-select" instanceId="single-value-select"
                className='react-select-container react-select-single-select-container'
                classNamePrefix='react-select'
                placeholder="Szukaj po nazwie"
                name="color"
                options={searchOptions}
                isClearable={true}
                value={searchOptions.filter(obj => value.includes(obj.value))}
                onChange={handleSearchChange}
                onInputChange={handleSearchInputChange}
                inputValue={value}
                noOptionsMessage={() => 'Nie ma takiego drinka'}
              />

            </div>

            <div className={styles.searchAndFiltersContainer__filtersContainer}>
              <Select id="long-value-select" instanceId="long-value-select"
                className='react-select-container'
                classNamePrefix='react-select'
                placeholder="Filtruj po składnikach"
                value={options.filter(obj => selectedFilters.includes(obj.value))} // ustawia wartości (filtry) wybrane przez użytkownika (ustawi je dodatkowo alfabetycznie)
                options={options} // opcje (filtry) do wyboru
                onChange={handleSelectedFiltersChange}
                isMulti
                noOptionsMessage={() => 'Nie ma filtrów'}
              />
            </div>

          </div>
        </div>

        <h1 className={styles.drinksHeading}>Lista Drinków</h1>
        {filteredDrinksSearch.length === 0 && <h2 className={styles.main__noDrinks}>Brak przepisów</h2>}
        <div className={styles.drinksContainer}>
          {filteredDrinksSearch.map(drink => (
            <DrinkCard key={drink.id} drink={drink} />
          ))}
        </div>
      </div>
    </>
  )
}
