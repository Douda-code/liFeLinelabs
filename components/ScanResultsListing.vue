<script setup>
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import ScanDetailsPopup from './ScanDetailsPopup.vue'
import { useDarkModeStore } from '../stores/darkMode'
import { useAuthStore } from '../stores/auth'
import { getPatientScans } from '../services/scanService'

const scanResults = ref([])
const loading = ref(true)
const error = ref(null)

const searchQuery = ref('')
const sortBy = ref('uploadDate')
const sortOrder = ref('desc')
const selectedScanResult = ref(null)
const isModalOpen = ref(false)

const darkModeStore = useDarkModeStore()
const authStore = useAuthStore()

// Load user's scan results
const loadScanResults = async () => {
  if (!authStore.isAuthenticated) {
    error.value = 'You must be logged in to view scan results.'
    loading.value = false
    return
  }
  
  try {
    loading.value = true
    const data = await getPatientScans(authStore.user.id)
    
    // Transform data for display
    scanResults.value = data.map(scan => ({
      id: scan.id,
      patientName: `${authStore.user.first_name} ${authStore.user.last_name}`,
      uploadDate: new Date(scan.upload_date).toLocaleDateString(),
      scanType: scan.scan_type,
      classificationStatus: scan.status,
      confidenceScore: scan.scan_analyses && scan.scan_analyses.length > 0 
        ? scan.scan_analyses[0].confidence_score 
        : 'N/A',
      aiReport: scan.scan_analyses && scan.scan_analyses.length > 0 
        ? scan.scan_analyses[0].ai_report 
        : 'Not analyzed yet'
    }))
    
    loading.value = false
  } catch (err) {
    console.error('Error loading scan results:', err)
    error.value = 'Failed to load scan results. Please try again later.'
    loading.value = false
  }
}

const filteredAndSortedResults = computed(() => {
  let results = scanResults.value

  // Filter by search query
  if (searchQuery.value) {
    results = results.filter(result => 
      result.uploadDate.includes(searchQuery.value) ||
      result.scanType.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      result.classificationStatus.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  // Sort by selected column and order
  results = results.sort((a, b) => {
    if (a[sortBy.value] < b[sortBy.value]) return sortOrder.value === 'asc' ? -1 : 1
    if (a[sortBy.value] > b[sortBy.value]) return sortOrder.value === 'asc' ? 1 : -1
    return 0
  })

  return results
})

const toggleSortOrder = (column) => {
  if (sortBy.value === column) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortBy.value = column
    sortOrder.value = 'asc'
  }
}

const openModal = (scan) => {
  selectedScanResult.value = { ...scan }
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  selectedScanResult.value = null
}

onMounted(() => {
  loadScanResults()
})
</script>

<template>
  <div>
    <div class="mb-4">
      <input v-model="searchQuery" type="text" placeholder="Search by date, type, or status" class="w-full px-4 py-2 border rounded focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white dark:border-gray-600">
    </div>
    
    <div v-if="loading" class="flex justify-center items-center py-8">
      <svg class="animate-spin h-8 w-8 text-indigo-600 dark:text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>
    
    <div v-else-if="error" class="p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg">
      {{ error }}
    </div>
    
    <div v-else-if="filteredAndSortedResults.length === 0" class="p-4 text-center text-gray-500 dark:text-gray-400">
      No scan results found. Upload a scan for AI analysis to see results here.
    </div>
    
    <table v-else class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
      <thead class="bg-gray-50 dark:bg-gray-800">
        <tr>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer" @click="toggleSortOrder('uploadDate')">
            Date
            <span v-if="sortBy === 'uploadDate'">{{ sortOrder === 'asc' ? '🔼' : '🔽' }}</span>
          </th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer" @click="toggleSortOrder('scanType')">
            Type
            <span v-if="sortBy === 'scanType'">{{ sortOrder === 'asc' ? '🔼' : '🔽' }}</span>
          </th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer" @click="toggleSortOrder('classificationStatus')">
            Status
            <span v-if="sortBy === 'classificationStatus'">{{ sortOrder === 'asc' ? '🔼' : '🔽' }}</span>
          </th>
          <th scope="col" class="relative px-6 py-3">
            <span class="sr-only">View Details</span>
          </th>
        </tr>
      </thead>
      <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
        <tr v-for="result in filteredAndSortedResults" :key="result.id">
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{{ result.uploadDate }}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{{ result.scanType }}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm">
            <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" :class="{
              'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200': result.classificationStatus === 'Completed',
              'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200': result.classificationStatus === 'Pending',
              'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200': result.classificationStatus === 'Processing'
            }">
              {{ result.classificationStatus }}
            </span>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <RouterLink :to="`/scans/${result.id}`" class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300">
              View Details
            </RouterLink>
          </td>
        </tr>
      </tbody>
    </table>
    <ScanDetailsPopup :scanResult="selectedScanResult" :showModal="isModalOpen" @close="closeModal" />
  </div>
</template>