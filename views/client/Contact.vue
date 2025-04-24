<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <div class="bg-white dark:bg-gray-800 shadow-2xl rounded-xl overflow-hidden transform transition-all duration-300 hover:scale-105">
        <div class="p-8">
          <h1 class="text-4xl font-extrabold text-center text-gray-900 dark:text-white mb-6 tracking-tight">
            Contact Us
          </h1>
          
          <p class="text-gray-600 dark:text-gray-300 text-center mb-8 leading-relaxed">
            Have questions or need assistance? We're here to help. Fill out the form below and we'll get back to you soon.
          </p>
          
          <form 
            @submit.prevent="submitForm" 
            novalidate 
            class="space-y-6"
          >
            <div>
              <label 
                for="name" 
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Full Name
              </label>
              <input 
                type="text" 
                id="name" 
                v-model="name"
                required
                minlength="2"
                maxlength="50"
                aria-describedby="name-error"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white transition-all duration-300"
                :class="{'border-red-500 dark:border-red-400': nameError}"
              >
              <p 
                v-if="nameError" 
                id="name-error" 
                class="mt-2 text-sm text-red-600 dark:text-red-400"
              >
                Please enter a valid name (2-50 characters)
              </p>
            </div>
            
            <div>
              <label 
                for="email" 
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Email Address
              </label>
              <input 
                type="email" 
                id="email" 
                v-model="email"
                required
                pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                aria-describedby="email-error"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white transition-all duration-300"
                :class="{'border-red-500 dark:border-red-400': emailError}"
              >
              <p 
                v-if="emailError" 
                id="email-error" 
                class="mt-2 text-sm text-red-600 dark:text-red-400"
              >
                Please enter a valid email address
              </p>
            </div>
            
            <div>
              <label 
                for="message" 
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Your Message
              </label>
              <textarea 
                id="message" 
                v-model="message"
                required
                minlength="10"
                maxlength="500"
                rows="4"
                aria-describedby="message-error"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white resize-none transition-all duration-300"
                :class="{'border-red-500 dark:border-red-400': messageError}"
              ></textarea>
              <p 
                v-if="messageError" 
                id="message-error" 
                class="mt-2 text-sm text-red-600 dark:text-red-400"
              >
                Please enter a message (10-500 characters)
              </p>
            </div>
            
            <div>
              <button 
                type="submit" 
                :disabled="isSubmitting"
                class="w-full py-3 bg-indigo-600 dark:bg-indigo-500 text-white font-semibold rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-300 ease-in-out transform active:scale-95 disabled:opacity-50"
              >
                <span v-if="!isSubmitting">Send Message</span>
                <span v-else class="flex items-center justify-center">
                  <svg class="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: '',
      email: '',
      message: '',
      isSubmitting: false,
      nameError: false,
      emailError: false,
      messageError: false
    }
  },
  methods: {
    validateForm() {
      // Reset error states
      this.nameError = false;
      this.emailError = false;
      this.messageError = false;

      // Validate name
      if (!this.name || this.name.length < 2 || this.name.length > 50) {
        this.nameError = true;
      }

      // Validate email
      const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
      if (!this.email || !emailRegex.test(this.email)) {
        this.emailError = true;
      }

      // Validate message
      if (!this.message || this.message.length < 10 || this.message.length > 500) {
        this.messageError = true;
      }

      // Return true if no errors
      return !(this.nameError || this.emailError || this.messageError);
    },
    async submitForm() {
      // Validate form
      if (!this.validateForm()) {
        return;
      }

      // Simulate form submission
      this.isSubmitting = true;

      try {
        // Simulated API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Reset form
        this.name = '';
        this.email = '';
        this.message = '';
        
        // Optional: Show success message
        alert('Message sent successfully!');
      } catch (error) {
        // Optional: Handle error
        alert('Failed to send message. Please try again.');
      } finally {
        this.isSubmitting = false;
      }
    }
  }
}
</script>
