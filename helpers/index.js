import cookie from 'cookie'

//Funkcja, której zadaniem jest parsowanie ciasteczek
export function parseCookies(req) {
    return cookie.parse(req ? req.headers.cookie || '' : '');
}