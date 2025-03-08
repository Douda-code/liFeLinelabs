<script setup>
import { ref, onMounted } from 'vue'
import NavSidebar from '../../components/NavSidebar.vue'
import { createConsultation, getPatientConsultations } from '../../services/consultationsService'
import { useAuthStore } from '../../stores/auth'
import { createNotification } from '../../services/notificationService'

const authStore = useAuthStore()

const consultationOptions = ref([
  { type: 'text', title: 'Text Messaging', description: 'Send a text message to your physician for quick consultations.' },
  { type: 'video', title: 'Video Calls', description: 'Schedule a video call with your physician for a virtual consultation.' },
  { type: 'in-person', title: 'In-Person Appointments', description: 'Book an in-person appointment with your physician.' }
])

// Using proper UUIDs for physicians
const physicians = ref([
  { 
    id: '00000000-0000-0000-0000-000000000001', 
    name: 'Dr. John Doe', 
    specialty: 'Cardiologist', 
    rating: '4.5/5', 
    contact: 'john.doe@example.com', 
    phone: '123-456-7890' 
  },
  { 
    id: '00000000-0000-0000-0000-000000000002', 
    name: 'Dr. Jane Smith', 
    specialty: 'Neurologist', 
    rating: '4.8/5', 
    contact: 'jane.smith@example.com', 
    phone: '098-765-4321' 
  },
  { 
    id: '00000000-0000-0000-0000-000000000003', 
    name: 'Dr. Emily Johnson', 
    specialty: 'Pediatrician', 
    rating: '4.7/5', 
    contact: 'emily.johnson@example.com', 
    phone: '555-123-4567' 
  }
])

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

// Format date for display
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString()
}

onMounted(() => {
  loadConsultations()
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">Consultation</h1>
    </div>
    <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 py-4 px-4 sm:px-6 lg:px-8">
      <!-- Sidebar -->
      <NavSidebar :activeSection="activeSection" />

      <!-- Main Content -->
      <main class="md:col-span-3 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <!-- Error/Success Messages -->
        <div v-if="error" class="mb-4 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded">
          {{ error }}
        </div>
        <div v-if="success" class="mb-4 p-4 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded">
          {{ success }}
        </div>

        <!-- Consultation Options -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div 
            v-for="option in consultationOptions" 
            :key="option.type" 
            class="bg-white dark:bg-gray-700 shadow-md rounded-lg overflow-hidden p-6 text-center cursor-pointer hover:shadow-lg transition-shadow duration-200"
            :class="{'ring-2 ring-indigo-500': selectedOption === option}"
            @click="selectOption(option)"
          >
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">{{ option.title }}</h2>
            <p class="text-gray-600 dark:text-gray-300">{{ option.description }}</p>
          </div>
        </div>
        
        <!-- Physician Directory -->
        <div class="bg-white dark:bg-gray-700 shadow-md rounded-lg overflow-hidden p-6 mb-8">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Available Physicians</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div 
              v-for="physician in physicians" 
              :key="physician.id" 
              class="bg-gray-50 dark:bg-gray-600 p-4 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow duration-200"
              :class="{'ring-2 ring-indigo-500': selectedPhysician === physician}"
              @click="selectPhysician(physician)"
            >
              <h3 class="font-medium text-gray-900 dark:text-white">{{ physician.name }}</h3>
              <p class="text-sm text-gray-500 dark:text-gray-300">{{ physician.specialty }}</p>
              <p class="text-sm text-gray-500 dark:text-gray-300">{{ physician.rating }}</p>
              <p class="text-sm text-gray-500 dark:text-gray-300">{{ physician.contact }}</p>
              <p class="text-sm text-gray-500 dark:text-gray-300">{{ physician.phone }}</p>
            </div>
          </div>
        </div>

        <!-- Appointment Scheduler -->
        <div v-if="showScheduler && selectedOption" class="bg-white dark:bg-gray-700 shadow-md rounded-lg overflow-hidden p-6 mb-8">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Schedule {{ selectedOption.title }}</h2>
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label for="date" class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Date</label>
                <input 
                  type="date" 
                  id="date" 
                  v-model="consultationDate"
                  required
                  class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
              </div>
              <div>
                <label for="time" class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Time</label>
                <input 
                  type="time" 
                  id="time" 
                  v-model="consultationTime"
                  required
                  class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
              </div>
            </div>
            <div>
              <label for="duration" class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Duration (minutes)</label>
              <select 
                id="duration" 
                v-model="consultationDuration"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="45">45 minutes</option>
                <option value="60">60 minutes</option>
              </select>
            </div>
            <div>
              <label for="notes" class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Notes</label>
              <textarea 
                id="notes" 
                v-model="consultationNotes"
                rows="4"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Add any notes or specific concerns..."
              ></textarea>
            </div>
            <div class="flex justify-end">
              <button 
                type="submit"
                :disabled="loading"
                class="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
              >
                {{ loading ? 'Scheduling...' : 'Schedule Consultation' }}
              </button>
            </div>
          </form>
        </div>

        <!-- Upcoming Consultations -->
        <div class="bg-white dark:bg-gray-700 shadow-md rounded-lg overflow-hidden p-6">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Your Consultations</h2>
          <div v-if="loading" class="text-center py-4">
            <p class="text-gray-600 dark:text-gray-400">Loading consultations...</p>
          </div>
          <div v-else-if="userConsultations.length === 0" class="text-center py-4">
            <p class="text-gray-600 dark:text-gray-400">No consultations scheduled</p>
          </div>
          <div v-else class="space-y-4">
            <div 
              v-for="consultation in userConsultations" 
              :key="consultation.id"
              class="bg-gray-50 dark:bg-gray-600 p-4 rounded-lg"
            >
              <div class="flex justify-between items-start">
                <div>
                  <h3 class="font-medium text-gray-900 dark:text-white">
                    {{ consultation.consultation_type.charAt(0).toUpperCase() + consultation.consultation_type.slice(1) }} Consultation
                  </h3>
                  <p class="text-sm text-gray-500 dark:text-gray-300">With {{ consultation.physicianName }}</p>
                  <p class="text-sm text-gray-500 dark:text-gray-300">{{ formatDate(consultation.scheduled_at) }}</p>
                  <p class="text-sm text-gray-500 dark:text-gray-300">Duration: {{ consultation.duration }} minutes</p>
                  <p class="text-sm text-gray-500 dark:text-gray-300">Status: {{ consultation.status }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>
