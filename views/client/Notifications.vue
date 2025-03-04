<script setup>
import { ref, computed, onMounted } from 'vue'
import NavSidebar from '../../components/NavSidebar.vue'
import { useAuthStore } from '../../stores/auth'
import { getUserNotifications, markNotificationAsRead, markNotificationAsImportant } from '../../services/notificationService'

const notifications = ref([])
const loading = ref(true)
const error = ref(null)

const filterCategory = ref('all')
const activeSection = ref('notifications')
const authStore = useAuthStore()

// Load user's notifications
const loadNotifications = async () => {
  if (!authStore.isAuthenticated) {
    error.value = 'You must be logged in to view notifications.'
    loading.value = false
    return
  }
  
  try {
    loading.value = true
    const data = await getUserNotifications(authStore.user.id)
    notifications.value = data
    loading.value = false
  } catch (err) {
    console.error('Error loading notifications:', err)
    error.value = 'Failed to load notifications. Please try again later.'
    loading.value = false
  }
}

const filteredNotifications = computed(() => {
  if (filterCategory.value === 'all') {
    return notifications.value
  }
  return notifications.value.filter(notification => notification.notification_type === filterCategory.value)
})

const handleMarkAsRead = async (notification) => {
  try {
    await markNotificationAsRead(notification.id)
    // Update local state
    notification.is_read = true
  } catch (err) {
    console.error('Error marking notification as read:', err)
  }
}

const handleMarkAsImportant = async (notification) => {
  try {
    await markNotificationAsImportant(notification.id, !notification.is_important)
    // Update local state
    notification.is_important = !notification.is_important
  } catch (err) {
    console.error('Error marking notification as important:', err)
  }
}

// Format date for display
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
}

onMounted(() => {
  loadNotifications()
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">Notifications</h1>
    </div>
    <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 py-4 px-4 sm:px-6 lg:px-8">
      <!-- Sidebar -->
      <NavSidebar :activeSection="activeSection" />

      <!-- Main Content -->
      <main class="md:col-span-3 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Notification Feed</h2>
        
        <!-- Filter options -->
        <div class="mb-4">
          <label for="filter-category" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Filter by Type:</label>
          <select 
            id="filter-category" 
            v-model="filterCategory" 
            class="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
          >
            <option value="all">All Notifications</option>
            <option value="system">System</option>
            <option value="appointment">Appointments</option>
            <option value="scan">Scan Results</option>
            <option value="consultation">Consultations</option>
          </select>
        </div>
        
        <div v-if="loading" class="flex justify-center items-center py-8">
          <svg class="animate-spin h-8 w-8 text-indigo-600 dark:text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        
        <div v-else-if="error" class="p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg">
          {{ error }}
        </div>
        
        <div v-else-if="filteredNotifications.length === 0" class="p-4 text-center text-gray-500 dark:text-gray-400">
          No notifications found.
        </div>
        
        <div v-else class="space-y-4">
          <div 
            v-for="notification in filteredNotifications" 
            :key="notification.id" 
            class="flex items-center justify-between p-4 rounded-lg hover:shadow-md transition-shadow duration-200"
            :class="{
              'bg-gray-50 dark:bg-gray-700': !notification.is_read,
              'bg-white dark:bg-gray-800 opacity-75': notification.is_read,
              'border-l-4 border-yellow-500': notification.is_important
            }"
          >
            <div>
              <h3 class="font-medium" :class="{'text-gray-900 dark:text-white': !notification.is_read, 'text-gray-500 dark:text-gray-400': notification.is_read}">
                {{ notification.title }}
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ formatDate(notification.created_at) }}</p>
              <p class="text-sm mt-1" :class="{'text-gray-700 dark:text-gray-300': !notification.is_read, 'text-gray-500 dark:text-gray-400': notification.is_read}">
                {{ notification.content }}
              </p>
            </div>
            <div class="flex items-center space-x-2">
              <button 
                @click="handleMarkAsRead(notification)" 
                class="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors duration-200"
                v-if="!notification.is_read"
              >
                Mark as Read
              </button>
              <button 
                @click="handleMarkAsImportant(notification)" 
                class="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors duration-200"
              >
                <span v-if="notification.is_important">Unmark Important</span>
                <span v-else>Mark Important</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>