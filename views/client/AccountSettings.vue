```vue
<script setup>
import { ref } from 'vue'
import NavSidebar from '../../components/NavSidebar.vue'
import { useAuthStore } from '../../stores/auth'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()
const firstName = ref(authStore.user?.first_name || 'John')
const lastName = ref(authStore.user?.last_name || 'Doe')
const email = ref(authStore.user?.email || 'john.doe@example.com')
const phone = ref(authStore.user?.phone || '123-456-7890')
const profilePicture = ref('https://via.placeholder.com/150')

const loginHistory = ref([
  { date: '2024-03-15', location: 'Home', device: 'iPhone', time: '9:45 AM' },
  { date: '2024-03-14', location: 'Work', device: 'MacBook', time: '2:30 PM' }
])

const notificationPreferences = ref({
  email: true,
  sms: false,
  push: true,
  marketing: false,
  updates: true
})

const language = ref('English')
const accessibilityOptions = ref({
  highContrast: false,
  largeText: false,
  reducedMotion: false,
  screenReader: false
})

const activeSection = ref('account-settings')
const activeMiniSection = ref('profile')

const updateProfile = () => {
  authStore.updateProfile({
    first_name: firstName.value,
    last_name: lastName.value,
    phone: phone.value
  }).then(() => {
    showToast('Profile updated successfully!')
  }).catch(error => {
    showToast(`Error updating profile: ${error.message}`, 'error')
  })
}

const showToast = (message, type = 'success') => {
  // Toast notification instead of alert
  const toast = {
    message,
    type
  }
  // Implementation would depend on your toast system
  console.log('Toast:', toast)
}

const changePassword = () => {
  showToast('Password changed successfully!')
}

const setupTwoFactorAuth = () => {
  showToast('Two-factor authentication set up successfully!')
}

const reviewLoginHistory = () => {
  showToast('Login history reviewed.')
}

const updatePreferences = () => {
  showToast('Preferences updated successfully!')
}

const upgradeAccount = () => {
  router.push('/upgrade-account')
}

const switchMiniSection = (section) => {
  activeMiniSection.value = section
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-900">
    <!-- Header with gradient background -->
   


    
    <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 py-8 px-4 sm:px-6 lg:px-8">
    

      <!-- Main Content -->
      <main class="md:col-span-4 rounded-x1 shadow-xl overflow-hidden bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
        <!-- Header tabs for mini sections (mobile view) -->
        <div class="md:hidden overflow-x-auto flex space-x-2 p-4 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
          <button 
            v-for="section in ['profile', 'security', 'preferences', 'accessibility', 'upgrade']" 
            :key="section"
            @click="switchMiniSection(section)"
            class="whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all duration-200"
            :class="activeMiniSection === section ? 
              'bg-indigo-600 text-white shadow-md' : 
              'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600'"
          >
            {{ section.charAt(0).toUpperCase() + section.slice(1) }}
          </button>
        </div>

        <div class="flex flex-col md:flex-row">
          <!-- Mini Sidebar (desktop only) -->
          <aside class="hidden md:block md:w-64 border-r border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
            <div class="p-6">
              <h2 class="text-xl font-semibold text-slate-900 dark:text-white mb-6">Settings</h2>
              <nav class="space-y-1">
                <button 
                  v-for="(label, section) in {
                    'profile': 'Profile Information',
                    'security': 'Security Settings',
                    'preferences': 'Preferences',
                    'accessibility': 'Accessibility',
                    'upgrade': 'Upgrade Account'
                  }" 
                  :key="section"
                  @click="activeMiniSection = section" 
                  class="flex items-center w-full px-4 py-3 rounded-lg transition-all duration-200 group"
                  :class="activeMiniSection === section ? 
                    'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-medium': 
                    'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50'"
                >
                  <!-- Icons would be added here -->
                  <span class="ml-3">{{ label }}</span>
                  <span 
                    v-if="activeMiniSection === section"
                    class="ml-auto h-1.5 w-1.5 rounded-full bg-indigo-500"
                  ></span>
                </button>
              </nav>
            </div>
          </aside>

          <!-- Content Area -->
          <div class="flex-1 p-6">
            <!-- Profile Section -->
            <div v-if="activeMiniSection === 'profile'" class="animate-fadeIn">
              <div class="flex items-center justify-between mb-6">
                <h2 class="text-2xl font-semibold text-slate-900 dark:text-white">Profile Information</h2>
                <button @click="updateProfile" class="inline-flex items-center px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-sm">
                  Save Changes
                </button>
              </div>

              <div class="mb-8">
                <div class="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                  <div class="relative group">
                    <img :src="profilePicture" alt="Profile Picture" class="h-24 w-24 rounded-full object-cover border-4 border-white dark:border-slate-700 shadow-md">
                    <div class="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <span class="text-white font-medium text-sm">Change</span>
                    </div>
                    <input type="file" class="hidden" id="profile-upload">
                  </div>
                  <div class="flex-1">
                    <h3 class="text-xl font-medium text-slate-900 dark:text-white text-center sm:text-left">
                      {{ firstName }} {{ lastName }}
                    </h3>
                    <p class="text-slate-500 dark:text-slate-400 text-center sm:text-left">
                      {{ email }}
                    </p>
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-4">
                  <label class="block">
                    <span class="text-sm font-medium text-slate-700 dark:text-slate-300">First Name</span>
                    <input 
                      type="text" 
                      v-model="firstName" 
                      class="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-900 dark:text-white"
                    >
                  </label>
                  
                  <label class="block">
                    <span class="text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</span>
                    <input 
                      type="email" 
                      v-model="email" 
                      class="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-900 dark:text-white"
                    >
                  </label>
                </div>
                
                <div class="space-y-4">
                  <label class="block">
                    <span class="text-sm font-medium text-slate-700 dark:text-slate-300">Last Name</span>
                    <input 
                      type="text" 
                      v-model="lastName" 
                      class="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-900 dark:text-white"
                    >
                  </label>
                  
                  <label class="block">
                    <span class="text-sm font-medium text-slate-700 dark:text-slate-300">Phone Number</span>
                    <input 
                      type="tel" 
                      v-model="phone" 
                      class="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-900 dark:text-white"
                    >
                  </label>
                </div>
              </div>
            </div>
            
            <!-- Security Section -->
            <div v-if="activeMiniSection === 'security'" class="animate-fadeIn">
              <h2 class="text-2xl font-semibold text-slate-900 dark:text-white mb-6">Security Settings</h2>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
                  <h3 class="text-lg font-medium text-slate-900 dark:text-white mb-4">Password Management</h3>
                  <p class="text-slate-500 dark:text-slate-400 mb-4">Strong passwords help protect your account from unauthorized access.</p>
                  <button @click="changePassword" class="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm">
                    Change Password
                  </button>
                </div>
                
                <div class="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
                  <h3 class="text-lg font-medium text-slate-900 dark:text-white mb-4">Two-Factor Authentication</h3>
                  <p class="text-slate-500 dark:text-slate-400 mb-4">Add an extra layer of security to your account with 2FA.</p>
                  <button @click="setupTwoFactorAuth" class="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm">
                    Set Up Two-Factor Authentication
                  </button>
                </div>
              </div>
              
              <div class="mt-8">
                <h3 class="text-lg font-medium text-slate-900 dark:text-white mb-4">Recent Login Activity</h3>
                <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                  <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                      <thead class="bg-slate-50 dark:bg-slate-700/50">
                        <tr>
                          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Date & Time</th>
                          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Location</th>
                          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Device</th>
                        </tr>
                      </thead>
                      <tbody class="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                        <tr v-for="entry in loginHistory" :key="entry.date" class="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                          <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-white">{{ entry.date }} {{ entry.time }}</td>
                          <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{{ entry.location }}</td>
                          <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{{ entry.device }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div class="mt-4 text-right">
                  <button @click="reviewLoginHistory" class="text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:text-indigo-800 dark:hover:text-indigo-300">
                    View Full Login History →
                  </button>
                </div>
              </div>
            </div>
            
            <!-- Preferences Section -->
            <div v-if="activeMiniSection === 'preferences'" class="animate-fadeIn">
              <div class="flex items-center justify-between mb-6">
                <h2 class="text-2xl font-semibold text-slate-900 dark:text-white">Preferences</h2>
                <button @click="updatePreferences" class="inline-flex items-center px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-sm">
                  Save Preferences
                </button>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div class="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
                  <h3 class="text-lg font-medium text-slate-900 dark:text-white mb-4">Notification Settings</h3>
                  
                  <div class="space-y-4">
                    <label class="flex items-center justify-between cursor-pointer">
                      <span class="text-slate-700 dark:text-slate-300">Email Notifications</span>
                      <div class="relative">
                        <input type="checkbox" v-model="notificationPreferences.email" class="sr-only peer">
                        <div class="w-11 h-6 bg-slate-200 dark:bg-slate-700 rounded-full peer peer-checked:bg-indigo-600 peer-focus:outline-none transition-colors"></div>
                        <div class="absolute left-1 top-1 bg-white dark:bg-slate-300 w-4 h-4 rounded-full peer-checked:translate-x-5 transition-transform"></div>
                      </div>
                    </label>
                    
                    <label class="flex items-center justify-between cursor-pointer">
                      <span class="text-slate-700 dark:text-slate-300">SMS Notifications</span>
                      <div class="relative">
                        <input type="checkbox" v-model="notificationPreferences.sms" class="sr-only peer">
                        <div class="w-11 h-6 bg-slate-200 dark:bg-slate-700 rounded-full peer peer-checked:bg-indigo-600 peer-focus:outline-none transition-colors"></div>
                        <div class="absolute left-1 top-1 bg-white dark:bg-slate-300 w-4 h-4 rounded-full peer-checked:translate-x-5 transition-transform"></div>
                      </div>
                    </label>
                    
                    <label class="flex items-center justify-between cursor-pointer">
                      <span class="text-slate-700 dark:text-slate-300">Push Notifications</span>
                      <div class="relative">
                        <input type="checkbox" v-model="notificationPreferences.push" class="sr-only peer">
                        <div class="w-11 h-6 bg-slate-200 dark:bg-slate-700 rounded-full peer peer-checked:bg-indigo-600 peer-focus:outline-none transition-colors"></div>
                        <div class="absolute left-1 top-1 bg-white dark:bg-slate-300 w-4 h-4 rounded-full peer-checked:translate-x-5 transition-transform"></div>
                      </div>
                    </label>
                    
                    <label class="flex items-center justify-between cursor-pointer">
                      <span class="text-slate-700 dark:text-slate-300">Marketing Emails</span>
                      <div class="relative">
                        <input type="checkbox" v-model="notificationPreferences.marketing" class="sr-only peer">
                        <div class="w-11 h-6 bg-slate-200 dark:bg-slate-700 rounded-full peer peer-checked:bg-indigo-600 peer-focus:outline-none transition-colors"></div>
                        <div class="absolute left-1 top-1 bg-white dark:bg-slate-300 w-4 h-4 rounded-full peer-checked:translate-x-5 transition-transform"></div>
                      </div>
                    </label>
                  </div>
                </div>
                
                <div class="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
                  <h3 class="text-lg font-medium text-slate-900 dark:text-white mb-4">Language Settings</h3>
                  
                  <label class="block">
                    <span class="text-sm font-medium text-slate-700 dark:text-slate-300">Select Language</span>
                    <select 
                      v-model="language" 
                      class="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-900 dark:text-white"
                    >
                      <option value="English">English</option>
                      <option value="Spanish">Spanish</option>
                      <option value="French">French</option>
                      <option value="German">German</option>
                      <option value="Chinese">Chinese</option>
                      <option value="Japanese">Japanese</option>
                    </select>
                  </label>
                  
                  <div class="mt-6">
                    <h4 class="text-md font-medium text-slate-900 dark:text-white mb-3">Time Zone</h4>
                    <select 
                      class="block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus```vue
sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-900 dark:text-white"
                    >
                      <option value="UTC">UTC (Coordinated Universal Time)</option>
                      <option value="EST">EST (Eastern Standard Time)</option>
                      <option value="PST">PST (Pacific Standard Time)</option>
                      <option value="GMT">GMT (Greenwich Mean Time)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Accessibility Section -->
            <div v-if="activeMiniSection === 'accessibility'" class="animate-fadeIn">
              <div class="flex items-center justify-between mb-6">
                <h2 class="text-2xl font-semibold text-slate-900 dark:text-white">Accessibility Options</h2>
                <button @click="updatePreferences" class="inline-flex items-center px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-sm">
                  Save Settings
                </button>
              </div>
              
              <div class="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="flex items-center space-x-3 mb-4 cursor-pointer">
                      <div class="relative">
                        <input type="checkbox" v-model="accessibilityOptions.highContrast" class="sr-only peer">
                        <div class="w-11 h-6 bg-slate-200 dark:bg-slate-700 rounded-full peer peer-checked:bg-indigo-600 peer-focus:outline-none transition-colors"></div>
                        <div class="absolute left-1 top-1 bg-white dark:bg-slate-300 w-4 h-4 rounded-full peer-checked:translate-x-5 transition-transform"></div>
                      </div>
                      <div>
                        <span class="text-slate-900 dark:text-white font-medium">High Contrast Mode</span>
                        <p class="text-sm text-slate-500 dark:text-slate-400">Increase contrast for better readability</p>
                      </div>
                    </label>
                    
                    <label class="flex items-center space-x-3 mb-4 cursor-pointer">
                      <div class="relative">
                        <input type="checkbox" v-model="accessibilityOptions.largeText" class="sr-only peer">
                        <div class="w-11 h-6 bg-slate-200 dark:bg-slate-700 rounded-full peer peer-checked:bg-indigo-600 peer-focus:outline-none transition-colors"></div>
                        <div class="absolute left-1 top-1 bg-white dark:bg-slate-300 w-4 h-4 rounded-full peer-checked:translate-x-5 transition-transform"></div>
                      </div>
                      <div>
                        <span class="text-slate-900 dark:text-white font-medium">Large Text</span>
                        <p class="text-sm text-slate-500 dark:text-slate-400">Increase text size throughout the interface</p>
                      </div>
                    </label>
                  </div>
                  
                                      <label class="flex items-center space-x-3 mb-4 cursor-pointer">
                      <div class="relative">
                        <input type="checkbox" v-model="accessibilityOptions.reducedMotion" class="sr-only peer">
                        <div class="w-11 h-6 bg-slate-200 dark:bg-slate-700 rounded-full peer peer-checked:bg-indigo-600 peer-focus:outline-none transition-colors"></div>
                        <div class="absolute left-1 top-1 bg-white dark:bg-slate-300 w-4 h-4 rounded-full peer-checked:translate-x-5 transition-transform"></div>
                      </div>
                      <div>
                        <span class="text-slate-900 dark:text-white font-medium">Reduced Motion</span>
                        <p class="text-sm text-slate-500 dark:text-slate-400">Minimize animations and transitions</p>
                      </div>
                    </label>
                    
                    <label class="flex items-center space-x-3 mb-4 cursor-pointer">
                      <div class="relative">
                        <input type="checkbox" v-model="accessibilityOptions.screenReader" class="sr-only peer">
                        <div class="w-11 h-6 bg-slate-200 dark:bg-slate-700 rounded-full peer peer-checked:bg-indigo-600 peer-focus:outline-none transition-colors"></div>
                        <div class="absolute left-1 top-1 bg-white dark:bg-slate-300 w-4 h-4 rounded-full peer-checked:translate-x-5 transition-transform"></div>
                      </div>
                      <div>
                        <span class="text-slate-900 dark:text-white font-medium">Screen Reader Support</span>
                        <p class="text-sm text-slate-500 dark:text-slate-400">Optimize interface for screen reader compatibility</p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Upgrade Account Section -->
            <div v-if="activeMiniSection === 'upgrade'" class="animate-fadeIn">
              <h2 class="text-2xl font-semibold text-slate-900 dark:text-white mb-4">Upgrade Account</h2>
              <p class="text-slate-700 dark:text-slate-300 mb-4">
                Enjoy additional features and enhanced performance with a premium account. Upgrade now to unlock the full potential of our platform.
              </p>
              <router-link to="/upgrade-account" class="inline-flex items-center px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-sm">
                Upgrade Now
              </router-link>
              <!-- Additional upgrade information or benefits can be added here -->
            </div>
            
          </div>
			</main>
        </div>
      
    </div>
  
</template>
```vue
