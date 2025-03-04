<script setup>
import { ref } from 'vue'
import NavSidebar from '../../components/NavSidebar.vue'
import { useAuthStore } from '../../stores/auth'

const authStore = useAuthStore()
const firstName = ref(authStore.user?.first_name || 'John')
const lastName = ref(authStore.user?.last_name || 'Doe')
const email = ref(authStore.user?.email || 'john.doe@example.com')
const phone = ref(authStore.user?.phone || '123-456-7890')
const profilePicture = ref('https://via.placeholder.com/150')

const loginHistory = ref([
  { date: '2024-03-15', location: 'Home', device: 'iPhone' },
  { date: '2024-03-14', location: 'Work', device: 'MacBook' }
])

const notificationPreferences = ref({
  email: true,
  sms: false,
  push: true
})

const language = ref('English')
const accessibilityOptions = ref({
  highContrast: false,
  largeText: false
})

const activeSection = ref('account-settings')
const activeMiniSection = ref('profile')

const updateProfile = () => {
  authStore.updateProfile({
    first_name: firstName.value,
    last_name: lastName.value,
    phone: phone.value
  }).then(() => {
    alert('Profile updated successfully!')
  }).catch(error => {
    alert(`Error updating profile: ${error.message}`)
  })
}

const changePassword = () => {
  alert('Password changed successfully!')
}

const setupTwoFactorAuth = () => {
  alert('Two-factor authentication set up successfully!')
}

const reviewLoginHistory = () => {
  alert('Login history reviewed.')
}

const updatePreferences = () => {
  alert('Preferences updated successfully!')
}

const upgradeAccount = () => {
  alert('Account upgraded to premium successfully!')
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">Account Settings</h1>
    </div>
    <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 py-4 px-4 sm:px-6 lg:px-8">
      <!-- Sidebar -->
      <NavSidebar :activeSection="activeSection" />

      <!-- Main Content -->
      <main class="md:col-span-3 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 grid grid-cols-1 md:grid-cols-4 gap-6">
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
            <button @click="activeMiniSection = 'accessibility'" :class="{'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200': activeMiniSection === 'accessibility', 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600': activeMiniSection !== 'accessibility'}" class="block py-2 px-4 rounded transition-colors duration-200 w-full text-left">
              Accessibility
            </button>
            <button @click="activeMiniSection = 'upgrade'" :class="{'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200': activeMiniSection === 'upgrade', 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600': activeMiniSection !== 'upgrade'}" class="block py-2 px-4 rounded transition-colors duration-200 w-full text-left">
              Upgrade Account
            </button>
          </nav>
        </aside>

        <!-- Main Content -->
        <div class="md:col-span-3">
          <div v-if="activeMiniSection === 'profile'">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Profile Information</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label for="first-name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">First Name</label>
                <input type="text" id="first-name" v-model="firstName" class="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white">
              </div>
              <div>
                <label for="last-name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Last Name</label>
                <input type="text" id="last-name" v-model="lastName" class="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white">
              </div>
              <div>
                <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                <input type="email" id="email" v-model="email" class="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white">
              </div>
              <div>
                <label for="phone" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</label>
                <input type="tel" id="phone" v-model="phone" class="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white">
              </div>
              <div>
                <label for="profile-picture" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Profile Picture</label>
                <div class="mt-1 flex items-center">
                  <img :src="profilePicture" alt="Profile Picture" class="h-10 w-10 rounded-full">
                  <input type="file" id="profile-picture" class="ml-4 text-gray-700 dark:text-gray-300">
                </div>
              </div>
            </div>
            <div class="mt-4 text-right">
              <button @click="updateProfile" class="bg-indigo-600 dark:bg-indigo-500 text-white px-6 py-2 rounded hover:bg-indigo-700 dark:hover:bg-indigo-600">
                Update Profile
              </button>
            </div>
          </div>
          
          <div v-if="activeMiniSection === 'security'">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Security Settings</h2>
            <div class="space-y-4">
              <div>
                <button @click="changePassword" class="w-full bg-indigo-600 dark:bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-700 dark:hover:bg-indigo-600">
                  Change Password
                </button>
              </div>
              <div>
                <button @click="setupTwoFactorAuth" class="w-full bg-indigo-600 dark:bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-700 dark:hover:bg-indigo-600">
                  Set Up Two-Factor Authentication
                </button>
              </div>
              <div>
                <button @click="reviewLoginHistory" class="w-full bg-indigo-600 dark:bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-700 dark:hover:bg-indigo-600">
                  Review Login History
                </button>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Login History</h3>
                <ul class="space-y-2">
                  <li v-for="entry in loginHistory" :key="entry.date" class="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                    <div>
                      <p class="text-sm font-medium text-gray-900 dark:text-white">{{ entry.date }}</p>
                      <p class="text-sm text-gray-500 dark:text-gray-300">{{ entry.location }} - {{ entry.device }}</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <div v-if="activeMiniSection === 'preferences'">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Preferences</h2>
            <div class="space-y-4">
              <div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Notification Preferences</h3>
                <div class="flex items-center">
                  <input type="checkbox" id="email-notifications" v-model="notificationPreferences.email" class="mr-2">
                  <label for="email-notifications" class="text-sm text-gray-700 dark:text-gray-300">Email Notifications</label>
                </div>
                <div class="flex items-center">
                  <input type="checkbox" id="sms-notifications" v-model="notificationPreferences.sms" class="mr-2">
                  <label for="sms-notifications" class="text-sm text-gray-700 dark:text-gray-300">SMS Notifications</label>
                </div>
                <div class="flex items-center">
                  <input type="checkbox" id="push-notifications" v-model="notificationPreferences.push" class="mr-2">
                  <label for="push-notifications" class="text-sm text-gray-700 dark:text-gray-300">Push Notifications</label>
                </div>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Language Selection</h3>
                <select v-model="language" class="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white">
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                  <option value="German">German</option>
                </select>
              </div>
            </div>
          </div>

          <div v-if="activeMiniSection === 'accessibility'">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Accessibility Options</h2>
            <div class="space-y-4">
              <div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Accessibility Options</h3>
                <div class="flex items-center">
                  <input type="checkbox" id="high-contrast" v-model="accessibilityOptions.highContrast" class="mr-2">
                  <label for="high-contrast" class="text-sm text-gray-700 dark:text-gray-300">High Contrast</label>
                </div>
                <div class="flex items-center">
                  <input type="checkbox" id="large-text" v-model="accessibilityOptions.largeText" class="mr-2">
                  <label for="large-text" class="text-sm text-gray-700 dark:text-gray-300">Large Text</label>
                </div>
              </div>
            </div>
            <div class="mt-4 text-right">
              <button @click="updatePreferences" class="bg-indigo-600 dark:bg-indigo-500 text-white px-6 py-2 rounded hover:bg-indigo-700 dark:hover:bg-indigo-600">
                Update Preferences
              </button>
            </div>
          </div>

          <div v-if="activeMiniSection === 'upgrade'">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Upgrade Account</h2>
            <div class="space-y-4">
              <div>
                <button @click="upgradeAccount" class="bg-indigo-600 dark:bg-indigo-500 text-white px-6 py-2 rounded hover:bg-indigo-700 dark:hover:bg-indigo-600">
                  Upgrade to Premium
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>