<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
    <div class="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
      <div class="uppercase tracking-wide text-sm text-indigo-500 dark:text-indigo-400 font-semibold text-center mb-4">Create Account</div>
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white text-center mb-6">Join Our Community</h2>
      <p class="text-gray-600 dark:text-gray-400 text-center mb-8">Fill out the form below to create your account.</p>
      <form class="mt-4 space-y-4" @submit.prevent="handleRegister">
        <div v-if="error" class="p-2 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded mb-4">
          {{ error }}
        </div>
        <div v-if="success" class="p-2 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded mb-4">
          {{ success }}
        </div>
        <div>
          <label for="first-name" class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">First Name</label>
          <input 
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 dark:border-gray-600 leading-tight focus:outline-none focus:shadow-outline" 
            id="first-name" 
            type="text" 
            placeholder="First Name"
            v-model="firstName"
            required
          >
        </div>
        <div>
          <label for="last-name" class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Last Name</label>
          <input 
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 dark:border-gray-600 leading-tight focus:outline-none focus:shadow-outline" 
            id="last-name" 
            type="text" 
            placeholder="Last Name"
            v-model="lastName"
            required
          >
        </div>
        <div>
          <label for="email" class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Email</label>
          <input 
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 dark:border-gray-600 leading-tight focus:outline-none focus:shadow-outline" 
            id="email" 
            type="email" 
            placeholder="Email"
            v-model="email"
            required
          >
        </div>
        <div>
          <label for="phone" class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Phone Number</label>
          <input 
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 dark:border-gray-600 leading-tight focus:outline-none focus:shadow-outline" 
            id="phone" 
            type="tel" 
            placeholder="Phone Number"
            v-model="phone"
          >
        </div>
        <div>
          <label for="password" class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Password</label>
          <input 
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 dark:border-gray-600 mb-3 leading-tight focus:outline-none focus:shadow-outline" 
            id="password" 
            type="password" 
            placeholder="Password"
            v-model="password"
            required
          >
        </div>
        <div>
          <label for="confirm-password" class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Confirm Password</label>
          <input 
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 dark:border-gray-600 mb-3 leading-tight focus:outline-none focus:shadow-outline" 
            id="confirm-password" 
            type="password" 
            placeholder="Confirm Password"
            v-model="confirmPassword"
            required
          >
        </div>
        <div class="flex items-center">
          <input type="checkbox" id="terms" v-model="agreeToTerms" class="mr-2 dark:bg-gray-700 dark:border-gray-600" required>
          <label for="terms" class="text-sm text-gray-700 dark:text-gray-300">I agree to the <a href="#" class="text-indigo-500 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300">Terms and Conditions</a></label>
        </div>
        <div class="flex items-center justify-between mt-4">
          <button 
            class="bg-indigo-500 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            type="submit"
            :disabled="loading"
          >
            <span v-if="loading">Processing...</span>
            <span v-else>Register</span>
          </button>
        </div>
        <div class="mt-4 text-center">
          <p class="text-gray-600 dark:text-gray-400">
            Already have an account?
            <RouterLink to="/login" class="text-indigo-500 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300">
              Sign In
            </RouterLink>
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth';
import { useDarkModeStore } from '../../stores/darkMode';
import { supabase } from '../../lib/supabase';

const router = useRouter();
const authStore = useAuthStore();
const darkModeStore = useDarkModeStore();

const firstName = ref('');
const lastName = ref('');
const email = ref('');
const phone = ref('');
const password = ref('');
const confirmPassword = ref('');
const agreeToTerms = ref(false);
const loading = ref(false);
const error = ref('');
const success = ref('');

const handleRegister = async () => {
  try {
    // Validate form
    if (password.value !== confirmPassword.value) {
      error.value = 'Passwords do not match';
      return;
    }
    
    loading.value = true;
    error.value = '';
    success.value = '';
    
    // First, create the auth user
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email.value,
      password: password.value,
      options: {
        data: {
          first_name: firstName.value,
          last_name: lastName.value
        }
      }
    });

    if (signUpError) {
      if (signUpError.message.includes('already registered')) {
        success.value = 'Account already exists. You can sign in with your credentials.';
        setTimeout(() => {
          router.push('/login');
        }, 2000);
        return;
      }
      
      error.value = signUpError.message || 'Failed to register';
      return;
    }
    
    // If signup is successful, insert user data into users table
    if (data?.user) {
      try {
        const { error: insertError } = await supabase
          .from('users')
          .insert([
            {
              id: data.user.id,
              email: email.value,
              first_name: firstName.value,
              last_name: lastName.value,
              phone: phone.value || null,
              role: 'patient',
              status: 'Active'
            }
          ]);
        
        if (insertError) {
          console.error('Error creating user record:', insertError);
          error.value = 'Account created but profile setup failed. Please contact support.';
          return;
        }
        
        // If successful, redirect to dashboard
        success.value = 'Registration successful! Redirecting to dashboard...';
        
        // Set user in auth store
        await authStore.loadUser();
        
        setTimeout(() => {
          router.push('/dashboard');
        }, 1000);
      } catch (insertErr) {
        console.error('Failed to create user record:', insertErr);
        error.value = 'Account created but profile setup failed. Please contact support.';
      }
    }
  } catch (err) {
    console.error('Registration error:', err);
    error.value = 'An unexpected error occurred';
  } finally {
    loading.value = false;
  }
};
</script>
