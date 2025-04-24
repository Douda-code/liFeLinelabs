<script setup>
import { ref, onMounted, computed } from 'vue'
import NavSidebar from '../../components/NavSidebar.vue'
import { findNearbyLungDoctors, getUserLocation, getDoctorDetails, initializeMap } from '../../services/doctorMapService'
import { useAuthStore } from '../../stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()
const activeSection = ref('find-doctors')

const doctors = ref([])
const loading = ref(false)
const error = ref(null)
const userLocation = ref(null)
const searchRadius = ref(5) // in miles
const searchSpecialty = ref('pulmonologist')
const selectedDoctor = ref(null)
const showDoctorDetails = ref(false)
const mapElement = ref(null)
const googleMap = ref(null)
const mapLoaded = ref(false)
const mapMarkers = ref([])

// Load doctors based on user location
const loadDoctors = async () => {
  try {
    loading.value = true
    error.value = null
    
    // Get user's location
    if (!userLocation.value) {
      userLocation.value = await getUserLocation()
    }
    
    // Find nearby doctors
    const nearbyDoctors = await findNearbyLungDoctors(userLocation.value, searchRadius.value * 1609) // Convert miles to meters
    doctors.value = nearbyDoctors
    console.log('Loaded doctors:', doctors.value)
    
    // Initialize Google Map if element exists
    if (mapElement.value && userLocation.value) {
      try {
        console.log('Initializing map with user location:', userLocation.value)
        
        // Extract location data for map markers
        const doctorLocations = doctors.value.map(doctor => ({
          ...doctor.location,
          name: doctor.name
        }))
        
        const { map, userMarker, doctorMarkers } = await initializeMap(
          mapElement.value,
          userLocation.value,
          doctorLocations
        )
        
        googleMap.value = map
        mapMarkers.value = doctorMarkers
        mapLoaded.value = true
        console.log('Map initialized successfully')
      } catch (mapError) {
        console.error('Error initializing map:', mapError)
        error.value = 'Failed to load map. Please try again.'
      }
    }
  } catch (err) {
    console.error('Error loading doctors:', err)
    error.value = err.message || 'Failed to load nearby doctors'
  } finally {
    loading.value = false
  }
}

// View doctor details
const viewDoctorDetails = async (doctor) => {
  console.log('Viewing doctor details:', doctor)
  try {
    loading.value = true
    const details = await getDoctorDetails(doctor.id)
    selectedDoctor.value = { ...doctor, ...details }
    showDoctorDetails.value = true
  } catch (err) {
    console.error('Error loading doctor details:', err)
    error.value = 'Failed to load doctor details'
  } finally {
    loading.value = false
  }
}

// Close doctor details modal
const closeDoctorDetails = () => {
  console.log('Closing doctor details modal')
  showDoctorDetails.value = false
  selectedDoctor.value = null
}

// Filter doctors by specialty
const filteredDoctors = computed(() => {
  if (!searchSpecialty.value) return doctors.value
  console.log('Filtering doctors by specialty:', searchSpecialty.value)
  return doctors.value.filter(doctor => 
    doctor.specialty.toLowerCase().includes(searchSpecialty.value.toLowerCase())
  )
})

// Format rating to display stars
const formatRating = (rating) => {
  const fullStars = Math.floor(rating)
  const halfStar = rating % 1 >= 0.5
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0)
  
  return {
    full: fullStars,
    half: halfStar ? 1 : 0,
    empty: emptyStars
  }
}

