<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto">
      <!-- Emergency Alert Banner -->
      <div class="bg-red-100 dark:bg-red-900/50 border-l-6 border-red-600 dark:border-red-500 p-6 mb-10 rounded-lg shadow-md">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <svg class="h-10 w-10 text-red-600 dark:text-red-400 animate-pulse" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-4">
            <h3 class="text-lg font-bold text-red-700 dark:text-red-300 mb-2">
              Immediate Medical Emergencies
            </h3>
            <p class="text-red-600 dark:text-red-400">
              If you are experiencing a life-threatening emergency, call emergency services immediately.
            </p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 shadow-2xl rounded-xl overflow-hidden transform transition-all duration-300 hover:scale-[1.01]">
        <div class="p-8">
          <h1 class="text-4xl font-extrabold text-center text-gray-900 dark:text-white mb-8 tracking-tight">
            Emergency Contacts
          </h1>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <!-- Emergency Numbers -->
            <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-600 dark:text-red-400 mr-4" fill="none" viewBox="0 0 36 36" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.848 9.724c1.376-.59 2.52-1.632 3.384-2.874m-1.51-6.72c-1.246-.59-2.492-1.128-3.722-1.728-4.261-2.132-8.874 1.848-8.874 6.884 0 1.939.694 3.717 1.848 5.09" />
                </svg>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  Emergency Numbers
                </h2>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b pb-2 border-gray-200 dark:border-gray-600">
                  <span className="text-gray-700 dark:text-gray-300">Emergency Services</span>
                  <a 
                    href="tel:911" 
                    className="text-red-600 dark:text-red-400 font-bold hover:text-red-800 dark:hover:text-red-300 transition-colors flex items-center"
                  >
                    911
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                  </a>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 dark:text-gray-300">Poison Control</span>
                  <a 
                    href="tel:1-800-222-1222" 
                    className="text-red-600 dark:text-red-400 font-bold hover:text-red-800 dark:hover:text-red-300 transition-colors flex items-center"
                  >
                    1-800-222-1222
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
            
            <!-- Nearby Facilities -->
            <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-600 dark:text-red-400 mr-4" fill="none" viewBox="0 0 36 36" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  Find Nearby ER
                </h2>
              </div>
              <div className="space-y-4">
                <input
                  type="text"
                  v-model="location"
                  placeholder="Enter your location"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 dark:bg-gray-800 dark:text-white transition-all duration-300"
                />
                <button 
                  @click="findNearestER"
                  className="w-full py-3 bg-red-600 dark:bg-red-500 text-white font-semibold rounded-lg hover:bg-red-700 dark:hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-300 ease-in-out transform active:scale-95 flex items-center justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  Find Nearest Emergency Room
                </button>
              </div>
            </div>
          </div>

          <!-- Additional Emergency Tips -->
          <div className="mt-8 bg-yellow-50 dark:bg-yellow-900/30 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-yellow-800 dark:text-yellow-300 mb-4">
              Emergency Preparedness Tips
            </h3>
            <ul className="space-y-2 text-yellow-700 dark:text-yellow-200 list-disc list-inside">
              <li>Keep a list of emergency contacts easily accessible</li>
              <li>Have a basic first aid kit at home and in your car</li>
              <li>Know the location of the nearest hospital and urgent care center</li>
              <li>Learn basic first aid and CPR</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      location: '',
      nearbyDoctors: [],
      loadingDoctors: false,
      userLocation: null,
      error: null
    }
  },
  methods: {
    findNearestER() {
      // In a real application, this would integrate with a mapping/geolocation service
      if (this.location) {
        // Create Google Maps URL for directions to nearest ER
        const mapsUrl = `https://www.google.com/maps/search/emergency+room+near+${encodeURIComponent(this.location)}`;
        window.open(mapsUrl, '_blank');
        // Placeholder for actual ER finding logic
      } else {
        alert('Please enter a location');
      }
    },
    async loadNearbyDoctors() {
      try {
        this.loadingDoctors = true;
        this.error = null;
        
        // Get user's location if not already available
        if (!this.userLocation) {
          this.userLocation = await getUserLocation();
        }
        
        // Find nearby doctors
        const doctors = await findNearbyLungDoctors(this.userLocation, 10000); // 10km radius
        this.nearbyDoctors = doctors.slice(0, 3); // Show top 3 doctors
      } catch (err) {
        console.error('Error loading nearby doctors:', err);
        this.error = 'Unable to load nearby doctors. Please try again.';
      } finally {
        this.loadingDoctors = false;
      }
    }
  },
  mounted() {
    // Load nearby doctors when component mounts
    this.loadNearbyDoctors();
  }
}
</script>
