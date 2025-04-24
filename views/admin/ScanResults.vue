<script setup>
import { ref, computed } from 'vue';
import AdminLayout from '../../components/AdminLayout.vue';
import ViewScanResultModal from '../../components/ViewScanResultModal.vue';
import { useDarkModeStore } from '../../stores/darkMode';

const darkModeStore = useDarkModeStore();

const scanResults = ref([
  { id: 1, patientName: 'John Doe', uploadDate: '2024-03-22', scanType: 'MRI', classificationStatus: 'Classified', confidenceScore: '0.95', aiReport: 'Normal' },
  { id: 2, patientName: 'Jane Smith', uploadDate: '2024-03-21', scanType: 'CT Scan', classificationStatus: 'Unclassified', confidenceScore: '0.80', aiReport: 'Inconclusive' },
  { id: 3, patientName: 'Alice Johnson', uploadDate: '2024-03-20', scanType: 'X-Ray', classificationStatus: 'Classified', confidenceScore: '0.90', aiReport: 'Fracture detected' },
]);

const scanTypeFilter = ref('');
const classificationStatusFilter = ref('');
const searchTerm = ref('');
const isModalOpen = ref(false);
const selectedScanResult = ref(null);

const filteredScans = computed(() => {
  return scanResults.value.filter(scan => {
    const typeMatch = scanTypeFilter.value === '' || scan.scanType === scanTypeFilter.value;
    const statusMatch = classificationStatusFilter.value === '' || scan.classificationStatus === classificationStatusFilter.value;
    const searchMatch = scan.patientName.toLowerCase().includes(searchTerm.value.toLowerCase());
    return typeMatch && statusMatch && searchMatch;
  });
});

const openModal = (scan) => {
  selectedScanResult.value = { ...scan };
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  selectedScanResult.value = null;
};
</script>

<template>
  <AdminLayout activeSection="scan-results">
    <div class="container mx-auto p-4">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">Scan Results & AI Reports Management</h1>

      <!-- Filters and Search -->
      <div class="flex flex-wrap items-center justify-between mb-4">
        <div class="flex items-center space-x-2">
          <label for="scan-type-filter" class="text-sm font-medium text-gray-700 dark:text-gray-300">Filter by Scan Type:</label>
          <select id="scan-type-filter" v-model="scanTypeFilter" class="mt-1 block rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white">
            <option value="">All</option>
            <option>MRI</option>
            <option>CT Scan</option>
            <option>X-Ray</option>
          </select>
        </div>

        <div class="flex items-center space-x-2">
          <label for="classification-status-filter" class="text-sm font-medium text-gray-700 dark:text-gray-300">Filter by Classification Status:</label>
          <select id="classification-status-filter" v-model="classificationStatusFilter" class="mt-1 block rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white">
            <option value="">All</option>
            <option>Classified</option>
            <option>Unclassified</option>
            <option>Error</option>
          </select>
        </div>

        <div class="flex items-center">
          <label for="scan-search" class="sr-only">Search scans</label>
          <div class="relative">
            <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <svg class="h-5 w-5 text-gray-400 dark:text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
              </svg>
            </div>
            <input type="text" id="scan-search" v-model="searchTerm" placeholder="Search scans" class="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 shadow-sm placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:text-white">
          </div>
        </div>
      </div>

      <!-- Scan Results Table -->
      <div class="shadow overflow-hidden border border-gray-200 dark:border-gray-700 sm:rounded-lg">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">Patient Name</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">Upload Date</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">Scan Type</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">Classification Status</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">Confidence Score</th>
              <th scope="col" class="relative px-6 py-3 border-b border-gray-200 dark:border-gray-700">
                <span class="sr-only">View</span>
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="scan in filteredScans" :key="scan.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700">{{ scan.patientName }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">{{ scan.uploadDate }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">{{ scan.scanType }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">{{ scan.classificationStatus }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">{{ scan.confidenceScore }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium border-b border-gray-200 dark:border-gray-700">
                <button @click="openModal(scan)" class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300">View</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <ViewScanResultModal :scanResult="selectedScanResult" :showModal="isModalOpen" @close="closeModal" />
    </div>
  </AdminLayout>
</template>
