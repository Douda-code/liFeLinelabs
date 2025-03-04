<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import NavSidebar from '../../components/NavSidebar.vue'
import { getScanById, getScanFileUrl } from '../../services/scanService'
import { useAuthStore } from '../../stores/auth'

const route = useRoute()
const router = useRouter()
const scanId = route.params.id
const scanDetails = ref(null)
const loading = ref(true)
const error = ref(null)
const activeSection = ref('scans')
const authStore = useAuthStore()
const scanImageUrl = ref(null)

onMounted(async () => {
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }
  
  try {
    loading.value = true
    const data = await getScanById(scanId)
    
    if (!data) {
      error.value = 'Scan not found'
      loading.value = false
      return
    }
    
    // Check if this scan belongs to the current user
    if (data.patient_id !== authStore.user.id) {
      error.value = 'You do not have permission to view this scan'
      loading.value = false
      return
    }
    
    // Try to get the scan image URL
    try {
      if (data.file_path && data.file_path !== 'placeholder') {
        scanImageUrl.value = await getScanFileUrl(data.file_path)
      }
    } catch (urlError) {
      console.error('Error getting scan image URL:', urlError)
      // Continue even if we can't get the image URL
    }
    
    // Format scan details for display
    scanDetails.value = {
      id: data.id,
      date: new Date(data.upload_date).toLocaleDateString(),
      type: data.scan_type,
      status: data.status,
      fileName: data.file_name,
      fileSize: formatFileSize(data.file_size),
      thumbnail: scanImageUrl.value || 'https://via.placeholder.com/150', // Use real URL if available
      visualization: scanImageUrl.value || 'https://via.placeholder.com/300', // Use real URL if available
      analysis: data.scan_analyses && data.scan_analyses.length > 0 ? data.scan_analyses[0] : null
    }
    
    loading.value = false
  } catch (err) {
    console.error('Error fetching scan details:', err)
    error.value = 'Failed to load scan details. Please try again later.'
    loading.value = false
  }
})

// Format file size for display
const formatFileSize = (bytes) => {
  if (bytes < 1024) return bytes + ' bytes'
  else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + ' KB'
  else return (bytes / 1048576).toFixed(2) + ' MB'
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">Scan Details</h1>
    </div>
    <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 py-4 px-4 sm:px-6 lg:px-8">
      <!-- Sidebar -->
      <NavSidebar :activeSection="activeSection" />
      
      <!-- Main Content -->
      <main class="md:col-span-3 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div v-if="loading" class="flex justify-center items-center h-64">
          <svg class="animate-spin h-8 w-8 text-indigo-600 dark:text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        
        <div v-else-if="error" class="p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg">
          {{ error }}
        </div>
        
        <div v-else-if="scanDetails">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white">{{ scanDetails.type }} Scan - {{ scanDetails.date }}</h2>
            <RouterLink to="/scans" class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300">
              Back to Scan Results
            </RouterLink>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Scan Information</h3>
              <p class="text-gray-700 dark:text-gray-300"><strong>Date:</strong> {{ scanDetails.date }}</p>
              <p class="text-gray-700 dark:text-gray-300"><strong>Type:</strong> {{ scanDetails.type }}</p>
              <p class="text-gray-700 dark:text-gray-300"><strong>Status:</strong> {{ scanDetails.status }}</p>
              <p class="text-gray-700 dark:text-gray-300"><strong>File Name:</strong> {{ scanDetails.fileName }}</p>
              <p class="text-gray-700 dark:text-gray-300"><strong>File Size:</strong> {{ scanDetails.fileSize }}</p>
            </div>
            
            <div v-if="scanDetails.analysis" class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">AI Analysis</h3>
              <p class="text-gray-700 dark:text-gray-300"><strong>Classification:</strong> {{ scanDetails.analysis.classification }}</p>
              <p class="text-gray-700 dark:text-gray-300"><strong>Confidence Score:</strong> {{ scanDetails.analysis.confidence_score }}</p>
              <p class="text-gray-700 dark:text-gray-300"><strong>Report:</strong> {{ scanDetails.analysis.ai_report }}</p>
              <p class="text-gray-700 dark:text-gray-300"><strong>Processing Time:</strong> {{ scanDetails.analysis.processing_time }}</p>
              <p class="text-gray-700 dark:text-gray-300"><strong>Analyzed On:</strong> {{ new Date(scanDetails.analysis.created_at).toLocaleString() }}</p>
            </div>
            
            <div v-else class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">AI Analysis</h3>
              <p class="text-gray-500 dark:text-gray-400">This scan has not been analyzed yet.</p>
              <RouterLink to="/ai-analysis" class="mt-2 inline-block text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300">
                Analyze this scan
              </RouterLink>
            </div>
          </div>
          
          <div class="mb-4">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Visualization</h3>
            <img :src="scanDetails.visualization" alt="Scan Visualization" class="w-full rounded-lg">
          </div>
          
          <div class="text-right">
            <a href="#" class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300">
              Download Report
            </a>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>