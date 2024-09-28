<script setup lang="ts">
    import { IonSpinner } from '@ionic/vue';
    // Se define los props del componente
    defineProps({
        text: String,
        type: {
            type: String as () => 'button' | 'submit' | 'reset',
            default: 'button'
        },
        loading: Boolean
    });
</script>

<template>
    <button :type="type" :disabled="loading" class="btn">
        <span v-if="!loading">{{ text }}</span>
        <IonSpinner v-else name="crescent" />
    </button>
</template>

<style scoped>
    .btn {
        width: 100%;
        height: 45px;
        background: #fff;
        border: none;
        outline: none;
        border-radius: 40px;
        box-shadow: 0 0 10px rgba(0, 0, 0, .1);
        cursor: pointer;
        font-size: 16px;
        color: #333;
        font-weight: 600;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .btn:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }
</style>
