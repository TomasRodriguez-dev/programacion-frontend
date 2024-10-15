<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'
import InputComponent from '@/components/InputComponent.vue'
import ButtonComponent from '@/components/ButtonComponent.vue'
import { Form, Field } from 'vee-validate'
import * as Yup from 'yup'

const authStore = useAuthStore()
const router = useRouter()

const schema = Yup.object().shape({
  username: Yup.string().required('Usuario Requerido'),
  password: Yup.string().required('Password es Requerido')
})

if (authStore.auth.data) {
  router.push('/')
}

function handleSubmit(values: any, { setErrors }: any) {
  const { username, password } = values
  return authStore
    .login(username, password)
    .then(() => {
      router.push('/')
    })
    .catch((error) => setErrors({ apiError: error }))
}
</script>

<template>
  <div class="wrapper">
    <Form @submit="handleSubmit" :validation-schema="schema" v-slot="{ errors, isSubmitting }">
      <h1>Login</h1>
      <!-- Input para el usuario -->
      <Field name="username" v-slot="{ field }">
        <InputComponent
          v-bind="field"
          type="text"
          placeholder="Usuario"
          :required="true"
          iconName="person-circle"
          :errorMessage="errors.username"
          :api-error="errors.apiError"
        />
      </Field>
      <!-- Input para la contraseña -->
      <Field name="password" v-slot="{ field }">
        <InputComponent
          v-bind="field"
          type="password"
          placeholder="Contraseña"
          :required="true"
          iconName="lock-closed"
          :errorMessage="errors.password"
          :api-error="errors.apiError"
        />
      </Field>
      <!-- Div para el checkbox de recordar contraseña y el enlace de olvidaste tu contraseña -->
      <div class="remember-forgot">
        <label>
          <input type="checkbox" name="remember" />
          Recordarme
        </label>
        <a href="#">Olvidaste tu contraseña</a>
      </div>
      <ButtonComponent text="Ingresar" type="submit" :isSubmitting="isSubmitting" />
      <div v-if="errors.apiError" class="error-alert">{{ errors.apiError }}</div>
    </Form>
  </div>
</template>

<style scoped>
/* Estilos para el contenedor del formulario */
.wrapper {
  width: 400px;
  background: transparent;
  border: 2px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(20px);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
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
.error-alert {
  margin: 16px 0 0 0;
  width: 100%;
  background: transparent;
  color: red;
  text-align: center;
  font-weight: 400;
}
</style>
