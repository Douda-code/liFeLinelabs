<script setup>
import { ref } from 'vue';
import AdminLayout from '../../components/AdminLayout.vue';
import { useDarkModeStore } from '../../stores/darkMode';

const darkModeStore = useDarkModeStore();

const settings = ref({
  language: 'English',
  timezone: 'UTC',
  branding: 'Healthcare Admin',
  passwordRequirements: '8 characters, 1 uppercase, 1 number',
  '2fa': 'Enabled',
  sessionTimeout: '30 minutes',
  aiModel: 'Default',
  thirdPartyServices: 'None',
  dataStorage: 'Local',
  backupSchedule: 'Daily',
  recoveryPlan: 'Contact support'
});

const activeMiniSection = ref('general');

const saveSettings = () => {
  // Implement settings saving logic here
  console.log('Saving settings:', settings.value);
};
</script>

<template>
  <AdminLayout activeSection="system-settings">
    <div class="container mx-auto p-4">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">System Settings & Configuration</h1>

      <!-- Main Content with Mini Sidebar -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <!-- Mini Sidebar -->
        <aside class="md:col-span-1 bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Settings</h2>
          <nav class="space-y-2">
            <button @click="activeMiniSection = 'general'" :class="{'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200': activeMiniSection === 'general', 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600': activeMiniSection !== 'general'}" class="block py-2 px-4 rounded transition-colors duration-200 w-full text-left">
              General Settings
            </button>
            <button @click="activeMiniSection = 'security'" :class="{'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200': activeMiniSection === 'security', 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600': activeMiniSection !== 'security'}" class="block py-2 px-4 rounded transition-colors duration-200 w-full text-left">
              Security Settings
            </button>
            <button @click="activeMiniSection = 'integration'" :class="{'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200': activeMiniSection === 'integration', 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600': activeMiniSection !== 'integration'}" class="block py-2 px-4 rounded transition-colors duration-200 w-full text-left">
              Integration & API
            </button>
            <button @click="activeMiniSection = 'backup'" :class="{'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200': activeMiniSection === 'backup', 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600': activeMiniSection !== 'backup'}" class="block py-2 px-4 rounded transition-colors duration-200 w-full text-left">
              Backup & Recovery
            </button>
          </nav>
        </aside>

        <!-- Settings Content -->
        <div class="md:col-span-3 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <!-- General Settings -->
          <div v-if="activeMiniSection === 'general'">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">General Settings</h2>
            <div class="space-y-4">
              <div>
                <label for="language" class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Language:</label>
                <select id="language" v-model="settings.language" class="shadow appearance-none border dark:border-gray-600 rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                  <option>English</option>
                  <option>Spanish</option>
                  <option>French</option>
                </select>
              </div>
              <div>
                <label for="timezone" class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Timezone:</label>
                <select id="timezone" v-model="settings.timezone" class="shadow appearance-none border dark:border-gray-600 rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                  <option>UTC</option>
                  <option>EST</option>
                  <option>PST</option>
                </select>
              </div>
              <div>
                <label for="branding" class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Branding:</label>
                <input type="text" id="branding" v-model="settings.branding" class="shadow appearance-none border dark:border-gray-600 rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline">
              </div>
              <div class="text-right">
                <button class="bg-indigo-600 dark:bg-indigo-500 text-white px-6 py-2 rounded hover:bg-indigo-700 dark:hover:bg-indigo-600" @click="saveSettings">
                  Save Settings
                </button>
              </div>
            </div>
          </div>

          <!-- Security Settings -->
          <div v-if="activeMiniSection === 'security'">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Security Settings</h2>
            <div class="space-y-4">
              <div>
                <label for="password-requirements" class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Password Requirements:</label>
                <input type="text" id="password-requirements" v-model="settings.passwordRequirements" class="shadow appearance-none border dark:border-gray-600 rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline">
              </div>
              <div>
                <label for="2fa" class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">2FA:</label>
                <select id="2fa" v-model="settings['2fa']" class="shadow appearance-none border dark:border-gray-600 rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                  <option>Enabled</option>
                  <option>Disabled</option>
                </select>
              </div>
              <div>
                <label for="session-timeout" class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Session Timeout:</label>
                <input type="text" id="session-timeout" v-model="settings.sessionTimeout" class="shadow appearance-none border dark:border-gray-600 rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline">
              </div>
              <div class="text-right">
                <button class="bg-indigo-600 dark:bg-indigo-500 text-white px-6 py-2 rounded hover:bg-indigo-700 dark:hover:bg-indigo-600" @click="saveSettings">
                  Save Settings
                </button>
              </div>
            </div>
          </div>

          <!-- Integration & API Settings -->
          <div v-if="activeMiniSection === 'integration'">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Integration & API Settings</h2>
            <div class="space-y-4">
              <div>
                <label for="ai-model" class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">AI Model Integration:</label>
                <input type="text" id="ai-model" v-model="settings.aiModel" class="shadow appearance-none border dark:border-gray-600 rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline">
              </div>
              <div>
                <label for="third-party-services" class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Third-Party Services:</label>
                <input type="text" id="third-party-services" v-model="settings.thirdPartyServices" class="shadow appearance-none border dark:border-gray-600 rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline">
              </div>
              <div>
                <label for="data-storage" class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Data Storage:</label>
                <input type="text" id="data-storage" v-model="settings.dataStorage" class="shadow appearance-none border dark:border-gray-600 rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline">
              </div>
              <div class="text-right">
                <button class="bg-indigo-600 dark:bg-indigo-500 text-white px-6 py-2 rounded hover:bg-indigo-700 dark:hover:bg-indigo-600" @click="saveSettings">
                  Save Settings
                </button>
              </div>
            </div>
          </div>

          <!-- Backup & Recovery -->
          <div v-if="activeMiniSection === 'backup'">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Backup & Recovery</h2>
            <div class="space-y-4">
              <div>
                <label for="backup-schedule" class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Backup Schedule:</label>
                <input type="text" id="backup-schedule" v-model="settings.backupSchedule" class="shadow appearance-none border dark:border-gray-600 rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline">
              </div>
              <div>
                <label for="recovery-plan" class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Recovery Plan:</label>
                <textarea id="recovery-plan" v-model="settings.recoveryPlan" rows="4" class="shadow appearance-none border dark:border-gray-600 rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"></textarea>
              </div>
              <div class="text-right">
                <button class="bg-indigo-600 dark:bg-indigo-500 text-white px-6 py-2 rounded hover:bg-indigo-700 dark:hover:bg-indigo-600" @click="saveSettings">
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>
