<script setup>
import { ref, onMounted, computed } from 'vue'
import { RouterLink } from 'vue-router'
import NavSidebar from '../../components/NavSidebar.vue'
import { useAuthStore } from '../../stores/auth'
import { getPatientAppointments } from '../../services/appointmentService'
import { getPatientConsultations } from '../../services/consultationsService'
import { getPatientScans } from '../../services/scanService'

const authStore = useAuthStore()

const recentActivities = ref([])
const upcomingAppointments = ref([])
const activeSection = ref('activity-history')
const activeTab = ref('recent-activity')

const loading = ref(true)
const error = ref(null)

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('en-US', options)
}

const getStatusColor = (status) => {
  return {
    'confirmed': 'bg-green-100 text-green-800',
    'pending': 'bg-yellow-100 text-yellow-800',
    'cancelled': 'bg-red-100 text-red-800',
    'completed': 'bg-blue-100 text-blue-800'
  }[status] || 'bg-gray-100 text-gray-800'
}

const loadActivities = async () => {
  if (!authStore.isAuthenticated) return

  try {
    const [appointments, consultations, scans] = await Promise.all([
      getPatientAppointments(authStore.user.id),
      getPatientConsultations(authStore.user.id),
      getPatientScans(authStore.user.id)
    ])

    upcomingAppointments.value = [
      ...appointments.map(appointment => ({
        type: 'appointment',
        title: appointment.reason,
        date: appointment.appointment_date,
        summary: `Appointment scheduled for ${appointment.appointment_time}`,
        icon: 'CalendarIcon',
        status: appointment.status
      })),
      ...consultations.map(consultation => ({
        type: 'consultation',
        title: `${consultation.consultation_type} Consultation`,
        date: consultation.scheduled_at,
        summary: `Consultation with ${consultation.physicianName}`,
        icon: 'ChatBubbleOvalLeftEllipsisIcon',
        status: consultation.status
      }))
    ].sort((a, b) => new Date(b.date) - new Date(a.date))

    recentActivities.value = scans.map(scan => ({
      type: 'scan',
      title: `${scan.scan_type} Scan Results`,
      date: scan.scan_date,
      summary: `Scan results are available for review.`,
      icon: 'DocumentTextIcon',
      status: scan.status
    }))
  } catch (err) {
    console.error('Error loading activities:', err)
    error.value = 'Failed to load activities'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadActivities()
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">


    <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 py-6 px-4 sm:px-6 lg:px-8">
      

      <main class="md:col-span-4 space-y-6">
        <nav class="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
          <div class="flex">
            <button @click="activeTab = 'recent-activity'" class="flex-1 py-4 px-6 text-center font-medium text-sm focus:outline-none transition-colors duration-200"
              :class="activeTab === 'recent-activity' ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'">
              Recent Activity
            </button>
            <button @click="activeTab = 'upcoming-appointments'" class="flex-1 py-4 px-6 text-center font-medium text-sm focus:outline-none transition-colors duration-200"
              :class="activeTab === 'upcoming-appointments' ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'">
              Upcoming Appointments
            </button>
            <button @click="activeTab = 'activity-calendar'" class="flex-1 py-4 px-6 text-center font-medium text-sm focus:outline-none transition-colors duration-200"
              :class="activeTab === 'activity-calendar' ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'">
              Activity Calendar
            </button>
          </div>
        </nav>

        <section v-if="activeTab === 'recent-activity'" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
          <div class="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 class="text-lg font-medium text-gray-900 dark:text-white">Recent Activities</h2>
          </div>
          <ul class="divide-y divide-gray-200 dark:divide-gray-700" v-if="!loading">
            <li v-for="activity in recentActivities" :key="activity.title" class="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors duration-150">
              <div class="p-6">
                <div class="flex items-start">
                  <div class="flex-shrink-0">
                    <div class="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-300">
                      {{ activity.icon ? activity.icon.charAt(0) : '#' }}
                    </div>
                  </div>
                  <div class="ml-4 flex-1">
                    <div class="flex items-center justify-between">
                      <h3 class="text-sm font-medium text-gray-900 dark:text-white">{{ activity.title }}</h3>
                      <span class="text-xs text-gray-500 dark:text-gray-400">{{ formatDate(activity.date) }}</span>
                    </div>
                    <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ activity.summary }}</p>
                    <div class="mt-3" v-if="activity.status">
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" :class="getStatusColor(activity.status)">
                        {{ activity.status.charAt(0).toUpperCase() + activity.status.slice(1) }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
          <div v-else class="flex justify-center py-8">
            <svg class="animate-spin h-8 w-8 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <div class="py-3 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-center">
            <button class="text-sm font-medium text-white dark:text-white hover:text-indigo-500 dark:hover:text-indigo-300">
              View all activities
            </button>
          </div>
        </section>

        <section v-if="activeTab === 'upcoming-appointments'" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
          <div class="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 class="text-lg font-medium text-gray-900 dark:text-white">Upcoming Appointments</h2>
          </div>
          <ul class="divide-y divide-gray-200 dark:divide-gray-700" v-if="!loading">
            <li v-for="appointment in upcomingAppointments" :key="appointment.title" class="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors duration-150">
              <div class="p-6">
                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <div class="flex-shrink-0">
                      <div class="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 font-bold">
                        {{ new Date(appointment.date).getDate() }}
                      </div>
                    </div>
                    <div class="ml-4">
                      <h3 class="text-sm font-medium text-gray-900 dark:text-white">{{ appointment.title }}</h3>
                      <div class="mt-1 flex items-center">
                        <span class="text-xs text-gray-500 dark:text-gray-400">{{ formatDate(appointment.date) }} </span>
                        <span class="ml-2 px-2 py-0.5 text-xs rounded-full" :class="getStatusColor(appointment.status)">
                          {{ appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1) }}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div class="flex space-x-2">
                    <button class="inline-flex items-center px-2.5 py-1.5 text-xs font-medium rounded border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                      Reschedule
                    </button>
                    <button class="inline-flex items-center px-2.5 py-1.5 text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 dark:text-indigo-300 dark:bg-indigo-900 dark:hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                      Details
                    </button>
                  </div>
                </div>
              </div>
            </li>
          </ul>
          <div v-else class="flex justify-center py-8">
            <svg class="animate-spin h-8 w-8 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <div class="py-3 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-center">
            <button class="text-sm font-medium text-white dark:text-white hover:text-indigo-500 dark:hover:text-indigo-300">
              View all appointments
            </button>
          </div>
        </section>

        <section v-if="activeTab === 'activity-calendar'" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
          <div class="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <h2 class="text-lg font-medium text-gray-900 dark:text-white">Activity Calendar</h2>
            <div class="flex space-x-2">
              <button class="inline-flex items-center p-1.5 rounded-md bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">
                Month
              </button>
              <button class="inline-flex items-center p-1.5 rounded-md bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 border border-transparent hover:bg-indigo-200 dark:hover:bg-indigo-800">
                Week
              </button>
              <button class="inline-flex items-center p-1.5 rounded-md bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">
                Day
              </button>
            </div>
          </div>
          <div class="p-6">
            <div class="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 rounded-lg text-center">
              <p class="text-white dark:text-white">Calendar view placeholder</p>
              <p class="text-sm text-white dark:text-white mt-2">Shows appointments and activities in calendar format</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>
