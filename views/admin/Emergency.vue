<script setup>
import { ref } from 'vue';
import AdminLayout from '../../components/AdminLayout.vue';
import { useDarkModeStore } from '../../stores/darkMode';

const darkModeStore = useDarkModeStore();

const emergencyContacts = ref([
  { id: 1, name: 'Dr. John Smith', role: 'Chief Medical Officer', phone: '555-123-4567', email: 'john.smith@example.com' },
  { id: 2, name: 'Jane Doe', role: 'Emergency Coordinator', phone: '555-987-6543', email: 'jane.doe@example.com' },
  { id: 3, name: 'Robert Johnson', role: 'Security Officer', phone: '555-456-7890', email: 'robert.johnson@example.com' },
]);

const emergencyProtocols = ref([
  { id: 1, name: 'System Outage', description: 'Protocol for handling system outages and ensuring continuity of care.', lastUpdated: '2024-03-15' },
  { id: 2, name: 'Data Breach', description: 'Steps to follow in case of a data breach or security incident.', lastUpdated: '2024-03-10' },
  { id: 3, name: 'Natural Disaster', description: 'Procedures for maintaining operations during natural disasters.', lastUpdated: '2024-02-28' },
]);

const alertMessage = ref('');
const alertType = ref('Informational');
const alertRecipients = ref('All Users');

const sendAlert = () => {
  // Implement alert sending logic here
  console.log('Sending alert:', {
    message: alertMessage.value,
    type: alertType.value,
    recipients: alertRecipients.value
  });
  
  // Reset form
  alertMessage.value = '';
  alertType.value = 'Informational';
  alertRecipients.value = 'All Users';
  
  // Show confirmation
  alert('Emergency alert sent successfully!');
};
</script>

<template>
  <AdminLayout activeSection="emergency">
    <div class="container mx-auto p-4">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">Emergency Management</h1>

      <!-- Emergency Contacts -->
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Emergency Contacts</h2>
      <div class="shadow overflow-hidden border border-gray-200 dark:border-gray-700 sm:rounded-lg mb-4">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">Name</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">Role</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">Phone</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">Email</th>
              <th scope="col" class="relative px-6 py-3 border-b border-gray-200 dark:border-gray-700">
                <span class="sr-only">Edit</span>
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="contact in emergencyContacts" :key="contact.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700">{{ contact.name }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">{{ contact.role }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">{{ contact.phone }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">{{ contact.email }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium border-b border-gray-200 dark:border-gray-700">
                <a href="#" class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300">Edit</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Emergency Protocols -->
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Emergency Protocols</h2>
      <div class="shadow overflow-hidden border border-gray-200 dark:border-gray-700 sm:rounded-lg mb-4">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">Protocol Name</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">Description</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">Last Updated</th>
              <th scope="col" class="relative px-6 py-3 border-b border-gray-200 dark:border-gray-700">
                <span class="sr-only">View</span>
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="protocol in emergencyProtocols" :key="protocol.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700">{{ protocol.name }}</td>
              <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">{{ protocol.description }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">{{ protocol.lastUpdated }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium border-b border-gray-200 dark:border-gray-700">
                <a href="#" class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300">View</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Emergency Alert System -->
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Emergency Alert System</h2>
      <div class="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 border border-gray-200 dark:border-gray-700 mb-4">
        <div class="mb-4">
          <label for="alert-message" class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Alert Message:</label>
          <textarea id="alert-message" v-model="alertMessage" rows="4" class="shadow appearance-none border dark:border-gray-600 rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"></textarea>
        </div>
        <div class="mb-4">
          <label for="alert-type" class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Alert Type:</label>
          <select id="alert-type" v-model="alertType" class="shadow appearance-none border dark:border-gray-600 rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline">
            <option>Informational</option>
            <option>Warning</option>
            <option>Critical</option>
          </select>
        </div>
        <div class="mb-4">
          <label for="alert-recipients" class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Recipients:</label>
          <select id="alert-recipients" v-model="alertRecipients" class="shadow appearance-none border dark:border-gray-600 rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline">
            <option>All Users</option>
            <option>Patients Only</option>
            <option>Physicians Only</option>
            <option>Admins Only</option>
          </select>
        </div>
        <button class="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline border border-red-700 dark:border-red-800" @click="sendAlert">
          Send Emergency Alert
        </button>
      </div>
    </div>
  </AdminLayout>
</template>
