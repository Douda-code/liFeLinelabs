<script setup>
import { defineProps, defineEmits } from 'vue';
import { useDarkModeStore } from '../stores/darkMode';

const props = defineProps({
  scanResult: {
    type: Object,
    required: true
  },
  showModal: {
    type: Boolean,
    required: true
  }
});

const emit = defineEmits(['close']);
const darkModeStore = useDarkModeStore();

const closeModal = () => {
  emit('close');
};
</script>

<template>
  <div v-if="showModal" class="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay, when the modal is open -->
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="closeModal"></div>

      <!-- Modal panel -->
      <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white" id="modal-title">
            Scan Result Details
          </h3>
          <div class="mt-2">
            <p class="text-gray-700 dark:text-gray-300"><strong>Patient Name:</strong> {{ scanResult.patientName }}</p>
            <p class="text-gray-700 dark:text-gray-300"><strong>Upload Date:</strong> {{ scanResult.uploadDate }}</p>
            <p class="text-gray-700 dark:text-gray-300"><strong>Scan Type:</strong> {{ scanResult.scanType }}</p>
            <p class="text-gray-700 dark:text-gray-300"><strong>Classification Status:</strong> {{ scanResult.classificationStatus }}</p>
            <p class="text-gray-700 dark:text-gray-300"><strong>Confidence Score:</strong> {{ scanResult.confidenceScore }}</p>
            <p class="text-gray-700 dark:text-gray-300"><strong>AI Report:</strong> {{ scanResult.aiReport }}</p>
          </div>
        </div>
        <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button type="button" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 dark:bg-blue-500 text-base font-medium text-white hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm" @click="closeModal">
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
