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
        ingredient6: '',
        measure1: '',
        measure2: '',
        measure3: '',
        measure4: '',
        measure5: '',
        measure6: '',
    })

    const [image, setImage] = useState({ preview: null, file: null });

    const router = useRouter();

    const handleInputChange = (e) => {
        e.preventDefault();
        const { name, value } = e.target
        //console.log(e.target.name)
        //console.log(e.target.value)
        setValues({ ...values, [name]: value });
    }

    const handleFileChange = (e) => {
        console.log(e.target.files[0])
        setImage({
            preview: URL.createObjectURL(e.target.files[0]),
            file: e.target.files[0]
        });
    }
    //console.log(image)
    //console.log(values.name)
    //console.log(values)

    const handleSubmit = async e => {
        e.preventDefault();
        //console.log(values)

        if (image !== null && values.name !== "") {

            //Dodanie wartości i zdjęcia do bazy danych
            const formData = new FormData();
            formData.append('data', JSON.stringify(values));
            formData.append('files.image', image.file);

            const res = await fetch(`${API_URL}/drinks`, {
                method: 'POST',
                body: formData
            })

            //console.log(res)

            if (!res.ok) {
                console.log('Something is wrong')
            }
            else {
                const drink = await res.json()
                //console.log(drink)
                setValues({
                    name: '',
                    ingredient1: '',
                    ingredient2: '',
                    ingredient3: '',
                    ingredient4: '',
                    ingredient5: '',
                    ingredient6: '',
                    measure1: '',
                    measure2: '',
                    measure3: '',
                    measure4: '',
                    measure5: '',
                    measure6: '',
                });
                setImage({ preview: null, file: null })
                router.push(`/przepisy/${drink.slug}`)
            }
        } else
            return
    }

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
                    <label htmlFor="measure1">Ilość składnika nr 1</label>
                    <input type="text" id="measure1" name="measure1" value={values.measure1} onChange={handleInputChange} />
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
                    <input type="file" onChange={handleFileChange} />
                </div>
                {image.preview !== null ?
                    <div>
                        <img src={image.preview} width="200px" height="200px" alt="" />
                    </div>
                    :
                    null}

                <input type="submit" value="Dodaj Drinka" />
            </form>
        </div>
    )
}
