<script setup lang="ts">
import ButtonComponent from '@/components/ButtonComponent.vue'
import { useAuthStore } from '@/stores/authStore'
import { useSesionStore } from '@/stores/sesionStore'
import { ref } from 'vue'
import { fetchWrapper } from '@/helpers/fetchWrapper'

const authStore = useAuthStore()
const sesionStore = useSesionStore()

// Obtener la información del usuario
const user = authStore.auth.data ? { ...authStore.auth.data } : null

// Crear una referencia para almacenar la lista de usuarios
const users = ref([])

// Variable para controlar el estado del loader
const loading = ref(true)

// Función para obtener la lista de usuarios
async function fetchUsers() {
  users.value = await fetchWrapper.get(
    `${import.meta.env.VITE_API_URL}/users`,
    {},
    { credentials: 'include' }
  )
  loading.value = false
}

// Llamar a la función para obtener los usuarios al montar el componente
fetchUsers()

function logout() {
  authStore.logout()
}
</script>

<template>
  <div class="wrapper">
    <h1 class="titulo">Hola, {{ user?.username }}</h1>
    <div class="line"></div>
    <!-- Informacion del Usuario -->
    <div class="info-user">
      <h3>Información de tu usuario:</h3>
      <p><span>Nombre:</span> {{ user?.firstName }} {{ user?.lastName }}</p>
      <p><span>Rol:</span> {{ user?.isAdmin ? 'Administrador' : 'Usuario' }}</p>
    </div>
    <div class="line"></div>
    <!-- Informacion de la Sesion del Usuario -->
    <div class="info-sesion">
      <h3>Información de sesion:</h3>
      <div class="loader" v-if="sesionStore.loading"></div>
      <p><span>JWT Payload:</span> {{ sesionStore.data?.payload.split('.')[1] }}</p>
      <p><span>JWT Creado a las:</span> {{ sesionStore.data?.createdAt.toLocaleTimeString() }}</p>
      <p><span>JWT Expira a las:</span> {{ sesionStore.data?.expiresAt.toLocaleTimeString() }}</p>
      <p>
        <span>JWT se refrescara a las:</span> {{ sesionStore.data?.refreshAt.toLocaleTimeString() }}
      </p>
    </div>
    <div class="line"></div>
    <!-- Los usuarios que se tienen registrados -->
    <div class="info-users">
      <h3>Lista de usuarios:</h3>
      <div class="loader" v-if="loading"></div>
      <div v-for="user in users" :key="user.id">
        <p>
          <span
            >{{ user.firstName }} {{ user.lastName }} [{{
              user.isAdmin ? 'Administrador' : 'Usuario'
            }}]</span
          >
        </p>
      </div>
      <button v-if="user.isAdmin === true" class="btn-agregar">
        <p><span>+ Agregar Nuevo</span></p>
      </button>
    </div>
    <div class="line"></div>
    <ButtonComponent text="Cerrar Sesion" type="submit" @click="logout" />
  </div>
</template>

<style scoped>
.wrapper {
  width: 420px;
  background: transparent;
  border: 2px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(20px);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  color: #fff;
  padding: 30px;
  border-radius: 15px;
}
.wrapper .titulo {
  font-size: 1.5em;
  font-weight: 500;
}
h3 {
  font-size: 1.1em;
  font-weight: 500;
}
p {
  margin-left: 0.3em;
  font-size: 0.9em;
  font-weight: 100;
}
span {
  font-size: 1em;
  font-weight: 400;
}
.line {
  height: 1.2px;
  background-color: rgba(255, 255, 255, 0.2);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  border-radius: 5px;
  margin: 6px 0 10px 0;
}
.btn-agregar {
  background: none;
  border: 2px solid #fff;
  color: #fff;
  border-radius: 16px;
  width: 9em;
  cursor: pointer;
  transition:
    background 0.3s,
    border-color 0.3s,
    color 0.3s;
}
.btn-agregar:hover {
  background-color: #fff;
  border: none;
  color: #333;
}
.btn-agregar:active {
  transform: scale(0.95);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  transition:
    transform 0.1s,
    box-shadow 0.1s;
}
.info-sesion {
  position: relative;
}
.info-users {
  position: relative;
}
.loader {
  position: absolute;
  top: 0;
  right: 0;
  margin: 8px;
  width: 24px;
  height: 24px;
  border: 4px solid #fff;
  border-bottom-color: transparent;
  border-radius: 50%;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
}
@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
