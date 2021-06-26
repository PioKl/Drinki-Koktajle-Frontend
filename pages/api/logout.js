import cookie from 'cookie';

//Niszczenie ciasteczka

export default async (request, response) => {
    //jeśli żądana metoda to POST wtedy przejdź dalej
    if(request.method === 'POST') {
        //Przejdź dalej i zniszcz ciasteczko, pozbywam sie data.jwt i ustawiam na pusty string
        response.setHeader(
            'Set-Cookie',
            cookie.serialize('token', '', {
                httpOnly: true,
                secure: process.env.NODE_ENV !== 'development',
                expires: new Date(0), //ustawienie daty na coś co już minęło, żeby było od razu zniszczone po kliknięciu wyloguj
                sameSite: 'strict',
                path: '/',
            })
        )
        response.status(200).json({message: "Sukces"})
    }
    //Jeśli jest to inna metoda niż POST
    else {
        response.setHeader('Allow', ['POST'])
        response.status(405).json({message: `Method ${request.method} not allowed`});
    }
}