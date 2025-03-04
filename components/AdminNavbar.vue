<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useDarkModeStore } from '../stores/darkMode';

const router = useRouter();
const authStore = useAuthStore();
const darkModeStore = useDarkModeStore();

const showProfileDropdown = ref(false);

const toggleProfileDropdown = () => {
  showProfileDropdown.value = !showProfileDropdown.value;
};

const logout = async () => {
  await authStore.signOut();
  router.push('/admin');
};

const profilePicture = ref('https://via.placeholder.com/150');
const userName = ref('Admin User');

// Click away functionality
const handleClickOutside = (event) => {
  if (showProfileDropdown.value && !event.target.closest('.profile-icon')) {
    showProfileDropdown.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<template>
  <nav class="bg-white dark:bg-gray-800 shadow-lg">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
      <RouterLink to="/admin/dashboard" class="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
        Admin
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
        
        <div class="relative profile-icon">
          <button
            @click="toggleProfileDropdown"
            class="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white focus:outline-none focus:shadow-outline"
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
              to="/admin/account-settings"
              class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Account Settings
            </RouterLink>
            <RouterLink
              to="/"
              class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Back to Client
            </RouterLink>
            <button
              @click="logout"
              class="block px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 w-full text-left"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.profile-icon .absolute {
  top: 100%;
  right: 0;
}
</style>