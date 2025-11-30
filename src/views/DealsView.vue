<template>
  <div class="list-view">
    <div
      class="list-view--header"
      v-if="crm.deals.length"
    >
      <h1 class="list-view--title">Сделки</h1>
      <button
        class="btn btn--primary"
        @click="openCreateDeal"
      >
        + Добавить сделку
      </button>
    </div>

    <div
      class="table-wrapper"
      v-if="crm.deals.length"
    >
      <table class="data-table">
        <thead>
          <tr>
            <th>Клиент</th>
            <th>Компания</th>
            <th>Описание</th>
            <th>Сумма</th>
            <th>Статус</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="deal in dealsWithClients"
            :key="deal.id"
          >
            <td>{{ deal.clientName }}</td>
            <td>{{ deal.company }}</td>
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
                @click="confirmDelete(deal.id)"
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
      <p class="empty-title">Сделок пока нет</p>
      <p class="empty-sub">Добавьте первую сделку</p>
      <button
        class="btn btn--primary"
        @click="openCreateDeal"
      >
        + Добавить сделку
      </button>
    </div>

    <DealModal
      :open="openDeal"
      :is-edit="isEditDeal"
      :deal-data="dealForm"
      @save="handleSaveDeal"
      @close="closeDealModal"
    />
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  import { useCRMStore } from '../stores/crm'
  import { useDealsWithClients } from '../composables/useDealsWithClients'
  import { statusClasses, statusLabels } from '../utils/statusClasses'
  import DealModal from '../components/Modals/DealModal.vue'

  const crm = useCRMStore()
  const { dealsWithClients } = useDealsWithClients()

  const openDeal = ref(false)
  const isEditDeal = ref(false)
  const editingDealId = ref(null)
  const dealForm = ref({})

  // Создать сделку
  const openCreateDeal = () => {
    openDeal.value = true
    isEditDeal.value = false
    editingDealId.value = null
    dealForm.value = {}
  }

  // Редактировать сделку
  const openEditDeal = (deal) => {
    openDeal.value = true
    isEditDeal.value = true
    editingDealId.value = deal.id
    dealForm.value = { ...deal }
  }

  // Сохранение сделки
  const handleSaveDeal = (data) => {
    if (isEditDeal.value) {
      crm.updateDeal(editingDealId.value, {
        ...dealForm.value, // старые данные
        ...data
      })
    } else {
      crm.addDeal({
        id: Date.now(),
        status: 'new',
        ...data
      })
    }
    closeDealModal()
  }

  // Закрытие модалки
  const closeDealModal = () => {
    openDeal.value = false
    isEditDeal.value = false
    editingDealId.value = null
  }

  // Удаление сделки
  const confirmDelete = (id) => {
    if (confirm('Удалить сделку? Это действие необратимо.')) {
      crm.deleteDeal(id)
    }
  }

  // Статусы
  const openMenuId = ref(null)
  const toggleStatusMenu = (id) => {
    openMenuId.value = openMenuId.value === id ? null : id
  }
  const changeStatus = (id, status) => {
    crm.updateDealStatus(id, status)
    openMenuId.value = null
  }
</script>

<style scoped></style>
