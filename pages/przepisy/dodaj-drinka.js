import { useState } from 'react';
import { useRouter } from 'next/router';
import { API_URL } from '@/config/index';

export default function AddDrink() {


    const [values, setValues] = useState({
        name: '',
        ingredient1: '',
        ingredient2: '',
        ingredient3: '',
        ingredient4: '',
        ingredient5: '',
        ingredient6: ''
    })

    const router = useRouter();

    const handleSubmit = async e => {
        e.preventDefault();
        console.log(values)

        const res = await fetch(`${API_URL}/drinks`, {
            method: 'POST',
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
            <h1>Add Drink</h1>

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
                <input type="submit" value="Dodaj Drinka" />
            </form>
        </div>
    )
}
