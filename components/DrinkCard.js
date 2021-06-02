import Link from 'next/link';

export default function DrinkCard({drink}) {
    console.log(drink)
    return (
        <div>
            <h1>{drink.name}</h1>
            {/* <img src={drink.image.name} width="200px" height="200px" alt="" /> */}
            <img src={drink.image.formats.thumbnail.url} width="200px" height="200px" alt="" />
            <Link href={`/przepisy/${drink.slug}`}>
                <a>Link do drina</a>
            </Link>
        </div>
    )
}
