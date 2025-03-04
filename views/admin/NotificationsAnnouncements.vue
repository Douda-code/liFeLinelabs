<script setup>
import { ref } from 'vue';
import AdminLayout from '../../components/AdminLayout.vue';
import { useDarkModeStore } from '../../stores/darkMode';

const darkModeStore = useDarkModeStore();

const notifications = ref([
  { id: 1, title: 'System Maintenance', date: '2024-03-25', type: 'System' },
  { id: 2, title: 'Policy Update', date: '2024-03-24', type: 'General' },
  { id: 3, title: 'New Feature Available', date: '2024-03-23', type: 'Update' },
]);

const newAnnouncement = ref({
  title: '',
  content: ''
});

const createAnnouncement = () => {
  // Implement announcement creation logic here
  console.log('Creating announcement:', newAnnouncement.value);
  // Reset the form
  newAnnouncement.value = {
    title: '',
    content: ''
  };
};
</script>

<template>
  <AdminLayout activeSection="notifications-announcements">
    <div class="container mx-auto p-4">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">Notifications & Announcements Management</h1>

      <!-- Notification List -->
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Notification List</h2>
      <div class="shadow overflow-hidden border border-gray-200 dark:border-gray-700 sm:rounded-lg mb-4">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">Title</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">Date</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">Type</th>
              <th scope="col" class="relative px-6 py-3 border-b border-gray-200 dark:border-gray-700">
                <span class="sr-only">View</span>
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="notification in notifications" :key="notification.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700">{{ notification.title }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">{{ notification.date }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">{{ notification.type }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium border-b border-gray-200 dark:border-gray-700">
                <a href="#" class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300">View</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Compose Announcement -->
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Compose Announcement</h2>
      <div class="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div class="mb-4">
          <label for="announcement-title" class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Title:</label>
          <input type="text" id="announcement-title" v-model="newAnnouncement.title" class="shadow appearance-none border dark:border-gray-600 rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline">
        </div>
        <div class="mb-4">
          <label for="announcement-content" class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Content:</label>
          <textarea id="announcement-content" v-model="newAnnouncement.content" rows="4" class="shadow appearance-none border dark:border-gray-600 rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"></textarea>
        </div>
        <button class="bg-blue-500 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" @click="createAnnouncement">
          Create Announcement
        </button>
      </div>
    </div>
  </AdminLayout>
</template>