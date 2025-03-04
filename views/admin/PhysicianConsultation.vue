<script setup>
import { ref } from 'vue';
import AdminLayout from '../../components/AdminLayout.vue';
import { useDarkModeStore } from '../../stores/darkMode';

const darkModeStore = useDarkModeStore();

const physicians = ref([
  { id: 1, name: 'Dr. Smith', specialty: 'Cardiologist', rating: '4.5' },
  { id: 2, name: 'Dr. Johnson', specialty: 'Neurologist', rating: '4.2' },
  { id: 3, name: 'Dr. Williams', specialty: 'Pediatrician', rating: '4.8' },
]);

const appointments = ref([
  { id: 1, patientName: 'John Doe', dateTime: '2024-03-25 10:00 AM', status: 'Scheduled' },
  { id: 2, patientName: 'Jane Smith', dateTime: '2024-03-26 02:00 PM', status: 'Confirmed' },
  { id: 3, patientName: 'Alice Johnson', dateTime: '2024-03-27 11:00 AM', status: 'Pending' },
]);
</script>

<template>
  <AdminLayout activeSection="physician-consultation">
    <div class="container mx-auto p-4">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">Physician & Consultation Management</h1>

      <!-- Physician Directory -->
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Physician Directory</h2>
      <div class="shadow overflow-hidden border border-gray-200 dark:border-gray-700 sm:rounded-lg mb-4">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">Name</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">Specialty</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">Rating</th>
              <th scope="col" class="relative px-6 py-3 border-b border-gray-200 dark:border-gray-700">
                <span class="sr-only">View</span>
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="physician in physicians" :key="physician.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700">{{ physician.name }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">{{ physician.specialty }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">{{ physician.rating }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium border-b border-gray-200 dark:border-gray-700">
                <a href="#" class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300">View</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Appointment Scheduler -->
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Appointment Scheduler</h2>
      <div class="shadow overflow-hidden border border-gray-200 dark:border-gray-700 sm:rounded-lg">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">Patient Name</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">Date/Time</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">Status</th>
              <th scope="col" class="relative px-6 py-3 border-b border-gray-200 dark:border-gray-700">
                <span class="sr-only">Edit</span>
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="appointment in appointments" :key="appointment.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700">{{ appointment.patientName }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">{{ appointment.dateTime }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">{{ appointment.status }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium border-b border-gray-200 dark:border-gray-700">
                <a href="#" class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300">Edit</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </AdminLayout>
</template>