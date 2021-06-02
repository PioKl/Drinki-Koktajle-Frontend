import { API_URL } from "@/config/index";
import DrinkCard from "@/components/DrinkCard";


export async function getStaticProps() {
  const res = await fetch(`${API_URL}/drinks`);
  const drinks = await res.json()

  return {
    props: { drinks },
    revalidate: 1,
  }
}

export default function Home({ drinks }) {

  return (
    <div>
      <h1>Main Page</h1>
      {drinks.length === 0 && <h1>Nie ma drinków</h1>}
      {drinks.map(drink => (
        <DrinkCard key={drink.id} drink={drink} />
      ))}
    </div>
  )
}



/* export async function getServerSideProps() {
  const res = await fetch(`${API_URL}/api/drinks`);
  const drinks = await res.json()

  return {
    props: { drinks },
  }
}
 */