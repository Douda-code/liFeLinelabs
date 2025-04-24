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
const activeTab = ref('all')
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
  if (activeTab.value === 'all') {
    return filterCategory.value === 'all' 
      ? notifications.value 
      : notifications.value.filter(notification => notification.notification_type === filterCategory.value)
  } else if (activeTab.value === 'unread') {
    return notifications.value.filter(notification => !notification.is_read &&
      (filterCategory.value === 'all' || notification.notification_type === filterCategory.value))
  } else if (activeTab.value === 'important') {
    return notifications.value.filter(notification => notification.is_important &&
      (filterCategory.value === 'all' || notification.notification_type === filterCategory.value))
  }
  return notifications.value
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

// Get time elapsed (e.g. "2 hours ago")
const getTimeElapsed = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)
  
  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`
  if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`
  
  return formatDate(dateString)
}

// Get notification icon based on type
const getNotificationIcon = (type) => {
  switch(type) {
    case 'system': return 'S'
    case 'appointment': return 'A'
    case 'scan': return 'R'
    case 'consultation': return 'C'
    default: return 'N'
  }
}

// Get notification color based on type
const getNotificationColor = (type) => {
  switch(type) {
    case 'system': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
    case 'appointment': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    case 'scan': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'consultation': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
    default: return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'
  }
}

const getNotificationLabel = (type) => {
  switch(type) {
    case 'system': return 'System'
    case 'appointment': return 'Appointment'
    case 'scan': return 'Scan Results'
    case 'consultation': return 'Consultation'
    default: return 'Notification'
  }
}

// Get unread count
const unreadCount = computed(() => {
  return notifications.value.filter(n => !n.is_read).length
})

// Get important count
const importantCount = computed(() => {
  return notifications.value.filter(n => n.is_important).length
})

onMounted(() => {
  loadNotifications()
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">

    
    <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 py-6 px-4 sm:px-6 lg:px-8">
     

      <!-- Main Content -->
      <main class="md:col-span-4 space-y-6">
        <!-- Horizontal Navbar -->
        <nav class="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
          <div class="flex">
            <button 
              @click="activeTab = 'all'" 
              class="flex-1 py-4 px-6 text-center font-medium text-sm focus:outline-none transition-colors duration-200"
              :class="activeTab === 'all' ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'"
            >
              All Notifications
            </button>
            <button 
              @click="activeTab = 'unread'" 
              class="flex-1 py-4 px-6 text-center font-medium text-sm focus:outline-none transition-colors duration-200 relative"
              :class="activeTab === 'unread' ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'"
            >
              Unread
              <span v-if="unreadCount > 0" class="absolute top-3 right-8 px-1.5 py-0.5 text-xs rounded-full bg-indigo-600 text-white">{{ unreadCount }}</span>
            </button>
            <button 
              @click="activeTab = 'important'" 
              class="flex-1 py-4 px-6 text-center font-medium text-sm focus:outline-none transition-colors duration-200 relative"
              :class="activeTab === 'important' ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'"
            >
              Important
              <span v-if="importantCount > 0" class="absolute top-3 right-8 px-1.5 py-0.5 text-xs rounded-full bg-yellow-500 text-white">{{ importantCount }}</span>
            </button>
          </div>
        </nav>

        <!-- Filter options -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
          <div class="flex items-center">
            <label for="filter-category" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mr-4">Filter by:</label>
            <select 
              id="filter-category" 
              v-model="filterCategory" 
              class="block w-full max-w-xs border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Types</option>
              <option value="system">System</option>
              <option value="appointment">Appointments</option>
              <option value="scan">Scan Results</option>
              <option value="consultation">Consultations</option>
            </select>
          </div>
        </div>
        
        <!-- Notifications Content -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
          <div class="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 class="text-lg font-medium text-gray-900 dark:text-white">
              {{ activeTab === 'all' ? 'All Notifications' : activeTab === 'unread' ? 'Unread Notifications' : 'Important Notifications' }}
            </h2>
          </div>
          
          <div v-if="loading" class="flex justify-center items-center py-12">
            <svg class="animate-spin h-8 w-8 text-indigo-600 dark:text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          
          <div v-else-if="error" class="p-6 bg-red-50 dark:bg-red-900/20 m-4 rounded-lg">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-red-800 dark:text-red-200">Error</h3>
                <div class="mt-2 text-sm text-red-700 dark:text-red-300">
                  <p>{{ error }}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div v-else-if="filteredNotifications.length === 0" class="py-12 text-center">
            <div class="mx-auto h-12 w-12 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">No notifications</h3>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {{ activeTab === 'all' ? 'No notifications found.' : activeTab === 'unread' ? 'No unread notifications.' : 'No important notifications.' }}
            </p>
          </div>
          
          <ul v-else class="divide-y divide-gray-200 dark:divide-gray-700">
            <li 
              v-for="notification in filteredNotifications" 
              :key="notification.id" 
              class="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors duration-150"
              :class="{
                'bg-white dark:bg-gray-800': notification.is_read,
                'bg-gray-50 dark:bg-gray-700': !notification.is_read
              }"
            >
              <div class="p-6">
                <div class="flex items-start">
                  <div class="flex-shrink-0">
                    <div class="w-10 h-10 rounded-full flex items-center justify-center" :class="getNotificationColor(notification.notification_type)">
                      {{ getNotificationIcon(notification.notification_type) }}
                    </div>
                  </div>
                  <div class="ml-4 flex-1">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center">
                        <h3 class="text-sm font-medium" 
                            :class="{'text-gray-900 dark:text-white': !notification.is_read, 'text-gray-700 dark:text-gray-300': notification.is_read}">
                          {{ notification.title }}
                        </h3>
                        <span class="ml-2 px-2 py-0.5 text-xs rounded-full" :class="getNotificationColor(notification.notification_type)">
                          {{ getNotificationLabel(notification.notification_type) }}
                        </span>
                        <span v-if="notification.is_important" class="ml-2 px-2 py-0.5 text-xs rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                          Important
                        </span>
                      </div>
                      <span class="text-xs text-gray-500 dark:text-gray-400">{{ getTimeElapsed(notification.created_at) }}</span>
                    </div>
                    <p class="mt-1 text-sm" 
                       :class="{'text-gray-700 dark:text-gray-300': !notification.is_read, 'text-gray-500 dark:text-gray-400': notification.is_read}">
                      {{ notification.content }}
                    </p>
                    <div class="mt-3 flex space-x-2">
                      <button 
                        @click="handleMarkAsRead(notification)" 
                        v-if="!notification.is_read"
                        class="inline-flex items-center px-2.5 py-1.5 text-xs font-medium rounded border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Mark as Read
                      </button>
                      <button 
                        @click="handleMarkAsImportant(notification)" 
                        class="inline-flex items-center px-2.5 py-1.5 text-xs font-medium rounded"
                        :class="notification.is_important ? 
                          'text-yellow-700 bg-yellow-100 hover:bg-yellow-200 dark:text-yellow-300 dark:bg-yellow-900 dark:hover:bg-yellow-800' : 
                          'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'"
                      >
                        {{ notification.is_important ? 'Unmark Important' : 'Mark Important' }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
          
          <div class="py-3 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-center">
            <button class="text-sm font-medium text-white dark:text-white hover:text-indigo-500 dark:hover:text-indigo-300">
              Load More
            </button>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>
