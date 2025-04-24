<template>
    <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-center p-4">
      <div class="w-full max-w-4xl">
        <div class="bg-white dark:bg-gray-800 shadow-2xl rounded-xl overflow-hidden transform transition-all duration-300 hover:scale-[1.01]">
          <div class="p-8 md:p-12">
            <h1 class="text-4xl font-extrabold text-center text-indigo-500  dark:text-indigo-500 mb-6 tracking-tight">
              About liFeliNe labs
            </h1>
            
            <div class="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <p class="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                  At MediScan AI, we're revolutionizing medical diagnostics through cutting-edge artificial intelligence and advanced laboratory technologies.
                </p>
                
                <div class="space-y-4">
                  <div class="flex items-start space-x-4">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-indigo-600 dark:text-indigo-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                    <div>
                      <h3 class="font-semibold text-gray-800 dark:text-white">Precision Diagnostics</h3>
                      <p class="text-sm text-gray-600 dark:text-gray-400">
                        Our AI algorithms detect subtle patterns human eyes might miss.
                      </p>
                    </div>
                  </div>
                  
                  <div class="flex items-start space-x-4">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-indigo-600 dark:text-indigo-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <h3 class="font-semibold text-gray-800 dark:text-white">Early Detection</h3>
                      <p class="text-sm text-gray-600 dark:text-gray-400">
                        Identifying potential health risks before they become critical.
                      </p>
                    </div>
                  </div>
                  
                  <div class="flex items-start space-x-4">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-indigo-600 dark:text-indigo-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <div>
                      <h3 class="font-semibold text-gray-800 dark:text-white">Patient Privacy</h3>
                      <p class="text-sm text-gray-600 dark:text-gray-400">
                        Highest standards of data protection and confidentiality.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <div class="bg-gray-100 dark:bg-gray-700 rounded-lg p-6 space-y-4">
                  <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Our Mission
                  </h2>
                  <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
                    We believe in empowering patients through advanced medical technology. Our AI-driven platform provides comprehensive, accurate, and swift diagnostic insights, helping healthcare professionals make informed decisions.
                  </p>
                  <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
                    By combining machine learning with expert medical knowledge, we're creating a future where early detection and personalized healthcare become the standard.
                  </p>
                </div>
              </div>
            </div>
            
            <div class="mt-8 text-center">
              <a 
                href="#" 
                class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 ease-in-out transform active:scale-95"
              >
                Learn More About Our Technology
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'AboutUs',
    // No complex logic needed for this static page
  }
  </script>
