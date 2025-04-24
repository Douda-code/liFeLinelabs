<script setup>
import { RouterLink } from 'vue-router'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { ref, onMounted, watch } from 'vue'

// Props
const props = defineProps({
  activeSection: String
})

// Router and auth
const router = useRouter()
const authStore = useAuthStore()

// Sidebar state
const isCollapsed = ref(false)
const isMobile = ref(false)
const showMobileMenu = ref(false)

// Navigation items with icons
const navItems = [
  { name: 'AI Classification', path: '/ai-analysis', icon: 'M9 3.75H6.912a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0 1.209 2.94l9.782 3.913c.56.223 1.189.223 1.75 0l9.781-3.913a2.25 2.25 0 0 0 1.21-2.94l-2.414-7.84A2.25 2.25 0 0 0 21.516 3.75H15M9 3.75l-1.5 8.25m0 0 9-4.5M7.5 12l6 3m3-3 1.5-8.25' },
  { name: 'Scan Results', path: '/scans', icon: 'M6 20.25h12m-7.5-3v3m3-3v3m-10.125-3h17.25c.621 0 1.125-.504 1.125-1.125V4.875c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125Z' },
  { name: 'Make Lab Appointment', path: '/make-appointment', icon: 'M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5' },
  { name: 'Physician Consultation', path: '/consultation', icon: 'M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z' },
  { name: 'Find Lung Doctors', path: '/find-doctors', icon: 'M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z' },
  { name: 'Activity History', path: '/activity-history', icon: 'M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z' },
  { name: 'Notifications', path: '/notifications', icon: 'M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0' },
  { name: 'Account Settings', path: '/account-settings', icon: 'M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.431l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49L1.258 17.7a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z' }
]

// Toggle sidebar collapse state
const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value
  localStorage.setItem('sidebarCollapsed', isCollapsed.value)
}

// Toggle mobile menu
const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
}

// Handle logout
const logout = async () => {
  await authStore.signOut()
  router.push('/')
}

// Check screen size and set sidebar state
const checkScreenSize = () => {
  isMobile.value = window.innerWidth < 768
  if (isMobile.value && !showMobileMenu.value) {
    isCollapsed.value = true
  }
}

// Watch for mobile state changes
watch(isMobile, (newVal) => {
  if (newVal && !showMobileMenu.value) {
    isCollapsed.value = true
  }
})

// Initialize on mount
onMounted(() => {
  // Load saved preference
  const savedState = localStorage.getItem('sidebarCollapsed')
  if (savedState !== null) {
    isCollapsed.value = savedState === 'true'
  }
  
  // Set initial state based on screen size
  checkScreenSize()
  
  // Add resize listener
  window.addEventListener('resize', checkScreenSize)
})
</script>

<template>
  <!-- Mobile menu overlay -->
  <div 
    v-if="isMobile && showMobileMenu" 
    class="fixed inset-0 bg-gray-900 bg-opacity-50 z-40"
    @click="toggleMobileMenu"
  ></div>
  
  <!-- Mobile menu button -->
  <button 
    v-if="isMobile" 
    @click="toggleMobileMenu" 
    class="fixed top-4 left-4 z-50 p-2 rounded-md bg-white dark:bg-gray-800 shadow-md"
    :class="{ 'ml-64': showMobileMenu }"
  >
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
      <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
  </button>
  
  <!-- Sidebar container -->
  <aside 
    class=" flex top-20 left-0 z-60 transition-all duration-300 ease-in-out shadow-lg"
    :class="{
      'w-64': !isCollapsed || (isMobile && showMobileMenu),
      'w-16': isCollapsed && (!isMobile || !showMobileMenu),
      '-translate-x-full': isMobile && !showMobileMenu,
      'translate-x-0': !isMobile || showMobileMenu
    }"  
    style="top: 60px; bottom: 60px;"
  >
    <div class="h-full flex flex-col bg-white dark:bg-gray-800 overflow-y-auto overflow-x-hidden">
      <!-- Sidebar header -->
      <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 
  class="text-lg font-semibold text-gray-800 dark:text-white transition-opacity duration-200 ml-12"
  :class="{ 'opacity-0 w-0': isCollapsed && !isMobile }"
