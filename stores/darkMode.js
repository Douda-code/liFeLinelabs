import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useDarkModeStore = defineStore('darkMode', () => {
  const isDark = ref(localStorage.getItem('darkMode') === 'true')

  const toggleDarkMode = () => {
    isDark.value = !isDark.value
    localStorage.setItem('darkMode', isDark.value)
    updateDarkMode()
  }

  const updateDarkMode = () => {
    if (isDark.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  // Initialize dark mode on store creation
  updateDarkMode()

  return {
    isDark,
    toggleDarkMode,
    updateDarkMode
  }
})
