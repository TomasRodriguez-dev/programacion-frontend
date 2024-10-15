export { fakeBackend }

import type { User } from '@/models/UserModel'
import type { JwtPayload } from '@/models/JwtModel'
import type { AuthRequestBody } from '@/models/AuthReqModel'
import { useSesionStore } from '@/stores/sesionStore'

// Array de usuarios en localstorage
const usersKey = 'vue-3-jwt-refresh-token-users'
const users: User[] = JSON.parse(localStorage.getItem(usersKey) || '[]')

// Agregar un usuario test en localstorage si no hay ninguno
const testUsers: User[] = [
  {
    id: 1,
    firstName: 'Tomás',
    lastName: 'Rodriguez',
    username: 'test',
    password: 'test',
    isAdmin: true,
    refreshTokens: []
  },
  {
    id: 2,
    firstName: 'Usuario',
    lastName: 'Prueba',
    username: 'tester',
    password: 'tester',
    isAdmin: false,
    refreshTokens: []
  }
]

// si no hay usuarios creamos uno y lo guardamos en almacenamiento local
if (!users.length) {
  users.push(...testUsers)
  localStorage.setItem(usersKey, JSON.stringify(users))
}

function fakeBackend() {
  const realFetch = window.fetch

  window.fetch = function (url, opts: any): Promise<Response> {
    return new Promise((resolve, reject) => {
      setTimeout(handleRoute, 1000)

      function handleRoute() {
        const { method } = opts
        switch (true) {
          case url.toString().endsWith('/users/authenticate') && method === 'POST':
            return authenticate()
          case url.toString().endsWith('/users/refresh-token') && method === 'POST':
            return refreshToken()
          case url.toString().endsWith('/users/revoke-token') && method === 'POST':
            return revokeToken()
          case url.toString().endsWith('/users') && method === 'GET':
            return getUsers()
          default:
            return realFetch(url, opts)
              .then((response) => resolve(response))
              .catch((error) => reject(error))
        }
      }

      // Funciones de rutas

      function authenticate() {
        const { username, password } = body<AuthRequestBody>()
        const user = users.find((x) => x.username === username && x.password === password)

        if (!user) return error('Usuario o contraseña incorrectos')

        const sesionStore = useSesionStore()
        const refreshToken = generateRefreshToken()
        user.refreshTokens.push(refreshToken)
        localStorage.setItem(usersKey, JSON.stringify(users))
        const jwtToken = generateJwtToken()
        sesionStore.update(jwtToken)

        return ok({
          id: user.id,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          isAdmin: user.isAdmin,
          jwtToken
        })
      }

      function refreshToken() {
        const refreshToken = getRefreshToken()
        if (!refreshToken) return unauthorized()

        const user = users.find((x) => x.refreshTokens.includes(refreshToken))
        if (!user) return unauthorized()

        // Actualizamos el refresh token en el array de refreshTokens del usuario
        user.refreshTokens = user.refreshTokens.filter((x) => x !== refreshToken)
        user.refreshTokens.push(generateRefreshToken())
        localStorage.setItem(usersKey, JSON.stringify(users))

        // Generamos un nuevo JWT token
        const newJwtToken = generateJwtToken()

        // Actualizamos el estado de sesión
        const sesionStore = useSesionStore()
        sesionStore.refreshSession(newJwtToken) // Pasamos el nuevo token al método

        return ok({
          id: user.id,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          isAdmin: user.isAdmin,
          jwtToken: newJwtToken
        })
      }

      function revokeToken() {
        if (!isLoggedIn()) return unauthorized()

        const refreshToken = getRefreshToken()
        const _user = users.find((x) => x.refreshTokens.includes(refreshToken))

        if (_user !== undefined) {
          _user.refreshTokens = _user.refreshTokens.filter((x) => x !== refreshToken)
          localStorage.setItem(usersKey, JSON.stringify(users))
        }

        return ok({ msg: 'Token revocado' })
      }

      function getUsers() {
        if (!isLoggedIn()) return unauthorized()
        return ok(users)
      }

      // Funciones Auxiliares

      function ok(body: any) {
        resolve({ ok: true, text: () => Promise.resolve(JSON.stringify(body)) } as Response)
      }

      function unauthorized() {
        resolve({
          status: 401,
          text: () => Promise.resolve(JSON.stringify({ message: 'Unauthorized' }))
        } as Response)
      }

      function error(message: string) {
        resolve({
          status: 400,
          text: () => Promise.resolve(JSON.stringify({ message }))
        } as Response)
      }

      function isLoggedIn(): boolean {
        const authHeader = opts.headers?.['Authorization'] || ''
        if (!authHeader.startsWith('Bearer fake-jwt-token')) return false

        try {
          const jwtToken = JSON.parse(atob(authHeader.split('.')[1])) as JwtPayload
          const tokenExpired = Date.now() > jwtToken.exp * 1000
          if (tokenExpired) return false
        } catch {
          return false
        }

        return true
      }

      function body<T>(): T {
        return opts.body ? JSON.parse(opts.body) : ({} as T)
      }

      function generateJwtToken(): string {
        // Crea token que expira en 2 minutos
        const tokenPayload: JwtPayload = { exp: Math.round(Date.now() / 1000 + 2 * 60) }
        const fakeJwtToken: string = `fake-jwt-token.${btoa(JSON.stringify(tokenPayload))}`
        return fakeJwtToken
      }

      function generateRefreshToken(): string {
        const token = new Date().getTime().toString()
        // Agregar un refresh token que expira en 7 dias
        const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString()
        document.cookie = `fakeRefreshToken=${token}; expires=${expires}; path=/`

        return token
      }

      function getRefreshToken(): string {
        // Obtener el refresh token de la cookie
        return (
          document.cookie.split(';').find((x) => x.includes('fakeRefreshToken')) || '='
        ).split('=')[1]
      }
    })
  }
}