>
  Dashboard
</h2>

        
       <!-- Toggle button (desktop only) -->
<!-- Toggle button (desktop only) -->

    <!-- Toggle button positioned inside the sidebar -->
    <button 
      @click="toggleSidebar" 
      class="absolute -right 4 top-3 flex items-center justify-center w-10 h-10 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none transition-colors"
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M3 6h18M3 12h18M3 18h18" />
      </svg>
    </button>


        
        <!-- Close button (mobile only) -->
        <button 
          v-if="isMobile && showMobileMenu"
          @click="toggleMobileMenu" 
          class="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <!-- Navigation -->
      <nav class="flex-1 p-3 space-y-1">
        <RouterLink 
          v-for="item in navItems" 
          :key="item.path"
          :to="item.path" 
          class="flex items-center gap-x-3 p-2 rounded-lg transition-all duration-200 group relative"
          :class="{
            'justify-center': isCollapsed && !isMobile,
            'bg-indigo-600 text-white hover:bg-indigo-700': activeSection === item.path.substring(1),
            'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700': activeSection !== item.path.substring(1)
          }"
        >
          <!-- Icon -->
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 flex-shrink-0">
            <path stroke-linecap="round" stroke-linejoin="round" :d="item.icon" />
          </svg>
          
          <!-- Label -->
          <span 
            class="truncate transition-all duration-200" 
            :class="{ 'opacity-0 w-0': isCollapsed && !isMobile }"
          >
            {{ item.name }}
          </span>
          
          <!-- Tooltip for collapsed mode -->
          <div 
            v-if="isCollapsed && !isMobile"
            class="absolute left-full rounded-md px-2 py-1 ml-6 bg-gray-900 text-white text-sm 
                   invisible opacity-0 -translate-x-3 transition-all group-hover:visible 
                   group-hover:opacity-100 group-hover:translate-x-0 z-50 whitespace-nowrap"
          >
            {{ item.name }}
          </div>
        </RouterLink>
      </nav>
      
      <!-- Logout button -->
      <div class="p-3 border-t border-gray-200 dark:border-gray-700">
        <button 
          @click="logout" 
          class="flex items-center gap-x-3 p-2 rounded-lg transition-all duration-200 group relative w-full"
          :class="{
            'justify-center': isCollapsed && !isMobile,
            'text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700': true
          }"
        >
          <!-- Logout icon -->
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
          </svg>
          
          <!-- Label -->
          <span 
            class="truncate transition-all duration-200" 
            :class="{ 'opacity-0 w-0': isCollapsed && !isMobile }"
          >
            Logout
          </span>
          
          <!-- Tooltip for collapsed mode -->
          <div 
            v-if="isCollapsed && !isMobile"
            class="absolute left-full rounded-md px-2 py-1 ml-6 bg-gray-900 text-white text-sm 
                   invisible opacity-0 -translate-x-3 transition-all group-hover:visible 
                   group-hover:opacity-100 group-hover:translate-x-0 z-50"
          >
            Logout
          </div>
        </button>
      </div>
    </div>
  </aside>


</template>

<style scoped>
/* Base transitions */
.transition-all {
  transition-property: all;
}

.transition-colors {
  transition-property: background-color, border-color, color, fill, stroke;
}

/* Utility classes for scrollbar styling */
::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 5px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a0aec0;
}

::-webkit-scrollbar-track {
  background: transparent;
}

/* Dark mode scrollbar */
.dark ::-webkit-scrollbar-thumb {
  background: #4a5568;
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: #718096;
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.group:hover .group-hover\:visible {
  animation: fadeIn 0.2s ease-in-out forwards;
}
</style>
