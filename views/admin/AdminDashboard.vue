<template>
  <AdminLayout activeSection="admin">
    <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">Admin Dashboard</h1>
    </div>
    <div class="max-w-7xl mx-auto flex flex-col gap-6 py-4 px-4 sm:px-6 lg:px-8">
      <!-- Total Registered Patients and Physicians -->
      <div class="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Total Registered</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">Patients</h3>
            <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ stats.totalPatients }}</p>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">Physicians</h3>
            <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ stats.totalPhysicians }}</p>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="mt-8">
        <div v-if="loading" class="flex justify-center py-8">
          <svg class="animate-spin h-8 w-8 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        
        <div v-else-if="error" class="p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg">
          {{ error }}
        </div>
        
        <div v-else>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">Recent Scan Uploads</h3>
              <ul class="space-y-2">
                <li
                  v-for="scan in recentScans"
                  :key="scan.id" 
                  class="flex items-center justify-between p-2 bg-white dark:bg-gray-600 rounded"
                >
                  <div>
                    <p class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ new Date(scan.upload_date).toLocaleDateString() }}
                    </p>
                    <p class="text-sm text-gray-500 dark:text-gray-300">
                      {{ scan.scan_type }} - {{ scan.patientName }}
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <!-- Upcoming Appointments -->
          <div class="mt-8">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white">Upcoming Appointments</h3>
                <ul class="space-y-2">
                  <li
                    v-for="appointment in upcomingAppointments"
                    :key="appointment.id"
                    class="flex items-center justify-between p-2 bg-white dark:bg-gray-600 rounded"
                  >
                    <div>
                      <p class="text-sm font-medium text-gray-900 dark:text-white">{{ new Date(appointment.appointment_date).toLocaleDateString() }} at {{ appointment.appointment_time }}</p>
                      <p class="text-sm text-gray-500 dark:text-gray-300">
                        {{ appointment.patientName }} - {{ appointment.physicianName }}
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
              <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white">Consultation Requests</h3>
                <ul class="space-y-2">
                  <li
                    v-for="request in consultationRequests"
                    :key="request.id"
                    class="flex items-center justify-between p-2 bg-white dark:bg-gray-600 rounded"
                  >
                    <div>
                      <p class="text-sm font-medium text-gray-900 dark:text-white">{{ new Date(request.scheduled_at).toLocaleDateString() }}</p>
                      <p class="text-sm text-gray-500 dark:text-gray-300">
                        {{ request.patientName }} - {{ request.physicianName }}
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import AdminLayout from '../../components/AdminLayout.vue';
import { useDarkModeStore } from '../../stores/darkMode';
import { getAllUsers } from '../../services/adminService';
import { getAllScans } from '../../services/scanService';
import { getAllAppointments } from '../../services/appointmentService';
import { getAllConsultations } from '../../services/consultationsService';

const darkModeStore = useDarkModeStore();

const recentScans = ref([]);
const upcomingAppointments = ref([]);
const consultationRequests = ref([]);
const stats = ref({
  totalPatients: 0,
  totalPhysicians: 0
});
const loading = ref(true);
const error = ref(null);

const loadDashboardData = async () => {
  try {
    loading.value = true;
    error.value = null;

    // Load users
    const users = await getAllUsers();
    stats.value.totalPatients = users.filter(u => u.role === 'patient').length;
    stats.value.totalPhysicians = users.filter(u => u.role === 'physician').length;

    // Load recent scans
    const scans = await getAllScans();
    recentScans.value = scans
      .sort((a, b) => new Date(b.upload_date) - new Date(a.upload_date))
      .slice(0, 5);

    // Load upcoming appointments
    const appointments = await getAllAppointments();
    upcomingAppointments.value = appointments
      .filter(a => new Date(a.appointment_date) >= new Date())
      .sort((a, b) => new Date(a.appointment_date) - new Date(b.appointment_date))
      .slice(0, 5);

    // Load consultation requests
    const consultations = await getAllConsultations();
    consultationRequests.value = consultations
      .filter(c => c.status === 'Pending')
      .slice(0, 5);

  } catch (err) {
    console.error('Error loading dashboard data:', err);
    error.value = 'Failed to load dashboard data';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadDashboardData();
});
</script>