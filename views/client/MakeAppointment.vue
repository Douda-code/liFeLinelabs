<script setup>
import NavSidebar from '../../components/NavSidebar.vue'
import { ref } from 'vue'
import { createAppointment } from '../../services/appointmentService'
import { useAuthStore } from '../../stores/auth'

const authStore = useAuthStore()
const activeSection = ref('make-appointment')
const appointmentDate = ref('')
const appointmentTime = ref('')
const lab = ref('')
const reason = ref('')
const loading = ref(false)
const error = ref(null)
const successMessage = ref('')

const handleSubmit = async () => {
  loading.value = true
  error.value = null
  successMessage.value = ''

  try {
    const appointmentData = {
      appointmentDate: appointmentDate.value,
      appointmentTime: appointmentTime.value,
      lab: lab.value,
      reason: reason.value,
    }
    await createAppointment(
      authStore.user.id,
      appointmentData.appointmentDate,
      appointmentData.appointmentTime,
      appointmentData.reason
    )
    successMessage.value = 'Appointment booked successfully!'
    // Reset form fields after successful booking
    appointmentDate.value = ''
    appointmentTime.value = ''
    lab.value = ''
    reason.value = ''
  } catch (err) {
    error.value = err.message || 'Could not book appointment.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header with gradient background -->
  


    
    <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 py-8 px-4 sm:px-6 lg:px-8">
     

      <!-- Main Content -->
      <main class="md:col-span-4">
        <!-- Card with subtle shadow and rounded edges -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <!-- Card header -->
          <div class="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-100 dark:border-gray-600">
            <h2 class="text-xl font-semibold text-gray-800 dark:text-white">Schedule Your Appointment</h2>
          </div>
          
          <!-- Form content -->
          <div class="p-6">
            <form @submit.prevent="handleSubmit" class="space-y-6">
              <!-- Two-column layout for date and time -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label for="appointment-date" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Appointment Date</label>
                  <input
                    v-model.trim="appointmentDate"
                    class="block w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white transition duration-150"
                    id="appointment-date"
                    type="date"
                    required
                    :disabled="loading"
                  />
                </div>
                <div>
                  <label for="appointment-time" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Appointment Time</label>
                  <input
                    v-model.trim="appointmentTime"
                    class="block w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white transition duration-150"
                    id="appointment-time"
                    type="time"
                    required
                    :disabled="loading"
                  />
                </div>
              </div>
              
              <div>
                <label for="lab" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select Laboratory</label>
                <select
                  id="lab"
                  v-model.trim="lab"
                  class="block w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white transition duration-150"
                  :disabled="loading"
                >
                  <option value="">Select a Lab</option>
                  <option>Lab A</option>
                  <option>Lab B</option>
                  <option>Lab C</option>
                </select>
              </div>
              
              <div>
                <label for="reason" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Reason for Appointment</label>
                <textarea
                  v-model.trim="reason"
                  id="reason"
                  rows="4"
                  class="block w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white transition duration-150"
                  placeholder="Please describe the purpose of your lab visit..."
                  :disabled="loading"
                ></textarea>
              </div>
              
              <!-- Status messages -->
              <div>
                <div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm mb-4 dark:bg-red-900/20 dark:border-red-700 dark:text-red-400">
                  <div class="flex items-center">
                    <span class="mr-2">⚠️</span>
                    {{ error }}
                  </div>
                </div>
                
                <div v-if="successMessage" class="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm mb-4 dark:bg-green-900/20 dark:border-green-700 dark:text-green-400">
                  <div class="flex items-center">
                    <span class="mr-2">✅</span>
                    {{ successMessage }}
                  </div>
                </div>
              </div>
              
              <!-- Submit button -->
              <div>
                <button
                  type="submit"
                  class="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-medium py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-all duration-150 shadow-md hover:shadow-lg flex justify-center items-center"
                  :disabled="loading"
                >
                  <span v-if="!loading">Book Appointment</span>
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
        
        <!-- Information card -->
        <div class="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 text-sm text-blue-700 dark:text-blue-300">
          <p class="font-medium mb-1">Appointment Guidelines:</p>
          <ul class="list-disc list-inside space-y-1 ml-2">
            <li>Please arrive 15 minutes before your scheduled time</li>
            <li>Bring your insurance card and ID</li>
            <li>You can reschedule up to 24 hours before your appointment</li>
          </ul>
        </div>
      </main>
    </div>
  </div>
</template>
