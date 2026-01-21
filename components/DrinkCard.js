import Link from "next/link";
import styles from "../styles/DrinkCard.module.scss";
import Image from "next/image";
import { useState } from "react";

export default function DrinkCard({ drink }) {
  const [loaded, setLoaded] = useState(false); // jeśli obrazek się załadował to zostanie usunięta animacja kropek

  return (
    <div className={styles.drinkContainer}>
      {drink.image && (
        <Link href={`/przepisy/${drink.slug}`}>
          <div className={styles.drinkContainer__imageContainer}>
            <Image
              onLoad={() => setLoaded(true)}
              loading="lazy"
              width="100%"
              height="100%"
              unoptimized
              layout="responsive"
              objectFit="fill"
              className={styles.drinkContainer__image}
              src={drink.image.url}
              placeholder="blur"
              alt="Zdjęcie drinka"
            />

            {!loaded && (
              <div className={styles.drinkContainer__loader}>
                <span></span>
                <span></span>
                <span></span>
              </div>
            )}

            <div className={styles.drinkContainer__detailsContainer}>
              <ul className={styles.drinkContainer__detailsItemList}>
                <li className={styles.drinkContainer__detailsItem}>
                  Lista składników:
                </li>
                {drink.ingredient1 && (
                  <ul
                    className={
                      styles.drinkContainer__detailsIngredientsAndMeasuresList
                    }
                  >
                    <li
                      className={`${drink.measure1 ? styles.drinkContainer__detailsIngredientItem : styles.drinkContainer__detailsIngredientWithoutMeasure}`}
                    >
                      {drink.ingredient1}
                    </li>
                    {drink.measure1 && (
                      <li className={styles.drinkContainer__detailsMeasureItem}>
                        {drink.measure1}
                      </li>
                    )}
                  </ul>
                )}
                {drink.ingredient2 && (
                  <ul
                    className={
                      styles.drinkContainer__detailsIngredientsAndMeasuresList
                    }
                  >
                    <li
                      className={`${drink.measure2 ? styles.drinkContainer__detailsIngredientItem : styles.drinkContainer__detailsIngredientWithoutMeasure}`}
                    >
                      {drink.ingredient2}
                    </li>
                    {drink.measure2 && (
                      <li className={styles.drinkContainer__detailsMeasureItem}>
                        {drink.measure2}
                      </li>
                    )}
                  </ul>
                )}
                {drink.ingredient3 && (
                  <ul
                    className={
                      styles.drinkContainer__detailsIngredientsAndMeasuresList
                    }
                  >
                    <li
                      className={`${drink.measure3 ? styles.drinkContainer__detailsIngredientItem : styles.drinkContainer__detailsIngredientWithoutMeasure}`}
                    >
                      {drink.ingredient3}
                    </li>
                    {drink.measure3 && (
                      <li className={styles.drinkContainer__detailsMeasureItem}>
                        {drink.measure3}
                      </li>
                    )}
                  </ul>
                )}
                {drink.ingredient4 && (
                  <ul
                    className={
                      styles.drinkContainer__detailsIngredientsAndMeasuresList
                    }
                  >
                    <li
                      className={`${drink.measure4 ? styles.drinkContainer__detailsIngredientItem : styles.drinkContainer__detailsIngredientWithoutMeasure}`}
                    >
                      {drink.ingredient4}
                    </li>
                    {drink.measure4 && (
                      <li className={styles.drinkContainer__detailsMeasureItem}>
                        {drink.measure4}
                      </li>
                    )}
                  </ul>
                )}
                {drink.ingredient5 && (
                  <ul
                    className={
                      styles.drinkContainer__detailsIngredientsAndMeasuresList
                    }
                  >
                    <li
                      className={`${drink.measure5 ? styles.drinkContainer__detailsIngredientItem : styles.drinkContainer__detailsIngredientWithoutMeasure}`}
                    >
                      {drink.ingredient5}
                    </li>
                    {drink.measure5 && (
                      <li className={styles.drinkContainer__detailsMeasureItem}>
                        {drink.measure5}
                      </li>
                    )}
                  </ul>
                )}
                {drink.ingredient6 && (
                  <ul
                    className={
                      styles.drinkContainer__detailsIngredientsAndMeasuresList
                    }
                  >
                    <li
                      className={`${drink.measure6 ? styles.drinkContainer__detailsIngredientItem : styles.drinkContainer__detailsIngredientWithoutMeasure}`}
                    >
                      {drink.ingredient6}
                    </li>
                    {drink.measure6 && (
                      <li className={styles.drinkContainer__detailsMeasureItem}>
                        {drink.measure6}
                      </li>
                    )}
                  </ul>
                )}
              </ul>
              {drink.user && (
                <li className={styles.drinkContainer__detailsAuthor}>
                  {" "}
                  Dodany przez: {drink.user.username}
                </li>
              )}
            </div>
          </div>
        </Link>
      )}
      <h2 className={styles.drinkContainer__name}>{drink.name}</h2>
    </div>
  );
}
