<template>
  <div>
    <!-- Карточки статистики -->
    <section class="stats">
      <div class="card">
        <h3>Клиентов</h3>
        <p>{{ crm.totalClients }}</p>
      </div>
      <div class="card">
        <h3>Сделок</h3>
        <p>{{ crm.totalDeals }}</p>
      </div>
      <div class="card">
        <h3>Выручка</h3>
        <p>₽ {{ crm.totalRevenue }}</p>
      </div>
    </section>

    <!-- Таблица -->
    <section class="table-section">
      <h2 class="table-section--title">Последние сделки</h2>

      <div
        class="table-wrapper"
        v-if="crm.deals.length"
      >
        <table class="data-table">
          <thead>
            <tr>
              <th>Клиент</th>
              <th>Сделка</th>
              <th>Сумма</th>
              <th>Статус</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="deal in dealsWithClients.slice(-3)"
              :key="deal.id"
            >
              <td>{{ deal.company }}</td>
              <td>{{ deal.description }}</td>
              <td>₽ {{ deal.amount }}</td>
              <td>
                <span
                  class="status"
                  :class="statusClasses[deal.status]"
                >
                  {{ statusLabels[deal.status] }}
                </span>
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
        <p class="empty-sub">Создайте первую сделку на странице “Сделки”</p>
        <button
          class="btn btn--primary"
          @click="$router.push('/deals')"
        >
          Перейти к сделкам
        </button>
      </div>
    </section>
  </div>
</template>

<script setup>
  import { useDealsWithClients } from '../composables/useDealsWithClients'
  import { useCRMStore } from '../stores/crm'
  import { statusClasses, statusLabels } from '../utils/statusClasses'

  const { dealsWithClients } = useDealsWithClients()
  const crm = useCRMStore()
</script>

<style scoped>
  /* Stats */
  .stats {
    display: flex;
    gap: 20px;
    padding: 20px 30px;
  }

  .card {
    background: var(--color-white);
    border-radius: 12px;
    padding: 20px;
    flex: 1;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  }

  .card h3 {
    font-size: 1rem;
    color: var(--color-gray);
  }

  .card p {
    font-size: 1.5rem;
    font-weight: bold;
    color: var(--color-black);
    margin-top: 10px;
  }

  /* Table */

  .table-section {
    background: var(--color-white);
    margin: 20px 30px;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  }

  .table-section--title {
    margin-bottom: 20px;
  }
</style>
