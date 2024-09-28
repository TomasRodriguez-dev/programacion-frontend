<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
</script>

<template>
    <div class="wrapper">
        <div v-if="authStore.isAuthenticated" class="user-info">
            <div class="user-image">
                <img src="./../assets/usuario.jpg" alt="Foto de perfil">
            </div>
            <h1>Bienvenido, {{ authStore.user }}</h1>
        </div>
        <div v-else>
            <h1>Bienvenido a la página de inicio</h1>
            <p>No hay usuario autenticado.</p>
        </div>
    </div>
</template>

<style scoped>
    /* Estilos para el contenedor del formulario */
    .wrapper {
        width: 400px;
        background: transparent;
        border: 2px solid rgba(255, 255, 255, .2);
        backdrop-filter: blur(20px);
        box-shadow: 0 0 10px rgba(0,0,0,.2);
        color: #fff;
        padding: 30px 40px;
        border-radius: 15px;
    }
    h1 {
        color: #fff;
    }

    .user-info {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
    }

    .user-image {
        width: 150px;
        height: 150px;
        border-radius: 50%;
        overflow: hidden;
        margin-bottom: 20px;
    }

    .user-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    h1 {
        margin-top: 0;
    }
</style>
