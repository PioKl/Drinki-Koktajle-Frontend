import {API_URL} from '@/config/index';
import cookie from 'cookie';

export default async (request, response) => {
    //jeśli żądana metoda to POST wtedy przejdź dalej
    if(request.method === 'POST') {
        //identifier i password pochodzą z AuthContext, który "przesyła dane" do api/login
        const {identifier, password} = request.body;

        //fetch tokena ze strapi, czyli zalogowanie użytkownika za pomocą strapi
        //strapi request
        const strapiResponse = await fetch(`${API_URL}/auth/local`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                identifier,
                password
            })
        })
        //po przesłaniu danych do strapi, jest sprawdzane, czy login i hasło jest poprawne z danymi w bazie danych strapi

        const data = await strapiResponse.json()

        //Jeśli dane są prawidłowe to ustaw te dane jako user i te dane, będą odebrane w AuthContext
        if(strapiResponse.ok) {
            //Ustawienie ciasteczka (cookie) po stronie serwera, potrzebne do jwt (json web token), w celu "przetrzymania danych" zalogowanego w ciasteczkach, żeby po odświeżeniu nadal pozostał zalogowany
            response.setHeader(
                'Set-Cookie',
                cookie.serialize('token', data.jwt, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV !== 'development',
                    maxAge: 60*60*24*7, //1 tydzień
                    sameSite: 'strict',
                    path: '/',
                })
            )

            response.status(200).json({user: data.user});
        } //Jeśli zły login, to przekaż błędną wiadomość (np. zły login, hasło)
        else {
            response.status(data.statusCode).json({message: data.message[0].messages[0].message})
        }

        
    } 
    //Jeśli jest to inna metoda niż POST
    else {
        response.setHeader('Allow', ['POST'])
        response.status(405).json({message: `Method ${request.method} not allowed`});
    }
}