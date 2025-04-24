<script setup>
import { ref, onMounted } from 'vue';
import AdminLayout from '../../components/AdminLayout.vue';
import { getAllAppointments, updateAppointmentStatus } from '../../services/appointmentService';

const appointments = ref([]);
const loading = ref(true);
const error = ref(null);
const showActionModal = ref(false);
const selectedAppointment = ref(null);
const actionType = ref('');

const loadAppointments = async () => {
  try {
    loading.value = true;
    error.value = null;
    const data = await getAllAppointments();
    appointments.value = data;
  } catch (err) {
    console.error('Error loading appointments:', err);
    error.value = 'Failed to load appointments';
  } finally {
    loading.value = false;
  }
};

const openActionModal = (appointment, action) => {
  selectedAppointment.value = appointment;
  actionType.value = action;
  showActionModal.value = true;
};

const handleAction = async () => {
  try {
    if (!selectedAppointment.value) return;
    
    let newStatus;
    switch (actionType.value) {
      case 'cancel':
        newStatus = 'Cancelled';
        break;
      case 'reschedule':
        newStatus = 'Rescheduled';
        break;
      case 'wait':
        newStatus = 'Waiting';
        break;
      default:
        return;
    }
    
    await updateAppointmentStatus(selectedAppointment.value.id, newStatus);
    await loadAppointments();
    showActionModal.value = false;
  } catch (err) {
    console.error('Error updating appointment:', err);
    error.value = 'Failed to update appointment';
  }
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString();
};

onMounted(() => {
  loadAppointments();
});
</script>

<template>
  <AdminLayout activeSection="appointments">
    <div class="container mx-auto p-4">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">Appointments</h1>

      <!-- Loading and Error States -->
      <div v-if="loading" class="flex justify-center py-8">
        <svg class="animate-spin h-8 w-8 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>

      <div v-else-if="error" class="p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg mb-4">
        {{ error }}
      </div>

      <div v-else>
        <!-- Appointments Table -->
        <div class="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Patient</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Time</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Reason</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="appointment in appointments" :key="appointment.id">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {{ appointment.patientName }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {{ formatDate(appointment.appointment_date) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {{ appointment.appointment_time }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {{ appointment.reason }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 py-1 text-xs font-semibold rounded-full" 
                    :class="{
                      'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200': appointment.status === 'Confirmed',
                      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200': appointment.status === 'Pending',
                      'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200': appointment.status === 'Cancelled',
                      'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200': appointment.status === 'Waiting'
                    }">
                    {{ appointment.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex space-x-2">
                    <button 
                      @click="openActionModal(appointment, 'cancel')"
                      class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                    >
                      Cancel
                    </button>
                    <button 
                      @click="openActionModal(appointment, 'reschedule')"
                      class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      Reschedule
                    </button>
                    <button 
                      @click="openActionModal(appointment, 'wait')"
                      class="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300"
                    >
                      Wait
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Action Modal -->
      <div v-if="showActionModal" class="fixed z-10 inset-0 overflow-y-auto">
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
          <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                {{ actionType.charAt(0).toUpperCase() + actionType.slice(1) }} Appointment
              </h3>
              <div class="mt-3">
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  Are you sure you want to {{ actionType }} this appointment?
                </p>
              </div>
            </div>
            <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                @click="handleAction"
                class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Confirm
              </button>
              <button
                @click="showActionModal = false"
                class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>