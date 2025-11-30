<template>
  <div class="client-page">
    <header class="client-header">
      <h1>Клиент № {{ clientId }}</h1>

      <div class="actions">
        <button
          class="btn btn--primary"
          @click="openEditClient"
        >
          Редактировать
        </button>
        <button
          class="btn btn--secondary"
          @click="openNewDealModal"
        >
          Добавить сделку
        </button>
        <button
          class="btn btn--danger"
          @click="confirmDeleteClient"
        >
          Удалить клиента
        </button>
      </div>
    </header>

    <!-- Информация о клиенте -->
    <section class="client-info">
      <h2>Информация о клиенте</h2>
      <div class="info-grid">
        <div class="info-item">
          <span class="label">Имя:</span>
          <span class="value">{{ client?.name }}</span>
        </div>
        <div class="info-item">
          <span class="label">Телефон:</span>
          <span class="value">{{ client?.phone }}</span>
        </div>
        <div class="info-item">
          <span class="label">Компания:</span>
          <span class="value">{{ client?.company }}</span>
        </div>
        <div class="info-item">
          <span class="label">Количество сделок:</span>
          <span class="value">{{ dealsCount }}</span>
        </div>
      </div>
    </section>

    <!-- Таблица сделок -->
    <section
      class="client-deals"
      v-if="dealsCount"
    >
      <h2 class="client-deal--title">Сделки клиента</h2>

      <div class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>Описание</th>
              <th>Сумма</th>
              <th>Статус</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="deal in clientDeals"
              :key="deal.id"
            >
              <td>{{ deal.description }}</td>
              <td>₽ {{ deal.amount }}</td>
              <td class="status-cell">
                <div class="status-wrapper">
                  <span
                    class="status"
                    :class="statusClasses[deal.status]"
                    @click="toggleStatusMenu(deal.id)"
                  >
                    {{ statusLabels[deal.status] }}
                  </span>
                  <div
                    v-if="openMenuId === deal.id"
                    class="status-menu"
                  >
                    <div
                      class="status-option"
                      v-for="(label, key) in statusLabels"
                      :key="key"
                      @click="changeStatus(deal.id, key)"
                    >
                      {{ label }}
                    </div>
                  </div>
                </div>
              </td>
              <td>
                <button
                  class="action-btn edit"
                  @click="openEditDeal(deal)"
                >
                  ✏️
                </button>
                <button
                  class="action-btn delete"
                  @click="confirmDeleteDial(deal.id)"
                >
                  🗑️
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Если нет сделок -->
    <div
      v-else
      class="empty-state"
    >
      <p class="empty-title">Сделок пока нет</p>
      <p class="empty-sub">Добавьте первую сделку</p>
      <button
        class="btn btn--primary"
        @click="openNewDealModal"
      >
        + Добавить сделку
      </button>
    </div>

    <DealModal
      :open="openDealModal"
      :is-edit="isEditDeal"
      :deal-data="editingDeal"
      :default-client-id="clientId"
      @save="handleDealSave"
      @close="closeDealModal"
    />

    <ClientModal
      :open="openClientModal"
      :is-edit="isEditClient"
      :client-data="editingClient"
      @save="handleClientSave"
      @close="closeClientModal"
    />
  </div>
</template>

<script setup>
  import { ref, reactive, computed } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useDealsWithClients } from '../composables/useDealsWithClients'
  import { useCRMStore } from '../stores/crm'
  import { statusClasses, statusLabels } from '../utils/statusClasses'
  import DealModal from '../components/Modals/DealModal.vue'
  import ClientModal from '../components/Modals/ClientModal.vue'

  const crm = useCRMStore()
  const { dealsWithClients } = useDealsWithClients()
  const route = useRoute()
  const router = useRouter()

  const clientId = Number(route.params.id)

  const openDealModal = ref(false)
  const openClientModal = ref(false)
  const isEditDeal = ref(false)
  const isEditClient = ref(false)
  const editingDeal = ref(null)
  const editingClient = ref(null)

  const form = reactive({
    name: '',
    company: '',
    phone: ''
  })

  /* ---------- ДАННЫЕ КЛИЕНТА ---------- */
  const client = computed(() => crm.clients.find((c) => c.id === clientId))

  /* ---------- СДЕЛКИ КЛИЕНТА ---------- */
  const clientDeals = computed(() => dealsWithClients.value.filter((d) => d.clientId === clientId))

  const dealsCount = computed(() => clientDeals.value.length)

  /* ---------- МОДАЛКА СДЕЛКИ ---------- */
  const openNewDealModal = () => {
    isEditDeal.value = false
    editingDeal.value = null
    openDealModal.value = true
  }

  // редактирование сделки
  const openEditDeal = (deal) => {
    isEditDeal.value = true
    editingDeal.value = { ...deal }
    openDealModal.value = true
  }

  const handleDealSave = (data) => {
    if (isEditDeal.value) {
      crm.updateDeal(editingDeal.value.id, {
        ...editingDeal.value,
        ...data
      })
    } else {
      crm.addDeal({
        id: Date.now(),
        status: 'new',
        ...data,
        clientId
      })
    }
    closeDealModal()
  }

  const closeDealModal = () => {
    openDealModal.value = false
    isEditDeal.value = false
    editingDeal.value = null
  }

  /* ---------- МОДАЛКА КЛИЕНТА ---------- */

  // редактирование клиента
  const openEditClient = () => {
    isEditClient.value = true
    editingClient.value = { ...client.value }
    openClientModal.value = true
  }

  const handleClientSave = (data) => {
    crm.updateClient(clientId, data)
    closeClientModal()
  }

  const closeClientModal = () => {
    openClientModal.value = false
    isEditClient.value = false
    editingClient.value = null
  }

  /* ---------- УДАЛЕНИЕ ---------- */

  const confirmDeleteClient = () => {
    if (confirm('Удалить клиента? Все связанные сделки тоже будут удалены.')) {
      crm.deleteClient(clientId)
      router.push('/clients')
    }
  }

  const confirmDeleteDial = (id) => {
    if (confirm('Удалить сделку? Это действие необратимо.')) {
      crm.deleteDeal(id)
    }
  }

  /* ---------- СТАТУСЫ ---------- */
  const openMenuId = ref(null)
  const toggleStatusMenu = (id) => {
    openMenuId.value = openMenuId.value === id ? null : id
  }
  const changeStatus = (id, status) => {
    crm.updateDealStatus(id, status)
    openMenuId.value = null
  }
</script>

<style scoped>
  .client-page {
    padding: 20px;
  }

  .client-deal--title {
    margin-bottom: 20px;
  }

  .client-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
  }

  .actions {
    display: flex;
    gap: 15px;
  }

  .client-info {
    margin-bottom: 40px;
  }

  .info-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    margin-top: 10px;
  }

  .info-item .label {
    font-weight: bold;
    margin-right: 5px;
  }

  .info-item .value {
    margin-left: 4px;
    color: var(--color-gray);
  }

  .info-item .status {
    margin-left: 10px;
  }
</style>
