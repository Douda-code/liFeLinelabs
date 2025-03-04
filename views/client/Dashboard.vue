<script setup>
import { ref } from 'vue'
import NavSidebar from '../../components/NavSidebar.vue'
import { useAuthStore } from '../../stores/auth'

const recentActivities = ref([
  { type: 'scan', title: 'MRI Results Available', date: '2024-03-15', summary: 'Your MRI scan results are now available for review.' },
  { type: 'appointment', title: 'Consultation with Dr. Smith', date: '2024-03-20', summary: 'You have an upcoming consultation with Dr. Smith.' },
  { type: 'report', title: 'AI Analysis Complete', date: '2024-03-14', summary: 'Your AI analysis report is ready.' }
])

const upcomingAppointments = ref([
  { title: 'Consultation with Dr. Smith', date: '2024-03-20', time: '10:00 AM' },
  { title: 'Follow-up with Dr. Johnson', date: '2024-03-25', time: '2:00 PM' }
])

const activeSection = ref('dashboard')
const authStore = useAuthStore()
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">Welcome, {{ authStore.user?.name || 'Patient' }}</h1>
    </div>
    <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 py-4 px-4 sm:px-6 lg:px-8">
      <!-- Sidebar -->
      <NavSidebar :activeSection="activeSection" />

      <!-- Main Content -->
      <main class="md:col-span-3">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Recent Activities -->
          <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Recent Activities</h2>
            <div class="space-y-4">
              <div v-for="activity in recentActivities" :key="activity.title" class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded">
                <div>
                  <h3 class="font-medium text-gray-900 dark:text-white">{{ activity.title }}</h3>
                  <p class="text-sm text-gray-500 dark:text-gray-400">{{ activity.date }}</p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">{{ activity.summary }}</p>
                </div>
                <button class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300">View</button>
              </div>
            </div>
          </div>

          <!-- Upcoming Appointments -->
          <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Upcoming Appointments</h2>
            <div class="space-y-4">
              <div v-for="appointment in upcomingAppointments" :key="appointment.title" class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded">
                <div>
                  <h3 class="font-medium text-gray-900 dark:text-white">{{ appointment.title }}</h3>
                  <p class="text-sm text-gray-500 dark:text-gray-400">{{ appointment.date }} at {{ appointment.time }}</p>
                </div>
                <button class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300">Reschedule</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>