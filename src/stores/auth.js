import { defineStore } from "pinia";
import { ref, watch } from "vue";

export const useAuthStore = defineStore("auth", () => {
  // Загружаем состояние
  const storedAuth = JSON.parse(localStorage.getItem("authState"));

  // Состояние авторизации
  const isAuth = ref(storedAuth?.isAuth || false);

  // Тестовый логин/пароль (для кнопки "Войти")
  const email = ref("admin@crm.com");
  const password = ref("12345");

  // Метод обычного входа
  const login = (enteredEmail, enteredPassword) => {
    if (enteredEmail === email.value && enteredPassword === password.value) {
      isAuth.value = true;
      return true;
    }
    return false;
  };

  // Метод входа как гость
  const loginAsGuest = () => {
    isAuth.value = true;
  };

  // Метод выхода
  const logout = () => {
    isAuth.value = false;
  };

  // Сохранение состояния
  watch(
    isAuth,
    () => {
      localStorage.setItem(
        "authState",
        JSON.stringify({ isAuth: isAuth.value })
      );
    },
    { deep: true }
  );

  return {
    isAuth,
    email,
    password,
    login,
    loginAsGuest,
    logout,
  };
});
