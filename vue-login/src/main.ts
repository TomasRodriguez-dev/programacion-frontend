import './assets/global.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { IonicVue } from '@ionic/vue'
import { useAuthStore } from './stores/authStore'
import { fakeBackend } from './helpers/fakebackend'

import App from './App.vue'
import router from './router'

fakeBackend()
startApp()

async function startApp() {
  const app = createApp(App)
  const pinia = createPinia()

  app.use(pinia)
  app.use(router)
  app.use(IonicVue)

  try {
    const authStore = useAuthStore()
    await authStore.refreshToken()
  } catch (error) {
    console.warn('No hay datos de autenticacion para el usuario')
    console.info('Rederigiendo a login page')
    router.push('/login')
  }

  app.mount('#app')
}
