<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { RouterLink } from 'vue-router';
import { useRouter } from 'vue-router';
import { useDarkModeStore } from '../stores/darkMode';
import { useAuthStore } from '../stores/auth';
import { getUserNotifications, markNotificationAsRead, markNotificationAsImportant } from '../services/notificationService';
import LoginModal from './LoginModal.vue';

const router = useRouter();
const darkModeStore = useDarkModeStore();
const authStore = useAuthStore();
const showLoginModal = ref(false);

const notifications = ref([]);
const showNotifications = ref(false);
const showProfileDropdown = ref(false);
const loading = ref(false);
const error = ref(null);

// Load user's notifications
const loadNotifications = async () => {
  if (!authStore.isAuthenticated) return;
  
  try {
    loading.value = true;
    const data = await getUserNotifications(authStore.user.id);
    notifications.value = data;
  } catch (err) {
    console.error('Error loading notifications:', err);
    error.value = 'Failed to load notifications';
  } finally {
    loading.value = false;
  }
};

// Format date for display
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value;
  if (showNotifications.value) {
    loadNotifications();
  }
};

const toggleProfileDropdown = () => {
  showProfileDropdown.value = !showProfileDropdown.value;
};

const openLoginModal = () => {
  showLoginModal.value = true;
};

const closeLoginModal = () => {
  showLoginModal.value = false;
};

const logout = async () => {
  await authStore.signOut();
  router.push('/');
};

const goToAdmin = () => {
  router.push('/admin');
};

const handleMarkAsRead = async (notification) => {
  try {
    await markNotificationAsRead(notification.id);
    // Update local state
    notification.is_read = true;
  } catch (err) {
    console.error('Error marking notification as read:', err);
  }
};

const handleMarkAsImportant = async (notification) => {
  try {
    await markNotificationAsImportant(notification.id, !notification.is_important);
    // Update local state
    notification.is_important = !notification.is_important;
  } catch (err) {
    console.error('Error marking notification as important:', err);
  }
};

const viewNotification = () => {
  router.push('/notifications');
  showNotifications.value = false;
};

const profilePicture = ref('https://via.placeholder.com/150');
const userName = ref('John Doe');

