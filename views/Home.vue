<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import LoginModal from '../components/LoginModal.vue'
import { useDarkModeStore } from '../stores/darkMode'
import BottomNavBar from '../components/BottomNavBar.vue'

const showLoginModal = ref(false)
const darkModeStore = useDarkModeStore()
const activeFeatureIndex = ref(0)

const openLoginModal = () => {
  showLoginModal.value = true
}

const closeLoginModal = () => {
  showLoginModal.value = false
}

const features = [
  {
    title: 'Advanced Scan Analysis',
    description: 'Our proprietary AI algorithms provide detailed analysis of medical scans with 98% accuracy.',
    icon: '🔬',
    color: 'from-blue-500 to-indigo-600'
  },
  {
    title: 'Instant Results Access',
    description: 'Securely access your scan results within minutes through our encrypted platform.',
    icon: '📊',
    color: 'from-emerald-500 to-teal-600'
  },
  {
    title: 'AI-Powered Diagnostics',
    description: 'Cutting-edge machine learning models detect patterns and anomalies human eyes might miss.',
    icon: '🧠',
    color: 'from-purple-500 to-indigo-600'
  },
  {
    title: 'Expert Consultations',
    description: 'Connect with our team of specialists to discuss your results and treatment options.',
    icon: '👨‍⚕️',
    color: 'from-orange-500 to-amber-600'
  },
]

const testimonials = [
  {
    text: "This lab's AI scan technology identified my condition in half the time of traditional methods.",
    author: "Dr. Sarah Johnson, Neurologist"
  },
  {
    text: "The precision of their diagnostic AI is remarkable. It's transformed how we approach early detection.",
    author: "Prof. Michael Chen, Medical Research Institute"
  },
  {
    text: "As a patient, having access to my scan results so quickly reduced my anxiety significantly.",
    author: "Thomas W., Patient"
  }
]

// Automatically rotate through features
const startFeatureRotation = () => {
  setInterval(() => {
    activeFeatureIndex.value = (activeFeatureIndex.value + 1) % features.length
  }, 5000)
}

onMounted(() => {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  if (prefersDark) {
    darkModeStore.toggleDarkMode()
  }
  startFeatureRotation()
})
</script>

