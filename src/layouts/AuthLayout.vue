<template>
  <div class="login-page">
    <router-view />
  </div>
</template>

<script setup></script>

<style scoped>
  .login-page {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background: var(--color-light-gray);
  }
</style>
