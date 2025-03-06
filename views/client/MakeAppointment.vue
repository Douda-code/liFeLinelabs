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
       authStore.user.id,// Replace with actual patient ID logic
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
    <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">Make an Appointment with a Lab</h1>
    </div>
    <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 py-4 px-4 sm:px-6 lg:px-8">
      <!-- Sidebar -->
      <NavSidebar :activeSection="activeSection" />

      <!-- Main Content -->
      <main class="md:col-span-3 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label for="appointment-date" class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Appointment Date</label>
            <input
              v-model.trim="appointmentDate"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="appointment-date"
              type="date"
              required
              :disabled="loading"
            />
          </div>
          <div>
            <label for="appointment-time" class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Appointment Time</label>
            <input
              v-model.trim="appointmentTime"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="appointment-time"
              type="time"
              required
              :disabled="loading"
            />
          </div>
          <div>
            <label for="lab" class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Lab</label>
            <select
              id="lab"
              v-model.trim="lab"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              :disabled="loading"
            >
              <option value="">Select a Lab</option>
              <option>Lab A</option>
              <option>Lab B</option>
              <option>Lab C</option>
            </select>
          </div>
          <div>
            <label for="reason" class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Reason for Appointment</label>
            <textarea
              v-model.trim="reason"
              id="reason"
              rows="4"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter the reason for your appointment..."
              :disabled="loading"
            ></textarea>
          </div>
          <div class="flex items-center justify-between mt-4">
            <button
              type="submit"
              class="bg-indigo-500 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
              :disabled="loading"
            >
              <span v-if="!loading">Book Appointment</span>
              <span v-else>Booking...</span>
            </button>
          </div>
          <div v-if="error" class="text-red-500 text-sm mt-2">{{ error }}</div>
          <div v-if="successMessage" class="text-green-500 text-sm mt-2">{{ successMessage }}</div>
        </form>
      </main>
    </div>
  </div>
</template>
