<script setup>
import NavSidebar from '../../components/NavSidebar.vue'
import { ref, onMounted, computed, watch } from 'vue'
import { createAppointment } from '../../services/appointmentService'
import { useAuthStore } from '../../stores/auth'
import { supabase } from '../../lib/supabase'

const authStore = useAuthStore()
const activeSection = ref('make-appointment')
const appointmentDate = ref('')
const appointmentTime = ref('')
const lab = ref('')
const reason = ref('')
const loading = ref(false)
const error = ref(null)
const successMessage = ref('')
const labSchedule = ref([])
const isLoadingSchedule = ref(true)
const bookedSlots = ref([])

// Get lab schedule
const getLabSchedule = async () => {
  try {
    const { data, error: scheduleError } = await supabase
      .from('lab_schedule')
      .select('*')
      .order('day_of_week')

    if (scheduleError) throw scheduleError
    labSchedule.value = data
  } catch (err) {
    console.error('Error loading lab schedule:', err)
    error.value = 'Failed to load lab schedule'
  } finally {
    isLoadingSchedule.value = false
  }
}

// Get booked appointments for selected date
// Get booked appointments for selected date
const loadBookedSlots = async (date) => {
  if (!date) return
  
  try {
    const { data, error: slotsError } = await supabase
      .from('appointments')
      .select('appointment_time')
      .eq('appointment_date', date)
    
    if (slotsError) throw slotsError
    
    // Add debugging to see what's being returned
    console.log('Booked slots data:', data)
    
    bookedSlots.value = data?.map(slot => slot.appointment_time) || []
    
    // Add debugging to see the processed array
    console.log('Processed booked slots:', bookedSlots.value)
  } catch (err) {
    console.error('Error loading booked slots:', err)
  }
}

// Watch for date changes to load booked slots
watch(appointmentDate, async (newDate) => {
  if (newDate) {
    await loadBookedSlots(newDate)
  }
})

// Generate available time slots for selected date
const availableTimeSlots = computed(() => {
  if (!appointmentDate.value) return []
  
  const date = new Date(appointmentDate.value)
  const dayOfWeek = date.getDay()
  const schedule = labSchedule.value.find(s => s.day_of_week === dayOfWeek)
  
  if (!schedule || !schedule.is_working_day) return []
  
  const [startHour, startMinute] = schedule.start_time.split(':').map(Number)
  const [endHour, endMinute] = schedule.end_time.split(':').map(Number)
  
  const slots = []
  let currentTime = new Date(date)
  currentTime.setHours(startHour, startMinute, 0)
  
  const endTime = new Date(date)
  endTime.setHours(endHour, endMinute, 0)
  
  // Check if appointment date is today
  const isToday = new Date().toDateString() === date.toDateString()
  const now = new Date()
  
  while (currentTime < endTime) {
  // Format time exactly as it's stored in the database
  const timeString = currentTime.toTimeString().slice(0, 5)
  
  // Debug logging
  console.log(`Checking time: ${timeString}, Is booked: ${bookedSlots.value.includes(timeString)}`)
  
  // If appointment is today, only show future time slots
  const isValidTime = !isToday || (currentTime > now)
  
  if (!bookedSlots.value.includes(timeString) && isValidTime) {
    slots.push(timeString)
  }
    
    // Move to next 15-minute slot
    currentTime.setMinutes(currentTime.getMinutes() + 15)
  }
  
  return slots
})

// Check if selected date is a working day
const isWorkingDay = computed(() => {
  if (!appointmentDate.value) return false
  
  const date = new Date(appointmentDate.value)
  const dayOfWeek = date.getDay()
  const schedule = labSchedule.value.find(s => s.day_of_week === dayOfWeek)
  
  return schedule?.is_working_day || false
})

// Format working hours for display
const formatWorkingHours = () => {
  const workingDays = labSchedule.value
    .filter(s => s.is_working_day)
    .map(s => {
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      return `${days[s.day_of_week]} (${s.start_time} - ${s.end_time})`
    })
    .join(', ')

  return `Working days: ${workingDays}`
}

const handleSubmit = async () => {
  loading.value = true
  error.value = null
  successMessage.value = ''

  try {
    // Validate working day
    if (!isWorkingDay.value) {
      error.value = 'Selected date is not a working day'
      return
    }

    // Validate time slot is available
    if (!availableTimeSlots.value.includes(appointmentTime.value)) {
      error.value = 'Selected time slot is not available'
      return
    }

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

// Get minimum date (today)
const getMinDate = () => {
  const today = new Date()
  return today.toISOString().split('T')[0]
}

// Format time for display
const formatTime = (time) => {
  return new Date(`2000-01-01T${time}`).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  })
}

onMounted(() => {
  getLabSchedule()
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 py-8 px-4 sm:px-6 lg:px-8">
      <!-- Main Content -->
      <main class="md:col-span-4">
        <!-- Card with subtle shadow and rounded edges -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <!-- Card header -->
          <div class="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-100 dark:border-gray-600">
            <h2 class="text-xl font-semibold text-gray-800 dark:text-white">Schedule Your Appointment</h2>
            <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">{{ formatWorkingHours() }}</p>
          </div>
          
          <!-- Form content -->
          <div class="p-6">
            <form @submit.prevent="handleSubmit" class="space-y-6">
              <!-- Date selection -->
              <div>
                <label for="appointment-date" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Appointment Date</label>
                <input
                  v-model.trim="appointmentDate"
                  class="block w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white transition duration-150"
                  id="appointment-date"
                  type="date"
                  required
                  :min="getMinDate()"
                  :disabled="loading || isLoadingSchedule"
                />
              </div>

              <!-- Time slots -->
              <div v-if="appointmentDate && isWorkingDay">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Time Slot</label>
                <div class="grid grid-cols-4 gap-2">
                  <button
                    v-for="slot in availableTimeSlots"
                    :key="slot"
                    type="button"
                    @click="appointmentTime = slot"
                    class="px-3 py-2 text-sm rounded-lg transition-colors duration-200"
                    :class="[
                      appointmentTime === slot
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/50'
                    ]"
                  >
                    {{ formatTime(slot) }}
                  </button>
                </div>
                <p v-if="availableTimeSlots.length === 0" class="mt-2 text-sm text-red-600 dark:text-red-400">
                  No available time slots for this date
                </p>
              </div>

              <div v-else-if="appointmentDate && !isWorkingDay" class="p-4 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg">
                <p class="text-yellow-800 dark:text-yellow-200">
                  Selected date is not a working day. Please choose another date.
                </p>
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
                  :disabled="loading || isLoadingSchedule || !appointmentDate || !appointmentTime || !lab"
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
            <li>Appointments are only available during working hours</li>
            <li>Each appointment slot is 15 minutes long</li>
          </ul>
        </div>
      </main>
    </div>
  </div>
</template>
```

Key changes made:

1. Added time_slot column and unique constraint to appointments table to prevent double bookings
2. Created a function to check if a time slot is available
3. Updated MakeAppointment.vue to:
   - Show available 15-minute time slots in a grid
   - Format times in 12-hour format
   - Check for booked slots when date is selected
   - Prevent booking on non-working days
   - Disable submit button until all required fields are filled
   - Show clear error messages for invalid selections
   - Improved validation for time slot availability

The time slots are now displayed in a grid format, making it easy for users to select an available time. The system prevents double bookings and only shows available 15-minute slots during w
