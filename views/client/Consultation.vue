<script setup>
import { ref, onMounted } from 'vue'
import NavSidebar from '../../components/NavSidebar.vue'
import { createConsultation, getPatientConsultations } from '../../services/consultationsService'
import { useAuthStore } from '../../stores/auth'
import { createNotification } from '../../services/notificationService'
import { hasPremiumAccess } from '../../services/subscriptionService'
import { supabase } from '../../lib/supabase'

const authStore = useAuthStore()
const hasPremium = ref(false)

const consultationOptions = ref([
  { type: 'text', title: 'Text Messaging', description: 'Send a text message to your physician for quick consultations.' },
  { type: 'video', title: 'Video Calls', description: 'Schedule a video call with your physician for a virtual consultation.' },
  { type: 'in-person', title: 'In-Person Appointments', description: 'Book an in-person appointment with your physician.' }
])

const physicians = ref([])
const loadingPhysicians = ref(true)
const errorPhysicians = ref(null)

const selectedOption = ref(null)
const selectedPhysician = ref(null)
const showScheduler = ref(false)
const activeSection = ref('consultation')
const consultationDate = ref('')
const consultationTime = ref('')
const consultationDuration = ref(30) // Default duration in minutes
const consultationNotes = ref('')
const loading = ref(false)
const error = ref(null)
const success = ref(null)
const userConsultations = ref([])

const selectOption = (option) => {
  selectedOption.value = option
  showScheduler.value = option.type !== 'text'
}

const selectPhysician = (physician) => {
  selectedPhysician.value = physician
}

const handleSubmit = async () => {
  if (!authStore.isAuthenticated) {
    error.value = 'Please log in to schedule a consultation'
    return
  }

  if (!selectedPhysician.value) {
    error.value = 'Please select a physician'
    return
  }

  if (!selectedOption.value) {
    error.value = 'Please select a consultation type'
    return
  }

  try {
    loading.value = true
    error.value = null
    success.value = null

    // Format the date and time for the database
    const scheduledAt = new Date(`${consultationDate.value}T${consultationTime.value}`)

    const consultation = await createConsultation(
      authStore.user.id,
      selectedPhysician.value.id,
      selectedOption.value.type,
      scheduledAt.toISOString(),
      consultationDuration.value,
      consultationNotes.value
    )

    // Create a notification for the user
    await createNotification(
      authStore.user.id,
      'Consultation Scheduled',
      `Your ${selectedOption.value.type} consultation with ${selectedPhysician.value.name} has been scheduled for ${scheduledAt.toLocaleString()}`,
      'consultation',
      false
    )

    success.value = 'Consultation scheduled successfully!'
    
    // Reset form
    consultationDate.value = ''
    consultationTime.value = ''
    consultationNotes.value = ''
    selectedOption.value = null
    selectedPhysician.value = null
    showScheduler.value = false

    // Refresh consultations list
    await loadConsultations()
  } catch (err) {
    console.error('Error scheduling consultation:', err)
    error.value = 'Failed to schedule consultation. Please try again.'
  } finally {
    loading.value = false
  }
}

const loadConsultations = async () => {
  if (!authStore.isAuthenticated) return

  try {
    loading.value = true
    const consultations = await getPatientConsultations(authStore.user.id)
    userConsultations.value = consultations
  } catch (err) {
    console.error('Error loading consultations:', err)
    error.value = 'Failed to load consultations'
  } finally {
    loading.value = false
  }
}

const loadPhysicians = async () => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, first_name, last_name')
      .eq('role', 'physician')

    if (error) {
      errorPhysicians.value = error.message
      console.error('Error fetching physicians:', error)
    } else {
      physicians.value = data.map(physician => ({
        id: physician.id,
        name: `${physician.first_name} ${physician.last_name}`,
        specialty: physician.specialty
      }))
    }
  } finally {
    loadingPhysicians.value = false
  }
}

// Format date for display
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString()
}

// Get consultation type icon
const getConsultationIcon = (type) => {
  switch(type) {
    case 'text': return '💬'
    case 'video': return '📹'
    case 'in-person': return '👩‍⚕️'
    default: return '📅'
  }
}

onMounted(() => {
  loadConsultations()
  loadPhysicians()
  checkPremiumAccess()
})

const checkPremiumAccess = async () => {
  if (authStore.isAuthenticated) {
    hasPremium.value = await hasPremiumAccess(authStore.user.id)
  }
}

