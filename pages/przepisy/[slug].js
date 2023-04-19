import { API_URL } from "@/config/index";
import styles from '../../styles/Recipe.module.scss';
import { useState } from "react";


/* export async function getStaticPaths() {
    const res = await fetch(`${API_URL}/drinks`)
    const drinks = await res.json()

    const paths = drinks.map(drink => ({
        params: { slug: drink.slug }
    }));

    return {
        paths,
        fallback: true,
    }
}

//te params ponizej pochodza, z paramsów z getStaticPaths
export async function getStaticProps({ params: { slug } }) {

    const res = await fetch(`${API_URL}/drinks?slug=${slug}`);
    const drinks = await res.json();
    if (!drinks.length) {
        return {
            props: {} //puste propsy, w celu pozbycia się błędu
        }
    }
    else
        return {
            props: {
                drink: drinks[0],
                revalidate: 1,
            }
        }
} */


export async function getServerSideProps({ query: { slug }}) {
    const res = await fetch(`${API_URL}/drinks?slug=${slug}`);
    const drinks = await res.json();
    if (!drinks.length) {
        return {
            props: {} //puste propsy, w celu pozbycia się błędu
        }
    }
    else
        return {
            props: {
                drink: drinks[0],
                //revalidate: 1,
            }
        }
}



export default function DrinkDetails({ drink }) {

    if (!drink) return <div className={styles.wrongRecipe}><h1 className={styles.wrongRecipe__title}>Nie ma takiego drinka</h1></div>

    const { ingredient1, ingredient2, ingredient3, ingredient4, ingredient5, ingredient6, measure1, measure2, measure3, measure4, measure5, measure6 } = drink;
    const ingredientList = [ingredient1, ingredient2, ingredient3, ingredient4, ingredient5, ingredient6,];
    const measureList = [measure1, measure2, measure3, measure4, measure5, measure6];

    const youtubeParser = (url) => {
        let regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
        let match = url.match(regExp);
        return (match && match[7].length == 11) ? match[7] : false;
    }

    const [showDrinkImage, setShowDrinkImage] = useState(true);
    const [showDrinkVideo, setShowDrinkVideo] = useState(false);


    return (
        <>
            <div className={styles.drinkNameContainer}>
                <h1 className={styles.drinkNameContainer__heading}>Drink: {drink.name}</h1>
            </div>

            <div className={styles.recipeContainer}>

                <div id="recipeMediaSection" className={styles.recipeMediaContainer}>
                    {(drink.image && drink.video) &&
                        <div className={styles.recipeMediaContainer__mediaButtons}>
                            <button onClick={() => { setShowDrinkImage(true), setShowDrinkVideo(false) }} className={`${styles.recipeMediaContainer__mediaButton} ${styles['recipeMediaContainer__mediaButton--image']} ${showDrinkImage && styles['recipeMediaContainer__mediaButton--active']}`}>Zdjęcie</button>
                            <button onClick={() => { setShowDrinkImage(false), setShowDrinkVideo(true) }} className={`${styles.recipeMediaContainer__mediaButton} ${styles['recipeMediaContainer__mediaButton--video']} ${showDrinkVideo && styles['recipeMediaContainer__mediaButton--active']}`}>Wideo</button>
                        </div>
                    }

                    {(drink.image && showDrinkImage) && <img className={`${styles.recipeMediaContainer__media} ${styles['recipeMediaContainer__media--img']}
                    ${drink.video ? styles['recipeMediaContainer__media--withVideo'] : styles['recipeMediaContainer__media--onlyImg']}`} src={drink.image.url} alt="Zdjęcie drinka" />}
                    {(drink.video && showDrinkVideo) &&
                        <div className={`${styles.recipeMediaContainer__media} ${styles['recipeMediaContainer__media--iframeContainer']}`}>
                            <iframe className={styles.recipeMediaContainer__iframe} src={`https://www.youtube.com/embed/${youtubeParser(drink.video)}`} target="_parent" allow="fullscreen"></iframe>
                        </div>
                    }
                    {drink.user && <h2 className={styles.recipeMediaContainer__author}>Dodany przez: {drink.user.username}</h2>}
                    {drink.author && <h2 className={styles.recipeMediaContainer__author}>Źródło: {drink.author}</h2>}
                </div>

                <div id="recipeIngrdientsAndInformationSection" className={styles.recipeIngrdientsAndInformationContainer}>

                    <div id="recipeIngredientsSection" className={`${styles.recipeIngredientsContainer} ${(drink.video || drink.description) && styles['recipeIngredientsContainer--shadow']}`}>
                        <h2 className={styles.recipeIngredientsContainer__heading}>Składniki</h2>
                        <div className={styles.recipeIngredientsContainer__ingredientsAndMeasuresLists}>
                            <ul className={`${styles.recipeIngredientsContainer__itemList} ${styles.recipeIngredientsContainer__ingredientsList}`}>
                                {ingredientList.map((ingredient, id) => ingredient ?
                                    <li className={styles.recipeIngredientsContainer__item} key={id}>{ingredient}</li> : null
                                )}
                            </ul>
                            <ul className={`${styles.recipeIngredientsContainer__itemList} ${styles.recipeIngredientsContainer__measuresList}`}>
                                {measureList.map((measure, id) => measure ?
                                    <li className={`${styles.recipeIngredientsContainer__item} ${styles['recipeIngredientsContainer__item--measure']}`} key={id}>{measure}</li> : null
                                )}
                            </ul>
                        </div>
                    </div>

                    {drink.description && <div id="recipeInformationsSection" className={`${styles.recipeInformationsContainer} ${drink.video && styles['recipeInformationsContainer--shadow']}`}>
                        <h2 className={styles.recipeInformationsContainer__heading}>Instrukcje</h2>
                        <p className={styles.recipeInformationsContainer__description}><span className={styles.recipeInformationsContainerr__descriptionTitle}>Jak zrobić:</span> {drink.description}</p>
                    </div>}

                    {drink.user && <div id="recipeAuthorSection" className={styles.recipeAuthor}>
                        <h2 className={styles.recipeAuthor__heading}>Dodany przez: {drink.user.username}</h2>
                        {drink.author && <h2 className={styles.recipeAuthor__heading}>Źródło: {drink.author}</h2>}
                    </div>}

                </div>

                {drink.video &&
                    <div className={styles.recipeVideoContainer}>
                        <h1 className={styles.recipeVideoContainer__heading}>Wideo instruktażowe</h1>
                        <div className={styles.recipeIframeContainer}>
                            {drink.video &&
                                <iframe className={styles.recipeIframeContainer__iframe} src={`https://www.youtube.com/embed/${youtubeParser(drink.video)}`} target="_parent" allow="fullscreen"></iframe>
                            }
                        </div>
                    </div>
                }
            </div>
        </>
    )
}
