<template>
  <div
    v-if="open"
    class="modal-overlay"
    @click.self="closeModal"
  >
    <div class="modal">
      <h2 class="modal-title">{{ isEdit ? 'Редактировать сделку' : 'Добавить сделку' }}</h2>

      <form @submit.prevent="submitForm">
        <!-- Выбор клиента -->
        <div class="form-group">
          <label for="client">Клиент:</label>
          <select
            v-model="localForm.clientId"
            id="client"
            :class="{ error: errors.clientId }"
            @change="validateClient"
          >
            <option value="">Выберите клиента</option>
            <option
              v-for="client in crm.clients"
              :key="client.id"
              :value="client.id"
            >
              {{ client.name }} ({{ client.company }})
            </option>
          </select>
          <span
            v-if="errors.clientId"
            class="error-text"
          >
            {{ errors.clientId }}
          </span>
        </div>

        <!-- Описание -->
        <div class="form-group">
          <label for="description">Описание:</label>
          <input
            type="text"
            id="description"
            v-model.trim="localForm.description"
            :class="{ error: errors.description }"
            @input="validateDescription"
            placeholder="Например: заказ оборудования"
          />
          <span
            v-if="errors.description"
            class="error-text"
          >
            {{ errors.description }}
          </span>
        </div>

        <!-- Сумма -->
        <div class="form-group">
          <label for="amount">Сумма сделки:</label>
          <input
            type="number"
            id="amount"
            v-model="localForm.amount"
            :class="{ error: errors.amount }"
            @input="validateAmount"
            placeholder="₽"
            min="0"
            step="0.01"
          />
          <span
            v-if="errors.amount"
            class="error-text"
          >
            {{ errors.amount }}
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
  import { useCRMStore } from '../../stores/crm'

  const crm = useCRMStore()

  const props = defineProps({
    open: Boolean,
    isEdit: Boolean,
    dealData: Object,
    defaultClientId: [Number, String] // используется только для новой сделки с конкретного клиента
  })

  const emit = defineEmits(['close', 'save'])

  // Форма
  const localForm = reactive({
    clientId: '',
    description: '',
    amount: ''
  })

  const errors = reactive({
    clientId: '',
    description: '',
    amount: ''
  })

  function validateClient() {
    if (localForm.clientId) {
      errors.clientId = ''
    } else {
      errors.clientId = 'Выберете клиента'
    }
  }

  function validateDescription() {
    if (localForm.description) {
      errors.description = ''
    } else {
      errors.description = 'Введите описание'
    }
  }

  function validateAmount() {
    if (localForm.amount === '' || localForm.amount === null) {
      errors.amount = 'Введите сумму'
    } else if (Number(localForm.amount) < 0) {
      errors.amount = 'Сумма должна быть положительной'
    } else {
      errors.amount = ''
    }
  }

  // Подставляем данные при открытии модалки
  watch(
    () => props.open,
    (val) => {
      if (val) {
        if (props.isEdit && props.dealData) {
          // Редактирование: подставляем клиента и данные сделки
          localForm.clientId = props.dealData.clientId
          localForm.description = props.dealData.description
          localForm.amount = props.dealData.amount
        } else {
          // Новая сделка: select пустой или по умолчанию clientId если передан
          localForm.clientId = props.defaultClientId || ''
          localForm.description = ''
          localForm.amount = ''
        }
      }
    },
    { immediate: true }
  )

  // Сохранение
  const submitForm = () => {
    validateClient()
    validateDescription()
    validateAmount()

    if (errors.clientId || errors.description || errors.amount) return

    emit('save', { ...localForm })
    //close()
  }

  // Закрытие модалки
  const closeModal = () => {
    emit('close')
  }
</script>

<style scoped></style>
