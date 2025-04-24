<script setup>
import AdminLayout from '../../components/AdminLayout.vue';
import { useDarkModeStore } from '../../stores/darkMode';

const darkModeStore = useDarkModeStore();
</script>

<template>
  <AdminLayout activeSection="reports-analytics">
    <div class="container mx-auto p-4">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">Reports & Analytics</h1>

      <!-- Pre-built Reports -->
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Pre-built Reports</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        <div class="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">User Registrations</h3>
          <p class="text-gray-600 dark:text-gray-400">View trends in user registrations over time.</p>
          <button class="mt-2 bg-blue-500 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">View Report</button>
        </div>

        <div class="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">Scan Processing Statistics</h3>
          <p class="text-gray-600 dark:text-gray-400">Analyze scan processing times and success rates.</p>
          <button class="mt-2 bg-blue-500 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">View Report</button>
        </div>

        <div class="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">Appointment Trends</h3>
          <p class="text-gray-600 dark:text-gray-400">Track appointment scheduling and completion rates.</p>
          <button class="mt-2 bg-blue-500 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">View Report</button>
        </div>

        <div class="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">AI Performance Metrics</h3>
          <p class="text-gray-600 dark:text-gray-400">Evaluate the accuracy and efficiency of AI models.</p>
          <button class="mt-2 bg-blue-500 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">View Report</button>
        </div>
      </div>

      <!-- Custom Report Builder -->
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Custom Report Builder</h2>
      <div class="shadow overflow-hidden border border-gray-200 dark:border-gray-700 sm:rounded-lg p-4 bg-white dark:bg-gray-800">
        <p class="text-gray-600 dark:text-gray-400 mb-4">Create custom queries and dashboards to analyze specific data sets.</p>
        <button class="bg-green-500 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          Create Custom Report
        </button>
      </div>
    </div>
  </AdminLayout>
</template>
