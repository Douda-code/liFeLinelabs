<script setup>
import { ref, reactive, onMounted } from 'vue'
import NavSidebar from '../../components/NavSidebar.vue'
import { analyzeScan, isValidScanFile } from '../../services/aiService'
import { uploadScan, getPatientScans } from '../../services/scanService' 
import { useAuthStore } from '../../stores/auth'
import { createNotification } from '../../services/notificationService'
import { hasPremiumAccess } from '../../services/subscriptionService'
import { RouterLink } from 'vue-router'

const authStore = useAuthStore()
const file = ref(null)
const isUploading = ref(false)
const activeSection = ref('ai-analysis')
const analysisResult = ref(null)
const showResult = ref(false)
const error = ref(null)
const scanType = ref('X-Ray')
const dropActive = ref(false)
const isPremium = ref(false)
const showPremiumBanner = ref(true)

// Analysis statistics
const stats = reactive({
  totalScans: 0,
  normalScans: 0,
  abnormalScans: 0
})

// Dismiss premium banner
const dismissPremiumBanner = () => {
  showPremiumBanner.value = false
}

const handleFileChange = (event) => {
  const selectedFile = event.target.files[0]
  if (selectedFile) {
    if (isValidScanFile(selectedFile)) {
      file.value = selectedFile
      error.value = null
    } else {
      error.value = 'Invalid file. Please upload a valid image file (JPEG, JPG, PNG) under 10MB.'
      file.value = null
    }
  }
}

const handleDrop = (event) => {
  event.preventDefault()
  dropActive.value = false
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
  dropActive.value = true
}

