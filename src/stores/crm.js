import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

export const useCRMStore = defineStore('crm', () => {
  // Загружаем клиентов из LocalStorage
  const storedClients = JSON.parse(localStorage.getItem('clients'))
  const clients = ref(
    storedClients?.length
      ? storedClients
      : [
          {
            id: 1,
            name: 'Алексей Смирнов',
            company: 'ООО «ТехноПром»',
            phone: '+7 900 111 22 33'
          },
          {
            id: 2,
            name: 'Екатерина Иванова',
            company: 'АО «Инновация»',
            phone: '+7 912 444 55 66'
          },
          {
            id: 3,
            name: 'Дмитрий Кузнецов',
            company: 'ООО «Глобал Сервис»',
            phone: '+7 925 777 88 99'
          }
        ]
  )

  // Загружаем сделки из LocalStorage
  const storedDeals = JSON.parse(localStorage.getItem('deals'))
  const deals = ref(
    storedDeals?.length
      ? storedDeals
      : [
          {
            id: 101,
            clientId: 1,
            company: 'ООО «ТехноПром»',
            amount: 250000,
            status: 'new',
            description: 'Поставка серверного оборудования'
          },
          {
            id: 102,
            clientId: 2,
            company: 'АО «Инновация»',
            amount: 120000,
            status: 'done',
            description: 'Лицензии на ПО'
          },
          {
            id: 103,
            clientId: 3,
            company: 'ООО «Глобал Сервис»',
            amount: 75000,
            status: 'cancelled',
            description: 'Обслуживание офисной техники'
          }
        ]
  )

  // Подсчёты
  const totalClients = computed(() => clients.value.length)
  const totalDeals = computed(() => deals.value.length)
  const totalRevenue = computed(() => deals.value.reduce((sum, d) => sum + d.amount, 0))

  // Автосохранение в LocalStorage при изменении
  watch(
    clients,
    (val) => {
      localStorage.setItem('clients', JSON.stringify(val))
    },
    { deep: true }
  )

  watch(
    deals,
    (val) => {
      localStorage.setItem('deals', JSON.stringify(val))
    },
    { deep: true }
  )

  // Методы работы с клиентами
  const addClient = (client) => clients.value.push(client)
  const updateClient = (id, updatedFields) => {
    const client = clients.value.find((c) => c.id === id)
    if (client) Object.assign(client, updatedFields)
  }
  const deleteClient = (id) => {
    clients.value = clients.value.filter((c) => c.id !== id)
    deals.value = deals.value.filter((d) => d.clientId !== id)
  }

  // Методы работы со сделками
  const addDeal = (deal) => deals.value.push(deal)
  const updateDeal = (id, updatedFields) => {
    const deal = deals.value.find((d) => d.id === id)
    if (deal) Object.assign(deal, updatedFields)
  }
  const deleteDeal = (id) => {
    deals.value = deals.value.filter((d) => d.id !== id)
  }
  const updateDealStatus = (id, newStatus) => {
    const deal = deals.value.find((d) => d.id === id)
    if (deal) deal.status = newStatus
  }

  return {
    clients,
    deals,
    totalClients,
    totalDeals,
    totalRevenue,
    addClient,
    updateClient,
    deleteClient,
    addDeal,
    updateDeal,
    deleteDeal,
    updateDealStatus
  }
})
