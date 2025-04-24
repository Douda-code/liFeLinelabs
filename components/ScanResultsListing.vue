<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { RouterLink } from 'vue-router'
import ScanDetailsPopup from './ScanDetailsPopup.vue'
import { useDarkModeStore } from '../stores/darkMode'
import { useAuthStore } from '../stores/auth'
import { getPatientScans } from '../services/scanService'
import { transformScansForDisplay } from '../services/scanListingService'

const scanResults = ref([])
const loading = ref(true)
const error = ref(null)

const searchQuery = ref('')
const sortBy = ref('uploadDate')
const sortOrder = ref('desc')
const selectedScanResult = ref(null)
const isModalOpen = ref(false)
const showFilters = ref(false)
const filterStatus = ref('All')
const filterType = ref('All')

const darkModeStore = useDarkModeStore()
const authStore = useAuthStore()

// Get unique scan types for filter
const scanTypes = computed(() => {
  const types = new Set(scanResults.value.map(scan => scan.scanType))
  return ['All', ...Array.from(types)]
})

// Get unique statuses for filter
const statusOptions = computed(() => {
  const statuses = new Set(scanResults.value.map(scan => scan.classificationStatus))
  return ['All', ...Array.from(statuses)]
})

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
    
    // Transform data and get thumbnails
    scanResults.value = await transformScansForDisplay(data)
    
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
    const query = searchQuery.value.toLowerCase()
    results = results.filter(result => 
      result.uploadDate.toLowerCase().includes(query) ||
      result.scanType.toLowerCase().includes(query) ||
      result.classificationStatus.toLowerCase().includes(query) ||
      result.patientName.toLowerCase().includes(query)
    )
  }

  // Filter by status
  if (filterStatus.value !== 'All') {
    results = results.filter(result => result.classificationStatus === filterStatus.value)
  }

  // Filter by type
  if (filterType.value !== 'All') {
    results = results.filter(result => result.scanType === filterType.value)
  }

  // Sort by selected column and order
  results = results.sort((a, b) => {
    if (sortBy.value === 'uploadDate') {
      return sortOrder.value === 'asc' 
        ? new Date(a.uploadDate) - new Date(b.uploadDate)
        : new Date(b.uploadDate) - new Date(a.uploadDate)
    }
    
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

const resetFilters = () => {
  searchQuery.value = ''
  filterStatus.value = 'All'
  filterType.value = 'All'
}

const getStatusColor = (status) => {
  switch (status) {
    case 'Completed':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'Pending':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    case 'Processing':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
  }
}

onMounted(() => {
  loadScanResults()
})

// Watch for auth state changes
watch(() => authStore.isAuthenticated, (isAuthenticated) => {
  if (isAuthenticated) {
    loadScanResults()
  }
})
</script>

<template>
  <!-- Header section -->


  <!-- Search and filters section -->
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6 overflow-hidden">
    <div class="p-4 sm:p-6">
      <div class="flex flex-col sm:flex-row sm:items-center gap-4">
        <!-- Search input -->
        <div class="relative flex-grow">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
            </svg>
          </div>
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Search by name, date, type, or status" 
            class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
          >
        </div>

        <!-- Filter toggle button -->
        <button 
          @click="showFilters = !showFilters" 
          class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
        >
          <svg class="-ml-1 mr-2 h-5 w-5 text-gray-500 dark:text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clip-rule="evenodd" />
          </svg>
          Filters
        </button>

        <!-- Refresh button -->
        <button 
          @click="loadScanResults" 
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
        >
          <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd" />
          </svg>
          Refresh
        </button>
      </div>

      <!-- Expanded filters -->
      <div v-if="showFilters" class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <!-- Status filter -->
          <div>
            <label for="statusFilter" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
            <select 
              id="statusFilter" 
              v-model="filterStatus" 
              class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
            >
              <option v-for="status in statusOptions" :key="status" :value="status">{{ status }}</option>
            </select>
          </div>

          <!-- Type filter -->
          <div>
            <label for="typeFilter" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Scan Type</label>
            <select 
              id="typeFilter" 
              v-model="filterType" 
              class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
            >
              <option v-for="type in scanTypes" :key="type" :value="type">{{ type }}</option>
            </select>
          </div>

          <!-- Reset filters -->
          <div class="flex items-end">
            <button 
              @click="resetFilters" 
              class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Content section -->
  <div class="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
    <!-- View Toggle Buttons -->
    <div class="flex justify-end p-4 border-b border-gray-200 dark:border-gray-700">
      <div class="inline-flex rounded-md shadow-sm" role="group">
        <button 
          @click="currentView = 'card'"
          :class="[
            'px-4 py-2 text-sm font-medium rounded-l-lg',
            currentView === 'card' 
              ? 'bg-indigo-600 text-white' 
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          ]"
        >
          <span class="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            Cards
          </span>
        </button>
        <button 
          @click="currentView = 'table'"
          :class="[
            'px-4 py-2 text-sm font-medium rounded-r-lg',
            currentView === 'table' 
              ? 'bg-indigo-600 text-white' 
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          ]"
        >
          <span class="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            Table
          </span>
        </button>
      </div>
    </div>

    <!-- Card view of results -->
    <div v-if="currentView === 'card'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      <div 
        v-for="result in filteredAndSortedResults" 
        :key="result.id" 
        class="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white dark:bg-gray-800"
      >
        <div class="relative h-48 bg-gray-100 dark:bg-gray-700">
          <img 
            :src="result.thumbnailUrl" 
            :alt="`${result.scanType} scan`"
            class="w-full h-full object-cover"
          />
          <div class="absolute bottom-0 left-0 right-0 px-4 py-2 bg-gradient-to-t from-black/70 to-transparent">
            <h3 class="text-lg font-medium text-white truncate">{{ result.scanType }}</h3>
          </div>
          <div class="absolute top-2 right-2">
            <span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full" :class="getStatusColor(result.classificationStatus)">
              {{ result.classificationStatus }}
            </span>
          </div>
        </div>
        
        <div class="p-4">
          <div class="flex items-center justify-between mb-3">
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ result.uploadDate }}
            </p>
            <p class="text-sm text-gray-600 dark:text-gray-300" v-if="result.confidenceScore !== 'N/A'">
              Confidence: {{ result.confidenceScore }}%
            </p>
          </div>
          
          <p class="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 h-10">
            {{ result.aiReport }}
          </p>
          
          <div class="mt-4 flex justify-between items-center">
            <RouterLink 
              :to="`/scans/${result.id}`" 
              class="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
            >
              View Details
            </RouterLink>
            <button 
              @click="openModal(result)" 
              class="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            >
              Quick View
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Table view for all screens (not just larger screens) -->
    <div v-if="currentView === 'table'" class="overflow-x-auto">
      <table v-if="!loading && !error && filteredAndSortedResults.length > 0" class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead class="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer" @click="toggleSortOrder('uploadDate')">
              <div class="flex items-center">
                Date
                <svg v-if="sortBy === 'uploadDate'" class="ml-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" :transform="sortOrder === 'asc' ? 'rotate(180)' : ''" />
                </svg>
              </div>
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer" @click="toggleSortOrder('scanType')">
              <div class="flex items-center">
                Type
                <svg v-if="sortBy === 'scanType'" class="ml-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" :transform="sortOrder === 'asc' ? 'rotate(180)' : ''" />
                </svg>
              </div>
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer" @click="toggleSortOrder('classificationStatus')">
              <div class="flex items-center">
                Status
                <svg v-if="sortBy === 'classificationStatus'" class="ml-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" :transform="sortOrder === 'asc' ? 'rotate(180)' : ''" />
                </svg>
              </div>
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Confidence
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              AI Report
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          <tr v-for="result in filteredAndSortedResults" :key="result.id" class="hover:bg-gray-50 dark:hover:bg-gray-750">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
              {{ result.uploadDate }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="flex-shrink-0 h-10 w-10 relative">
                  <img class="h-10 w-10 rounded-md object-cover" :src="result.thumbnailUrl" :alt="`${result.scanType} scan`">
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ result.scanType }}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full" :class="getStatusColor(result.classificationStatus)">
                {{ result.classificationStatus }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
              {{ result.confidenceScore !== 'N/A' ? `${result.confidenceScore}%` : 'N/A' }}
            </td>
            <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 max-w-xs">
              <p class="truncate">{{ result.aiReport }}</p>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <div class="flex space-x-4">
                <RouterLink 
                  :to="`/scans/${result.id}`" 
                  class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300"
                >
                  View
                </RouterLink>
                <button 
                  @click="openModal(result)" 
                  class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  Quick View
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
  
  
</div>
	</div>

<!-- Error state -->
<div v-if="error" class="text-red-600 dark:text-red-400 p-4 text-center">
  {{ error }}
</div>


<!-- Scan details modal -->
<ScanDetailsPopup 
  v-if="isModalOpen" 
  :scan="selectedScanResult" 
  @close="closeModal" 
/>
</template>

<script>
export default {
  data() {
    return {
      currentView: 'card', // Default view is card view
      sortBy: 'uploadDate',
      sortOrder: 'desc',
      // Other existing data properties
    };
  },
  methods: {
    toggleSortOrder(column) {
      if (this.sortBy === column) {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortBy = column;
        this.sortOrder = 'desc';
      }
    },
    getStatusColor(status) {
      switch (status) {
        case 'Confirmed':
          return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
        case 'Pending':
          return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100';
        case 'Rejected':
          return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100';
        default:
          return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
      }
    },
    openModal(result) {
      // Your existing modal opening logic
    }
    // Other existing methods
  },
  computed: {
    filteredAndSortedResults() {
      // Your existing computed property for filtering and sorting results
      return []; // This should return your actual filtered and sorted data
    }
    // Other existing computed properties
  }
};
</script>
