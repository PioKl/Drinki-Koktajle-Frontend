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

    const [values, setValues] = useState({
        name: drink.name,
        ingredient1: drink.ingredient1,
        ingredient2: drink.ingredient2,
        ingredient3: drink.ingredient3,
        ingredient4: drink.ingredient4,
        ingredient5: drink.ingredient5,
        ingredient6: drink.ingredient6
    })

    const [drinkImage, setDrinkImage] = useState(drink.image ? drink.image.formats.thumbnail.url : null)

    const router = useRouter();

    const handleSubmit = async e => {
        e.preventDefault();
        console.log(values)

        const res = await fetch(`${API_URL}/drinks/${drink.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
        })
        console.log(res)



        if (!res.ok) {
            console.log('Something is wrong')
        }
        else {
            const drink = await res.json()
            console.log(drink)
            setValues({
                name: '',
                ingredient1: '',
                ingredient2: '',
                ingredient3: '',
                ingredient4: '',
                ingredient5: '',
                ingredient6: ''
            });
            router.push(`/przepisy/${drink.slug}`)
        }
    }

    const handleInputChange = (e) => {
        e.preventDefault();
        const { name, value } = e.target
        console.log(e.target.name)
        console.log(e.target.value)
        setValues({ ...values, [name]: value });
    }
    console.log(values.name)
    return (
        <div>
            <h1>Edit Drink</h1>

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Nazwa drinka</label>
                    <input type="text" id="name" name="name" value={values.name} onChange={handleInputChange} />
                </div>
                <div>
                    <label htmlFor="ingredient1">Składnik nr 1</label>
                    <input type="text" id="ingredient1" name="ingredient1" value={values.ingredient1} onChange={handleInputChange} />
                </div>
                <div>
                    <label htmlFor="ingredient1">Składnik nr 2</label>
                    <input type="text" id="ingredient2" name="ingredient2" value={values.ingredient2} onChange={handleInputChange} />
                </div>
                <div>
                    <label htmlFor="ingredient3">Składnik nr 3</label>
                    <input type="text" id="ingredient3" name="ingredient3" value={values.ingredient3} onChange={handleInputChange} />
                </div>
                <div>
                    <h2>Zdjęcie</h2>
                    {drinkImage ?
                        <Image src={drinkImage} width={200} height={200} />
                        :
                        <div>
                            <h2>Nie ma zdjęcia</h2>
                        </div>
                    }
                    <button>{drinkImage ? "Zmień zdjęcie" : "Dodaj zdjęcie"}</button>
                </div>
                <input type="submit" value="Edytuj Drinka" />
            </form>
        </div>
    )
}
