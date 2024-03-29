import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { API_URL } from '@/config/index';
import { parseCookies } from '@/helpers/index';
import styles from '../../styles/Forms.module.scss';

//Pobranie wymaganego tokena
export async function getServerSideProps({ req }) {
    const { token } = parseCookies(req)

    return {
        props: {
            token: token || null
        }
    }
}


export default function AddDrink({ token }) {

    const router = useRouter();

    //State dodany w celu włączenia i wyłączenia loadera przy dodawaniu
    const [addEditLoader, setAddEditLoader] = useState(false);

    //Jeśli użytkownik nie jest zalogowany to przekierwoanie na stronę logowania
    useEffect(() => {
        if (token === null) {
            router.push("/konto/zaloguj");
        }
    }, []);

    const toastYoutubeError = "toast-youtube-error";
    const toastYoutubeSuccess = "toast-youtube-success";

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

    const ToastYoutubeSuccess = () => {
        toast.success("Adres Youtube jest prawidłowy", {
            toastId: toastYoutubeSuccess
        });
    }

    const [values, setValues] = useState({
        name: '',
        description: '',
        author: '',
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
        video: '',
    })

    const [image, setImage] = useState({ preview: null, file: null });

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
        image: false,
    });
    let valuesEmpty = {
        nameEmpty: false,
        ingredientsOneAndTwoEmpty: false,
        ingredientsAndMeasuresEmpty1: false,
        ingredientsAndMeasuresEmpty2: false,
        ingredientsAndMeasuresEmpty3: false,
        ingredientsAndMeasuresEmpty4: false,
        ingredientsAndMeasuresEmpty5: false,
        ingredientsAndMeasuresEmpty6: false,
        imageEmpty: false,
    }
    const messages = {
        name_empty: 'Drink musi mieć nazwę',
        ingredientsOneAndTwo_empty: ' Drink musi mieć składnik nr 1 i składnik nr 2.',
        ingredientOrMeasure_empty: 'Składnik musi mieć nazwę i ilość.',
        image_empty: 'Musisz dodać zdjęcie drinka',
        wrongYoutubeUrl: 'Nieprawidłowy adres url'
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

    const handleFileChange = (e) => {
        setImage({
            preview: URL.createObjectURL(e.target.files[0]),
            file: e.target.files[0]
        });
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

        if (image.file === null) {
            valuesEmpty.imageEmpty = true;
            setErrors(prev => ({
                ...prev,
                image: messages.image_empty,
            }));
            toast.error("Drink lub koktajl musi mieć zdjęcie!")
        }
        else if (image.file !== null) {
            valuesEmpty.imageEmpty = false;
            setErrors(prev => ({
                ...prev,
                image: false,
            }));
        }

        for (let i = 1; i <= Object.keys(valuesEmpty).length - 3; i++) {
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
        if (!valuesEmpty.nameEmpty && !valuesEmpty.ingredientsOneAndTwoEmpty && !valuesEmpty.ingredientsAndMeasuresEmpty1 && !valuesEmpty.ingredientsAndMeasuresEmpty2 && !valuesEmpty.ingredientsAndMeasuresEmpty3 && !valuesEmpty.ingredientsAndMeasuresEmpty4 && !valuesEmpty.ingredientsAndMeasuresEmpty5 && !valuesEmpty.ingredientsAndMeasuresEmpty6 && !valuesEmpty.imageEmpty && !wrongYoutubeUrl) {
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
            setAddEditLoader(true);

            //Dodanie wartości i zdjęcia do bazy danych
            const formData = new FormData();
            formData.append('data', JSON.stringify(values));
            formData.append('files.image', image.file);

            const res = await fetch(`${API_URL}/drinks`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData,
            });

            if (!res.ok) {
                setAddEditLoader(false);
                if (res.status === 403 || res.status === 401) {
                    toast.error(
                        <div>
                            Brak autoryzacji <br /><br />
                            Musisz być zalogowany aby dodać drinka
                        </div>
                    )
                    return
                }
                toast.error(<div>
                    Coś poszło nie tak :( <br /><br />
                    Wprowadzona nazwa drinka może być już zajęta  <br /><br />
                    Zdjęcie może mieć nieprawidłowy format
                </div>
                )
            }
            else {
                const drink = await res.json()
                setValues({
                    name: '',
                    description: '',
                    author: '',
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
                    video: '',
                });
                setImage({ preview: null, file: null })
                router.push(`/przepisy/${drink.slug}`)
            }
        } else
            return
    }

    return (
        <>
            {token !== null &&
                <>
                    <ToastContainer />
                    <div className={`${styles.formContainer}  ${styles['formContainer--drinkCreation']}`}>
                        <h1 className={styles.formContainer__heading}>Dodaj drinka</h1>
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
                                {image.preview !== null ?
                                    <div className={styles.formContainer__imgPreview}>
                                        <img src={image.preview} width="200px" height="200px" alt="Zdjęcie drinka" />
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

                                {values.video !== "" &&
                                    <div className={styles.formContainer__iframe}>
                                        <iframe src={`https://www.youtube.com/embed/${youtubeParser(values.video)}`} width="500" height="500" target="_parent"></iframe>
                                        {errors.wrongYoutubeUrl && <span style={{ color: "red" }}>{messages.wrongYoutubeUrl}</span>}
                                    </div>
                                }
                            </div>
                            <div className={`${styles.formContainer__buttonContainer} ${styles['formContainer__buttonContainer--drinkCreation']}`}>
                                <button className={`${styles.formContainer__button}`} type="submit">Dodaj Drinka</button>
                                {addEditLoader && <div className={styles.formContainer__buttonLoader}></div>}
                            </div>

                        </form>
                    </div>
                </>
            }
        </>
    )
}
