<script setup lang="ts">
    // Se define los props del componente
    defineProps({
        text: String,
        type: {
            type: String as () => 'button' | 'submit' | 'reset',
            default: 'button'
        },
        isSubmitting: Boolean
    });
</script>

<template>
    <button :type="type" class="btn">
        <span v-show="isSubmitting" class="loader"></span>
        <p v-show="!isSubmitting">{{ text }}</p>
    </button>
</template>

<style scoped>
    .btn {
        width: 100%;
        height: 50px;
        border-radius: 15px;
        border: none;
        outline: none;
        box-shadow: 0 0 10px rgba(0, 0, 0, .1);
        cursor: pointer;
        font-size: 1.2em;
        font-weight: 600;
        color: #333;
    }
    .btn p {
        font-size: 1em;
        font-weight: 600;
        color: #333; 
    }
    .loader {
        margin: auto 0;
        width: 24px;
        height: 24px;
        border: 4px solid purple;
        border-bottom-color: transparent;
        border-radius: 50%;
        display: inline-block;
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
