<script setup>
import { RouterLink } from 'vue-router'
import { useDarkModeStore } from '../stores/darkMode'

const darkModeStore = useDarkModeStore()
</script>

<template>
  <nav class="bg-white dark:bg-indigo-700 dark:bg-opacity-25 shadow-lg">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-center h-16 items-center">
        <div class="flex space-x-8">
          <RouterLink
            to="/about-us"
            class="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
          >
            About Us
          </RouterLink>
          <RouterLink
            to="/resources"
            class="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
          >
            Services
          </RouterLink>
          <RouterLink
            to="/contact"
            class="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
          >
            Contact Us
          </RouterLink>
          <RouterLink
            to="/emergency"
            class="inline-flex items-center px-1 pt-1 text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors duration-200"
          >
            Emergency
          </RouterLink>
        </div>
      </div>
    </div>
  </nav>
</template>
