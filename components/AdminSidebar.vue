<script setup>
import { RouterLink } from 'vue-router'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const props = defineProps({
  activeSection: String
})

const router = useRouter()
const authStore = useAuthStore()

const logout = async () => {
  await authStore.signOut()
  router.push('/')
}
</script>

<template>
  <aside class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
    <nav class="space-y-2">
      <RouterLink to="/admin/dashboard" class="block py-2 px-4 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200" :class="{'bg-indigo-600 text-white': activeSection === 'admin', 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700': activeSection !== 'admin'}">
        Dashboard
      </RouterLink>
      <RouterLink to="/admin/users" class="block py-2 px-4 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200" :class="{'bg-indigo-600 text-white': activeSection === 'users', 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700': activeSection !== 'users'}">
        Users
      </RouterLink>
      <RouterLink to="/admin/scan-results" class="block py-2 px-4 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200" :class="{'bg-indigo-600 text-white': activeSection === 'scan-results', 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700': activeSection !== 'scan-results'}">
        Scan Results
      </RouterLink>
      <RouterLink to="/admin/appointments" class="block py-2 px-4 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200" :class="{'bg-indigo-600 text-white': activeSection === 'appointments', 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700': activeSection !== 'appointments'}">
        Appointments
      </RouterLink>
      <RouterLink to="/admin/ai-models" class="block py-2 px-4 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200" :class="{'bg-indigo-600 text-white': activeSection === 'ai-models', 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700': activeSection !== 'ai-models'}">
        AI Models
      </RouterLink>
      <RouterLink to="/admin/physician-consultation" class="block py-2 px-4 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200" :class="{'bg-indigo-600 text-white': activeSection === 'physician-consultation', 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700': activeSection !== 'physician-consultation'}">
        Physician Consultation
      </RouterLink>
      <RouterLink to="/admin/notifications-announcements" class="block py-2 px-4 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200" :class="{'bg-indigo-600 text-white': activeSection === 'notifications-announcements', 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700': activeSection !== 'notifications-announcements'}">
        Notifications Announcements
      </RouterLink>
      <RouterLink to="/admin/system-settings" class="block py-2 px-4 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200" :class="{'bg-indigo-600 text-white': activeSection === 'system-settings', 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700': activeSection !== 'system-settings'}">
        System Settings
      </RouterLink>
      <RouterLink to="/admin/logs-audit-trail" class="block py-2 px-4 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200" :class="{'bg-indigo-600 text-white': activeSection === 'logs-audit-trail', 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700': activeSection !== 'logs-audit-trail'}">
        Logs Audit Trail
      </RouterLink>
      <RouterLink to="/admin/reports-analytics" class="block py-2 px-4 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200" :class="{'bg-indigo-600 text-white': activeSection === 'reports-analytics', 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700': activeSection !== 'reports-analytics'}">
        Reports Analytics
      </RouterLink>
      <RouterLink to="/admin/support-ticketing" class="block py-2 px-4 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200" :class="{'bg-indigo-600 text-white': activeSection === 'support-ticketing', 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700': activeSection !== 'support-ticketing'}">
        Support Ticketing
      </RouterLink>
      <RouterLink to="/admin/account-settings" class="block py-2 px-4 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200" :class="{'bg-indigo-600 text-white': activeSection === 'account-settings', 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700': activeSection !== 'account-settings'}">
        Account Settings
      </RouterLink>
      <RouterLink to="/admin/emergency" class="block py-2 px-4 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200" :class="{'bg-indigo-600 text-white': activeSection === 'emergency', 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700': activeSection !== 'emergency'}">
        Emergency
      </RouterLink>
      <button @click="logout" class="block py-2 px-4 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 w-full text-left">
        Logout
      </button>
    </nav>
  </aside>
</template>

<style scoped>
.bg-white {
  background-color: #ffffff;
}

.text-gray-800 {
  color: #2d3748;
}

.hover\:bg-gray-100:hover {
  background-color: #f7fafc;
}

.router-link-active {
  background-color: #edf2f7;
  color: #2d3748;
}

.block {
  display: block;
}

.py-2 {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}

.px-4 {
  padding-left: 1rem;
  padding-right: 1rem;
}

.rounded {
  border-radius: 0.375rem;
}

.shadow-md {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}
</style>
