import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import { API_URL } from '@/config/index';

export async function getServerSideProps({ params: { id } }) {
    const res = await fetch(`${API_URL}/drinks/${id}`)
    const drink = await res.json();

    return {
        props: {
            drink
        }
    }
}

export default function EditDrink({ drink }) {

    const router = useRouter();

    const [values, setValues] = useState({
        name: drink.name,
        ingredient1: drink.ingredient1,
        ingredient2: drink.ingredient2,
        ingredient3: drink.ingredient3,
        ingredient4: drink.ingredient4,
        ingredient5: drink.ingredient5,
        ingredient6: drink.ingredient6,
        measure1: drink.measure1,
        measure2: drink.measure2,
        measure3: drink.measure3,
        measure4: drink.measure4,
        measure5: drink.measure5,
        measure6: drink.measure6
    })

    //Zmienna, która pobiera obrazek z bazy danych, a także umożliwia jego zmianę
    const [drinkImage, setDrinkImage] = useState({ imageFromDataBase: drink.image ? drink.image.formats.thumbnail.url : null, newImagePreview: null, newImageFile: null });

    //Zmienne potrzebne przy walidacji
    let validation = false;
    const [errors, setErrors] = useState({
        name: false,
        ingredientsAndMeasures1: false,
        ingredientsAndMeasures2: false,
        ingredientsAndMeasures3: false,
        ingredientsAndMeasures4: false,
        ingredientsAndMeasures5: false,
        ingredientsAndMeasures6: false,
    });
    let valuesEmpty = {
        nameEmpty: false,
        ingredientsAndMeasuresEmpty1: false,
        ingredientsAndMeasuresEmpty2: false,
        ingredientsAndMeasuresEmpty3: false,
        ingredientsAndMeasuresEmpty4: false,
        ingredientsAndMeasuresEmpty5: false,
        ingredientsAndMeasuresEmpty6: false
    }
    const messages = {
        name_empty: 'Drink musi mieć nazwę',
        ingredientOrMeasure_empty: 'Składnik musi mieć ilość, a ilość musi dotyczyć składnika'
    }

    const handleInputChange = (e) => {
        e.preventDefault();
        const { name, value } = e.target
        console.log(e.target.name)
        console.log(e.target.value)
        setValues({ ...values, [name]: value });
    }

    //Mechanika edytowania obrazka
    const handleFileChange = (e) => {
        setDrinkImage({
            newImagePreview: URL.createObjectURL(e.target.files[0]),
            newImageFile: e.target.files[0]
        })
    }


    //Funkcja odpowiadająca za walidację
    const formValidation = () => {
        //Wczesna wersja walidacji

        if (values.name === "") {
            valuesEmpty.nameEmpty = true;
            setErrors(prev => ({
                ...prev,
                name: messages.name_empty,
            }));
        }
        else if (values.name !== "") {
            valuesEmpty.nameEmpty = false;
            setErrors(prev => ({
                ...prev,
                name: false,
            }));
        }

        for (let i = 1; i <= 6; i++) {
            console.log(eval(`values.ingredient${i}`))
            console.log(eval(`values.measure${i}`))
            if (eval(`values.ingredient${i}`) === "" && eval(`values.measure${i}`) !== "") {
                eval(`valuesEmpty.ingredientsAndMeasuresEmpty${i} = true`);
                eval(`setErrors(prev => ({
                    ...prev,
                    ingredientsAndMeasures${i}: messages.ingredientOrMeasure_empty,
                }))`)
            }
            else if (eval(`values.ingredient${i}`) !== "" && eval(`values.measure${i}`) === "") {
                eval(`valuesEmpty.ingredientsAndMeasuresEmpty${i} = true`);
                eval(`setErrors(prev => ({
                    ...prev,
                    ingredientsAndMeasures${i}: messages.ingredientOrMeasure_empty,
                }))`)
            }
            else if (eval(`values.ingredient${i}`) !== "" && eval(`values.measure${i}`) !== "") {
                eval(`valuesEmpty.ingredientsAndMeasuresEmpty${i} = false`);
                eval(`setErrors(prev => ({
                        ...prev,
                        ingredientsAndMeasures${i}: false,
                    }))`)
            }
            else {
                eval(`valuesEmpty.ingredientsAndMeasuresEmpty${i} = false`);
                eval(`setErrors(prev => ({
                        ...prev,
                        ingredientsAndMeasures${i}: false,
                    }))`)
            }
        }


        if (valuesEmpty.nameEmpty === false && valuesEmpty.ingredientsAndMeasuresEmpty1 === false && valuesEmpty.ingredientsAndMeasuresEmpty2 === false && valuesEmpty.ingredientsAndMeasuresEmpty3 === false && valuesEmpty.ingredientsAndMeasuresEmpty4 === false && valuesEmpty.ingredientsAndMeasuresEmpty5 === false && valuesEmpty.ingredientsAndMeasuresEmpty6 === false) {
            validation = true;
        }
    }


    const handleSubmit = async e => {

        e.preventDefault();

        formValidation();

        if (validation === true) {
            //Dodanie edytowanych wartości i zdjęcia do bazy danych
            const formData = new FormData();
            formData.append('data', JSON.stringify(values));
            formData.append('files.image', drinkImage.newImageFile);

            const res = await fetch(`${API_URL}/drinks/${drink.id}`, {
                method: 'PUT',
                body: formData
            })

            console.log(res)

            if (!res.ok) {
                console.log('Something is wrong')
            }
            else {
                const drink = await res.json()
                router.push(`/przepisy/${drink.slug}`)
            }
        }

    }

    return (
        <div>
            <h1>Edit Drink</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Nazwa drinka</label>
                    <input type="text" id="name" name="name" value={values.name} onChange={handleInputChange} />
                </div>
                {errors.name && <span style={{ color: "red" }}>{messages.name_empty}</span>}
                <div>
                    <label htmlFor="ingredient1">Składnik nr 1</label>
                    <input type="text" id="ingredient1" name="ingredient1" value={values.ingredient1} onChange={handleInputChange} />
                    <label htmlFor="measure1">Ilość składnika nr 1</label>
                    <input type="text" id="measure1" name="measure1" value={values.measure1} onChange={handleInputChange} />
                </div>
                {errors.ingredientsAndMeasures1 && <span style={{ color: "red" }}>{messages.ingredientOrMeasure_empty}</span>}
                <div>
                    <label htmlFor="ingredient2">Składnik nr 2</label>
                    <input type="text" id="ingredient2" name="ingredient2" value={values.ingredient2} onChange={handleInputChange} />
                    <label htmlFor="measure2">Ilość składnika nr 2</label>
                    <input type="text" id="measure2" name="measure2" value={values.measure2} onChange={handleInputChange} />
                </div>
                {errors.ingredientsAndMeasures2 && <span style={{ color: "red" }}>{messages.ingredientOrMeasure_empty}</span>}
                <div>
                    <label htmlFor="ingredient3">Składnik nr 3</label>
                    <input type="text" id="ingredient3" name="ingredient3" value={values.ingredient3} onChange={handleInputChange} />
                    <label htmlFor="measure3">Ilość składnika nr 3</label>
                    <input type="text" id="measure3" name="measure3" value={values.measure3} onChange={handleInputChange} />
                </div>
                {errors.ingredientsAndMeasures3 && <span style={{ color: "red" }}>{messages.ingredientOrMeasure_empty}</span>}
                <div>
                    <label htmlFor="ingredient3">Składnik nr 4</label>
                    <input type="text" id="ingredient4" name="ingredient4" value={values.ingredient4} onChange={handleInputChange} />
                    <label htmlFor="measure4">Ilość składnika nr 4</label>
                    <input type="text" id="measure4" name="measure4" value={values.measure4} onChange={handleInputChange} />
                </div>
                {errors.ingredientsAndMeasures4 && <span style={{ color: "red" }}>{messages.ingredientOrMeasure_empty}</span>}
                <div>
                    <label htmlFor="ingredient5">Składnik nr 5</label>
                    <input type="text" id="ingredient5" name="ingredient5" value={values.ingredient5} onChange={handleInputChange} />
                    <label htmlFor="measure5">Ilość składnika nr 5</label>
                    <input type="text" id="measure5" name="measure5" value={values.measure5} onChange={handleInputChange} />
                </div>
                {errors.ingredientsAndMeasures5 && <span style={{ color: "red" }}>{messages.ingredientOrMeasure_empty}</span>}
                <div>
                    <label htmlFor="ingredient6">Składnik nr 6</label>
                    <input type="text" id="ingredient6" name="ingredient6" value={values.ingredient6} onChange={handleInputChange} />
                    <label htmlFor="measure6">Ilość składnika nr 6</label>
                    <input type="text" id="measure6" name="measure6" value={values.measure6} onChange={handleInputChange} />
                </div>
                {errors.ingredientsAndMeasures6 && <span style={{ color: "red" }}>{messages.ingredientOrMeasure_empty}</span>}
                <div>

                    <h2>Zdjęcie</h2>
                    {drinkImage.newImagePreview !== null ?
                        <div>
                            <img src={drinkImage.newImagePreview} width="200px" height="200px" alt="" />
                        </div>
                        :
                        drinkImage.imageFromDataBase ?
                            <Image src={drinkImage.imageFromDataBase} width={200} height={200} />
                            :
                            <div>
                                <h2>Nie ma zdjęcia</h2>
                            </div>
                    }
                    <input type="file" onChange={handleFileChange} />
                </div>
                <input type="submit" value="Edytuj Drinka" />
                <Link href={`/przepisy/${drink.slug}`}><a><button>Anuluj</button></a></Link>
            </form>
        </div>
    )
}


