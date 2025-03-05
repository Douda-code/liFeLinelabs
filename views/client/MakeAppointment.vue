<script setup>
import NavSidebar from '../../components/NavSidebar.vue'
import { ref } from 'vue'

const activeSection = ref('make-appointment')
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
        <form class="space-y-4">
          <div>
            <label for="appointment-date" class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Appointment Date</label>
            <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="appointment-date" type="date">
          </div>
          <div>
            <label for="appointment-time" class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Appointment Time</label>
            <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="appointment-time" type="time">
          </div>
          <div>
            <label for="lab" class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Lab</label>
            <select id="lab" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline">
              <option value="">Select a Lab</option>
              <option>Lab A</option>
              <option>Lab B</option>
              <option>Lab C</option>
            </select>
          </div>
          <div>
            <label for="reason" class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Reason for Appointment</label>
            <textarea id="reason" rows="4" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="Enter the reason for your appointment..."></textarea>
          </div>
          <div class="flex items-center justify-between mt-4">
            <RouterLink to="/make-appointment">
            <button class="bg-indigo-500 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full">
              Book Appointment
            </button>
              </RouterLink>
          </div>
        </form>
      </main>
    </div>
  </div>
</template>
