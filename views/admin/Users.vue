<script setup>
import { ref, computed } from 'vue';
import AdminLayout from '../../components/AdminLayout.vue';
import EditUserModal from '../../components/EditUserModal.vue';
import { useDarkModeStore } from '../../stores/darkMode';
import { getAllUsers, updateUser } from '../../services/adminService';

const darkModeStore = useDarkModeStore();

const users = ref([
  { id: 1, first_name: 'John', last_name: 'Doe', email: 'john.doe@example.com', role: 'patient', status: 'Active', created_at: '2024-01-15' },
  { id: 2, first_name: 'Jane', last_name: 'Smith', email: 'jane.smith@example.com', role: 'physician', status: 'Active', created_at: '2023-12-01' },
  { id: 3, first_name: 'Alice', last_name: 'Johnson', email: 'alice.johnson@example.com', role: 'admin', status: 'Active', created_at: '2024-02-20' },
]);

const userTypeFilter = ref('');
const userStatusFilter = ref('');
const searchTerm = ref('');
const isModalOpen = ref(false);
const selectedUser = ref(null);
const loading = ref(false);

// Load users from database
const loadUsers = async () => {
  try {
    loading.value = true;
    const data = await getAllUsers();
    if (data) {
      users.value = data;
    }
  } catch (error) {
    console.error('Error loading users:', error);
  } finally {
    loading.value = false;
  }
};

// Call loadUsers when component is mounted
loadUsers();

const filteredUsers = computed(() => {
  return users.value.filter(user => {
    const typeMatch = userTypeFilter.value === '' || user.role === userTypeFilter.value;
    const statusMatch = userStatusFilter.value === '' || user.status === userStatusFilter.value;
    const searchMatch = 
      `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm.value.toLowerCase()) || 
      user.email.toLowerCase().includes(searchTerm.value.toLowerCase());
    return typeMatch && statusMatch && searchMatch;
  });
});

const openModal = (user) => {
  selectedUser.value = { ...user };
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  selectedUser.value = null;
};

const saveUser = async (updatedUser) => {
  try {
    loading.value = true;
    
    // In a real app, call the API to update the user
    await updateUser(updatedUser.id, updatedUser);
    
    // Update the local user list
    const index = users.value.findIndex(user => user.id === updatedUser.id);
    if (index !== -1) {
      users.value[index] = updatedUser;
    }
    
    closeModal();
  } catch (error) {
    console.error('Error updating user:', error);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <AdminLayout activeSection="users">
    <div class="container mx-auto p-4">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">User Management</h1>

      <!-- Filters and Search -->
      <div class="flex flex-wrap items-center justify-between mb-4">
        <div class="flex items-center space-x-2">
          <label for="user-type-filter" class="text-sm font-medium text-gray-700 dark:text-gray-300">Filter by Type:</label>
          <select id="user-type-filter" v-model="userTypeFilter" class="mt-1 block rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white">
            <option value="">All</option>
            <option value="patient">Patient</option>
            <option value="physician">Physician</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div class="flex items-center space-x-2">
          <label for="user-status-filter" class="text-sm font-medium text-gray-700 dark:text-gray-300">Filter by Status:</label>
          <select id="user-status-filter" v-model="userStatusFilter" class="mt-1 block rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white">
            <option value="">All</option>
            <option>Active</option>
            <option>Suspended</option>
          </select>
        </div>

        <div class="flex items-center">
          <label for="user-search" class="sr-only">Search users</label>
          <div class="relative">
            <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <svg class="h-5 w-5 text-gray-400 dark:text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
              </svg>
            </div>
            <input type="text" id="user-search" v-model="searchTerm" placeholder="Search users" class="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 shadow-sm placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:text-white">
          </div>
        </div>
      </div>

      <!-- User List/Table -->
      <div class="shadow overflow-hidden border border-gray-200 dark:border-gray-700 sm:rounded-lg">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">Name</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">Email</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">Role</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">Status</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">Registration Date</th>
              <th scope="col" class="relative px-6 py-3 border-b border-gray-200 dark:border-gray-700">
                <span class="sr-only">Edit</span>
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="user in filteredUsers" :key="user.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700">{{ user.first_name }} {{ user.last_name }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">{{ user.email }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">{{ user.role }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">{{ user.status }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">{{ new Date(user.created_at).toLocaleDateString() }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium border-b border-gray-200 dark:border-gray-700">
                <button @click="openModal(user)" class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300">Edit</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <EditUserModal :user="selectedUser" :showModal="isModalOpen" @close="closeModal" @save="saveUser" />
    </div>
  </AdminLayout>
</template>