<template>
  <div class="settings-view">
    <h1 class="settings-view--title">Настройки</h1>

    <div class="settings-container">
      <!-- Настройка темы -->
      <section class="setting-item">
        <label>Тема:</label>
        <select v-model="theme">
          <option value="light">Светлая</option>
          <option value="dark">Тёмная</option>
        </select>
      </section>

      <!-- Настройка уведомлений -->
      <section class="checkbox-item">
        <label>Получать уведомления о новых сделках</label>
        <input
          type="checkbox"
          v-model="notifications"
        />
      </section>

      <!-- Настройка профиля -->
      <section class="setting-item">
        <h2 class="setting-item--title">Профиль</h2>
        <div class="form-group">
          <label for="name">Имя:</label>
          <input
            id="name"
            type="text"
            v-model="profile.name"
          />
        </div>

        <div class="form-group">
          <label for="email">Email:</label>
          <input
            id="email"
            type="email"
            v-model="profile.email"
          />
        </div>
      </section>

      <button
        class="btn btn--primary"
        @click="saveSettings"
      >
        Сохранить
      </button>
    </div>
  </div>
</template>

<script setup>
  import { reactive, ref } from 'vue'

  const theme = ref('light')
  const notifications = ref(true)

  const profile = reactive({
    name: 'Иван Иванов',
    email: 'ivan@example.com'
  })

  const saveSettings = () => {
    alert(
      `Настройки сохранены!\nТема: ${theme.value}\nУведомления: ${notifications.value ? 'вкл' : 'выкл'}\nИмя: ${profile.name}\nEmail: ${profile.email}`
    )
  }
</script>

<style scoped>
  .settings-view {
    padding: 30px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .settings-view--title {
    font-size: 1.5rem;
    margin-bottom: 30px;
    align-self: flex-start;
  }

  .settings-container {
    width: 500px;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .setting-item--title {
    margin-bottom: 15px;
  }

  .form-group {
    margin-bottom: 20px;
  }

  /* Чекбокс в ряд с текстом */
  .checkbox-item {
    display: flex;
    flex-direction: row;
    gap: 15px;
  }

  input[type='checkbox'] {
    width: 15px;
    height: 15px;
  }

  .btn--primary {
    display: inline-block;
    align-self: flex-start;
  }
</style>
