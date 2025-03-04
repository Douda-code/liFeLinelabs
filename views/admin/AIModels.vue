<script setup>
import { ref } from 'vue';
import AdminLayout from '../../components/AdminLayout.vue';
import { useDarkModeStore } from '../../stores/darkMode';

const darkModeStore = useDarkModeStore();

const aiModels = ref([
  { 
    id: 1, 
    name: 'Pneumonia Detection Model', 
    version: '1.2.3', 
    accuracy: '92.5%', 
    lastUpdated: '2024-03-15',
    status: 'Active',
    trainingDataset: 'ChestX-ray14',
    description: 'Detects pneumonia in chest X-rays using a convolutional neural network architecture.'
  },
  { 
    id: 2, 
    name: 'Tuberculosis Classifier', 
    version: '2.0.1', 
    accuracy: '89.7%', 
    lastUpdated: '2024-03-10',
    status: 'Active',
    trainingDataset: 'TB-Net Dataset',
    description: 'Identifies tuberculosis patterns in chest X-rays using a ResNet50 architecture with transfer learning.'
  },
  { 
    id: 3, 
    name: 'Multi-disease Classifier', 
    version: '0.9.5', 
    accuracy: '85.3%', 
    lastUpdated: '2024-03-20',
    status: 'Testing',
    trainingDataset: 'Combined Medical Imaging Dataset',
    description: 'Experimental model that can detect multiple conditions from various scan types.'
  }
]);

const modelPerformance = ref({
  pneumonia: {
    accuracy: 92.5,
    precision: 91.2,
    recall: 93.8,
    f1Score: 92.5,
    falsePositives: 6.2,
    falseNegatives: 8.8
  },
  tuberculosis: {
    accuracy: 89.7,
    precision: 88.3,
    recall: 90.1,
    f1Score: 89.2,
    falsePositives: 9.9,
    falseNegatives: 11.7
  }
});

const selectedModel = ref(null);
const showModelDetails = ref(false);

const viewModelDetails = (model) => {
  selectedModel.value = model;
  showModelDetails.value = true;
};

const closeModelDetails = () => {
  showModelDetails.value = false;
};
</script>

<template>
  <AdminLayout activeSection="ai-models">
    <div class="container mx-auto p-4">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">AI Models Management</h1>

      <!-- AI Models List -->
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">AI Models</h2>
      <div class="shadow overflow-hidden border border-gray-200 dark:border-gray-700 sm:rounded-lg mb-6">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">Model Name</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">Version</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">Accuracy</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">Status</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">Last Updated</th>
              <th scope="col" class="relative px-6 py-3 border-b border-gray-200 dark:border-gray-700">
                <span class="sr-only">View</span>
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="model in aiModels" :key="model.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700">{{ model.name }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">{{ model.version }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">{{ model.accuracy }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm border-b border-gray-200 dark:border-gray-700">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" :class="{
                  'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200': model.status === 'Active',
                  'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200': model.status === 'Testing'
                }">
                  {{ model.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">{{ model.lastUpdated }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium border-b border-gray-200 dark:border-gray-700">
                <button @click="viewModelDetails(model)" class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300">View Details</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Performance Metrics -->
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Performance Metrics</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <!-- Pneumonia Model Metrics -->
        <div class="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Pneumonia Detection Model</h3>
          <div class="space-y-2">
            <div>
              <div class="flex justify-between mb-1">
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Accuracy</span>
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ modelPerformance.pneumonia.accuracy }}%</span>
              </div>
              <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div class="bg-green-600 h-2.5 rounded-full" :style="`width: ${modelPerformance.pneumonia.accuracy}%`"></div>
              </div>
            </div>
            <div>
              <div class="flex justify-between mb-1">
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Precision</span>
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ modelPerformance.pneumonia.precision }}%</span>
              </div>
              <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div class="bg-blue-600 h-2.5 rounded-full" :style="`width: ${modelPerformance.pneumonia.precision}%`"></div>
              </div>
            </div>
            <div>
              <div class="flex justify-between mb-1">
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Recall</span>
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ modelPerformance.pneumonia.recall }}%</span>
              </div>
              <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div class="bg-indigo-600 h-2.5 rounded-full" :style="`width: ${modelPerformance.pneumonia.recall}%`"></div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Tuberculosis Model Metrics -->
        <div class="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Tuberculosis Classifier</h3>
          <div class="space-y-2">
            <div>
              <div class="flex justify-between mb-1">
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Accuracy</span>
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ modelPerformance.tuberculosis.accuracy }}%</span>
              </div>
              <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div class="bg-green-600 h-2.5 rounded-full" :style="`width: ${modelPerformance.tuberculosis.accuracy}%`"></div>
              </div>
            </div>
            <div>
              <div class="flex justify-between mb-1">
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Precision</span>
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ modelPerformance.tuberculosis.precision }}%</span>
              </div>
              <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div class="bg-blue-600 h-2.5 rounded-full" :style="`width: ${modelPerformance.tuberculosis.precision}%`"></div>
              </div>
            </div>
            <div>
              <div class="flex justify-between mb-1">
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Recall</span>
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ modelPerformance.tuberculosis.recall }}%</span>
              </div>
              <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div class="bg-indigo-600 h-2.5 rounded-full" :style="`width: ${modelPerformance.tuberculosis.recall}%`"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Model Training Controls -->
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Model Training</h2>
      <div class="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 mb-6 border border-gray-200 dark:border-gray-700">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="model-select" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Model to Train</label>
            <select id="model-select" class="mt-1 block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:text-white">
              <option v-for="model in aiModels" :key="model.id" :value="model.id">{{ model.name }}</option>
            </select>
          </div>
          <div>
            <label for="dataset-select" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Training Dataset</label>
            <select id="dataset-select" class="mt-1 block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:text-white">
              <option>ChestX-ray14</option>
              <option>TB-Net Dataset</option>
              <option>Combined Medical Imaging Dataset</option>
              <option>MIMIC-CXR</option>
            </select>
          </div>
        </div>
        <div class="mt-4">
          <button class="bg-indigo-600 dark:bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-700 dark:hover:bg-indigo-600 border border-indigo-700 dark:border-indigo-600">
            Start Training
          </button>
        </div>
      </div>

      <!-- Model Details Modal -->
      <div v-if="showModelDetails && selectedModel" class="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="closeModelDetails"></div>
          <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
          <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border border-gray-200 dark:border-gray-700">
            <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white" id="modal-title">
                {{ selectedModel.name }} Details
              </h3>
              <div class="mt-2">
                <p class="text-gray-700 dark:text-gray-300"><strong>Version:</strong> {{ selectedModel.version }}</p>
                <p class="text-gray-700 dark:text-gray-300"><strong>Accuracy:</strong> {{ selectedModel.accuracy }}</p>
                <p class="text-gray-700 dark:text-gray-300"><strong>Status:</strong> {{ selectedModel.status }}</p>
                <p class="text-gray-700 dark:text-gray-300"><strong>Last Updated:</strong> {{ selectedModel.lastUpdated }}</p>
                <p class="text-gray-700 dark:text-gray-300"><strong>Training Dataset:</strong> {{ selectedModel.trainingDataset }}</p>
                <p class="text-gray-700 dark:text-gray-300"><strong>Description:</strong> {{ selectedModel.description }}</p>
              </div>
            </div>
            <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-200 dark:border-gray-700">
              <button type="button" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 dark:bg-blue-500 text-base font-medium text-white hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm" @click="closeModelDetails">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>