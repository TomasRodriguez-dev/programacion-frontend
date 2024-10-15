import { defineStore } from 'pinia'
import type { SesionState } from '@/models/SesionStateModel'

export const useSesionStore = defineStore('sesion', {
  state: (): SesionState => ({
    loading: false,
    data: JSON.parse(localStorage.getItem('sesionData') || 'null') // Recuperar la sesión desde localStorage al cargar
  }),

  actions: {
    update(payload?: string) {
      if (!payload) {
        console.error('Payload no puede ser undefined')
        return
      }

      const now = new Date()
      const expiresAt = new Date(now.getTime() + 2 * 60 * 1000) // 2 minutos de expiración
      // const refreshAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) // Refrescar en 7 días
      const refreshAt = new Date(now.getTime() + 1 * 60 * 1000) // Refrescar en 1 minuto para saber si funciona correctamente

      this.data = {
        payload,
        createdAt: now,
        expiresAt,
        refreshAt
      }

      // Guardar los datos de sesión en localStorage para que al momento de actualizar la pagina no se pierdan los datos
      localStorage.setItem('sesionData', JSON.stringify(this.data))
    },

    clear() {
      this.data = null
      // Eliminar los datos de sesión de localStorage
      localStorage.removeItem('sesionData')
    },

    refreshSession(newToken?: string) {
      if (!this.data) {
        console.error('No hay datos de sesión para refrescar')
        return
      }

      this.loading = true // Se da inicio a el loader

      const now = new Date()
      const newExpiresAt = new Date(now.getTime() + 2 * 60 * 1000) // Expira en 2 minutos
      // const newRefreshAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) // Refrescar en 7 días
      const newRefreshAt = new Date(now.getTime() + 1 * 60 * 1000) // Refrescar en 1 minuto para saber si funciona correctamente

      this.data = {
        ...this.data,
        payload: newToken || this.data.payload,
        createdAt: now,
        expiresAt: newExpiresAt,
        refreshAt: newRefreshAt
      }

      // Actualizar los datos de sesión en localStorage
      localStorage.setItem('sesionData', JSON.stringify(this.data))

      setTimeout(() => {
        this.loading = false // Se Detiene el loader después de la actualización
      }, 500) // Se simula un pequeño delay de proceso ya que como es local vamos a tener los datos al instante
    }
  }
})
