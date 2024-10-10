<script setup lang="ts">
    import { ref } from 'vue';
    import { useRouter } from 'vue-router';
    import  { useAuthStore } from '../../stores/auth';
    import InputComponent from '@/components/InputComponent.vue';
    import ButtonComponent from '@/components/ButtonComponent.vue';
    import type { User } from '@/models/UserModel';

    const router = useRouter();
    const authStore = useAuthStore();
    
    // Referencias
    const formRef = ref<HTMLFormElement | null>(null);
    // Estado del formulario
    const user = ref<User>({
        username: '',
        password: '',
        remember: false,
    });
    // Estado del boton de carga
    const loading = ref(false);
    // Funcion para resetear el formulario
    const resetForm = () => {
        user.value = {
            username: '',
            password: '',
            remember: false
        };
    };
    // Funcion para manejar el envio del formulario
    const handleSubmit = async (e: Event) => {
        e.preventDefault();
        // Verifica si el formulario es valido
        if (formRef.value?.checkValidity()) {
            loading.value = true;
            try {
                const datosIngresados: Partial<User> = {
                    username: user.value.username || 'admin',
                    password: user.value.password || '123',
                    remember: user.value.remember || undefined
                };

                console.log(datosIngresados);
                console.log('Usuario:', user.value.username, 'Contraseña:', user.value.password, 'Recordarme:', user.value.remember);                
                const success = await authStore.login(user.value.username, user.value.password);
                if (success) {
                    console.log('Inicio de sesión exitoso');
                    router.push({ name: 'home' });
                } else {
                    console.error('Error de inicio de sesión');
                }
            } catch (error) {
                console.error('Error durante el inicio de sesión:', error);
            } finally {
                resetForm();
                loading.value = false;
            }
        } else {
            // Muestra un mensaje de error si el formulario no es valido
            formRef.value?.reportValidity();
        }
    }
    // Funcion para manejar el input del formulario
    const handleInput = (e: Event, field: keyof User) => {
        // Obtiene el target del evento
        const target = e.target as HTMLInputElement;
        // Verifica si el campo es de tipo "remember"
        if (field === 'remember') {
            // Asigna el valor del checkbox
            user.value.remember = target.checked;
        } else {
            user.value[field] = target.value;
        }
    }
</script>

<template>
    <div class="wrapper">
        <form ref="formRef" @submit="handleSubmit" novalidate>
            <h1>Login</h1>
            <!-- Input para el usuario -->
            <InputComponent 
                name="user"
                type="text"
                placeholder="Usuario"
                :required="true"
                iconName="person-circle"
                :value="user.username"
                @input="(e) => handleInput(e, 'username')"
            />
            <!-- Input para la contraseña -->
            <InputComponent 
                name="password"
                type="password"
                placeholder="Contraseña"
                :required="true"
                iconName="lock-closed"
                :value="user.password"
                @input="(e) => handleInput(e, 'password')"
            />
            <!-- Div para el checkbox de recordar contraseña y el enlace de olvidaste tu contraseña -->
            <div class="remember-forgot">
                <label>
                    <input 
                        type="checkbox" 
                        name="remember"
                        :checked="user.remember"
                        @input="(e) => handleInput(e, 'remember')"
                    > 
                    Recordarme
                </label>
                <a href="#">Olvidaste tu contraseña</a>
            </div>
            <ButtonComponent text="Ingresar" type="submit" :loading="loading" />
        </form>
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
    /* Estilos para el titulo del formulario */
    .wrapper h1 {
        font-size: 3em;
        text-align: center;
    }
    /* Estilos para el div del checkbox de recordar contraseña y el enlace de olvidaste tu contraseña */
    .wrapper .remember-forgot {
        display: flex;
        justify-content: space-between;
        font-size: 1.2em;
        margin: -15px 0 15px;
    }
    .wrapper .remember-forgot label input {
        accent-color: #fff;
        margin-right: 3px;
    }
    .wrapper .remember-forgot a {
        color: #fff;
        text-decoration: none;
    }
    .wrapper .remember-forgot a:hover {
        text-decoration: underline;
    }
</style>