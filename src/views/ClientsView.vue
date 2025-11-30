<template>
  <div class="list-view">
    <div
      class="list-view--header"
      v-if="crm.clients.length"
    >
      <h1 class="list-view--title">Клиенты</h1>
      <button
        class="btn btn--primary"
        @click="openCreateClient"
      >
        + Добавить клиента
      </button>
    </div>

    <div
      class="table-wrapper"
      v-if="crm.clients.length"
    >
      <table class="data-table">
        <thead>
          <tr>
            <th>Имя</th>
            <th>Компания</th>
            <th>Телефон</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="client in crm.clients"
            :key="client.id"
            @click="openClientCard(client.id)"
            class="clickable-row"
          >
            <td>{{ client.name }}</td>
            <td>{{ client.company }}</td>
            <td>{{ client.phone }}</td>

            <td @click.stop>
              <button
                class="action-btn edit"
                @click="openEditClient(client)"
              >
                <!-- ИСПРАВЛЕНО -->
                ✏️
              </button>
              <button
                class="action-btn delete"
                @click="confirmDelete(client.id)"
              >
                🗑️
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div
      v-else
      class="empty-state"
    >
      <p class="empty-title">Клиентов пока нет</p>
      <p class="empty-sub">Добавьте первого клиента, чтобы начать работу</p>

      <button
        class="btn btn--primary"
        @click="openCreateClient"
      >
        + Добавить клиента
      </button>
    </div>

    <ClientModal
      :open="openClient"
      :is-edit="isEditClient"
      :client-data="clientForm"
      @save="handleSaveClient"
      @close="closeClientModal"
    />
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useCRMStore } from '../stores/crm'
  import ClientModal from '../components/Modals/ClientModal.vue'

  const router = useRouter()
  const crm = useCRMStore()

  // Состояние МОДАЛКИ
  const openClient = ref(false)
  const isEditClient = ref(false)
  const clientForm = ref({})
  const editingClientId = ref(null)

  // Открыть карточку клиента
  function openClientCard(id) {
    router.push(`/clients/${id}`)
  }

  // Создать клиента
  const openCreateClient = () => {
    openClient.value = true
    isEditClient.value = false
    editingClientId.value = null
    clientForm.value = {}
  }

  // Редактировать клиента
  const openEditClient = (client) => {
    openClient.value = true
    isEditClient.value = true
    editingClientId.value = client.id
    clientForm.value = { ...client }
  }

  // Сохранение клиента
  const handleSaveClient = (data) => {
    if (isEditClient.value) {
      crm.updateClient(editingClientId.value, {
        ...clientForm.value, // старый клиент
        ...data //
      })
    } else {
      crm.addClient({
        id: Date.now(),
        ...data
      })
    }
    closeClientModal()
  }

  // Закрытие модалки
  const closeClientModal = () => {
    openClient.value = false
    isEditClient.value = false
    editingClientId.value = null
  }

  // Удаление клиента
  const confirmDelete = (id) => {
    if (confirm('Удалить клиента?')) {
      crm.deleteClient(id)
    }
  }
</script>

<style scoped>
  .clickable-row {
    cursor: pointer;
    transition: background 0.2s;
  }

  .clickable-row:hover {
    background: #f7f7f7;
  }
</style>
