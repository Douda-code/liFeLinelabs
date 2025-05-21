<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { useDarkModeStore } from '../stores/darkMode';
import { useAuthStore } from '../stores/auth';
import { getUserNotifications, markNotificationAsRead, markNotificationAsImportant } from '../services/notificationService';
import LoginModal from './LoginModal.vue';

const router = useRouter();
const darkModeStore = useDarkModeStore();
const authStore = useAuthStore();

// Reactive state
const showLoginModal = ref(false);
const notifications = ref([]);
const showNotifications = ref(false);
const showProfileDropdown = ref(false);
const loading = ref(false);
const error = ref(null);

// Computed properties
const unreadNotificationsCount = computed(() => {
  return notifications.value.filter(n => !n.is_read).length;
});

const importantNotifications = computed(() => {
  return notifications.value.filter(n => n.is_important);
});

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

// Format date with relative time
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return 'Today';
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else {
    return date.toLocaleDateString();
  }
};

// UI interaction methods
const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value;
  showProfileDropdown.value = false;
  if (showNotifications.value) {
    loadNotifications();
  }
};

const toggleProfileDropdown = () => {
  showProfileDropdown.value = !showProfileDropdown.value;
  showNotifications.value = false;
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

const handleMarkAsRead = async (notification, event) => {
  event.stopPropagation();
  try {
    await markNotificationAsRead(notification.id);
    notification.is_read = true;
  } catch (err) {
    console.error('Error marking notification as read:', err);
  }
};

const handleMarkAsImportant = async (notification, event) => {
  event.stopPropagation();
  try {
    await markNotificationAsImportant(notification.id, !notification.is_important);
    notification.is_important = !notification.is_important;
  } catch (err) {
    console.error('Error marking notification as important:', err);
  }
};

const viewNotification = (notification) => {
  router.push(`/notifications/${notification.id}`);
  showNotifications.value = false;
};

const viewAllNotifications = () => {
  router.push('/notifications');
  showNotifications.value = false;
};

// Click outside handler
const handleClickOutside = (event) => {
  if (showNotifications.value && !event.target.closest('.notifications-wrapper')) {
    showNotifications.value = false;
  }
  if (showProfileDropdown.value && !event.target.closest('.profile-wrapper')) {
    showProfileDropdown.value = false;
  }
};

// Lifecycle hooks
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
  <header class="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-md backdrop-blur-sm bg-opacity-80 dark:bg-opacity-80">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <nav class="flex items-center justify-between h-16">
        <!-- Logo -->
        <RouterLink to="/" class="flex items-center gap-x-1 group">
          <span class="text-3xl font-bold text-indigo-600 dark:text-white transition-all duration-300 group-hover:text-indigo-700 dark:group-hover:text-indigo-200">liFeliNe</span>
          <span class="text-xl font-bold text-indigo-500 dark:text-indigo-400 transition-all duration-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-300">Labs</span>
        </RouterLink>

        <!-- Action buttons -->
        <div class="flex items-center space-x-4">
          <!-- Find Doctors Link -->
          <RouterLink 
            to="/find-doctors" 
            class="hidden md:inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
          >
            <svg class="h-5 w-5 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Find Doctors
          </RouterLink>
           
          <!-- Dark Mode Toggle -->
          <button
    @click="darkModeStore.toggleDarkMode"
    class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
    :title="darkModeStore.isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
    aria-label="Toggle dark mode"
  >
    <svg
      v-if="!darkModeStore.isDark"
      class="w-5 h-5 text-gray-700 dark:text-gray-300"
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
      class="w-5 h-5 text-yellow-400"
      fill="currentColor"
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
  </button>
          
          <!-- Admin Button -->
          <button
            v-if="authStore.user?.role === 'admin'"
            @click="goToAdmin"
            class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
            title="Admin Panel"
            aria-label="Admin panel"
          >
            <svg 
              class="w-5 h-5 text-gray-700 dark:text-gray-300" 
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
          
          <!-- Authenticated User Interface -->
          <template v-if="authStore.isAuthenticated">
            <!-- Notifications -->
            <div class="notifications-wrapper relative">
              <button
                @click="toggleNotifications"
                class="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                aria-label="Notifications"
              >
                <svg class="h-5 w-5 text-gray-700 dark:text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538.214 1.055.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                </svg>
                <!-- Notification Badge -->
                <span 
                  v-if="unreadNotificationsCount > 0"
                  class="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
                >
                  {{ unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount }}
                </span>
              </button>
              
              <!-- Notifications Dropdown -->
              <div
                v-if="showNotifications"
                class="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700"
                style="max-height: 80vh"
              >
                <div class="flex justify-between items-center px-4 py-3 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                  <h3 class="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                  <button @click="viewAllNotifications" class="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300">
                    View All
                  </button>
                </div>
                
                <div class="overflow-y-auto" style="max-height: 60vh">
                  <!-- Loading State -->
                  <div v-if="loading" class="p-4 text-center text-gray-500 dark:text-gray-400">
                    <svg class="animate-spin h-5 w-5 mx-auto mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading notifications...
                  </div>
                  
                  <!-- Error State -->
                  <div v-else-if="error" class="p-4 text-center text-red-500 dark:text-red-400">
                    <svg class="h-6 w-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    {{ error }}
                  </div>
                  
                  <!-- Empty State -->
                  <div v-else-if="notifications.length === 0" class="p-8 text-center text-gray-500 dark:text-gray-400">
                    <svg class="h-12 w-12 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    No notifications yet
                  </div>
                  
                  <!-- Notifications List -->
                  <div v-else>
                    <!-- Important Notifications Section -->
                    <div v-if="importantNotifications.length > 0" class="border-b border-gray-200 dark:border-gray-700">
                      <div class="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900">
                        IMPORTANT
                      </div>
                      <div v-for="notification in importantNotifications" :key="`important-${notification.id}`" 
                        @click="viewNotification(notification)"
                        class="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-800"
                        :class="{ 'bg-indigo-50 dark:bg-indigo-900/20': !notification.is_read }"
                      >
                        <div class="flex justify-between">
                          <h4 class="font-medium text-gray-900 dark:text-white flex items-center">
                            {{ notification.title }}
                            <span class="ml-2 text-yellow-500">★</span>
                          </h4>
                          <div class="flex space-x-2">
                            <button 
                              v-if="!notification.is_read"
                              @click="handleMarkAsRead(notification, $event)" 
                              class="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
                            >
                              Read
                            </button>
                            <button 
                              @click="handleMarkAsImportant(notification, $event)"
                              class="text-xs text-yellow-600 dark:text-yellow-400 hover:text-yellow-700 dark:hover:text-yellow-300"
                            >
                              Unstar
                            </button>
                          </div>
                        </div>
                        <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">{{ notification.content }}</p>
                        <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">{{ formatDate(notification.created_at) }}</p>
                      </div>
                    </div>
                    
                    <!-- Regular Notifications -->
                    <div v-for="notification in notifications.filter(n => !n.is_important)" :key="`regular-${notification.id}`" 
                      @click="viewNotification(notification)"
                      class="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-800"
                      :class="{ 'bg-indigo-50 dark:bg-indigo-900/20': !notification.is_read }"
                    >
                      <div class="flex justify-between">
                        <h4 class="font-medium text-gray-900 dark:text-white">{{ notification.title }}</h4>
                        <div class="flex space-x-2">
                          <button 
                            v-if="!notification.is_read"
                            @click="handleMarkAsRead(notification, $event)" 
                            class="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
                          >
                            Read
                          </button>
                          <button 
                            @click="handleMarkAsImportant(notification, $event)"
                            class="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                          >
                            Star
                          </button>
                        </div>
                      </div>
                      <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">{{ notification.content }}</p>
                      <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">{{ formatDate(notification.created_at) }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- User Profile -->
            <div class="profile-wrapper relative">
              <button
                @click="toggleProfileDropdown"
                class="flex items-center focus:outline-none"
                aria-label="User menu"
              >
                <div class="h-8 w-8 rounded-full overflow-hidden ring-2 ring-indigo-500 dark:ring-indigo-400">
                  <img
                    :src="authStore.user?.profilePicture || 'https://via.placeholder.com/150'"
                    alt="Profile"
                    class="h-full w-full object-cover"
                  />
                </div>
              </button>
              
              <!-- Profile Dropdown -->
              <div
                v-if="showProfileDropdown"
                class="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700"
              >
                <div class="p-4 border-b border-gray-200 dark:border-gray-700">
                  <p class="font-medium text-gray-900 dark:text-white">{{ authStore.user?.name || 'User' }}</p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">{{ authStore.user?.email || 'user@example.com' }}</p>
                </div>
                
                <div class="py-1">
                  <RouterLink
                    to="/dashboard"
                    class="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <svg class="mr-3 h-5 w-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Dashboard
                  </RouterLink>
                  
                  <RouterLink
                    to="/notifications"
                    class="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <svg class="mr-3 h-5 w-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538.214 1.055.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    Notifications
                  </RouterLink>
                  <RouterLink
										     to="/account-settings"
                    class="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <svg class="mr-3 h-5 w-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.486 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                     </svg>
                    Account Settings
									</RouterLink>
                  
                  <button
                    @click="logout"
                    class="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                  >
                    <svg class="mr-3 h-5 w-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </template>
          
          <!-- Unauthenticated User Interface -->
          <template v-else>
            <button
              @click="openLoginModal"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
            >
              Sign In
            </button>
          </template>
        </div>
      </nav>
    </div>
  </header>
  
  <!-- Login Modal -->
  <LoginModal
    v-if="showLoginModal"
    @close="closeLoginModal"
  />
</template>

<style scoped>
.notifications-wrapper .absolute,
.profile-wrapper .absolute {
  z-index: 50;
}
</style>
