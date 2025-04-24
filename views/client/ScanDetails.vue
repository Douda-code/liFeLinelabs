<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import NavSidebar from '../../components/NavSidebar.vue'
import { getScanById, getScanFileUrl } from '../../services/scanService'
import { useAuthStore } from '../../stores/auth'
import { supabase } from '../../lib/supabase'
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'

const route = useRoute()
const router = useRouter()
const scanId = route.params.id
const scanDetails = ref(null)
const loading = ref(true)
const error = ref(null)
const activeSection = ref('scans')
const authStore = useAuthStore()
const scanImageUrl = ref(null)
const imageLoading = ref(false)
const imageError = ref(null)
const generatingPdf = ref(false)

// Function to get signed URL for scan image
const getScanImage = async (filePath) => {
  try {
    imageLoading.value = true
    imageError.value = null
    
    const { data, error } = await supabase.storage
      .from('scans')
      .createSignedUrl(filePath, 3600) // URL valid for 1 hour
    
    if (error) throw error
    
    return data.signedUrl
  } catch (err) {
    console.error('Error getting scan image:', err)
    imageError.value = 'Failed to load scan image'
    return null
  } finally {
    imageLoading.value = false
  }
}

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
    if (data.file_path) {
      scanImageUrl.value = await getScanImage(data.file_path)
    }
    
    // Format scan details for display
    scanDetails.value = {
      id: data.id,
      date: new Date(data.upload_date).toLocaleDateString(),
      type: data.scan_type,
      status: data.status,
      fileName: data.file_name,
      fileSize: formatFileSize(data.file_size),
      filePath: data.file_path,
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

// Download scan image
const downloadScan = async () => {
  try {
    if (!scanDetails.value?.filePath) {
      throw new Error('No file path available')
    }
    
    const { data, error } = await supabase.storage
      .from('scans')
      .download(scanDetails.value.filePath)
    
    if (error) throw error
    
    // Create blob URL and trigger download
    const blob = new Blob([data], { type: 'application/octet-stream' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = scanDetails.value.fileName || 'scan'
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    a.remove()
  } catch (err) {
    console.error('Error downloading scan:', err)
    error.value = 'Failed to download scan'
  }
}
// Generate and download PDF report
const downloadPdfReport = async () => {
  try {
    generatingPdf.value = true
    
    // Create a temporary div to render the report content
    const reportElement = document.createElement('div')
    reportElement.id = 'pdf-report'
    reportElement.style.width = '210mm'
    reportElement.style.padding = '20px'
    reportElement.style.backgroundColor = 'white'
    reportElement.style.color = 'black'
    reportElement.style.position = 'absolute'
    reportElement.style.left = '-9999px'
    
    // Add report content
    reportElement.innerHTML = `
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="color: #4f46e5; font-size: 24px; margin-bottom: 5px;">liFeliNe Labs</h1>
        <h2 style="font-size: 20px; margin-bottom: 5px;">Scan Analysis Report</h2>
        <p style="color: #666; font-size: 14px;">Generated on ${new Date().toLocaleString()}</p>
      </div>
      
      <div style="margin-bottom: 20px; padding-bottom: 10px; border-bottom: 1px solid #eee;">
        <h3 style="font-size: 18px; margin-bottom: 10px;">Patient Information</h3>
        <p><strong>Name:</strong> ${authStore.user?.first_name} ${authStore.user?.last_name}</p>
        <p><strong>ID:</strong> ${authStore.user?.id}</p>
      </div>
      
      <div style="margin-bottom: 20px; padding-bottom: 10px; border-bottom: 1px solid #eee;">
        <h3 style="font-size: 18px; margin-bottom: 10px;">Scan Information</h3>
        <p><strong>Scan Type:</strong> ${scanDetails.value?.type}</p>
        <p><strong>Date:</strong> ${scanDetails.value?.date}</p>
        <p><strong>File Name:</strong> ${scanDetails.value?.fileName}</p>
        <p><strong>Status:</strong> ${scanDetails.value?.status}</p>
      </div>
    `
    
    // Add analysis results if available
    if (scanDetails.value?.analysis) {
      reportElement.innerHTML += `
        <div style="margin-bottom: 20px; padding-bottom: 10px; border-bottom: 1px solid #eee;">
          <h3 style="font-size: 18px; margin-bottom: 10px;">AI Analysis Results</h3>
          <p><strong>Classification:</strong> <span style="color: ${
            scanDetails.value.analysis.classification === 'Normal' ? 'green' : 'red'
          }; font-weight: bold;">${scanDetails.value.analysis.classification}</span></p>
          <p><strong>Confidence Score:</strong> ${scanDetails.value.analysis.confidence_score}%</p>
          <p><strong>Analysis Report:</strong> ${scanDetails.value.analysis.ai_report}</p>
          <p><strong>Processing Time:</strong> ${scanDetails.value.analysis.processing_time}</p>
          <p><strong>Analyzed On:</strong> ${new Date(scanDetails.value.analysis.created_at).toLocaleString()}</p>
        </div>
      `
    } else {
      reportElement.innerHTML += `
        <div style="margin-bottom: 20px; padding-bottom: 10px; border-bottom: 1px solid #eee;">
          <h3 style="font-size: 18px; margin-bottom: 10px;">AI Analysis Results</h3>
          <p>This scan has not been analyzed yet.</p>
        </div>
      `
    }
    
    // Add disclaimer
    reportElement.innerHTML += `
      <div style="margin-top: 30px; font-size: 12px; color: #666;">
        <p><strong>Disclaimer:</strong> This report is generated by an AI system and should be reviewed by a healthcare professional. 
        The results are not a substitute for professional medical advice, diagnosis, or treatment.</p>
      </div>
    `
    
    // Add scan image if available
    if (scanImageUrl.value) {
      const imgElement = document.createElement('div')
      imgElement.innerHTML = `
        <div style="margin-bottom: 20px; padding-bottom: 10px; border-bottom: 1px solid #eee;">
          <h3 style="font-size: 18px; margin-bottom: 10px;">Scan Image</h3>
          <div style="text-align: center;">
            <img src="${scanImageUrl.value}" style="max-width: 100%; max-height: 300px; object-fit: contain;" />
          </div>
        </div>
      `
      reportElement.appendChild(imgElement)
    }
    
    // Append to document, render to canvas, then remove
    document.body.appendChild(reportElement)
    
    const canvas = await html2canvas(reportElement, {
      scale: 2,
      useCORS: true,
      logging: false
    })
    
    document.body.removeChild(reportElement)
    
    // Create PDF
    const pdf = new jsPDF('p', 'mm', 'a4')
    const imgData = canvas.toDataURL('image/png')
    const imgWidth = 210
    const pageHeight = 295
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    let heightLeft = imgHeight
    let position = 0
    
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight
    
    // Add new pages if content overflows
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }
    
    // Save the PDF
    pdf.save(`scan-report-${scanDetails.value?.id || 'unknown'}.pdf`)
    
    generatingPdf.value = false
  } catch (err) {
    console.error('Error generating PDF:', err)
    error.value = 'Failed to generate PDF report'
    generatingPdf.value = false
  }
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
              <p class="text-gray-700 dark:text-gray-300"><strong>Confidence Score:</strong> {{ scanDetails.analysis.confidence_score }}%</p>
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
          
          <!-- Scan Image Display -->
          <div class="mb-6">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Scan Image</h3>
            <div class="relative bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
              <div v-if="imageLoading" class="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
                <svg class="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              
              <div v-if="imageError" class="p-4 text-center text-red-600 dark:text-red-400">
                {{ imageError }}
              </div>
              
              <img 
                v-if="scanImageUrl" 
                :src="scanImageUrl" 
                :alt="scanDetails.fileName"
                class="max-w-full h-auto rounded-lg"
                @error="imageError = 'Failed to load image'"
              >
              
              <div v-else-if="!imageLoading && !imageError" class="p-4 text-center text-gray-500 dark:text-gray-400">
                No image available
              </div>
            </div>
          </div>
          
          <div class="flex justify-end space-x-4">
            <button 
              @click="downloadPdfReport" 
              :disabled="generatingPdf"
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg v-if="!generatingPdf" class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <svg v-else class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span v-if="!generatingPdf">Download PDF Report</span>
              <span v-else>Generating PDF...</span>
            </button>
            <button 
              @click="downloadScan" 
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
              Download Scan
            </button>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>
