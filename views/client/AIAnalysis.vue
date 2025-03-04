<script setup>
import { ref, reactive, onMounted } from 'vue'
import NavSidebar from '../../components/NavSidebar.vue'
import { analyzeScan, isValidScanFile } from '../../services/aiService'
import { uploadScan, getPatientScans } from '../../services/scanService'
import { useAuthStore } from '../../stores/auth'
import { createNotification } from '../../services/notificationService'

const authStore = useAuthStore()
const file = ref(null)
const isUploading = ref(false)
const activeSection = ref('ai-analysis')
const analysisResult = ref(null)
const showResult = ref(false)
const error = ref(null)
const scanType = ref('X-Ray')

// Analysis statistics
const stats = reactive({
  totalScans: 0,
  normalScans: 0,
  abnormalScans: 0
})

const handleFileChange = (event) => {
  const selectedFile = event.target.files[0]
  if (selectedFile) {
    if (isValidScanFile(selectedFile)) {
      file.value = selectedFile
      error.value = null
    } else {
      error.value = 'Invalid file. Please upload a valid image file (JPEG, PNG) under 10MB.'
      file.value = null
    }
  }
}

const handleDrop = (event) => {
  event.preventDefault()
  const droppedFile = event.dataTransfer.files[0]
  if (droppedFile) {
    if (isValidScanFile(droppedFile)) {
      file.value = droppedFile
      error.value = null
    } else {
      error.value = 'Invalid file. Please upload a valid image file (JPEG, PNG) under 10MB.'
      file.value = null
    }
  }
}

const handleDragOver = (event) => {
  event.preventDefault()
}

const uploadScanAndAnalyze = async () => {
  if (file.value) {
    try {
      isUploading.value = true
      error.value = null
      showResult.value = false
      
      // Check if user is authenticated
      if (!authStore.isAuthenticated) {
        error.value = 'You must be logged in to upload and analyze scans.'
        isUploading.value = false
        return
      }
      
      // Upload scan to storage and create record in database
      const scanData = await uploadScan(file.value, scanType.value, authStore.user.id)
      
      // Call the AI service to analyze the scan
      const result = await analyzeScan(file.value, scanData.id)
      
      // Update analysis result
      analysisResult.value = result
      
      // Update statistics
      stats.totalScans++
      if (result.classification === 'Normal') {
        stats.normalScans++
      } else {
        stats.abnormalScans++
      }
      
      // Show the result
      showResult.value = true
      
      // Create notification for the user
      try {
        await createNotification(
          authStore.user.id,
          'Scan Analysis Completed',
          `Your ${scanType.value} scan has been analyzed with a classification of ${result.classification}`,
          'scan',
          result.classification !== 'Normal'
        )
      } catch (notificationError) {
        console.error('Error creating notification:', notificationError)
      }
      
    } catch (err) {
      console.error('Error analyzing scan:', err)
      error.value = 'An error occurred while analyzing the scan. Please try again.'
    } finally {
      isUploading.value = false
    }
  } else {
    error.value = 'Please select a file to upload.'
  }
}

const resetAnalysis = () => {
  file.value = null
  showResult.value = false
  analysisResult.value = null
  error.value = null
}

// Load statistics from user's scan history
const loadUserStats = async () => {
  if (authStore.isAuthenticated) {
    try {
      const scans = await getPatientScans(authStore.user.id)
      
      if (scans && scans.length > 0) {
        stats.totalScans = scans.length
        
        // Count normal vs abnormal scans
        stats.normalScans = scans.filter(scan => 
          scan.scan_analyses && 
          scan.scan_analyses.length > 0 && 
          scan.scan_analyses[0].classification === 'Normal'
        ).length
        
        stats.abnormalScans = stats.totalScans - stats.normalScans
      }
    } catch (err) {
      console.error('Error loading user statistics:', err)
    }
  }
}

