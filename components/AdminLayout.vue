<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900">
    <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 py-4 px-4 sm:px-6 lg:px-8">
      <AdminSidebar :activeSection="activeSection" />
      <main class="md:col-span-3 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import AdminSidebar from './AdminSidebar.vue';
import { ref } from 'vue';
import { useDarkModeStore } from '../stores/darkMode';

const props = defineProps({
  activeSection: {
    type: String,
    default: 'admin'
  }
});

const activeSection = ref(props.activeSection);
const darkModeStore = useDarkModeStore();
</script>
