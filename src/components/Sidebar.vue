<template>
  <aside class="sidebar">
    <div class="logo">MyCRM</div>
    <nav class="menu">
      <router-link
        to="/"
        class="menu-item"
      >
        Главная
      </router-link>
      <router-link
        to="/clients"
        class="menu-item"
      >
        Клиенты
      </router-link>
      <router-link
        to="/deals"
        class="menu-item"
      >
        Сделки
      </router-link>
      <router-link
        to="/settings"
        class="menu-item"
      >
        Настройки
      </router-link>
    </nav>

    <!-- Кнопка выхода -->
    <button
      class="btn btn--danger"
      @click="logout"
    >
      Выйти
    </button>
  </aside>
</template>

<script setup>
  import { useRouter } from 'vue-router'
  import { useAuthStore } from '../stores/auth'

  const router = useRouter()
  const auth = useAuthStore()

  function logout() {
    auth.logout()
    router.push('/login')
  }
</script>

<style scoped>
  /* Sidebar */
  .sidebar {
    width: 240px;
    background: #1e1f26;
    color: #fff;
    display: flex;
    flex-direction: column;
    padding: 20px;
  }

  .logo {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 40px;
    text-align: center;
  }

  .menu {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .menu-item {
    color: #bbb;
    text-decoration: none;
    padding: 10px 15px;
    border-radius: 8px;
    transition: 0.3s;
  }

  .menu-item:hover,
  .menu-item.exact-active {
    background: #35363f;
    color: #fff;
  }

  /* Кнопка выхода */
  .btn--danger {
    margin-top: auto;
  }
</style>
