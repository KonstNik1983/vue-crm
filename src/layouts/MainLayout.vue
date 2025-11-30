<template>
  <div class="dashboard">
    <!-- Боковое меню -->
    <Sidebar />

    <!-- Основная часть -->
    <div class="main">
      <!-- Верхняя панель -->
      <header class="topbar">
        <h1>Добро пожаловать, {{ username }}</h1>
        <div class="user">
          <img
            src="https://i.pravatar.cc/40"
            alt="User"
          />
        </div>
      </header>

      <!-- Здесь будут подставляться страницы -->
      <router-view />
    </div>
  </div>
</template>

<script setup>
  import Sidebar from '../components/Sidebar.vue'

  const username = 'Администратор'
</script>

<style scoped>
  .dashboard {
    display: flex;
    min-height: 100vh;
    background: var(--color-light-gray);
  }

  /* Main */
  .main {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
  }

  /* Topbar */
  .topbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: var(--color-white);
    padding: 20px 30px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  }

  .topbar h1 {
    font-size: 1.2rem;
    color: var(--color-gray);
  }

  .user img {
    border-radius: 50%;
  }
</style>
