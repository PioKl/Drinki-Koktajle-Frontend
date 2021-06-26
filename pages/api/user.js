import {API_URL} from '@/config/index';
import cookie from 'cookie';

//Przetrzymanie zalogowanego użytkownika

export default async (request, response) => {
    //jeśli żądana metoda to GET wtedy przejdź dalej
    if(request.method === 'GET') {
        //Jeśli ciasteczko nie istnieje
        if(!request.headers.cookie) {
            response.status(403).json({message: 'Nieautoryzowany'})
            return
        }

        //Jeśli istnieje
        //destrukturyzacja ciasteczka w celu otrzymania odpowiedniego tokena
        const {token} = cookie.parse(request.headers.cookie);

        //Tutaj nastąpi przekazanie cookie tokena do strapi, a w zasadzie sprawdzenie, czy token się zgadza
        //users/me jest to route wymagany przez strapi, jeśli chodzi o autoryzację
        const strapiResponse = await fetch (`${API_URL}/users/me`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        const user = await strapiResponse.json() //użytkownik pobrany ze strapi

        //Jeśli wszystko w porządku token zgodny to przekaż użytkownika dalej, gdzie AuthContext będzie mógł go wykorzystać
        if(strapiResponse.ok) {
            response.status(200).json({user})
        } 
        //Jeśli nie to przekaż błędną wiadomość
        else {
            response.status(403).json({message: 'User forbidden'})
        }

    }
    //Jeśli jest to inna metoda niż GET
    else {
        response.setHeader('Allow', ['GET'])
        response.status(405).json({message: `Method ${request.method} not allowed`});
    }
}