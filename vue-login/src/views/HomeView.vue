<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
</script>

<template>
    <div>
        <h1>Bienvenido a la página de inicio</h1>
        <div v-if="authStore.isAuthenticated">
            <h2>Datos del usuario:</h2>
            <p>Nombre de usuario: {{ authStore.user }}</p>
        </div>
        <div v-else>
            <p>No hay usuario autenticado.</p>
        </div>
    </div>
</template>

<style scoped>
    h1, h2, p {
        color: #fff;
    }
</style>
