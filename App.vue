<script setup>
import { RouterView } from 'vue-router'
import ClientNavbar from './components/ClientNavbar.vue'
import AdminNavbar from './components/AdminNavbar.vue'
import BottomNavBar from './components/BottomNavBar.vue'
import { useRoute } from 'vue-router'
import { computed, onMounted } from 'vue'
import { useAuthStore } from './stores/auth'
import { useDarkModeStore } from './stores/darkMode'

const route = useRoute()
const authStore = useAuthStore()
const darkModeStore = useDarkModeStore()

// Check if the current route is in the admin section
const isAdminRoute = computed(() => route.path.startsWith('/admin'))

// Check if the current route is the admin login page
const isAdminLoginPage = computed(() => route.path === '/admin')

// Show admin navbar only if in admin routes and authenticated as admin
const showAdminNavbar = computed(() => 
  isAdminRoute.value && 
  authStore.isAuthenticated && 
  authStore.isAdmin && 
  !isAdminLoginPage.value
)

// Show client navbar only if not in admin routes
const showClientNavbar = computed(() => !isAdminRoute.value)

// Show bottom navbar only if not in admin routes and not on login/register pages
const showBottomNavbar = computed(() => 
  !isAdminRoute.value && 
  route.path !== '/login' && 
  route.path !== '/register'
)

// Initialize dark mode on app mount
onMounted(() => {
  // Apply dark mode settings from localStorage
  if (localStorage.getItem('darkMode') === 'true') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
})
</script>

<template>
  <div class="min-h-screen" :class="isAdminRoute ? 'bg-gray-100 dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-900'">
    <ClientNavbar v-if="showClientNavbar" />
    <AdminNavbar v-if="showAdminNavbar" />
    <RouterView />
    <BottomNavBar v-if="showBottomNavbar" />
  </div>
</template>