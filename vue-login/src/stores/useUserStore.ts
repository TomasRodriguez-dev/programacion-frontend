import { defineStore } from 'pinia'

export const useUserStore = defineStore('usuario', {
  // Estado inicial del store
  state: () => ({
    usuario: null as null | { username: string; token: string },
    isLoggedIn: false
  }),

  // Getters para acceder a los datos derivados del estado
  getters: {
    // Ejemplo de un getter para saber si el usuario está autenticado
    getUser(state) {
      return state.usuario
    },
    isAuthenticated: (state) => state.isLoggedIn
  },

  // Acciones para modificar el estado
  actions: {
    // Método para simular un inicio de sesión
    login(username: string) {
      // Simulación de autenticación
      this.usuario = { username, token: 'fake-jwt-token' }
      this.isLoggedIn = true
      return true
    },

    // Método para cerrar sesión
    logout() {
      this.usuario = null
      this.isLoggedIn = false
    }
  }
})
