import {API_URL} from "@/config/index";


export async function getStaticPaths(){
    const res = await fetch(`${API_URL}/drinks`)
    const drinks = await res.json()

    const paths = drinks.map(drink => ({
        params: {slug: drink.slug}
    }));

    return {
        paths,
        fallback: true,
    }
}

//te params ponizej pochodza, z paramsów z getStaticPaths
export async function getStaticProps({params: {slug}}) {

    const res = await fetch (`${API_URL}/drinks?slug=${slug}`);
    const drinks = await res.json();
    return {
        props:{
            drink: drinks[0],
            revalidate: 1,
        }
    }
} 



export default function DrinkDetails({drink}) {
    return (
        <div>
            <h1>{drink.name}</h1>
            <img src={drink.image.formats.thumbnail.url} width="200px" height="200px" alt="" />
        </div>
    )
}



/* export async function getServerSideProps({query: {slug}}) {

    const res = await fetch (`${API_URL}/api/przepisy/${slug}`)
    const drinks = await res.json
    return {
        props:{
            drink: drinks[0]
        }
    }
} */