onMounted(() => {
  loadUserStats()
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">AI Analysis</h1>
    </div>
    <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 py-4 px-4 sm:px-6 lg:px-8">
      <!-- Sidebar -->
      <NavSidebar :activeSection="activeSection" />

      <!-- Main Content -->
      <main class="md:col-span-3">
        <div v-if="!showResult" class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Disease Classification</h2>
          <p class="text-gray-600 dark:text-gray-400 mb-6">
            Upload your scan images for AI-powered analysis of three specific diseases: Pneumonia, Tuberculosis, and Normal.
          </p>
          
          <!-- Error message -->
          <div v-if="error" class="mb-4 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg">
            {{ error }}
          </div>
          
          <!-- Scan Type Selection -->
          <div class="mb-4">
            <label for="scan-type" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Scan Type</label>
            <select 
              id="scan-type" 
              v-model="scanType" 
              class="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
            >
              <option>X-Ray</option>
              <option>MRI</option>
              <option>CT Scan</option>
              <option>Ultrasound</option>
            </select>
          </div>
          
          <!-- Combined Upload and Drag and Drop Section -->
          <div class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center relative" @drop="handleDrop" @dragover="handleDragOver">
            <div v-if="isUploading" class="absolute inset-0 flex items-center justify-center bg-white dark:bg-gray-800 bg-opacity-75 dark:bg-opacity-75">
              <div class="text-center">
                <svg class="animate-spin h-10 w-10 text-indigo-600 dark:text-indigo-400 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p class="mt-2 text-gray-600 dark:text-gray-400">Analyzing scan with AI...</p>
              </div>
            </div>
            <div v-else>
              <p class="text-gray-600 dark:text-gray-400 mb-4">Drag and drop your scan files here or click to select files</p>
              <input type="file" @change="handleFileChange" class="hidden" id="file-upload" accept="image/*,.pdf">
              <label for="file-upload" class="cursor-pointer bg-indigo-600 dark:bg-indigo-500 text-white px-6 py-2 rounded hover:bg-indigo-700 dark:hover:bg-indigo-600">
                Select Files
              </label>
              <div v-if="file" class="mt-4 text-left">
                <p class="text-gray-700 dark:text-gray-300 font-medium">Selected file:</p>
                <p class="text-gray-600 dark:text-gray-400">{{ file.name }} ({{ (file.size / 1024).toFixed(2) }} KB)</p>
              </div>
              <div class="mt-4">
                <p class="text-gray-500 dark:text-gray-400 text-sm">Supported file types: JPEG, PNG, PDF</p>
                <p class="text-gray-500 dark:text-gray-400 text-sm">Max file size: 10MB</p>
              </div>
            </div>
          </div>
          
          <!-- Upload Button -->
          <div class="mt-8 text-center">
            <button @click="uploadScanAndAnalyze" class="bg-indigo-600 dark:bg-indigo-500 text-white px-6 py-2 rounded hover:bg-indigo-700 dark:hover:bg-indigo-600" :disabled="isUploading || !file">
              Upload and Analyze
            </button>
          </div>
          
          <!-- Statistics -->
          <div class="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">Total Scans</h3>
              <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ stats.totalScans }}</p>
            </div>
            <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">Normal</h3>
              <p class="text-3xl font-bold text-green-600 dark:text-green-400">{{ stats.normalScans }}</p>
            </div>
            <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">Abnormal</h3>
              <p class="text-3xl font-bold text-red-600 dark:text-red-400">{{ stats.abnormalScans }}</p>
            </div>
          </div>
        </div>
        
        <!-- Analysis Results -->
        <div v-if="showResult && analysisResult" class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Analysis Results</h2>
            <button @click="resetAnalysis" class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300">
              Analyze Another Scan
            </button>
          </div>
          
          <div class="mb-6 p-4 rounded-lg" :class="{
            'bg-green-100 dark:bg-green-900': analysisResult.classification === 'Normal',
            'bg-red-100 dark:bg-red-900': analysisResult.classification !== 'Normal'
          }">
            <h3 class="text-lg font-bold" :class="{
              'text-green-800 dark:text-green-200': analysisResult.classification === 'Normal',
              'text-red-800 dark:text-red-200': analysisResult.classification !== 'Normal'
            }">
              Classification: {{ analysisResult.classification }}
            </h3>
            <p class="mt-2" :class="{
              'text-green-700 dark:text-green-300': analysisResult.classification === 'Normal',
              'text-red-700 dark:text-red-300': analysisResult.classification !== 'Normal'
            }">
              {{ analysisResult.analysisReport }}
            </p>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Scan Details</h3>
              <p class="text-gray-700 dark:text-gray-300"><strong>File Name:</strong> {{ analysisResult.scanName }}</p>
              <p class="text-gray-700 dark:text-gray-300"><strong>Scan Type:</strong> {{ analysisResult.scanType }}</p>
              <p class="text-gray-700 dark:text-gray-300"><strong>Analyzed On:</strong> {{ new Date(analysisResult.timestamp).toLocaleString() }}</p>
              <p class="text-gray-700 dark:text-gray-300"><strong>Processing Time:</strong> {{ analysisResult.processingTime }}</p>
            </div>
            
            <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">AI Confidence</h3>
              <div class="mb-2">
                <div class="flex justify-between mb-1">
                  <span class="text-gray-700 dark:text-gray-300">Confidence Score:</span>
                  <span class="text-gray-700 dark:text-gray-300 font-bold">{{ analysisResult.confidenceScore }}</span>
                </div>
                <div class="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                  <div class="h-2.5 rounded-full" :style="`width: ${analysisResult.confidenceScore * 100}%`" :class="{
                    'bg-green-600': analysisResult.confidenceLevel === 'High',
                    'bg-yellow-600': analysisResult.confidenceLevel === 'Medium',
                    'bg-red-600': analysisResult.confidenceLevel === 'Low'
                  }"></div>
                </div>
              </div>
              <p class="text-gray-700 dark:text-gray-300"><strong>Confidence Level:</strong> 
                <span :class="{
                  'text-green-600 dark:text-green-400': analysisResult.confidenceLevel === 'High',
                  'text-yellow-600 dark:text-yellow-400': analysisResult.confidenceLevel === 'Medium',
                  'text-red-600 dark:text-red-400': analysisResult.confidenceLevel === 'Low'
                }">{{ analysisResult.confidenceLevel }}</span>
              </p>
            </div>
          </div>
          
          <div class="mt-6">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Next Steps</h3>
            <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <ul class="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
                <li>Review the AI analysis results with your healthcare provider</li>
                <li>Schedule a consultation with a specialist if recommended</li>
                <li>Download the analysis report for your records</li>
                <li>Follow up with additional tests if necessary</li>
              </ul>
              <div class="mt-4 flex space-x-4">
                <button class="bg-indigo-600 dark:bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-700 dark:hover:bg-indigo-600">
                  Download Report
                </button>
                <RouterLink to="/consultation" class="bg-green-600 dark:bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 dark:hover:bg-green-600 inline-block">
                  Schedule Consultation
                </RouterLink>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>