// Open Google Maps directions
const getDirections = (doctor) => {
  if (!userLocation.value || !doctor.location) return
  
  const origin = `${userLocation.value.latitude},${userLocation.value.longitude}`
  const destination = `${doctor.location.latitude},${doctor.location.longitude}`
  const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`
  
  window.open(url, '_blank')
}

// Book appointment with doctor
const bookAppointment = (doctor) => {
  // Store selected doctor in localStorage or state management
  localStorage.setItem('selectedDoctor', JSON.stringify(doctor))
  // Navigate to appointment booking page
  router.push('/make-appointment')
}

onMounted(() => {
  loadDoctors()
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">Find Lung Specialists Near You</h1>
      <p class="text-gray-600 dark:text-gray-300 mb-8">
        Locate pulmonologists and lung specialists in your area for consultations and treatment.
      </p>
    </div>

    <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 py-4 px-4 sm:px-6 lg:px-8">
      <!-- Sidebar -->
      <NavSidebar :activeSection="activeSection" />

      <!-- Main Content -->
      <main class="md:col-span-3 space-y-6">
        <!-- Search and Filter Controls -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label for="specialty" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Specialty</label>
              <select 
                id="specialty" 
                v-model="searchSpecialty"
                class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="pulmonologist">Pulmonologist</option>
                <option value="thoracic">Thoracic Surgeon</option>
                <option value="respiratory">Respiratory Specialist</option>
                <option value="pulmonary">Pulmonary Rehabilitation</option>
              </select>
            </div>
            
            <div>
              <label for="radius" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Search Radius</label>
              <select 
                id="radius" 
                v-model="searchRadius"
                class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              >
                <option :value="5">5 miles</option>
                <option :value="10">10 miles</option>
                <option :value="25">25 miles</option>
                <option :value="50">50 miles</option>
              </select>
            </div>
            
            <div class="flex items-end">
              <button 
                @click="loadDoctors" 
                class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                :disabled="loading"
              >
                <span v-if="loading">Searching...</span>
                <span v-else>Search</span>
              </button>
            </div>
          </div>
        </div>
        
        <!-- Map View -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div class="p-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
            <h2 class="text-lg font-medium text-gray-900 dark:text-white">Map View</h2>
          </div>
          <div class="p-4">
            <div v-if="loading" class="flex justify-center py-8">
              <svg class="animate-spin h-8 w-8 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            
            <div v-else-if="error" class="p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg">
              {{ error }}
              <button 
                @click="loadDoctors" 
                class="mt-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
              >
                Try again
              </button>
            </div>
            
            <div v-else class="rounded-lg overflow-hidden shadow-md">
              <!-- Google Maps container -->
              <div ref="mapElement" class="w-full h-64 bg-gray-100 dark:bg-gray-700"></div>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">
                Map shows approximate locations of nearby lung specialists
              </p>
            </div>
          </div>
        </div>
        
        <!-- Doctors List -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div class="p-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
            <h2 class="text-lg font-medium text-gray-900 dark:text-white">Nearby Lung Specialists</h2>
          </div>
          
          <div v-if="loading && !doctors.length" class="flex justify-center py-8">
            <svg class="animate-spin h-8 w-8 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          
          <div v-else-if="doctors.length === 0" class="p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No doctors found</h3>
            <p class="text-gray-500 dark:text-gray-400">
              Try expanding your search radius or changing your search criteria
            </p>
          </div>
          
          <div v-else class="divide-y divide-gray-200 dark:divide-gray-700">
            <div 
              v-for="doctor in doctors" 
              :key="doctor.id"
              class="p-6 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors duration-150"
            >
              <div class="flex flex-col md:flex-row md:items-start">
                <div class="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                  <div class="h-16 w-16 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-300 text-xl font-bold">
                    {{ doctor.name.charAt(0) }}
                  </div>
                </div>
                
                <div class="flex-1">
                  <div class="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 class="text-lg font-medium text-gray-900 dark:text-white">{{ doctor.name }}</h3>
                      <p class="text-indigo-600 dark:text-indigo-400">{{ doctor.specialty }}</p>
                    </div>
                    
                    <div class="mt-2 md:mt-0 flex items-center">
                      <div class="flex items-center mr-2">
                        <svg v-for="i in 5" :key="i" class="h-5 w-5" :class="{
                          'text-yellow-400': i <= Math.floor(doctor.rating),
                          'text-gray-300 dark:text-gray-600': i > Math.ceil(doctor.rating)
                        }" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span class="ml-1 text-gray-600 dark:text-gray-400">{{ doctor.rating }}</span>
                      </div>
                      <span class="text-gray-500 dark:text-gray-400 text-sm">{{ doctor.distance }}</span>
                    </div>
                  </div>
                  
                  <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div class="flex items-start">
                      <svg class="h-5 w-5 text-gray-400 dark:text-gray-500 mt-0.5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
                      </svg>
                      <span class="text-gray-600 dark:text-gray-400">{{ doctor.address }}</span>
                    </div>
                    
                    <div class="flex items-start">
                      <svg class="h-5 w-5 text-gray-400 dark:text-gray-500 mt-0.5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                      <span class="text-gray-600 dark:text-gray-400">{{ doctor.phone }}</span>
                    </div>
                  </div>
                  
                  <div class="mt-4 text-sm text-gray-500 dark:text-gray-400">
                    {{ doctor.availability }}
                  </div>
                  
                  <div class="mt-4 flex flex-wrap gap-2">
                    <button 
                      @click="viewDoctorDetails(doctor)"
                      class="inline-flex items-center px-3 py-1.5 border border-indigo-600 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 rounded-md hover:bg-indigo-50 dark:hover:bg-indigo-900/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 text-sm"
                      aria-label="View doctor profile"
                    >
                      View Profile
                    </button>
                    
                    <a 
                      :href="`tel:${doctor.phone.replace(/[^0-9]/g, '')}`"
                      class="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 text-sm"
                      aria-label="Call doctor"
                    >
                      <svg class="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                      Call
                    </a>
                    
                    <button 
                      @click="bookAppointment(doctor)"
                      class="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 text-sm"
                      aria-label="Book appointment"
                    >
                      <svg class="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
                      </svg>
                      Book Appointment
                    </button>
                    
                    <button 
                      @click="getDirections(doctor)"
                      class="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 text-sm"
                      aria-label="Get directions"
                    >
                      <svg class="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
                      </svg>
                      Directions
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
    
    <!-- Doctor Details Modal -->
    <div v-if="showDoctorDetails && selectedDoctor" class="fixed z-10 inset-0 overflow-y-auto">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="closeDoctorDetails"></div>
        
        <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                  {{ selectedDoctor.name }}
                </h3>
                <p class="text-indigo-600 dark:text-indigo-400">{{ selectedDoctor.specialty }}</p>
                
                <div class="mt-4">
                  <div class="flex items-center mb-2">
                    <div class="flex items-center mr-2">
                      <svg v-for="i in 5" :key="i" class="h-5 w-5" :class="{
                        'text-yellow-400': i <= Math.floor(selectedDoctor.rating),
                        'text-gray-300 dark:text-gray-600': i > Math.ceil(selectedDoctor.rating)
                      }" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span class="ml-1 text-gray-600 dark:text-gray-400">{{ selectedDoctor.rating }}</span>
                    </div>
                  </div>
                  
                  <p class="text-gray-700 dark:text-gray-300 mt-2">{{ selectedDoctor.bio }}</p>
                  
                  <div class="mt-4">
                    <h4 class="text-sm font-medium text-gray-900 dark:text-white">Education</h4>
                    <ul class="mt-2 text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      <li v-for="(edu, index) in selectedDoctor.education" :key="index">
                        • {{ edu }}
                      </li>
                    </ul>
                  </div>
                  
                  <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 class="text-sm font-medium text-gray-900 dark:text-white">Contact Information</h4>
                      <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">{{ selectedDoctor.address }}</p>
                      <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">{{ selectedDoctor.phone }}</p>
                      <p v-if="selectedDoctor.website" class="mt-1 text-sm">
                        <a :href="selectedDoctor.website" target="_blank" class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300">
                          Visit Website
                        </a>
                      </p>
                    </div>
                    
                    <div>
                      <h4 class="text-sm font-medium text-gray-900 dark:text-white">Office Hours</h4>
                      <div class="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        <div v-for="(hours, day) in selectedDoctor.hours" :key="day" class="flex justify-between">
                          <span>{{ day }}:</span>
                          <span>{{ hours }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="mt-4">
                    <h4 class="text-sm font-medium text-gray-900 dark:text-white">Insurance Accepted</h4>
                    <div class="mt-2 flex flex-wrap gap-2">
                      <span 
                        v-for="(insurance, index) in selectedDoctor.insuranceAccepted" 
                        :key="index"
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                      >
                        {{ insurance }}
                      </span>
                    </div>
                  </div>
                  
                  <div class="mt-4">
                    <h4 class="text-sm font-medium text-gray-900 dark:text-white">Reviews</h4>
                    <div class="mt-2 space-y-3">
                      <div v-for="(review, index) in selectedDoctor.reviews" :key="index" class="border-b border-gray-200 dark:border-gray-700 pb-3">
                        <div class="flex items-center">
                          <div class="flex items-center">
                            <svg v-for="i in 5" :key="i" class="h-4 w-4" :class="{
                              'text-yellow-400': i <= review.rating,
                              'text-gray-300 dark:text-gray-600': i > review.rating
                            }" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          </div>
                          <span class="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">{{ review.author }}</span>
                        </div>
                        <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">{{ review.text }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button 
              type="button" 
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
              @click="bookAppointment(selectedDoctor)"
            >
              Book Appointment
            </button>
            <button 
              type="button" 
             class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
             @click="getDirections(selectedDoctor)"
            >
              Get Directions
            </button>
            <button 
              type="button" 
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              @click="closeDoctorDetails"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Map container styles */
/* Doctor card hover effect */
.doctor-card {
  transition: all 0.3s ease;
}

.doctor-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}
</style>