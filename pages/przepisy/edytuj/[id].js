import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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

    const toastYoutubeError = "toast-youtube-error";
    const ToastYoutubeError = () => {
        toast.error(<div>
            Link jest nieprawidłowy!<br /><br />
            Prawidłowe przykłady: <br /><br />
            https://www.youtube.com/watch?v=ABCDEFGHIJK <br /><br />
            https://www.youtube.com/watch?v=ABCDEFGHIJK&t=269s <br /><br />
            https://www.youtube.com/watch?v=ABCDEFGHIJK?t=269s <br /><br />
            https://www.youtube.com/embed/ABCDEFGHIJK?start=199

        </div>, {
            toastId: toastYoutubeError
        });
    }

    const [values, setValues] = useState({
        name: drink.name,
        description: drink.description,
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
        measure6: drink.measure6,
        video: drink.video,
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
        ingredientOrMeasure_empty: 'Składnik musi mieć nazwę i ilość',
    }

    const youtubeParser = (url) => {

        let regExp = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/;
        let match = url.match(regExp);
        console.log(match)

        //Jeśli match istnieje (url jest zgodony z regexpem) i istnieje match[6], a match[6] jest wtedy, gdy film na youtube ma końcówkę &t, bądź ?t, czyli jeśli użytkownik chce rozpocząć od danego momentu (np. &t=269s) i jeśli match[5] ma długość jedenastu znaków (gdyż każdy film na youtube, ma takie końcówki) oraz jeśli liczba znaków match[6] jest większa od 3, czyli od (&t=) wówczas wykonaj warunek
        if (match && match[6] && match[5].length == 11 && match[6].length > 3) {

            //jeśli początek match[6] zawiera znaki &t i ?t, wtedy do match[5] dołącz do stringa "?start=", wszystko co zawiera się w match[6] z wyjątkiem jego 3 pierwszych znaków (&t= lub ?t=) oraz dodatkowo odejmij ostatni znak (s, który oznacza sekundę)
            if (match[6].slice(0, 2).includes("&t" || "?t")) {
                return match[5] + "?start=" + match[6].slice(3).slice(0, -1);
            }
            //natomiast jeśli match[6] nie zawiera takich znaków wtedy połącz strinki match[5] z match[6], czyli standardowa końcówka filmu na youtube + cała sekwencja start np. ?start=199
            else {
                return match[5] + match[6];
            }

        }
        //Jeśli istnieje match zgdony z regeExpem i liczba znaków w match[5] wynosi 11, wtedy zwróć tylko match[5], czyli standardową końcówkę filmu na youtube (film włącza się od początku)
        else if (match && match[5].length == 11) {
            return match[5]
        }
        //w przeciwnym wypadku zakończ
        else {
            ToastYoutubeError();
            return
        }
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
            toast.error("Drink lub koktajl musi mieć nazwę!")
        }
        else if (values.name !== "") {
            valuesEmpty.nameEmpty = false;
            setErrors(prev => ({
                ...prev,
                name: false,
            }));
        }

        for (let i = 1; i <= Object.keys(valuesEmpty).length - 1; i++) {
            console.log(eval(`values.ingredient${i}`))
            console.log(eval(`values.measure${i}`))
            if (eval(`values.ingredient${i}`) === "" && eval(`values.measure${i}`) !== "") {
                eval(`valuesEmpty.ingredientsAndMeasuresEmpty${i} = true`);
                eval(`setErrors(prev => ({
                    ...prev,
                    ingredientsAndMeasures${i}: messages.ingredientOrMeasure_empty,
                }))`)
                toast.error(`Składnik numer ${i} musi mieć nazwę! `)
            }
            else if (eval(`values.ingredient${i}`) !== "" && eval(`values.measure${i}`) === "") {
                eval(`valuesEmpty.ingredientsAndMeasuresEmpty${i} = true`);
                eval(`setErrors(prev => ({
                    ...prev,
                    ingredientsAndMeasures${i}: messages.ingredientOrMeasure_empty,
                }))`)
                toast.error(`Składnik numer ${i} musi mieć podaną ilość!`)
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

        console.log(youtubeParser(values.video))
        if (valuesEmpty.nameEmpty === false && valuesEmpty.ingredientsAndMeasuresEmpty1 === false && valuesEmpty.ingredientsAndMeasuresEmpty2 === false && valuesEmpty.ingredientsAndMeasuresEmpty3 === false && valuesEmpty.ingredientsAndMeasuresEmpty4 === false && valuesEmpty.ingredientsAndMeasuresEmpty5 === false && valuesEmpty.ingredientsAndMeasuresEmpty6 === false) {
            validation = true;
            toast.success("Sukces!")
        }
        else {
            return
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
        } else return

    }
    console.log(values)
    return (
        <div>
            <h1>Edit Drink</h1>
            <ToastContainer />
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
                    <label htmlFor="description">Opis</label>
                    <textarea type="text" name="description" id="description" value={values.description} onChange={handleInputChange}></textarea>
                </div>
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
                <div>
                    <h2>Film instruktażowy</h2>
                    <input type="text" id="video" name="video" value={values.video} onChange={handleInputChange} />
                    {values.video !== null || "" ?
                        <div>
                            <iframe src={`https://www.youtube.com/embed/${youtubeParser(values.video)}`} width="500" height="150" target="_parent"></iframe>
                        </div>
                        :
                        <div>
                            <h2>Nie ma filmu</h2>
                        </div>
                    }
                </div>
                <input type="submit" value="Edytuj Drinka" />
                <Link href={`/przepisy/${drink.slug}`}><a><button>Anuluj</button></a></Link>
            </form>
        </div>
    )
}


