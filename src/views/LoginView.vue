<template>
  <div class="login-card">
    <h1 class="login-title">Вход в систему</h1>

    <form
      class="login-form"
      @submit.prevent="login"
    >
      <div class="form-group">
        <label for="email">Email</label>
        <input
          type="email"
          id="email"
          placeholder="Введите email"
          v-model.trim="loginForm.email"
          :class="{ error: errors.email }"
          @input="validateEmail"
        />
        <span
          v-if="errors.email"
          class="error-text"
        >
          {{ errors.email }}
        </span>
      </div>

      <div class="form-group">
        <label for="password">Пароль</label>
        <input
          type="password"
          id="password"
          placeholder="Введите пароль"
          v-model.trim="loginForm.password"
          :class="{ error: errors.password }"
          @input="validatePassword"
        />
        <span
          v-if="errors.password"
          class="error-text"
        >
          {{ errors.password }}
        </span>
      </div>

      <button
        type="submit"
        class="btn btn--primary"
      >
        Войти
      </button>
      <button
        type="button"
        class="btn btn--secondary"
        @click="loginAsGuest"
      >
        Войти как гость
      </button>
    </form>
  </div>
</template>

<script setup>
  import { reactive } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAuthStore } from '../stores/auth'

  const auth = useAuthStore()
  const router = useRouter()

  const loginForm = reactive({
    email: '',
    password: ''
  })

  const errors = reactive({
    email: '',
    password: ''
  })

  function validateEmail() {
    if (loginForm.email.includes('@')) {
      errors.email = '' // валидно — убираем ошибку
    } else {
      errors.email = 'Введите корректный email' // иначе показываем
    }
  }

  function validatePassword() {
    if (loginForm.password) {
      errors.password = ''
    } else {
      errors.password = 'Введите пароль'
    }
  }

  function login() {
    validateEmail()
    validatePassword()

    if (errors.email || errors.password) return // есть ошибки — не отправляем

    const success = auth.login(loginForm.email, loginForm.password)
    if (success) {
      router.push('/')
    } else {
      alert('Неверный логин или пароль')
    }
  }

  function loginAsGuest() {
    auth.loginAsGuest()
    router.push('/')
  }
</script>

<style scoped>
  .login-card {
    background: var(--color-white);
    padding: 2rem 2.5rem;
    border-radius: 12px;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    width: 350px;
    text-align: center;
  }

  .login-title {
    font-size: 1.6rem;
    font-weight: 600;
    color: var(--color-gray);
    margin-bottom: 1.5rem;
  }

  .login-form {
    display: flex;
    flex-direction: column;
  }

  input:focus {
    border-color: var(--color-brand);
  }

  .btn--primary {
    margin-top: 0.8rem;
    background-color: var(--color-brand) !important;
    margin-bottom: 1rem;
  }

  .btn--secondary {
    margin-top: 0.3rem;
  }

  .btn--secondary:hover {
    background: #e3f2fd !important;
    color: var(--color-black) !important;
  }
</style>
