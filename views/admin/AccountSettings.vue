<script setup>
import { ref } from 'vue';
import AdminLayout from '../../components/AdminLayout.vue';
import { useDarkModeStore } from '../../stores/darkMode';
import { useAuthStore } from '../../stores/auth';

const darkModeStore = useDarkModeStore();
const authStore = useAuthStore();

const profile = ref({
  first_name: authStore.user?.first_name || 'Admin',
  last_name: authStore.user?.last_name || 'User',
  email: authStore.user?.email || 'admin@example.com',
  phone: authStore.user?.phone || '123-456-7890'
});

const security = ref({
  password: '',
  confirmPassword: '',
  twoFactorAuth: false
});

const preferences = ref({
  language: 'English',
  notifications: true,
  theme: darkModeStore.isDark ? 'Dark' : 'Light'
});

const activeSection = ref('account-settings');
const activeMiniSection = ref('profile');

const saveSettings = () => {
  // Implement settings saving logic here
  console.log('Saving settings:', {
    profile: profile.value,
    security: security.value,
    preferences: preferences.value
  });
  
  // Update theme if changed
  if (preferences.value.theme === 'Dark' && !darkModeStore.isDark) {
    darkModeStore.toggleDarkMode();
  } else if (preferences.value.theme === 'Light' && darkModeStore.isDark) {
    darkModeStore.toggleDarkMode();
  }
};
</script>

<template>
  <AdminLayout activeSection="account-settings">
    <div class="container mx-auto p-4">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">Account Settings</h1>

      <!-- Main Content with Mini Sidebar -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <!-- Mini Sidebar -->
        <aside class="md:col-span-1 bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Settings</h2>
          <nav class="space-y-2">
            <button @click="activeMiniSection = 'profile'" :class="{'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200': activeMiniSection === 'profile', 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600': activeMiniSection !== 'profile'}" class="block py-2 px-4 rounded transition-colors duration-200 w-full text-left">
              Profile Information
            </button>
            <button @click="activeMiniSection = 'security'" :class="{'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200': activeMiniSection === 'security', 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600': activeMiniSection !== 'security'}" class="block py-2 px-4 rounded transition-colors duration-200 w-full text-left">
              Security Settings
            </button>
            <button @click="activeMiniSection = 'preferences'" :class="{'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200': activeMiniSection === 'preferences', 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600': activeMiniSection !== 'preferences'}" class="block py-2 px-4 rounded transition-colors duration-200 w-full text-left">
              Preferences
            </button>
          </nav>
        </aside>

        <!-- Settings Content -->
        <div class="md:col-span-3 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <!-- Profile Information -->
          <div v-if="activeMiniSection === 'profile'">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Profile Information</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label for="first-name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">First Name</label>
                <input type="text" id="first-name" v-model="profile.first_name" class="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white">
              </div>
              <div>
                <label for="last-name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Last Name</label>
                <input type="text" id="last-name" v-model="profile.last_name" class="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white">
              </div>
              <div>
                <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                <input type="email" id="email" v-model="profile.email" class="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white">
              </div>
              <div>
                <label for="phone" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</label>
                <input type="tel" id="phone" v-model="profile.phone" class="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white">
              </div>
              <div>
                <label for="profile-picture" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Profile Picture</label>
                <div class="mt-1 flex items-center">
                  <img src="https://via.placeholder.com/150" alt="Profile Picture" class="h-10 w-10 rounded-full">
                  <input type="file" id="profile-picture" class="ml-4 text-gray-700 dark:text-gray-300">
                </div>
              </div>
            </div>
            <div class="mt-4 text-right">
              <button @click="saveSettings" class="bg-indigo-600 dark:bg-indigo-500 text-white px-6 py-2 rounded hover:bg-indigo-700 dark:hover:bg-indigo-600">
                Update Profile
              </button>
            </div>
          </div>
          
          <!-- Security Settings -->
          <div v-if="activeMiniSection === 'security'">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Security Settings</h2>
            <div class="space-y-4">
              <div>
                <label for="current-password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Current Password</label>
                <input type="password" id="current-password" class="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white">
              </div>
              <div>
                <label for="new-password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">New Password</label>
                <input type="password" id="new-password" v-model="security.password" class="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white">
              </div>
              <div>
                <label for="confirm-password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirm New Password</label>
                <input type="password" id="confirm-password" v-model="security.confirmPassword" class="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white">
              </div>
              <div class="flex items-center">
                <input type="checkbox" id="two-factor-auth" v-model="security.twoFactorAuth" class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded">
                <label for="two-factor-auth" class="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                  Enable Two-Factor Authentication
                </label>
              </div>
              <div class="mt-4 text-right">
                <button @click="saveSettings" class="bg-indigo-600 dark:bg-indigo-500 text-white px-6 py-2 rounded hover:bg-indigo-700 dark:hover:bg-indigo-600">
                  Update Security Settings
                </button>
              </div>
            </div>
          </div>
          
          <!-- Preferences -->
          <div v-if="activeMiniSection === 'preferences'">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Preferences</h2>
            <div class="space-y-4">
              <div>
                <label for="language" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Language</label>
                <select v-model="preferences.language" id="language" class="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white">
                  <option>English</option>
                  <option>Spanish</option>
                  <option>French</option>
                  <option>German</option>
                </select>
              </div>
              <div class="flex items-center">
                <input type="checkbox" id="notifications" v-model="preferences.notifications" class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded">
                <label for="notifications" class="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                  Enable Notifications
                </label>
              </div>
              <div>
                <label for="theme" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Theme</label>
                <select v-model="preferences.theme" id="theme" class="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white">
                  <option>Light</option>
                  <option>Dark</option>
                </select>
              </div>
              <div class="mt-4 text-right">
                <button @click="saveSettings" class="bg-indigo-600 dark:bg-indigo-500 text-white px-6 py-2 rounded hover:bg-indigo-700 dark:hover:bg-indigo-600">
                  Update Preferences
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>