<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
    <div class="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
      <div class="uppercase tracking-wide text-sm text-indigo-500 dark:text-indigo-400 font-semibold text-center mb-4">Member Login</div>
      <h2 class="text-2xl font-extrabold text-gray-900 dark:text-white text-center mb-6">Access Your Account</h2>
      <form class="mt-4 space-y-4" @submit.prevent="handleLogin">
        <div v-if="error" class="p-2 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded mb-4">
          {{ error }}
        </div>
        <div>
          <label class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" for="email">
            Email
          </label>
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
          <label class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" for="password">
            Password
          </label>
          <input 
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 dark:border-gray-600 mb-3 leading-tight focus:outline-none focus:shadow-outline" 
            id="password" 
            type="password" 
            placeholder="Password"
            v-model="password"
            required
          >
        </div>
        <div class="flex items-center justify-between">
          <button 
            class="bg-indigo-500 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full" 
            type="submit"
            :disabled="loading"
          >
            <span v-if="loading">Loading...</span>
            <span v-else>Sign In</span>
          </button>
        </div>
        <div class="flex items-center justify-between mt-4">
          <div class="text-sm">
            <a class="text-indigo-500 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300" href="#">
              Forgot Password?
            </a>
          </div>
        </div>
        <div class="mt-4 text-center">
          <p class="text-gray-600 dark:text-gray-400">
            Don't have an account?
            <RouterLink to="/register" class="text-indigo-500 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300">
              Sign Up
            </RouterLink>
          </p>
        </div>
        
        <!-- Demo credentials -->
        <div class="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
          <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Demo Credentials:</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-1"><strong>Regular User:</strong> user@example.com / password123</p>
          <p class="text-sm text-gray-600 dark:text-gray-400"><strong>Admin:</strong> admin@example.com / admin123</p>
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

const router = useRouter();
const authStore = useAuthStore();
const darkModeStore = useDarkModeStore();

const email = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');

const handleLogin = async () => {
  try {
    loading.value = true;
    error.value = '';
    
    // Use the real Supabase authentication
    const result = await authStore.signIn(email.value, password.value);
    
    if (result.error) {
      error.value = result.error.message || 'Failed to sign in';
      return;
    }
    
    // If successful, redirect to dashboard
    router.push('/dashboard');
  } catch (err) {
    console.error('Login error:', err);
    error.value = 'An unexpected error occurred';
  } finally {
    loading.value = false;
  }
};
</script>
