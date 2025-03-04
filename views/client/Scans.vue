<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">My Scan Results</h1>
    </div>
    <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 py-4 px-4 sm:px-6 lg:px-8">
      <!-- Sidebar -->
      <NavSidebar :activeSection="activeSection" />

      <!-- Main Content -->
      <main class="md:col-span-3 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Scan History</h2>
          <RouterLink to="/ai-analysis" class="bg-indigo-600 dark:bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-700 dark:hover:bg-indigo-600">
            Upload New Scan
          </RouterLink>
        </div>
        <ScanResultsListing />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ScanResultsListing from '../../components/ScanResultsListing.vue';
import NavSidebar from '../../components/NavSidebar.vue';
import { useDarkModeStore } from '../../stores/darkMode';
import { useAuthStore } from '../../stores/auth';

const activeSection = ref('scans');
const darkModeStore = useDarkModeStore();
const authStore = useAuthStore();
</script>