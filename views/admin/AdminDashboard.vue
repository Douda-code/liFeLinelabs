<template>
  <AdminLayout activeSection="admin">
    <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">Admin Dashboard</h1>
    </div>
    <div
      class="max-w-7xl mx-auto flex flex-col gap-6 py-4 px-4 sm:px-6 lg:px-8"
    >
      <!-- Total Registered Patients and Physicians -->
      <div class="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Total Registered</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">Patients</h3>
            <p class="text-3xl font-bold text-gray-900 dark:text-white">1,234</p>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">Physicians</h3>
            <p class="text-3xl font-bold text-gray-900 dark:text-white">456</p>
          </div>
        </div>
      </div>

      <!-- Recent Scan Uploads and AI Classification Outcomes -->
      <div class="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">Scan Uploads</h3>
            <ul class="space-y-2">
              <li
                v-for="scan in recentScans"
                :key="scan.id"
                class="flex items-center justify-between p-2 bg-white dark:bg-gray-600 rounded"
              >
                <div>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">{{ scan.date }}</p>
                  <p class="text-sm text-gray-500 dark:text-gray-300">
                    {{ scan.type }} - {{ scan.patientName }}
                  </p>
                </div>
              </li>
            </ul>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">
              AI Classification Outcomes
            </h3>
            <ul class="space-y-2">
              <li
                v-for="outcome in aiOutcomes"
                :key="outcome.id"
                class="flex items-center justify-between p-2 bg-white dark:bg-gray-600 rounded"
              >
                <div>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">{{ outcome.date }}</p>
                  <p class="text-sm text-gray-500 dark:text-gray-300">
                    {{ outcome.scanType }} - {{ outcome.result }}
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Upcoming Appointments or Consultation Requests -->
      <div class="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Upcoming</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">Appointments</h3>
            <ul class="space-y-2">
              <li
                v-for="appointment in upcomingAppointments"
                :key="appointment.id"
                class="flex items-center justify-between p-2 bg-white dark:bg-gray-600 rounded"
              >
                <div>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ appointment.date }} at {{ appointment.time }}
                  </p>
                  <p class="text-sm text-gray-500 dark:text-gray-300">
                    {{ appointment.patientName }} -
                    {{ appointment.physicianName }}
                  </p>
                </div>
              </li>
            </ul>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">
              Consultation Requests
            </h3>
            <ul class="space-y-2">
              <li
                v-for="request in consultationRequests"
                :key="request.id"
                class="flex items-center justify-between p-2 bg-white dark:bg-gray-600 rounded"
              >
                <div>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ request.date }} at {{ request.time }}
                  </p>
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
  </AdminLayout>
</template>

<script setup>
import { ref } from 'vue';
import AdminLayout from '../../components/AdminLayout.vue';
import { useDarkModeStore } from '../../stores/darkMode';

const darkModeStore = useDarkModeStore();

const recentScans = ref([
  { id: 1, date: '2024-03-15', type: 'MRI', patientName: 'John Doe' },
  { id: 2, date: '2024-03-14', type: 'CT Scan', patientName: 'Jane Smith' },
  { id: 3, date: '2024-03-13', type: 'X-Ray', patientName: 'Emily Johnson' },
]);

const aiOutcomes = ref([
  { id: 1, date: '2024-03-15', scanType: 'MRI', result: 'Normal' },
  { id: 2, date: '2024-03-14', scanType: 'CT Scan', result: 'Abnormal' },
  { id: 3, date: '2024-03-13', scanType: 'X-Ray', result: 'Normal' },
]);

const upcomingAppointments = ref([
  {
    id: 1,
    date: '2024-03-20',
    time: '10:00 AM',
    patientName: 'John Doe',
    physicianName: 'Dr. Smith',
  },
  {
    id: 2,
    date: '2024-03-25',
    time: '2:00 PM',
    patientName: 'Jane Smith',
    physicianName: 'Dr. Johnson',
  },
]);

const consultationRequests = ref([
  {
    id: 1,
    date: '2024-03-20',
    time: '10:00 AM',
    patientName: 'John Doe',
    physicianName: 'Dr. Smith',
  },
  {
    id: 2,
    date: '2024-03-25',
    time: '2:00 PM',
    patientName: 'Jane Smith',
    physicianName: 'Dr. Johnson',
  },
]);
</script>