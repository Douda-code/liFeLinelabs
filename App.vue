<script setup>
import { RouterView } from 'vue-router'
import ClientNavbar from './components/ClientNavbar.vue'
import AdminNavbar from './components/AdminNavbar.vue'
import BottomNavBar from './components/BottomNavBar.vue'
import { useRoute } from 'vue-router'
import { computed, onMounted } from 'vue'
import { useAuthStore } from './stores/auth'
import { useDarkModeStore } from './stores/darkMode'
import NavSidebar from './components/NavSidebar.vue'

const route = useRoute()
const authStore = useAuthStore()
const darkModeStore = useDarkModeStore()

const isAdminRoute = computed(() => route.path.startsWith('/admin'))
const isAdminLoginPage = computed(() => route.path === '/admin')
const showAdminNavbar = computed(() =>
  isAdminRoute.value &&
  authStore.isAuthenticated &&
  authStore.isAdmin &&
  !isAdminLoginPage.value
)
const showClientNavbar = computed(() => !isAdminRoute.value)
const showBottomNavbar = computed(() =>
  !isAdminRoute.value &&
  route.path !== '/login' &&
  route.path !== '/register'
)

const showNavSidebar = computed(() => {
  const allowedPaths = [
    '/dashboard',
    '/scans',
    '/ai-analysis',
    '/make-appointment',
    '/consultation',
    '/activity-history',
    '/notifications',
    '/account-settings'
  ]
  return allowedPaths.includes(route.path)
})

onMounted(() => {
  if (localStorage.getItem('darkMode') === 'true') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
})
</script>

<template>
  <div class="min-h-screen flex" :class="isAdminRoute ? 'bg-gray-100 dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-900'">
    <NavSidebar v-if="showNavSidebar && !isAdminRoute" class="w-32" />
    <div class="flex-1">
      <ClientNavbar v-if="showClientNavbar" />
      <AdminNavbar v-if="showAdminNavbar" />
      <RouterView />
      <BottomNavBar v-if="showBottomNavbar" />
    </div>
  </div>
</template>
