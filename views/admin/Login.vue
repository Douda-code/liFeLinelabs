<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">Admin Login</h2>
        <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Sign in to access the admin dashboard
        </p>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div v-if="error" class="rounded-md bg-red-50 dark:bg-red-900 p-4">
          <div class="flex">
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800 dark:text-red-300">{{ error }}</h3>
            </div>
          </div>
        </div>
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="email-address" class="sr-only">Email address</label>
            <input id="email-address" name="email" type="email" autocomplete="email" required v-model="email" class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white dark:bg-gray-700 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Email address">
          </div>
          <div>
            <label for="password" class="sr-only">Password</label>
            <input id="password" name="password" type="password" autocomplete="current-password" required v-model="password" class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white dark:bg-gray-700 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Password">
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input id="remember-me" name="remember-me" type="checkbox" v-model="rememberMe" class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded">
            <label for="remember-me" class="ml-2 block text-sm text-gray-900 dark:text-gray-300">
              Remember me
            </label>
          </div>

          <div class="text-sm">
            <a href="#" class="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300">
              Forgot your password?
            </a>
          </div>
        </div>

        <div>
          <button type="submit" :disabled="loading" class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <span v-if="loading" class="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
            Sign in
          </button>
        </div>
      </form>
      
      <!-- Demo credentials -->
      <div class="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
        <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Demo Credentials:</h3>
        <p class="text-sm text-gray-600 dark:text-gray-400">admin@example.com / admin123</p>
      </div>
      
      <!-- Back to client link -->
      <div class="mt-4 text-center">
        <a href="/" class="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300">
          ← Back to main site
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth';
import { useDarkModeStore } from '../../stores/darkMode';

const router = useRouter();
const authStore = useAuthStore();
const darkModeStore = useDarkModeStore();

const email = ref('admin@example.com');
const password = ref('admin123');
const rememberMe = ref(false);
const loading = ref(false);
const error = ref('');

const handleLogin = async () => {
  try {
    loading.value = true;
    error.value = '';
    
    // Use real authentication
    const result = await authStore.signIn(email.value, password.value);
    
    if (result.error) {
      error.value = result.error.message || 'Failed to sign in';
      return;
    }
    
    // Check if user has admin role
    if (authStore.user && authStore.user.role === 'admin') {
      router.push('/admin/dashboard');
    } else {
      error.value = 'You do not have permission to access the admin panel';
      await authStore.signOut();
    }
  } catch (err) {
    console.error('Login error:', err);
    error.value = 'An unexpected error occurred';
  } finally {
    loading.value = false;
  }
};
</script>