const handleConsultationClick = () => {
  if (!hasPremium.value) {
    router.push('/upgrade-account')
    return
  }
  // Continue with consultation logic
}

// Add premium check to template
const checkPremiumAndProceed = () => {
  if (!hasPremium.value) {
    router.push('/upgrade-account')
    return false
  }
  return true
}

</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header with gradient background -->
  


    <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 py-8 px-4 sm:px-6 lg:px-8">
      

      <!-- Main Content -->
      <main class="md:col-span-4 space-y-8">
        <!-- Premium Required Notice -->
        <div v-if="!hasPremium" class="bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-400 p-4 mb-6">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm text-yellow-700 dark:text-yellow-300">
                Physician consultation is a premium feature. 
                <RouterLink to="/upgrade-account" class="font-medium underline text-yellow-700 dark:text-yellow-300 hover:text-yellow-600 dark:hover:text-yellow-200">
                  Upgrade your account
                </RouterLink>
                to access this feature.
              </p>
            </div>
          </div>
        </div>

        <!-- Alert Messages -->
        <div v-if="error" class="p-4 bg-red-50 border-l-4 border-red-500 rounded-md text-red-700 dark:bg-red-900/20 dark:text-red-300 dark:border-red-500 flex items-center">
          <span class="mr-3 text-red-500">⚠️</span>
          <p>{{ error }}</p>
        </div>
        
        <div v-if="success" class="p-4 bg-green-50 border-l-4 border-green-500 rounded-md text-green-700 dark:bg-green-900/20 dark:text-green-300 dark:border-green-500 flex items-center">
          <span class="mr-3 text-green-500">✅</span>
          <p>{{ success }}</p>
        </div>

        <!-- Step 1: Consultation Options -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <div class="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-100 dark:border-gray-600">
            <h2 class="text-xl font-semibold text-gray-800 dark:text-white">Step 1: Select Consultation Type</h2>
          </div>
          
          <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div 
                v-for="option in consultationOptions" 
                :key="option.type" 
                class="bg-white dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-xl overflow-hidden p-6 text-center cursor-pointer hover:shadow-md transition-all duration-200"
                :class="{
                  'ring-2 ring-indigo-500 shadow-md bg-indigo-50 dark:bg-indigo-900/20': selectedOption === option,
                  'opacity-50 cursor-not-allowed': !hasPremium
                }"
                @click="checkPremiumAndProceed() && selectOption(option)" 
                :disabled="!hasPremium.value || !authStore.isAuthenticated"
              >
                <div class="mb-4">
                  <span class="text-3xl" v-if="option.type === 'text'">💬</span>
                  <span class="text-3xl" v-if="option.type === 'video'">📹</span>
                  <span class="text-3xl" v-if="option.type === 'in-person'">👩‍⚕️</span>
                </div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">{{ option.title }}</h3>
                <p class="text-gray-600 dark:text-gray-300 text-sm">{{ option.description }}</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Step 2: Physician Directory -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <div class="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-100 dark:border-gray-600">
            <h2 class="text-xl font-semibold text-gray-800 dark:text-white">Step 2: Select Physician</h2>
          </div>
          
          <div class="p-6">
            <div v-if="loadingPhysicians" class="flex justify-center py-8">
              <svg class="animate-spin h-8 w-8 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <div v-else-if="errorPhysicians" class="p-4 bg-red-50 border-l-4 border-red-500 rounded-md text-red-700 dark:bg-red-900/20 dark:text-red-300 dark:border-red-500 flex items-center">
              <span class="mr-3 text-red-500">⚠️</span>
              <p>{{ errorPhysicians }}</p>
            </div>
            <div v-else-if="physicians.length === 0" class="py-10 text-center">
              <p class="text-gray-600 dark:text-gray-400 text-lg">No physicians found.</p>
            </div>
            <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div 
                v-for="physician in physicians" 
                :key="physician.id" 
                class="bg-white dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
                :class="{
                  'ring-2 ring-indigo-500 shadow-md bg-indigo-50 dark:bg-indigo-900/20': selectedPhysician === physician,
                  'opacity-50 cursor-not-allowed': !hasPremium
                }"
                @click="checkPremiumAndProceed() && selectPhysician(physician)" 
                :disabled="!hasPremium.value || !authStore.isAuthenticated"
              >
                <div class="p-4 bg-indigo-50 dark:bg-indigo-900/20 border-b border-gray-100 dark:border-gray-600">
                  <div class="flex items-center">
                    <div class="h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-800 flex items-center justify-center text-indigo-500 dark:text-indigo-300 text-xl font-bold">
                      {{ physician.name.charAt(0) }}
                    </div>
                    <div class="ml-4">
                      <h3 class="font-semibold text-gray-900 dark:text-white">{{ physician.name }}</h3>
                      <p class="text-sm text-indigo-600 dark:text-indigo-300">{{ physician.specialty }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 3: Appointment Scheduler -->
        <div v-if="showScheduler && selectedOption && hasPremium.value && authStore.isAuthenticated" class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <div class="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-100 dark:border-gray-600">
            <h2 class="text-xl font-semibold text-gray-800 dark:text-white">Step 3: Schedule Your {{ selectedOption.title }}</h2>
          </div>
          
          <div class="p-6">
            <form @submit.prevent="handleSubmit" class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label for="date" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
                  <input 
                    type="date" 
                    id="date" 
                    v-model="consultationDate"
                    required
                    class="block w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white transition duration-150"
                  >
                </div>
                <div>
                  <label for="time" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Time</label>
                  <input 
                    type="time" 
                    id="time" 
                    v-model="consultationTime"
                    required
                    class="block w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white transition duration-150"
                  >
                </div>
              </div>
              <div>
                <label for="duration" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Duration</label>
                <select 
                  id="duration" 
                  v-model="consultationDuration"
                  class="block w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white transition duration-150"
                >
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="45">45 minutes</option>
                  <option value="60">60 minutes</option>
                </select>
              </div>
              <div>
                <label for="notes" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes for the Physician</label>
                <textarea 
                  id="notes" 
                  v-model="consultationNotes"
                  rows="4"
                  class="block w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white transition duration-150"
                  placeholder="Describe your symptoms or reason for consultation..."
                ></textarea>
              </div>
              
              <!-- Submit Button -->
              <div class="flex justify-end">
                <button 
                  type="submit"
                  :disabled="loading"
                  class="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-medium py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-all duration-150 shadow-md hover:shadow-lg flex items-center"
                >
                  <span v-if="!loading">Schedule Consultation</span>
                  <span v-else class="flex items-center">
                    <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Your Consultations -->
        <div v-if="authStore.isAuthenticated" class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <div class="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-100 dark:border-gray-600">
            <h2 class="text-xl font-semibold text-gray-800 dark:text-white">Your Upcoming Consultations</h2>
          </div>
          
          <div class="p-6">
            <div v-if="loading" class="flex justify-center py-8">
              <svg class="animate-spin h-8 w-8 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            
            <div v-else-if="userConsultations.length === 0" class="py-10 text-center">
              <div class="text-gray-400 dark:text-gray-500 text-6xl mb-4">📅</div>
              <p class="text-gray-600 dark:text-gray-400 text-lg">You don't have any scheduled consultations</p>
              <p class="text-gray-500 dark:text-gray-500 text-sm mt-2">Select a consultation type and physician above to get started</p>
            </div>
            
            <div v-else class="space-y-4">
              <div 
                v-for="consultation in userConsultations" 
                :key="consultation.id"
                class="bg-white dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-lg overflow-hidden shadow-sm"
              >
                <div class="p-4 border-l-4" :class="{
                  'border-blue-500': consultation.consultation_type === 'text',
                  'border-green-500': consultation.consultation_type === 'video',
                  'border-purple-500': consultation.consultation_type === 'in-person'
                }">
                  <div class="flex justify-between items-start">
                    <div class="flex items-start">
                      <div class="text-2xl mr-4">
                        {{ getConsultationIcon(consultation.consultation_type) }}
                      </div>
                      <div>
                        <h3 class="font-semibold text-gray-900 dark:text-white">
                          {{ consultation.consultation_type.charAt(0).toUpperCase() + consultation.consultation_type.slice(1) }} Consultation
                        </h3>
                        <p class="text-sm font-medium text-indigo-600 dark:text-indigo-300 mt-1">With {{ consultation.physicianName }}</p>
                        <div class="mt-2 flex flex-wrap gap-2">
                          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200">
                            🕒 {{ formatDate(consultation.scheduled_at) }}
                          </span>
                          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200">
                            ⏱️ {{ consultation.duration }} min
                          </span>
                          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" :class="{
                            'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300': consultation.status === 'pending',
                            'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300': consultation.status === 'confirmed',
                            'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300': consultation.status === 'completed'
                          }">
                            {{ consultation.status.charAt(0).toUpperCase() + consultation.status.slice(1) }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>