const handleDragLeave = (event) => {
  event.preventDefault()
  dropActive.value = false
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
      
      const scanData = await uploadScan(file.value, scanType.value, authStore.user.id)
      
      if (!scanData || !scanData.id) {
        throw new Error('Failed to create scan record')
      }
      
      // Call the AI service to analyze the scan
      const result = await analyzeScan(file.value, scanData.id)
      console.log('Analysis result:', result)
      
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
      const userId = authStore.user?.id
      if (!userId) {
        console.error('No user ID available')
        return
      }
      
      const scans = await getPatientScans(userId)
      
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

// Check if user has premium access
const checkPremiumAccess = async () => {
  if (authStore.isAuthenticated) {
    const userId = authStore.user?.id
    if (!userId) {
      console.error('No user ID available')
      return false
    }
    
    try {
      isPremium.value = await hasPremiumAccess(userId)
      console.log('User premium status for AI analysis:', isPremium.value)
    } catch (err) {
      console.error('Error checking premium status:', err)
    }
  }
}

onMounted(() => {
  loadUserStats()
  checkPremiumAccess()
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
    <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 py-4 px-4 sm:px-6 lg:px-8">
      <!-- Main Content -->
      <main class="md:col-span-5 space-y-8">
        <!-- Premium Banner -->
        <div v-if="!isPremium && showPremiumBanner" class="bg-gradient-to-r from-yellow-500 to-amber-500 text-white p-4 rounded-xl shadow-md relative">
          <button @click="dismissPremiumBanner" class="absolute top-2 right-2 text-white hover:text-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
          <div class="flex items-start pr-6">
            <div class="flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-yellow-300" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium">Upgrade to Premium</h3>
              <div class="mt-1 text-xs">
                <p>Standard users get basic binary classification (Normal/Abnormal). Upgrade to premium for advanced multi-class disease detection.</p>
                <RouterLink to="/upgrade-account" class="mt-2 inline-block bg-white text-yellow-600 px-2 py-1 rounded text-xs font-medium">
                  Upgrade Now
                </RouterLink>
              </div>
            </div>
          </div>
        </div>
        
        <div v-if="!showResult" class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
          <div class="flex items-center mb-6">
            <div class="h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
            </div>
            <div>
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Advanced Disease Classification</h2>
              <p class="text-indigo-600 dark:text-indigo-400">State-of-the-art AI diagnostics</p>
            </div>
          </div>
          
          <p class="text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
            Our proprietary AI system can analyze your medical scans with high accuracy to detect three specific conditions: 
            <span class="font-semibold">Pneumonia</span>, <span class="font-semibold">Tuberculosis</span>, and 
            <span class="font-semibold">Normal</span> findings. Upload your scan for instant analysis.
          </p>
          
          <!-- Error message -->
          <div v-if="error" class="mb-6 p-4 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-xl border border-red-100 dark:border-red-800/50 flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            <span>{{ error }}</span>
          </div>
          
          <!-- Scan Type Selection -->
          <div class="mb-6">
            <label for="scan-type" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Scan Type</label>
            <div class="relative">
              <select 
                id="scan-type" 
                v-model="scanType" 
                class="appearance-none block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option>X-Ray</option>
                <option>MRI</option>
                <option>CT Scan</option>
                <option>Ultrasound</option>
              </select>
              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700 dark:text-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
          
          <!-- Combined Upload and Drag and Drop Section -->
          <div 
            class="border-2 border-dashed rounded-xl p-12 text-center relative transition-all duration-200" 
            :class="[
              dropActive ? 'border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20' : 'border-gray-300 dark:border-gray-600',
              dropActive ? 'ring-4 ring-indigo-300 dark:ring-indigo-800/30' : ''
            ]"
            @drop="handleDrop" 
            @dragover="handleDragOver"
            @dragleave="handleDragLeave"
          >
            <div v-if="isUploading" class="absolute inset-0 flex items-center justify-center bg-white dark:bg-gray-800 bg-opacity-90 dark:bg-opacity-90 backdrop-blur-sm rounded-xl">
              <div class="text-center">
                <svg class="animate-spin h-12 w-12 text-indigo-600 dark:text-indigo-400 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p class="mt-4 text-xl font-medium text-indigo-600 dark:text-indigo-400">Analyzing with AI...</p>
                <p class="mt-2 text-gray-600 dark:text-gray-400">This may take a few moments</p>
              </div>
            </div>
            <div v-else class="py-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-400 dark:text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p class="text-lg text-gray-700 dark:text-gray-300 mb-4">Drag and drop your scan files here or click to select</p>
              <input type="file" @change="handleFileChange" class="hidden" id="file-upload" accept="image/*,.pdf">
              <label for="file-upload" class="cursor-pointer inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                </svg>
                Select Files
              </label>
              
              <div v-if="file" class="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg inline-block mx-auto">
                <div class="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-indigo-500 dark:text-indigo-400 mr-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd" />
                  </svg>
                  <div class="text-left">
                    <p class="text-gray-800 dark:text-gray-200 font-medium">{{ file.name }}</p>
                    <p class="text-gray-600 dark:text-gray-400 text-sm">{{ (file.size / 1024).toFixed(2) }} KB</p>
                  </div>
                </div>
              </div>
              
              <div class="mt-6 flex flex-wrap justify-center gap-4 text-sm">
                <div class="flex items-center text-gray-500 dark:text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clip-rule="evenodd" />
                  </svg>
                  <span>JPEG, JPG, PNG</span>
                </div>
                <div class="flex items-center text-gray-500 dark:text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
                  </svg>
                  <span>Max 10MB</span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Upload Button -->
          <div class="mt-8 text-center">
            <button 
              @click="uploadScanAndAnalyze" 
              class="inline-flex items-center px-8 py-3 border border-transparent text-lg font-medium rounded-full shadow-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              :disabled="isUploading || !file"
            >
              <svg v-if="!isUploading" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clip-rule="evenodd" />
              </svg>
              <span v-if="!isUploading">Upload and Analyze</span>
              <span v-else>Processing...</span>
            </button>
          </div>
          
          <!-- Statistics Cards -->
          <div class="mt-12">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 text-indigo-600 dark:text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
              </svg>
              Your Analysis Statistics
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="bg-white dark:bg-gray-700 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-600 hover:shadow-xl transition-shadow">
                <div class="flex items-center">
                  <div class="rounded-full bg-blue-100 dark:bg-blue-900/50 p-3 mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                      <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 class="text-gray-500 dark:text-gray-400 font-medium text-sm uppercase tracking-wider">Total Scans</h3>
                    <p class="text-4xl font-bold text-gray-900 dark:text-white mt-1">{{ stats.totalScans }}</p>
                  </div>
                </div>
              </div>
              
              <div class="bg-white dark:bg-gray-700 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-600 hover:shadow-xl transition-shadow">
                <div class="flex items-center">
                  <div class="rounded-full bg-green-100 dark:bg-green-900/50 p-3 mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-600 dark:text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 class="text-gray-500 dark:text-gray-400 font-medium text-sm uppercase tracking-wider">Normal Results</h3>
                    <p class="text-4xl font-bold text-green-600 dark:text-green-400 mt-1">{{ stats.normalScans }}</p>
                  </div>
                </div>
              </div>
              
              <div class="bg-white dark:bg-gray-700 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-600 hover:shadow-xl transition-shadow">
                <div class="flex items-center">
                  <div class="rounded-full bg-red-100 dark:bg-red-900/50 p-3 mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-600 dark:text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 class="text-gray-500 dark:text-gray-400 font-medium text-sm uppercase tracking-wider">Abnormal Results</h3>
                    <p class="text-4xl font-bold text-red-600 dark:text-red-400 mt-1">{{ stats.abnormalScans }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Analysis Results -->
        <div v-if="showResult && analysisResult" class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
          <div class="flex justify-between items-center mb-8">
            <div class="flex items-center space-x-2">
              <div class="h-10 w-10 rounded-full mr-4"
                :class="{
                  'bg-green-100 dark:bg-green-900': analysisResult.classification ===   'Normal',
                  'bg-red-100 dark:bg-red-900': analysisResult.classification !== 'Normal'
                }">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 m-2" :class="{
                    'text-green-600 dark:text-green-400': analysisResult.classification === 'Normal',
                    'text-red-600 dark:text-red-400': analysisResult.classification !== 'Normal'
                  }" viewBox="0 0 20 20" fill="currentColor">
                  <path v-if="analysisResult.classification === 'Normal'" fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  <path v-else fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
              </div>
              <div>
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Analysis Results</h2>
                <div class="flex items-center mt-1">
                  <span 
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="analysisResult.isPremiumAnalysis ? 
                      'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' : 
                      'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'"
                  >
                    {{ analysisResult.isPremiumAnalysis ? 'Premium Multi-class AI' : 'Standard Binary AI' }}
                  </span>
                </div>
              </div>
            </div>
            <button @click="resetAnalysis" class="flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd" />
              </svg>
              Analyze Another Scan
            </button>
          </div> 
          <div class="mt-4">
            <p class="text-lg text-gray-700 dark:text-gray-300">
              The AI analysis of your scan indicates a
              <span 
                class="font-bold text-xl"
                :class="{
                  'text-green-600': analysisResult.classification === 'Normal',
                  'text-red-600': analysisResult.classification !== 'Normal'
                }"
              >
                {{ analysisResult.classification }}
              </span> 
              condition with
              <span class="font-bold text-xl" :class="{
                'text-green-600': parseFloat(analysisResult.confidenceScore) >= 90,
                'text-yellow-600': parseFloat(analysisResult.confidenceScore) >= 70 && parseFloat(analysisResult.confidenceScore) < 90,
                'text-red-600': parseFloat(analysisResult.confidenceScore) < 70
              }">
                {{ analysisResult.confidenceScore }}% 
              </span>
              confidence.
            </p>
            <div class="mt-4 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Analysis Details</h3>
              <div class="space-y-2">
                <div class="flex items-center">
                  <span class="text-gray-600 dark:text-gray-400 w-32">Confidence:</span>
                  <div class="flex-1">
                    <div class="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                      <div 
                        class="h-2.5 rounded-full transition-all duration-500"
                        :style="{ width: `${analysisResult.confidenceScore}%` }"
                        :class="{
                          'bg-green-600': parseFloat(analysisResult.confidenceScore) >= 90,
                          'bg-yellow-500': parseFloat(analysisResult.confidenceScore) >= 70 && parseFloat(analysisResult.confidenceScore) < 90,
                          'bg-red-500': parseFloat(analysisResult.confidenceScore) < 70
                        }"
                      ></div>
                    </div>
                  </div>
                  <span class="ml-4 font-semibold" :class="{
                    'text-green-600': parseFloat(analysisResult.confidenceScore) >= 90,
                    'text-yellow-600': parseFloat(analysisResult.confidenceScore) >= 70 && parseFloat(analysisResult.confidenceScore) < 90,
                    'text-red-600': parseFloat(analysisResult.confidenceScore) < 70
                  }">{{ analysisResult.confidenceScore }}%</span>
                </div>
                <div class="flex items-center">
                  <span class="text-gray-600 dark:text-gray-400 w-32">Confidence Level:</span>
                  <span class="font-medium" :class="{
                    'text-green-600': analysisResult.confidenceLevel === 'High',
                    'text-yellow-600': analysisResult.confidenceLevel === 'Medium',
                    'text-red-600': analysisResult.confidenceLevel === 'Low'
                  }">{{ analysisResult.confidenceLevel }}</span>
                </div>
              </div>
            </div>
            
            <!-- Premium vs Standard AI explanation -->
            <div v-if="!isPremium && !analysisResult.isPremiumAnalysis" class="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800/50">
              <div class="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-yellow-500 mt-0.5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                </svg>
                <div>
                  <h4 class="text-sm font-medium text-yellow-800 dark:text-yellow-300">Standard AI Analysis</h4>
                  <p class="mt-1 text-xs text-yellow-700 dark:text-yellow-200">
                    You're using our standard binary classification model that detects normal vs. abnormal conditions. 
                    <RouterLink to="/upgrade-account" class="font-medium underline">Upgrade to premium</RouterLink> 
                    for our advanced multi-class model that can specifically identify pneumonia, tuberculosis, and other conditions.
                  </p>
                </div>
              </div>
            </div>
            
            <div v-if="analysisResult.comments" class="mt-2">
              <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-1">Additional Details</h3>
              <p class="text-gray-600 dark:text-gray-400 text-sm">
                {{ analysisResult.comments }}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>
