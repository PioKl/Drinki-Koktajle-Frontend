import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import { API_URL } from '@/config/index';
import { parseCookies } from '@/helpers/index';
import styles from '../../../styles/Forms.module.scss';

export async function getServerSideProps({ params: { id }, req }) {
    const { token } = parseCookies(req)

    try {
        const res = await fetch(`${API_URL}/drinks/${id}`)
        const drink = await res.json();
        return {
            props: {
                drink,
                token: token || null
            }
        }
    } catch {
        //Nie ma drinka o takim id
        return {
            props: {
                empty: true
            }
        }
    }
}

export default function EditDrink({ drink, token, empty }) {

    const router = useRouter();

    useEffect(() => {
        if (token === null) {
            router.push("/konto/zaloguj");
        }
    })

    if (empty) {
        return (
            <div className={styles.wrongEditId}>
                <h2>Nie istnieje drink o takim id</h2>
            </div>
        )
    }

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
        author: drink.author,
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
    let wrongYoutubeUrl = false;
    const [errors, setErrors] = useState({
        name: false,
        ingredientsOneAndTwo: false,
        wrongYoutubeUrl: false,
        ingredientsAndMeasures1: false,
        ingredientsAndMeasures2: false,
        ingredientsAndMeasures3: false,
        ingredientsAndMeasures4: false,
        ingredientsAndMeasures5: false,
        ingredientsAndMeasures6: false,
    });
    let valuesEmpty = {
        nameEmpty: false,
        ingredientsOneAndTwoEmpty: false,
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
        ingredientsOneAndTwo_empty: ' Drink musi mieć składnik nr 1 i składnik nr 2',
        wrongYoutubeUrl: 'Nieprawidłowy adres url',
    }

    const youtubeParser = (url) => {

        let regExp = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/;
        let match = url.match(regExp);

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
            //jeśli użytkownik wpisał coś niezgdonego z przyjętym parsem, wtedy ustaw zmienna wronYoutubeUrl na true
            if (values.video !== (null || "")) {
                ToastYoutubeError();
                wrongYoutubeUrl = true;
            }
            return
        }
    }


    const handleInputChange = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
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

        if (values.ingredient1 === '' && values.ingredient2 === '') {
            valuesEmpty.ingredientsOneAndTwoEmpty = true;
            setErrors(prev => ({
                ...prev,
                ingredientsOneAndTwo: messages.ingredientsOneAndTwo_empty,
            }));
            toast.error("Musisz dodać co najmniej dwa składniki")

        }
        else if (values.ingredient1 !== '' && values.ingredient2 === '') {
            valuesEmpty.ingredientsOneAndTwoEmpty = true;
            setErrors(prev => ({
                ...prev,
                ingredientsOneAndTwo: messages.ingredientsOneAndTwo_empty,
            }));
            toast.error("Musisz dodać co najmniej dwa składniki")
        }
        else if (values.ingredient1 === '' && values.ingredient2 !== '') {
            valuesEmpty.ingredientsOneAndTwoEmpty = true;
            setErrors(prev => ({
                ...prev,
                ingredientsOneAndTwo: messages.ingredientsOneAndTwo_empty,
            }));
            toast.error("Musisz dodać co najmniej dwa składniki")
        }
        else {
            valuesEmpty.ingredientsOneAndTwoEmpty = false;
            setErrors(prev => ({
                ...prev,
                ingredientsOneAndTwo: false,
            }));
        }

        for (let i = 1; i <= Object.keys(valuesEmpty).length - 2; i++) {
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

        if (wrongYoutubeUrl === true) {
            setErrors(prev => ({
                ...prev,
                wrongYoutubeUrl: messages.wrongYoutubeUrl,
            }));
        }
        else {
            setErrors(prev => ({
                ...prev,
                wrongYoutubeUrl: false,
            }));
        }

        //Jeśli wszystkie poniższe wartości są false, wtedy wszystko jest w porządku, walidacja zostaje ustawiona na true
        if (!valuesEmpty.nameEmpty && !valuesEmpty.ingredientsOneAndTwoEmpty && !valuesEmpty.ingredientsAndMeasuresEmpty1 && !valuesEmpty.ingredientsAndMeasuresEmpty2 && !valuesEmpty.ingredientsAndMeasuresEmpty3 && !valuesEmpty.ingredientsAndMeasuresEmpty4 && !valuesEmpty.ingredientsAndMeasuresEmpty5 && !valuesEmpty.ingredientsAndMeasuresEmpty6 && !wrongYoutubeUrl) {
            validation = true;
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
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            })

            if (!res.ok) {
                if (res.status === 403 || res.status === 401) {
                    toast.error('Brak autoryzacji')
                    return
                }
                toast.error(
                    <div>
                        Coś poszło nie tak :( <br /><br />
                        Wprowadzona nazwa drinka może być już zajęta <br /><br />
                        Zdjęcie może mieć nieprawidłowy format
                    </div>
                )
            }
            else {
                const drink = await res.json()
                router.push(`/przepisy/${drink.slug}`)
            }
        } else return

    }

    return (
        <>
            {token !== null &&
                <>
                    <ToastContainer />
                    <div className={`${styles.formContainer}  ${styles['formContainer--drinkCreation']}`}>
                        <h1 className={styles.formContainer__heading}>Edytuj drinka</h1>
                        <form onSubmit={handleSubmit}>
                            <div className={styles.formContainer__creationFormField}>
                                <label className={`${styles.formContainer__creationLabel} ${styles['formContainer__creationLabel--required']}`} htmlFor="name">Nazwa drinka</label>
                                <input className={styles.formContainer__creationInput} type="text" id="name" name="name" value={values.name} onChange={handleInputChange} />
                                {errors.name &&
                                    <div className={styles.formContainer__errors}>
                                        {errors.name && <span style={{ color: "red" }}>{messages.name_empty}</span>}
                                    </div>
                                }
                            </div>

                            <div className={`${styles.formContainer__creationFormField} ${styles['formContainer__creationFormField--ingredientsAndMeasuresContainer']}`}>
                                <div className={styles.formContainer__ingredientsContainer}>
                                    <label className={`${styles.formContainer__creationLabel} ${styles['formContainer__creationLabel--required']}`} htmlFor="ingredient1">Składnik nr 1</label>
                                    <input className={styles.formContainer__creationInput} type="text" id="ingredient1" name="ingredient1" value={values.ingredient1} onChange={handleInputChange} />
                                </div>

                                <div className={styles.formContainer__measuresContainer}>
                                    <label className={`${styles.formContainer__creationLabel} ${styles['formContainer__creationLabel--required']}`} htmlFor="measure1">Ilość składnika nr 1</label>
                                    <input className={styles.formContainer__creationInput} type="text" id="measure1" name="measure1" value={values.measure1} onChange={handleInputChange} />
                                </div>

                                {(errors.ingredientsAndMeasures1 || errors.ingredientsOneAndTwo) &&
                                    <div className={`${styles.formContainer__errors} ${styles['formContainer__errors--ingredientsAndMeasures']}`}>
                                        {errors.ingredientsAndMeasures1 && <span style={{ color: "red" }}>{messages.ingredientOrMeasure_empty}</span>}
                                        {errors.ingredientsOneAndTwo && <span style={{ color: "red" }}>{messages.ingredientsOneAndTwo_empty}</span>}
                                    </div>
                                }
                            </div>


                            <div className={`${styles.formContainer__creationFormField} ${styles['formContainer__creationFormField--ingredientsAndMeasuresContainer']}`}>
                                <div className={styles.formContainer__ingredientsContainer}>
                                    <label className={`${styles.formContainer__creationLabel} ${styles['formContainer__creationLabel--required']}`} htmlFor="ingredient2">Składnik nr 2</label>
                                    <input className={styles.formContainer__creationInput} type="text" id="ingredient2" name="ingredient2" value={values.ingredient2} onChange={handleInputChange} />
                                </div>

                                <div className={styles.formContainer__measuresContainer}>
                                    <label className={`${styles.formContainer__creationLabel} ${styles['formContainer__creationLabel--required']}`} htmlFor="measure2">Ilość składnika nr 2</label>
                                    <input className={styles.formContainer__creationInput} type="text" id="measure2" name="measure2" value={values.measure2} onChange={handleInputChange} />
                                </div>

                                {(errors.ingredientsAndMeasures2 || errors.ingredientsOneAndTwo) &&
                                    <div className={`${styles.formContainer__errors} ${styles['formContainer__errors--ingredientsAndMeasures']}`}>
                                        {errors.ingredientsAndMeasures2 && <span style={{ color: "red" }}>{messages.ingredientOrMeasure_empty}</span>}
                                        {errors.ingredientsOneAndTwo && <span style={{ color: "red" }}>{messages.ingredientsOneAndTwo_empty}</span>}
                                    </div>
                                }
                            </div>

                            {(values.ingredient1 && values.measure1 && values.ingredient2 && values.measure2) &&
                                <div className={`${styles.formContainer__creationFormField} ${styles['formContainer__creationFormField--ingredientsAndMeasuresContainer']}`}>
                                    <div className={styles.formContainer__ingredientsContainer}>
                                        <label className={styles.formContainer__creationLabel} htmlFor="ingredient3">Składnik nr 3</label>
                                        <input className={styles.formContainer__creationInput} type="text" id="ingredient3" name="ingredient3" value={values.ingredient3} onChange={handleInputChange} />
                                    </div>

                                    <div className={styles.formContainer__measuresContainer}>
                                        <label className={styles.formContainer__creationLabel} htmlFor="measure3">Ilość składnika nr 3</label>
                                        <input className={styles.formContainer__creationInput} type="text" id="measure3" name="measure3" value={values.measure3} onChange={handleInputChange} />
                                    </div>

                                    {errors.ingredientsAndMeasures3 &&
                                        <div className={`${styles.formContainer__errors} ${styles['formContainer__errors--ingredientsAndMeasures']}`}>
                                            {errors.ingredientsAndMeasures3 && <span style={{ color: "red" }}>{messages.ingredientOrMeasure_empty}</span>}
                                        </div>
                                    }
                                </div>
                            }

                            {(values.ingredient1 && values.measure1 && values.ingredient2 && values.measure2 && values.ingredient3 && values.measure3) &&
                                <div className={`${styles.formContainer__creationFormField} ${styles['formContainer__creationFormField--ingredientsAndMeasuresContainer']}`}>
                                    <div className={styles.formContainer__ingredientsContainer}>
                                        <label className={styles.formContainer__creationLabel} htmlFor="ingredient3">Składnik nr 4</label>
                                        <input className={styles.formContainer__creationInput} type="text" id="ingredient4" name="ingredient4" value={values.ingredient4} onChange={handleInputChange} />
                                    </div>

                                    <div className={styles.formContainer__measuresContainer}>
                                        <label className={styles.formContainer__creationLabel} htmlFor="measure4">Ilość składnika nr 4</label>
                                        <input className={styles.formContainer__creationInput} type="text" id="measure4" name="measure4" value={values.measure4} onChange={handleInputChange} />
                                    </div>

                                    {errors.ingredientsAndMeasures4 &&
                                        <div className={`${styles.formContainer__errors} ${styles['formContainer__errors--ingredientsAndMeasures']}`}>
                                            {errors.ingredientsAndMeasures4 && <span style={{ color: "red" }}>{messages.ingredientOrMeasure_empty}</span>}
                                        </div>
                                    }
                                </div>
                            }

                            {(values.ingredient1 && values.measure1 && values.ingredient2 && values.measure2 && values.ingredient3 && values.measure3 && values.ingredient4 && values.measure4) &&
                                <div className={`${styles.formContainer__creationFormField} ${styles['formContainer__creationFormField--ingredientsAndMeasuresContainer']}`}>
                                    <div className={styles.formContainer__ingredientsContainer}>
                                        <label className={styles.formContainer__creationLabel} htmlFor="ingredient5">Składnik nr 5</label>
                                        <input className={styles.formContainer__creationInput} type="text" id="ingredient5" name="ingredient5" value={values.ingredient5} onChange={handleInputChange} />
                                    </div>
                                    <div className={styles.formContainer__measuresContainer}>
                                        <label className={styles.formContainer__creationLabel} htmlFor="measure5">Ilość składnika nr 5</label>
                                        <input className={styles.formContainer__creationInput} type="text" id="measure5" name="measure5" value={values.measure5} onChange={handleInputChange} />
                                    </div>
                                    {errors.ingredientsAndMeasures5 &&
                                        <div className={`${styles.formContainer__errors} ${styles['formContainer__errors--ingredientsAndMeasures']}`}>
                                            {errors.ingredientsAndMeasures5 && <span style={{ color: "red" }}>{messages.ingredientOrMeasure_empty}</span>}
                                        </div>
                                    }
                                </div>
                            }

                            {(values.ingredient1 && values.measure1 && values.ingredient2 && values.measure2 && values.ingredient3 && values.measure3 && values.ingredient4 && values.measure4 && values.ingredient5 && values.measure5) &&
                                <div className={`${styles.formContainer__creationFormField} ${styles['formContainer__creationFormField--ingredientsAndMeasuresContainer']}`}>
                                    <div className={styles.formContainer__ingredientsContainer}>
                                        <label className={styles.formContainer__creationLabel} htmlFor="ingredient6">Składnik nr 6</label>
                                        <input className={styles.formContainer__creationInput} type="text" id="ingredient6" name="ingredient6" value={values.ingredient6} onChange={handleInputChange} />
                                    </div>
                                    <div className={styles.formContainer__measuresContainer}>
                                        <label className={styles.formContainer__creationLabel} htmlFor="measure6">Ilość składnika nr 6</label>
                                        <input className={styles.formContainer__creationInput} type="text" id="measure6" name="measure6" value={values.measure6} onChange={handleInputChange} />
                                    </div>
                                    {errors.ingredientsAndMeasures6 &&
                                        <div className={`${styles.formContainer__errors} ${styles['formContainer__errors--ingredientsAndMeasures']}`}>
                                            {errors.ingredientsAndMeasures6 && <span style={{ color: "red" }}>{messages.ingredientOrMeasure_empty}</span>}
                                        </div>
                                    }
                                </div>
                            }

                            <div className={styles.formContainer__creationFormField}>
                                <label className={styles.formContainer__creationLabel} htmlFor="description">Opis</label>
                                <textarea className={styles.formContainer__creationInput} type="text" name="description" id="description" value={values.description} onChange={handleInputChange}></textarea>
                            </div>

                            <div className={styles.formContainer__creationFormField}>
                                <label className={styles.formContainer__creationLabel} htmlFor="author">Źródło <span className={styles.formContainer__creationBrackets}>(wpisz autora, bądź nazwę strony, jeśli drink został dodany na podstawie czyjegoś przepisu)</span></label>
                                <input className={styles.formContainer__creationInput} type="text" name="author" id="author" value={values.author} onChange={handleInputChange} />
                            </div>

                            <div className={styles.formContainer__creationFormField}>
                                <label className={`${styles.formContainer__creationLabel} ${styles['formContainer__creationLabel--required']}`} htmlFor="file">Zdjęcie drinka</label>
                                <input type="file" name="file" id="file" onChange={handleFileChange} />

                                {drinkImage.newImagePreview !== null ?
                                    <div className={styles.formContainer__imgPreview}>
                                        <img src={drinkImage.newImagePreview} width="200px" height="200px" alt="Zdjęcie drinka" />
                                    </div>
                                    :
                                    drinkImage.imageFromDataBase ?
                                        <div className={styles.formContainer__imgPreview}>
                                            <Image src={drinkImage.imageFromDataBase} width={200} height={200} />
                                        </div>
                                        :
                                        <>
                                            {errors.image &&
                                                <div className={styles.formContainer__errors}>
                                                    {errors.image && <span style={{ color: "red" }}>{messages.image_empty}</span>}
                                                </div>
                                            }
                                        </>
                                }
                            </div>

                            <div className={styles.formContainer__creationFormField}>
                                <label className={styles.formContainer__creationLabel} htmlFor="video">Film instruktażowy</label>
                                <input className={styles.formContainer__creationInput} type="text" id="video" name="video" placeholder='Link do filmu na youtube' value={values.video} onChange={handleInputChange} />

                                {values.video !== (null || "") &&
                                    <div className={styles.formContainer__iframe}>
                                        <iframe src={`https://www.youtube.com/embed/${youtubeParser(values.video)}`} width="500" target="_parent"></iframe>
                                        {errors.wrongYoutubeUrl && <span style={{ color: "red" }}>{messages.wrongYoutubeUrl}</span>}
                                    </div>
                                }
                            </div>

                            <div className={styles.formContainer__editButtonContainer}>
                                <button className={`${styles.formContainer__button} ${styles['formContainer__button--drinkCreation']}`} type="submit">Edytuj Drinka</button>
                                <Link href={`/przepisy/${drink.slug}`}><a><button className={`${styles.formContainer__button} ${styles['formContainer__button--drinkCreation']} ${styles['formContainer__button--cancel']}`}>Anuluj</button></a></Link>
                            </div>

                        </form>
                    </div>
                </>
            }
        </>
    )
}


