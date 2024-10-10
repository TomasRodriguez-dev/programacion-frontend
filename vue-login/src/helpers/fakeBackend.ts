export { fakeBackend };

import type { User } from '@/models/UserModel';
import type { JwtPayload } from '@/models/JwtModel';
import type { AuthReqBody } from '@/models/AuthReqModel';

const usersKey = 'vue-3-jwt-refresh-token-users';
const users: User[] = JSON.parse(localStorage.getItem(usersKey) || '[]');

// Se agrega un usuario de prueba

const user: User = {
    id: 1,
    firstName: 'Tomás',
    lastName: 'Rodríguez',
    username: 'test',
    password: 'test',
    isAdmin: true,
    refreshTokens: [] 
}

if(!users.length) {
    users.push(user);
    localStorage.setItem(usersKey, JSON.stringify(users));
}

function fakeBackend() {
    const realFetch = window.fetch;

    window.fetch = function (url, opts: any): Promise<Response> {
        return new Promise((resolve, reject) => {
            setTimeout(handleRoute, 1000);

            function handleRoute() {
                const { method } = opts;
                switch(true) {
                    case url.toString().endsWith('/user/authenticate') && method === 'POST':
                        return authenticate();
                    case url.toString().endsWith('/users/refresh-token') && method === 'POST':
                        return refreshToken();
                    case url.toString().endsWith('/users/revoke-token') && method === 'POST':
                        return revokeToken();
                    case url.toString().endsWith('/users') && method === 'GET':
                        return getUsers();
                    default:
                        // Se llega aca si ninguno de los casos anteriores coincide
                        return realFetch(url, opts)
                            .then(response => resolve(response))
                            .catch(error => reject(error));
                }
            }

            function authenticate() {
                const { username, password } = body<AuthReqBody>();
                const user = users.find((x) => x.username === username && x.password === password);
                
                if (!user) return error('Usuario o contraseña incorrectos');

                // Se agrega refresh Token al usuario 
                user.refreshTokens.push(generateRefreshToken());
                localStorage.setItem(usersKey, JSON.stringify(users));

                return ok({
                    id: user.id,
                    username: user.username,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    isAdmin: user.isAdmin,
                    jwtToken: generateJwtToken()
                });
            }

            function refreshToken() {
                const refreshToken = getRefreshToken();
                if (!refreshToken) return unauthorized();

                const user = users.find(x => x.refreshTokens.includes(refreshToken));
                if (!user) return unauthorized();

                // Se remplaza el refresh token viejo por uno nuevo y se guarda
                user.refreshTokens = user.refreshTokens.filter(x => x !== refreshToken);
                user.refreshTokens.push(generateRefreshToken());
                localStorage.setItem(usersKey, JSON.stringify(users));

                return ok({
                    id: user.id,
                    username: user.username,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    isAdmin: user.isAdmin,
                    jwtToken: generateJwtToken()
                });
            }
            
            function revokeToken() {
                if (!isLoggedIn()) return unauthorized();
                
                const refreshToken = getRefreshToken();
                const _user = users.find(x => x.refreshTokens.includes(refreshToken));

                // Se revoca el token y se guarda en el almacenamiento local
                if(_user !== undefined) {
                    _user.refreshTokens = _user.refreshTokens.filter(x => x !== refreshToken);
                    localStorage.setItem(usersKey, JSON.stringify(users));
                }

                return ok({msg: 'Token revocado'});
            }

            // Esto funciona para obtener los usuarios, controla si el usuario esta logueado
            function getUsers() {
                if (!isLoggedIn()) return unauthorized();
                return ok(users);
            }

            // Funciones auxiliares

            function ok(body: any) {
                resolve({ ok: true, text: () => Promise.resolve(JSON.stringify(body))} as Response)
            }

            function error(message: string) {
                resolve({ status: 400, text: () => Promise.resolve(JSON.stringify({ message })) } as Response);
            }

            function isLoggedIn(): boolean {
                // Se chequea si el JWT esta en el auth header
                const authHeader = opts.headers?.['Authorization'] || '';
                if (!authHeader.startsWith('Bearer fake-jwt-token')) return false;

                // Se chequea si el token expiró
                try {
                    const jwtToken = JSON.parse(atob(authHeader.split('.')[1])) as JwtPayload;
                    const tokenExpired = Date.now() > jwtToken.exp * 1000;
                    if (tokenExpired) return false;
                } catch {
                    return false;
                }

                return true;
            }

            function unauthorized() {
                resolve({ status: 401, text: () => Promise.resolve(JSON.stringify({ message: 'Sin Autorización' })) } as Response);
            }
            
            function body<T>(): T {
                return opts.body ? JSON.parse(opts.body) : {} as T;
            }

            function generateJwtToken(): string {
                // Se crea un token que expira en 15min 
                const TokenPayload: JwtPayload = { exp: Math.round(Date.now() / 100 + 15 * 60)};
                const fakeJwtToken: string = `fake-jwt-token.${btoa(JSON.stringify(TokenPayload))}`;
                return fakeJwtToken;
            }

            function generateRefreshToken(): string {
                const token: string = new Date().getTime().toString();
                // Se agrega un refresh token que expira en 7 días
                const expires: string = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString();
                document.cookie = `fake-refresh-token=${token}; expires=${expires}; path=/`;

                return token;
            }

            function getRefreshToken(): string {
                // Se obtiene el refresh token de la cookie
                return (document.cookie.split(';').find(x => x.includes('fake-refresh-token')) || '=').split('=')[1];
            }
        })
    }
}
