<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-red-50 dark:bg-red-900 border-l-4 border-red-600 dark:border-red-500 p-4 mb-8">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-600 dark:text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-600 dark:text-red-400">
              For immediate medical emergencies, call emergency services immediately
            </h3>
          </div>
        </div>
      </div>

      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">Emergency Contacts</h1>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Emergency Numbers -->
        <div class="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
          <div class="p-6">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Emergency Numbers</h2>
            <ul class="space-y-4">
              <li class="flex justify-between items-center">
                <span class="text-gray-700 dark:text-gray-300">Emergency Services</span>
                <a href="tel:911" class="text-red-600 dark:text-red-400 font-bold hover:text-red-800 dark:hover:text-red-300">911</a>
              </li>
              <li class="flex justify-between items-center">
                <span class="text-gray-700 dark:text-gray-300">Poison Control</span>
                <a href="tel:1-800-222-1222" class="text-red-600 dark:text-red-400 font-bold hover:text-red-800 dark:hover:text-red-300">1-800-222-1222</a>
              </li>
            </ul>
          </div>
        </div>
        
        <!-- Nearby Facilities -->
        <div class="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
          <div class="p-6">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Nearby Emergency Facilities</h2>
            <div class="mb-4">
              <input
                type="text"
                placeholder="Enter your location"
                class="w-full px-4 py-2 border dark:border-gray-600 rounded focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              >
            </div>
            <button class="bg-red-600 dark:bg-red-500 text-white px-6 py-2 rounded hover:bg-red-700 dark:hover:bg-red-600 transition-colors duration-200">
              Find Nearest ER
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>