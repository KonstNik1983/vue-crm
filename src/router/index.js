import { createRouter, createWebHistory } from "vue-router";

import { useAuthStore } from "../stores/auth";

import MainLayout from "../layouts/MainLayout.vue";
import AuthLayout from "../layouts/AuthLayout.vue";

import LoginView from "../views/LoginView.vue";
import DashboardView from "../views/DashboardView.vue";
import ClientsView from "../views/ClientsView.vue";
import DealsView from "../views/DealsView.vue";
import SettingsView from "../views/SettingsView.vue";
import ClientView from "../views/ClientView.vue";

const routes = [
  {
    path: "/",
    component: MainLayout,
    children: [
      { path: "", name: "dashboard", component: DashboardView },
      { path: "clients", name: "clients", component: ClientsView },
      { path: "deals", name: "deals", component: DealsView },
      { path: "settings", name: "settings", component: SettingsView },
      { path: "clients/:id", name: "client", component: ClientView },
    ],
  },
  {
    path: "/login",
    component: AuthLayout,
    children: [{ path: "", name: "login", component: LoginView }],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  linkActiveClass: "active",
  linkExactActiveClass: "exact-active",
});

router.beforeEach((to, from, next) => {
  const auth = useAuthStore();

  if (!auth.isAuth && to.name !== "login") {
    return next("/login");
  }

  if (auth.isAuth && to.name === "login") {
    return next("/");
  }

  next();
});

export default router;