<template>
  <main class="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-indigo-900 text-gray-900 dark:text-gray-100 transition-all duration-500">
    <!-- Hero Section with animated background -->
    <div class="relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 opacity-50"></div>
      <div class="absolute inset-0">
        <div class="absolute inset-0 bg-[url('/images/dna-pattern.svg')] bg-center opacity-10 dark:opacity-5 animate-pulse"></div>
      </div>
      
      <div class="relative">
        <div class="mt-16 mx-auto max-w-7xl px-4 sm:mt-24 sm:px-6 lg:mt-32 lg:px-8 xl:mt-40 pb-24">
          <div class="lg:grid lg:grid-cols-12 lg:gap-8">
            <div class="sm:text-center lg:text-left lg:col-span-7">
              <h1 class="text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl">
                <span class="block xl:inline bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500 dark:from-indigo-400 dark:to-blue-300">
                  AI-Powered Medical
                </span>
                <span class="block xl:inline mt-1">Scan Analysis</span>
              </h1>
              <p class="mt-3 text-base text-gray-500 dark:text-gray-300 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                Experience the future of medical diagnostics with our lab's proprietary AI technology. Get faster, more accurate scan results with advanced pattern recognition and machine learning algorithms.
              </p>
              <div class="mt-8 sm:flex sm:justify-center lg:justify-start">
                <div class="rounded-md shadow">
                  <RouterLink to="/register" class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 dark:from-indigo-500 dark:to-blue-400 md:py-4 md:text-lg md:px-10 transform transition hover:scale-105 duration-300">
                    Get started
                  </RouterLink>
                </div>
                <div class="mt-3 sm:mt-0 sm:ml-3">
                  <button @click="openLoginModal" class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-900 dark:text-indigo-300 dark:hover:bg-indigo-800 md:py-4 md:text-lg md:px-10 transform transition hover:scale-105 duration-300">
                    Sign in
                  </button>
                </div>
              </div>
            </div>
            <div class="hidden lg:flex lg:col-span-5 lg:items-center">
  <div class="relative w-full h-96   rounded-2xl overflow-hidden shadow-xl transform transition-all duration-500 hover:scale-105">
   
    <div class="absolute inset-0 flex items-center justify-center">
      <div class="w-3/5 h-4/5 bg-white dark:bg-gray-400 rounded-xl shadow-inner flex items-center justify-center p-2">
        <div class="relative w-full h-full">
          <!-- Lung image - replace the src with your actual lung image -->
          <img src="../assets/lung.jpg" alt="Lung scan" class="absolute inset-0 w-full h-full object-contain"/>
          
          <!-- Scanning animation -->
          <div class="absolute inset-0 pointer-events-none">
            <div class="absolute inset-x-0 top-0 h-1 bg-green-600 opacity-60 animate-scan"></div>
          </div>
          
          <!-- Scanning overlay -->
          <div class="absolute inset-0 bg-blue-400 opacity-10 "></div>
          
          <!-- Scan lines -->
          <div class="absolute inset-0 overflow-hidden">
            <div class="h-full w-full bg-scan-lines"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Features Section with hover effects -->
    <div class="py-16 bg-white dark:bg-gray-800 relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-r from-indigo-100 to-blue-100 dark:from-indigo-900 dark:to-blue-900 opacity-50"></div>
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="lg:text-center">
          <h2 class="text-base text-2xl text-indigo-600 dark:text-indigo-400 font-semibold tracking-wide uppercase">
            Advanced Technology
          </h2>
          <p class="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            AI-Powered Diagnostic Solutions
          </p>
          <p class="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-300 lg:mx-auto">
            Our laboratory combines cutting-edge AI research with medical expertise to deliver unprecedented accuracy in diagnostic imaging.
          </p>
        </div>

        <div class="mt-16">
          <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div v-for="(feature, index) in features" :key="feature.title" 
              class="relative bg-white dark:bg-gray-900 p-6 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              :class="index === activeFeatureIndex ? 'ring-2 ring-indigo-500 dark:ring-indigo-400' : ''">
              <div class="absolute inset-x-0 top-0 h-1 rounded-t-xl bg-gradient-to-r" :class="feature.color"></div>
              <div class="text-4xl mb-4 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 p-3 rounded-full w-16 h-16 flex items-center justify-center">
                {{ feature.icon }}
              </div>
              <h3 class="text-xl font-bold text-gray-900 dark:text-white">
                {{ feature.title }}
              </h3>
              <p class="mt-2 text-base text-gray-500 dark:text-gray-300">
                {{ feature.description }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Technology Showcase -->
    <div class="py-16 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900 dark:to-blue-900">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
          <div>
            <h2 class="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
              Advanced AI Algorithms
            </h2>
            <p class="mt-3 max-w-3xl text-lg text-gray-500 dark:text-gray-300">
              Our proprietary machine learning models are trained on millions of medical scans, enabling detection of subtle patterns that might be missed by conventional methods.
            </p>
            <div class="mt-8 space-y-4">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 dark:bg-indigo-600 text-white">
                    <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                </div>
                <div class="ml-4">
                  <h3 class="text-lg font-medium text-gray-900 dark:text-white">98.7% Accuracy Rate</h3>
                  <p class="mt-1 text-md text-gray-500 dark:text-gray-300">Peer-reviewed studies confirm our AI's exceptional precision in diagnostic imaging.</p>
                </div>
              </div>
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 dark:bg-indigo-600 text-white">
                    <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div class="ml-4">
                  <h3 class="text-lg font-medium text-gray-900 dark:text-white">Results in Minutes</h3>
                  <p class="mt-1 text-md text-gray-500 dark:text-gray-300">Our AI analysis provides rapid results while maintaining diagnostic integrity.</p>
                </div>
              </div>
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 dark:bg-indigo-600 text-white">
                    <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                </div>
                <div class="ml-4">
                  <h3 class="text-lg font-medium text-gray-900 dark:text-white">Continuous Learning</h3>
                  <p class="mt-1 text-md text-gray-500 dark:text-gray-300">Our AI models improve over time, adapting to new medical research and discoveries.</p>
                </div>
              </div>
            </div>
          </div>
          <div class="mt-10 lg:mt-0 relative">
  <div class="relative rounded-2xl overflow-hidden shadow-xl transform transition-all duration-500 hover:scale-105 h-96">
    <div class="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-600 opacity-10 animate-pulse"></div>
    <div class="absolute inset-0 flex items-center justify-center">
      <div class="w-4/5 h-4/5 bg-white dark:bg-gray-800 rounded-xl shadow-inner flex items-center justify-center p-6">
        <div class="w-full h-full relative">
          <!-- Network structure representation -->
          <div class="absolute inset-0 flex items-center justify-center">
            <!-- Input layer -->
            <div class="flex flex-col gap-2 absolute left-2">
              <div class="w-5 h-5 rounded-full bg-indigo-500 opacity-70 animate-pulse"></div>
              <div class="w-5 h-5 rounded-full bg-indigo-500 opacity-70 animate-pulse delay-75"></div>
              <div class="w-5 h-5 rounded-full bg-indigo-500 opacity-70 animate-pulse delay-150"></div>
              <div class="w-5 h-5 rounded-full bg-indigo-500 opacity-70 animate-pulse delay-300"></div>
              <div class="w-5 h-5 rounded-full bg-indigo-500 opacity-70 animate-pulse delay-150"></div>
            </div>
            
            <!-- Hidden layers -->
            <div class="flex flex-col gap-3 absolute left-1/4">
              <div class="w-4 h-4 rounded-full bg-blue-500 opacity-70 animate-pulse delay-300"></div>
              <div class="w-4 h-4 rounded-full bg-blue-500 opacity-70 animate-pulse delay-150"></div>
              <div class="w-4 h-4 rounded-full bg-blue-500 opacity-70 animate-pulse"></div>
              <div class="w-4 h-4 rounded-full bg-blue-500 opacity-70 animate-pulse delay-75"></div>
            </div>
            
            <div class="flex flex-col gap-3 absolute left-1/2 -translate-x-1/2">
              <div class="w-4 h-4 rounded-full bg-purple-500 opacity-70 animate-pulse delay-75"></div>
              <div class="w-4 h-4 rounded-full bg-purple-500 opacity-70 animate-pulse delay-300"></div>
              <div class="w-4 h-4 rounded-full bg-purple-500 opacity-70 animate-pulse"></div>
              <div class="w-4 h-4 rounded-full bg-purple-500 opacity-70 animate-pulse delay-150"></div>
              <div class="w-4 h-4 rounded-full bg-purple-500 opacity-70 animate-pulse delay-225"></div>
            </div>
            
            <div class="flex flex-col gap-3 absolute right-1/4">
              <div class="w-4 h-4 rounded-full bg-blue-500 opacity-70 animate-pulse"></div>
              <div class="w-4 h-4 rounded-full bg-blue-500 opacity-70 animate-pulse delay-225"></div>
              <div class="w-4 h-4 rounded-full bg-blue-500 opacity-70 animate-pulse delay-150"></div>
            </div>
            
            <!-- Output layer -->
            <div class="flex flex-col gap-2 absolute right-2">
              <div class="w-5 h-5 rounded-full bg-indigo-500 opacity-70 animate-pulse delay-300"></div>
              <div class="w-5 h-5 rounded-full bg-indigo-500 opacity-70 animate-pulse"></div>
              <div class="w-5 h-5 rounded-full bg-indigo-500 opacity-70 animate-pulse delay-150"></div>
            </div>
            
            <!-- Connection lines (SVG) -->
            <svg class="absolute inset-0 w-full h-full" viewBox="110 -15 150 200" xmlns="http://www.w3.org/2000/svg">
              <!-- Input to Hidden 1 connections -->
              <path d="M40,40 L110,53" stroke="rgba(99, 102, 241, 0.5)" stroke-width="1">
                <animate attributeName="stroke-opacity" values="0.2;0.8;0.2" dur="3s" repeatCount="indefinite" />
              </path>
              <path d="M40,70 L110,53" stroke="rgba(99, 102, 241, 0.3)" stroke-width="1">
                <animate attributeName="stroke-opacity" values="0.2;0.8;0.2" dur="2.7s" repeatCount="indefinite" />
              </path>
              <path d="M40,100 L110,73" stroke="rgba(99, 102, 241, 0.3)" stroke-width="1">
                <animate attributeName="stroke-opacity" values="0.2;0.8;0.2" dur="2.4s" repeatCount="indefinite" />
              </path>
              <path d="M40,130 L110,93" stroke="rgba(99, 102, 241, 0.3)" stroke-width="1">
                <animate attributeName="stroke-opacity" values="0.2;0.8;0.2" dur="2.8s" repeatCount="indefinite" />
              </path>
              <path d="M40,40 L110,73" stroke="rgba(99, 102, 241, 0.2)" stroke-width="1" />
              <path d="M40,70 L110,93" stroke="rgba(99, 102, 241, 0.2)" stroke-width="1" />
              
              <!-- Hidden 1 to Hidden 2 connections -->
              <path d="M110,50 L180,42" stroke="rgba(99, 102, 241, 0.3)" stroke-width="1">
                <animate attributeName="stroke-opacity" values="0.2;0.8;0.2" dur="3.2s" repeatCount="indefinite" />
              </path>
              <path d="M110,50 L180,62" stroke="rgba(99, 102, 241, 0.3)" stroke-width="1">
                <animate attributeName="stroke-opacity" values="0.2;0.8;0.2" dur="2.5s" repeatCount="indefinite" />
              </path>
              <path d="M110,70 L180,65" stroke="rgba(99, 102, 241, 0.3)" stroke-width="1">
                <animate attributeName="stroke-opacity" values="0.2;0.8;0.2" dur="2.9s" repeatCount="indefinite" />
              </path>
              <path d="M110,90 L180,130" stroke="rgba(99, 102, 241, 0.3)" stroke-width="1">
                <animate attributeName="stroke-opacity" values="0.2;0.8;0.2" dur="3.3s" repeatCount="indefinite" />
              </path>
              
              <!-- Hidden 2 to Hidden 3 connections -->
              <path d="M180,40 L260,63" stroke="rgba(99, 102, 241, 0.3)" stroke-width="1">
                <animate attributeName="stroke-opacity" values="0.2;0.8;0.2" dur="2.6s" repeatCount="indefinite" />
              </path>
              <path d="M180,63 L260,85" stroke="rgba(99, 102, 241, 0.3)" stroke-width="1">
                <animate attributeName="stroke-opacity" values="0.2;0.8;0.2" dur="3.1s" repeatCount="indefinite" />
              </path>
              <path d="M180,85 L260,85" stroke="rgba(99, 102, 241, 0.3)" stroke-width="1">
                <animate attributeName="stroke-opacity" values="0.2;0.8;0.2" dur="2.3s" repeatCount="indefinite" />
              </path>
              
              <!-- Hidden 3 to Output connections -->
              <path d="M340,63 L255,63" stroke="rgba(99, 102, 241, 0.3)" stroke-width="1">
                <animate attributeName="stroke-opacity" values="0.2;0.8;0.2" dur="3.4s" repeatCount="indefinite" />
              </path>
              <path d="M340,83 L255,85" stroke="rgba(99, 102, 241, 0.3)" stroke-width="1">
                <animate attributeName="stroke-opacity" values="0.2;0.8;0.2" dur="2.2s" repeatCount="indefinite" />
              </path>
              <path d="M340,105 L255,105" stroke="rgba(99, 102, 241, 0.3)" stroke-width="1">
                <animate attributeName="stroke-opacity" values="0.2;0.8;0.2" dur="2.7s" repeatCount="indefinite" />
              </path>
            </svg>
          </div>
          
          <!-- Training progress indicator -->
          <div class="absolute bottom-2 left-0 right-0 flex flex-col items-center">
            <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">Training Progress: 78%</div>
            <div class="w-3/4 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div class="h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full animate-pulse" style="width: 78%"></div>
            </div>
            <div class="text-xs text-gray-500 dark:text-gray-400 mt-2">Loss: 0.023 | Accuracy: 97.8%</div>
          </div>
          
          <!-- Data flow animation -->
          <div class="absolute top-2 left-0 right-0 flex justify-center">
            <div class="text-xs text-gray-500 dark:text-gray-400">Epoch 78/100</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
        </div>
      </div>
    </div>

    <!-- Testimonials Section -->
    <div class="py-16 bg-white dark:bg-gray-800 overflow-hidden">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="lg:text-center">
          <h2 class="text-base text-2xl text-indigo-600 dark:text-indigo-400 font-semibold tracking-wide uppercase">
            Testimonials
          </h2>
          <p class="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Trusted by Medical Professionals
          </p>
        </div>
        <div class="mt-10">
          <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div v-for="(testimonial, index) in testimonials" :key="index" class="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div class="flex items-center mb-4">
                <div class="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-xl">
                  {{ testimonial.author.charAt(0) }}
                </div>
                <div class="ml-4">
                  <div class="text-lg font-medium text-gray-900 dark:text-white">
                    {{ testimonial.author.split(',')[0] }}
                  </div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">
                    {{ testimonial.author.split(',')[1] }}
                  </div>
                </div>
              </div>
              <div class="text-gray-600 dark:text-gray-300 italic">
                "{{ testimonial.text }}"
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- CTA Section with animation -->
    <!-- Pricing Plans Section -->
    <div class="py-16 bg-white dark:bg-gray-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="lg:text-center mb-12">
          <h2 class="text-base text-2xl text-indigo-600 dark:text-indigo-400 font-semibold tracking-wide uppercase">
            Pricing Plans
          </h2>
          <p class="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Choose the Right Plan for You
          </p>
          <p class="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-300 lg:mx-auto">
            Select a plan that best fits your needs, from individual use to family coverage.
          </p>
        </div>

        <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <!-- Standard Plan -->
          <div class="bg-gray-50 dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105">
            <div class="px-6 py-8">
              <h3 class="text-2xl font-bold text-gray-900 dark:text-white text-center">Standard</h3>
              <p class="mt-4 text-gray-500 dark:text-gray-400 text-center">Free</p>
              <p class="mt-2 text-5xl font-extrabold text-gray-900 dark:text-white text-center">$0</p>
              <ul class="mt-8 space-y-4">
                <li class="flex items-center">
                  <svg class="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span class="ml-3 text-gray-700 dark:text-gray-300">2 Scans per day</span>
                </li>
                <li class="flex items-center">
                  <svg class="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span class="ml-3 text-gray-700 dark:text-gray-300">Basic AI Analysis</span>
                </li>
                <li class="flex items-center">
                  <svg class="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span class="ml-3 text-gray-700 dark:text-gray-300">Email Support</span>
                </li>
              </ul>
              <div class="mt-8">
                <RouterLink to="/register" class="block w-full bg-indigo-600 text-white text-center px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                  Get Started
                </RouterLink>
              </div>
            </div>
          </div>

          <!-- Premium Individual Plan -->
          <div class="bg-gradient-to-b from-indigo-500 to-purple-600 rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 relative">
            <div class="absolute top-0 right-0 bg-yellow-400 text-gray-900 px-3 py-1 rounded-bl-lg font-medium text-sm">
              Popular
            </div>
            <div class="px-6 py-8">
              <h3 class="text-2xl font-bold text-white text-center">Premium Individual</h3>
              <p class="mt-4 text-indigo-100 text-center">Monthly</p>
              <p class="mt-2 text-5xl font-extrabold text-white text-center">$29</p>
              <ul class="mt-8 space-y-4">
                <li class="flex items-center">
                  <svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span class="ml-3 text-white">Unlimited Scans</span>
                </li>
                <li class="flex items-center">
                  <svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span class="ml-3 text-white">Advanced AI Analysis</span>
                </li>
                <li class="flex items-center">
                  <svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span class="ml-3 text-white">Priority Support</span>
                </li>
                <li class="flex items-center">
                  <svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span class="ml-3 text-white">Detailed Reports</span>
                </li>
              </ul>
              <div class="mt-8">
                <RouterLink to="/upgrade-account" class="block w-full bg-white text-indigo-600 text-center px-4 py-2 rounded-lg hover:bg-indigo-50 transition-colors">
                  Upgrade Now
                </RouterLink>
              </div>
            </div>
          </div>

          <!-- Family Premium Plan -->
          <div class="bg-gray-50 dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105">
            <div class="px-6 py-8">
              <h3 class="text-2xl font-bold text-gray-900 dark:text-white text-center">Family Premium</h3>
              <p class="mt-4 text-gray-500 dark:text-gray-400 text-center">Monthly</p>
              <p class="mt-2 text-5xl font-extrabold text-gray-900 dark:text-white text-center">$49</p>
              <ul class="mt-8 space-y-4">
                <li class="flex items-center">
                  <svg class="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span class="ml-3 text-gray-700 dark:text-gray-300">Up to 5 Family Members</span>
                </li>
                <li class="flex items-center">
                  <svg class="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span class="ml-3 text-gray-700 dark:text-gray-300">Unlimited Scans</span>
                </li>
                <li class="flex items-center">
                  <svg class="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span class="ml-3 text-gray-700 dark:text-gray-300">Advanced AI Analysis</span>
                </li>
                <li class="flex items-center">
                  <svg class="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span class="ml-3 text-gray-700 dark:text-gray-300">24/7 Priority Support</span>
                </li>
                <li class="flex items-center">
                  <svg class="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span class="ml-3 text-gray-700 dark:text-gray-300">Family Dashboard</span>
                </li>
              </ul>
              <div class="mt-8">
                <RouterLink to="/upgrade-account" class="block w-full bg-indigo-600 text-white text-center px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                  Upgrade Now
                </RouterLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-gradient-to-r from-indigo-600 to-blue-600 dark:from-indigo-700 dark:to-blue-700">
      <div class="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-extrabold text-white sm:text-4xl">
          <span class="block">Experience the Future of Medical Diagnostics</span>
          <span class="block">Start Your AI-Powered Scan Analysis Today</span>
        </h2>
        <p class="mt-4 text-lg leading-6 text-indigo-100">
          Join leading healthcare institutions that trust our laboratory's advanced AI technology for faster, more accurate diagnoses.
        </p>
        <div class="mt-8 flex justify-center">
          <div class="inline-flex rounded-md shadow">
            <RouterLink to="/register" class="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 sm:w-auto transform transition hover:scale-105 duration-300">
              Create account
            </RouterLink>
          </div>
          <div class="ml-3 inline-flex">
            <button @click="openLoginModal" class="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-700 hover:bg-indigo-800 sm:w-auto transform transition hover:scale-105 duration-300">
              Sign in
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Login Modal -->
    <LoginModal v-if="showLoginModal" @close="closeLoginModal" />
  </main>
</template>

<style>
@keyframes scan {
  0% { transform: translateY(0%); opacity: 0.7; }
  100% { transform: translateY(2500%); opacity: 0.3; }
}

.animate-scan {
  animation: scan 2s linear infinite;
}

.bg-scan-lines {
  background: repeating-linear-gradient(
    to bottom,
    transparent,
    transparent 4px,
    rgba(0, 120, 255, 0.05) 4px,
    rgba(0, 120, 255, 0.05) 8px
  );
 
}

.delay-75 {
  animation-delay: 0.75s;
}

.delay-150 {
  animation-delay: 1.5s;
}

.delay-225 {
  animation-delay: 2.25s;
}

.delay-300 {
  animation-delay: 3s;
}
</style>
