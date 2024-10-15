<script setup lang="ts">
import { ref, watch } from 'vue'
import { IonIcon } from '@ionic/vue'
import { personCircle, lockClosed } from 'ionicons/icons'

// Se define los props del componente
const props = defineProps({
  name: String,
  type: String,
  placeholder: String,
  required: Boolean,
  iconName: String,
  modelValue: String,
  errorMessage: String,
  apiError: String
})

// Se define los emit del componente para los inputs
const emit = defineEmits(['blur', 'update:modelValue']) // Cambia 'input' a 'update:modelValue'

const inputValue = ref(props.modelValue) // Inicializa con el valor del prop

// Se define la función para obtener el icono del input
const getIcon = (iconName: string | undefined): string => {
  if (!iconName) return ''
  switch (iconName) {
    case 'person-circle':
      return personCircle
    case 'lock-closed':
      return lockClosed
    default:
      return ''
  }
}

// Se define la función para manejar el evento de blur del input
const onBlur = () => {
  emit('blur', { name: props.name, value: inputValue.value })
}

// Observa los cambios en inputValue y emite el nuevo valor
watch(inputValue, (newValue) => {
  emit('update:modelValue', newValue)
})
</script>
<template>
  <div class="input-bx">
    <input
      :name="name"
      :type="type"
      :placeholder="placeholder"
      :required="required"
      v-model="inputValue"
      :class="{ 'is-invalid': errorMessage || apiError }"
      @blur="onBlur"
    />
    <IonIcon class="icon" :icon="getIcon(iconName)" />
    <div v-if="errorMessage" class="invalid-feedback">{{ errorMessage }}</div>
  </div>
</template>
<style scoped>
.input-bx {
  position: relative;
  width: 100%;
  height: 50px;
  margin: 30px 0;
}
.input-bx input {
  width: 100%;
  height: 100%;
  background: transparent;
  border: none;
  outline: none;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  color: #fff;
  padding: 20px 45px 20px 20px;
}
.input-bx input.is-invalid {
  width: 100%;
  height: 100%;
  background: rgba(250, 150, 150, 0.1);
  border: 2px solid rgba(255, 0, 0, 0.2);
  color: red;
}
.input-bx input::placeholder {
  color: #fff;
}
.input-bx input.is-invalid::placeholder {
  color: red;
}
.input-bx .icon {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.5em;
}
.input-bx .invalid-feedback {
  padding: 0px 16px;
  margin: 0;
  color: red;
  font-weight: 300;
}
</style>
