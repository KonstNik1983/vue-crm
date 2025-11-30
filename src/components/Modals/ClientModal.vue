<template>
  <div
    v-if="open"
    class="modal-overlay"
    @click.self="closeModal"
  >
    <div class="modal">
      <h2 class="modal-title">{{ isEdit ? 'Редактировать клиента' : 'Добавить клиента' }}</h2>

      <form @submit.prevent="submitForm">
        <div class="form-group">
          <label for="name">Имя:</label>
          <input
            type="text"
            id="name"
            v-model.trim="localForm.name"
            :class="{ error: errors.name }"
            @input="validateName"
          />
          <span
            v-if="errors.name"
            class="error-text"
          >
            {{ errors.name }}
          </span>
        </div>
        <div class="form-group">
          <label for="company">Компания:</label>
          <input
            type="text"
            id="company"
            v-model.trim="localForm.company"
            :class="{ error: errors.company }"
            @input="validateCompany"
          />
          <span
            v-if="errors.company"
            class="error-text"
          >
            {{ errors.company }}
          </span>
        </div>
        <div class="form-group">
          <label for="phone">Телефон:</label>
          <input
            type="text"
            id="phone"
            v-model="localForm.phone"
            :class="{ error: errors.phone }"
            @input="validatePhone"
          />
          <span
            v-if="errors.phone"
            class="error-text"
          >
            {{ errors.phone }}
          </span>
        </div>
        <div class="actions">
          <button
            type="submit"
            class="btn btn--primary"
          >
            Сохранить
          </button>
          <button
            type="button"
            class="btn btn--secondary"
            @click="closeModal"
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
  import { reactive, watch } from 'vue'

  const props = defineProps({
    open: Boolean,
    isEdit: Boolean,
    clientData: Object
  })

  const emit = defineEmits(['close', 'save'])

  const localForm = reactive({
    name: '',
    company: '',
    phone: ''
  })

  const errors = reactive({
    name: '',
    company: '',
    phone: ''
  })

  watch(
    () => props.open,
    (val) => {
      if (val) {
        if (props.isEdit && props.clientData) {
          localForm.name = props.clientData.name
          localForm.company = props.clientData.company
          localForm.phone = props.clientData.phone
        } else {
          localForm.name = ''
          localForm.company = ''
          localForm.phone = ''
        }

        errors.name = ''
        errors.company = ''
        errors.phone = ''
      }
    }
  )

  function validateName() {
    if (localForm.name) {
      errors.name = ''
    } else {
      errors.name = 'Введите имя'
    }
  }

  function validateCompany() {
    if (localForm.company) {
      errors.company = ''
    } else {
      errors.company = 'Введите компанию'
    }
  }

  function validatePhone() {
    const phoneValue = localForm.phone.trim()
    if (!phoneValue) {
      errors.phone = 'Введите телефон'
    } else if (!/^\+?\d[\d\s-]*$/.test(phoneValue)) {
      errors.phone = 'Телефон должен содержать только цифры, пробелы, тире или плюс'
    } else {
      errors.phone = ''
    }
  }

  function submitForm() {
    validateName()
    validateCompany()
    validatePhone()

    if (errors.name || errors.company || errors.phone) return

    emit('save', { ...localForm })
  }

  function closeModal() {
    emit('close')
    Object.keys(errors).forEach((e) => (errors[e] = ''))
  }
</script>

<style scoped></style>
