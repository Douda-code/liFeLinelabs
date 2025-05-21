<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { addPaymentMethod, updateSubscription, getSubscriptionStatus, hasPremiumAccess } from '../../services/subscriptionService'

const router = useRouter()
const authStore = useAuthStore()

const loading = ref(false)
const error = ref('')
const success = ref('')
const cardNumber = ref('')
const expiryDate = ref('')
const cvv = ref('')
const selectedPlan = ref('premium')
const currentSubscription = ref(null)
const loadingSubscription = ref(true)

onMounted(async () => {
  if (authStore.isAuthenticated) {
    try {
      loadingSubscription.value = true
      
      // Get subscription status
      try {
        const status = await getSubscriptionStatus(authStore.user.id)
        currentSubscription.value = status
        console.log('Current subscription status:', status)
      } catch (statusError) {
        console.error('Error getting subscription details:', statusError)
        // Continue even if we can't get detailed subscription info
      }
      
      // Check premium access separately (more reliable)
      const isPremium = await hasPremiumAccess(authStore.user.id)
      console.log('User has premium access:', isPremium)
      
      // If user already has premium, show appropriate message
      if (isPremium && !currentSubscription.value) {
        currentSubscription.value = { type: 'premium' }
      }
    } catch (err) {
      console.error('Error loading subscription status:', err)
      error.value = 'Failed to load subscription status'
    } finally {
      loadingSubscription.value = false
    }
  }
})

const validateExpiryDate = (expiry) => {
  // Check format MM/YY or MM/YYYY
  const regex = /^(0[1-9]|1[0-2])\/(\d{2}|\d{4})$/
  if (!regex.test(expiry)) {
    return { valid: false, error: 'Expiry date must be in MM/YY or MM/YYYY format' }
  }

  const [month, year] = expiry.split('/')
  const expMonth = parseInt(month)
  let expYear = parseInt(year)

  // Convert 2-digit year to 4-digit year
  if (year.length === 2) {
    expYear = 2000 + expYear
  }

  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth() + 1

  // Check if card is expired
  if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
    return { valid: false, error: 'Card has expired' }
  }

  return { valid: true, expMonth, expYear }
}

const handleSubmit = async () => {
  try {
    loading.value = true
    error.value = ''
    success.value = ''

    // Validate card details
    if (!cardNumber.value || !expiryDate.value || !cvv.value) {
      error.value = 'Please fill in all card details'
      loading.value = false
      return
    }

    // Validate expiry date
    const expiryValidation = validateExpiryDate(expiryDate.value)
    if (!expiryValidation.valid) {
      error.value = expiryValidation.error
      loading.value = false
      return
    }
    
    // Add payment method
    await addPaymentMethod(authStore.user.id, {
      last4: cardNumber.value.slice(-4),
      brand: 'visa', // In a real app, this would be determined by the payment processor
      exp_month: expiryValidation.expMonth,
      exp_year: expiryValidation.expYear
    })

    // Update subscription
    await updateSubscription(authStore.user.id, selectedPlan.value)

    success.value = 'Subscription updated successfully!'
    setTimeout(() => {
      router.push('/dashboard')
    }, 2000)
  } catch (err) {
    console.error('Error upgrading account:', err)
    error.value = 'Failed to process payment. Please try again.'
  } finally {
    loading.value = false
  }
}

</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
    <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">Upgrade to Premium</h2>
    
    <!-- Current Subscription Status -->
    <div v-if="loadingSubscription" class="mb-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-center">
      <svg class="animate-spin h-5 w-5 text-indigo-500 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <span class="text-gray-700 dark:text-gray-300">Loading subscription status...</span>
    </div>
    <div v-else-if="currentSubscription" class="mb-8 p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
      <p class="text-indigo-700 dark:text-indigo-300">
        Current Plan: <span class="font-semibold">{{ currentSubscription.type.charAt(0).toUpperCase() + currentSubscription.type.slice(1) }}</span>
        <span v-if="currentSubscription.subscription" class="ml-2 text-sm">
          (Renews: {{ new Date(currentSubscription.subscription.current_period_end).toLocaleDateString() }})
        </span>
      </p>
    </div>

    <!-- Error/Success Messages -->
    <div v-if="error" class="mb-6 p-4 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg">
      {{ error }}
    </div>
    <div v-if="success" class="mb-6 p-4 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg">
      {{ success }}
    </div>

    <p class="text-gray-600 dark:text-gray-400 mb-8">
      Upgrade your account to enjoy exclusive features and enhanced performance.
    </p>
    <form @submit.prevent="handleSubmit" class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8">
      <div class="space-y-6">
        <!-- Plan Selection -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Select Plan</label>
          <div class="mt-2 space-y-4">
            <div class="flex items-center">
              <input
                type="radio"
                id="premium"
                value="premium"
                v-model="selectedPlan"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
              />
              <label for="premium" class="ml-3">
                <span class="block text-sm font-medium text-gray-700 dark:text-gray-300">Premium Individual ($29/month)</span>
              </label>
            </div>
            <div class="flex items-center">
              <input
                type="radio"
                id="family"
                value="family"
                v-model="selectedPlan"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
              />
              <label for="family" class="ml-3">
                <span class="block text-sm font-medium text-gray-700 dark:text-gray-300">Family Premium ($49/month)</span>
              </label>
            </div>
          </div>
        </div>

        <div>
          <label for="card-number" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Card Number</label>
          <input type="text" id="card-number" v-model="cardNumber" class="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-gray-900 dark:text-white" required>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label for="expiry-date" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Expiry Date (MM/YY or MM/YYYY)</label>
            <input type="text" id="expiry-date" v-model="expiryDate" placeholder="MM/YY" class="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-gray-900 dark:text-white" required>
          </div>
          <div>
            <label for="cvv" class="block text-sm font-medium text-gray-700 dark:text-gray-300">CVV</label>
            <input type="text" id="cvv" v-model="cvv" class="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-gray-900 dark:text-white" required>
          </div>
        </div>
        <div>
          <button type="submit" class="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-all duration-150 shadow-md hover:shadow-lg">
            <span v-if="loading">Processing...</span>
            <span v-else>Upgrade Account</span>
          </button>
        </div>
      </div>
    </form>
  </div>
</template>