const handleClickOutside = (event) => {
  if (showNotifications.value && !event.target.closest('.notifications-icon')) {
    showNotifications.value = false;
  }
  if (showProfileDropdown.value && !event.target.closest('.profile-icon')) {
    showProfileDropdown.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  if (authStore.isAuthenticated) {
    loadNotifications();
  }
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

// Watch for auth state changes
watch(() => authStore.isAuthenticated, (isAuthenticated) => {
  if (isAuthenticated) {
    loadNotifications();
  } else {
    notifications.value = [];
  }
});
</script>

<template>
  <nav class="bg-white dark:bg-indigo-900 shadow-lg">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
         <RouterLink to="/" class="flex items-center gap-x-0">
    <span class="text-4xl font-bold text-indigo-600 dark:text-white">liFeliNe</span>
    <span class="text-xl font-bold text-indigo-600 dark:text-indigo-400 relative ">Labs</span>
  </RouterLink>
        <div class="flex items-center">
          <!-- Dark Mode Toggle -->
          <button
            @click="darkModeStore.toggleDarkMode"
            class="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 mr-4"
            :title="darkModeStore.isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
          >
            <svg
              v-if="!darkModeStore.isDark"
              class="w-6 h-6 text-gray-600 dark:text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            </svg>
            <svg
              v-else
              class="w-6 h-6 text-yellow-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707"
              />
            </svg>
          </button>
        
          
          <!-- Admin Link -->
          <button
            @click="goToAdmin"
            class="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 mr-4"
            title="Admin Panel"
          >
            <svg 
              class="w-6 h-6 text-gray-600 dark:text-gray-300" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                stroke-width="2" 
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.486 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                stroke-width="2" 
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </button>
          
          <!-- Show these elements only when authenticated -->
          <template v-if="authStore.isAuthenticated">
            <div class="relative notifications-icon mr-4">
              <button
                @click="toggleNotifications"
                class="bg-indigo-500 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538.214 1.055.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                </svg>
              </button>
              <div
                v-if="showNotifications"
                class="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50"
              >
                <div class="block px-4 py-2 text-sm font-medium text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700">
                  Notifications
                </div>
                <div class="mt-1 max-h-96 overflow-y-auto">
                  <div v-if="loading" class="p-4 text-center text-gray-500 dark:text-gray-400">
                    Loading notifications...
                  </div>
                  <div v-else-if="error" class="p-4 text-center text-red-500 dark:text-red-400">
                    {{ error }}
                  </div>
                  <div v-else-if="notifications.length === 0" class="p-4 text-center text-gray-500 dark:text-gray-400">
                    No notifications
                  </div>
                  <ul v-else class="space-y-1">
                    <li
                      v-for="notification in notifications"
                      :key="notification.id"
                      class="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-700"
                      :class="{
                        'bg-gray-50 dark:bg-gray-700': !notification.is_read,
                        'opacity-75': notification.is_read
                      }"
                    >
                      <div class="flex-1">
                        <div class="flex items-center">
                          <h3 class="font-medium text-gray-900 dark:text-white">{{ notification.title }}</h3>
                          <button 
                            @click="handleMarkAsImportant(notification)"
                            class="ml-2 text-yellow-500 hover:text-yellow-600"
                            :class="{ 'opacity-50': !notification.is_important }"
                          >
                            ★
                          </button>
                        </div>
                        <p class="text-sm text-gray-500 dark:text-gray-400">{{ notification.content }}</p>
                        <p class="text-xs text-gray-400 dark:text-gray-500">{{ formatDate(notification.created_at) }}</p>
                      </div>
                      <div class="flex items-center space-x-2">
                        <button 
                          v-if="!notification.is_read"
                          @click="handleMarkAsRead(notification)" 
                          class="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
                        >
                          Mark as Read
                        </button>
                        <button 
                          @click="viewNotification"
                          class="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
                        >
                          View
                        </button>
                      </div>
                    </li>
                  </ul>
                </div>
                <div class="border-t border-gray-200 dark:border-gray-700 p-2 text-center">
                  <RouterLink 
                    to="/notifications" 
                    class="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
                    @click="showNotifications = false"
                  >
                    View All Notifications
                  </RouterLink>
                </div>
              </div>
            </div>
            <div class="relative profile-icon">
              <button
                @click="toggleProfileDropdown"
                class="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 focus:outline-none focus:shadow-outline"
              >
                <div class="flex-shrink-0 h-10 w-10">
                  <img
                    :src="profilePicture"
                    alt="Profile Picture"
                    class="h-10 w-10 rounded-full"
                  />
                </div>
              </button>
              <div
                v-if="showProfileDropdown"
                class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50"
              >
                <div class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 font-semibold">
                  {{ authStore.user?.name || userName }}
                </div>
                <RouterLink
                  to="/dashboard"
                  class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Dashboard
                </RouterLink>
                <RouterLink
                  to="/notifications"
                  class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Notifications
                </RouterLink>
                <RouterLink
                  to="/account-settings"
                  class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Account Settings
                </RouterLink>
                <button
                  @click="logout"
                  class="block px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 w-full text-left"
                >
                  Logout
                </button>
              </div>
            </div>
          </template>
          <!-- Show sign in/sign up when not authenticated -->
          <template v-else>
            <button
              @click="openLoginModal"
              class="bg-indigo-500 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
            >
              Sign In
            </button>
            <RouterLink
              to="/register"
              class="bg-white dark:bg-white hover:bg-gray-100 dark:hover:bg-gray-600 text-indigo-500 dark:text-indigo-500 font-bold py-2 px-4 rounded border border-indigo-500 dark:border-indigo-400 focus:outline-none focus:shadow-outline"
            >
              Sign Up
            </RouterLink>
          </template>
        </div>
      </div>
    </div>
    <!-- Login Modal -->
    <LoginModal v-if="showLoginModal" @close="closeLoginModal" />
  </nav>
</template>

<style scoped>
.notifications-icon .absolute {
  top: 100%;
  right: 0;
}

.profile-icon .absolute {
  top: 100%;
  right: 0;
}
</style>
