<script setup>
import { ref, defineProps, defineEmits, watch } from 'vue';
import { useDarkModeStore } from '../stores/darkMode';

const props = defineProps({
  user: {
    type: Object,
    required: true
  },
  showModal: {
    type: Boolean,
    required: true
  }
});

const emit = defineEmits(['close', 'save']);
const darkModeStore = useDarkModeStore();

const editedUser = ref({ ...props.user });

watch(() => props.user, (newUser) => {
  if (newUser) {
    editedUser.value = { ...newUser };
  }
}, { deep: true });

const closeModal = () => {
  emit('close');
};

const saveUser = () => {
  emit('save', editedUser.value);
};
</script>

<template>
  <div v-if="showModal" class="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay -->
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="closeModal"></div>

      <!-- Modal panel -->
      <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white" id="modal-title">
            Edit User
          </h3>
          <div class="mt-2">
            <div class="mb-4">
              <label for="first-name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">First Name</label>
              <input type="text" id="first-name" v-model="editedUser.first_name" class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white">
            </div>
            <div class="mb-4">
              <label for="last-name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Last Name</label>
              <input type="text" id="last-name" v-model="editedUser.last_name" class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white">
            </div>
            <div class="mb-4">
              <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
              <input type="email" id="email" v-model="editedUser.email" class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white">
            </div>
            <div class="mb-4">
              <label for="role" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Role</label>
              <select id="role" v-model="editedUser.role" class="mt-1 block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:text-white">
                <option>patient</option>
                <option>physician</option>
                <option>admin</option>
              </select>
            </div>
            <div class="mb-4">
              <label for="status" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
              <select id="status" v-model="editedUser.status" class="mt-1 block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:text-white">
                <option>Active</option>
                <option>Suspended</option>
              </select>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button type="button" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 dark:bg-blue-500 text-base font-medium text-white hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm" @click="saveUser">
            Save
          </button>
          <button type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm" @click="closeModal">
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
