<script setup>
import { ref } from 'vue'
import NavSidebar from '../../components/NavSidebar.vue'

const consultationOptions = ref([
  { type: 'text', title: 'Text Messaging', description: 'Send a text message to your physician for quick consultations.' },
  { type: 'video', title: 'Video Calls', description: 'Schedule a video call with your physician for a virtual consultation.' },
  { type: 'in-person', title: 'In-Person Appointments', description: 'Book an in-person appointment with your physician.' }
])

const physicians = ref([
  { id: 1, name: 'Dr. John Doe', specialty: 'Cardiologist', rating: '4.5/5', contact: 'john.doe@example.com', phone: '123-456-7890' },
  { id: 2, name: 'Dr. Jane Smith', specialty: 'Neurologist', rating: '4.8/5', contact: 'jane.smith@example.com', phone: '098-765-4321' },
  { id: 3, name: 'Dr. Emily Johnson', specialty: 'Pediatrician', rating: '4.7/5', contact: 'emily.johnson@example.com', phone: '555-123-4567' }
])

const selectedOption = ref(null)
const selectedPhysician = ref(null)
const showScheduler = ref(false)
const activeSection = ref('consultation')

const selectOption = (option) => {
  selectedOption.value = option
  showScheduler.value = option.type !== 'text'
}

const selectPhysician = (physician) => {
  selectedPhysician.value = physician
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">Consultation</h1>
    </div>
    <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 py-4 px-4 sm:px-6 lg:px-8">
      <!-- Sidebar -->
      <NavSidebar :activeSection="activeSection" />

      <!-- Main Content -->
      <main class="md:col-span-3 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <!-- Consultation Options -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div v-for="option in consultationOptions" :key="option.type" class="bg-white dark:bg-gray-700 shadow-md rounded-lg overflow-hidden p-6 text-center cursor-pointer hover:shadow-lg transition-shadow duration-200" @click="selectOption(option)">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">{{ option.title }}</h2>
            <p class="text-gray-600 dark:text-gray-300">{{ option.description }}</p>
          </div>
        </div>
        
        <!-- Physician Directory -->
        <div class="bg-white dark:bg-gray-700 shadow-md rounded-lg overflow-hidden p-6 mb-8">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Available Physicians</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div v-for="physician in physicians" :key="physician.id" class="bg-gray-50 dark:bg-gray-600 p-4 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow duration-200" @click="selectPhysician(physician)">
              <h3 class="font-medium text-gray-900 dark:text-white">{{ physician.name }}</h3>
              <p class="text-sm text-gray-500 dark:text-gray-300">{{ physician.specialty }}</p>
              <p class="text-sm text-gray-500 dark:text-gray-300">{{ physician.rating }}</p>
              <p class="text-sm text-gray-500 dark:text-gray-300">{{ physician.contact }}</p>
              <p class="text-sm text-gray-500 dark:text-gray-300">{{ physician.phone }}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>