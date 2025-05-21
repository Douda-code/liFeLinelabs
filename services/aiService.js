import { supabase } from '../lib/supabase'
import { createScanAnalysis } from './scanService'
import axios from 'axios'
import { hasPremiumAccess } from './subscriptionService'
import { useAuthStore } from '../stores/auth'

// API endpoints for different AI models
const PREMIUM_API_URL = 'https://derradjadel-lifeline-labs-ai.hf.space/predict'
const STANDARD_API_URL = 'https://derradjadel-lifeline-labs-ai-standard.hf.space/predict'

// Debug flag to show which model is being used
const DEBUG_MODEL_USAGE = true

/**
 * Validates if a file is a valid scan file
 * @param {File} file - The file to validate
 * @returns {boolean} - Whether the file is valid
 */
export const isValidScanFile = (file) => {
  // Check if file exists
  if (!file) return false;

  // Check file size (max 10MB)
  const maxSize = 10 * 1024 * 1024; // 10MB in bytes
  if (file.size > maxSize) return false;

  // Check file type
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  return validTypes.includes(file.type);
};

/**
 * Analyze a scan using AI models
 * For premium users: Uses multiclass pneumonia detection model
 * For standard users: Uses binary classification model
 * @param {File} scanFile - The scan file to analyze
 * @param {string|null} scanId - Optional scan ID for database updates
 * @returns {Promise} - Promise that resolves with the analysis results
 */
export const analyzeScan = async (scanFile, scanId = null) => {
  try {
    // Check if user has premium access
    let isPremium = false;
    if (scanId) {
      console.log('Checking premium access for scan ID:', scanId);
      // Get the patient ID from the scan
      const { data: scanData, error: scanError } = await supabase
        .from('scans')
        .select('patient_id')
        .eq('id', scanId)
        .single();
      
      if (scanError) {
        console.error('Error fetching scan data:', scanError);
      }
      
      if (scanData) {
        console.log('Found scan data, patient ID:', scanData.patient_id);
        isPremium = await hasPremiumAccess(scanData.patient_id);
      }
    }
    
    // Select the appropriate API URL based on user's subscription
    const apiUrl = isPremium ? PREMIUM_API_URL : STANDARD_API_URL;
    
    if (DEBUG_MODEL_USAGE) {
      console.log('=== AI MODEL SELECTION ===');
      console.log(`User has premium access: ${isPremium ? 'YES' : 'NO'}`);
      console.log(`Using ${isPremium ? 'PREMIUM MULTICLASS' : 'STANDARD BINARY'} AI model for analysis`);
      console.log(`API endpoint: ${apiUrl}`);
      console.log('========================');
    }
    
    // Prepare form data for the API
    const formData = new FormData();
    formData.append('file', scanFile);

    let result;
    
    if (isPremium) {
      // PREMIUM MODEL: Multiclass classification (Normal, Pneumonia, Tuberculosis)
      console.log('Calling premium multiclass model API...');
      
      // Call the premium multiclass model API
      const response = await axios.post(PREMIUM_API_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Process the premium model response
      result = {
        scanName: scanFile.name,
        scanType: determineScanType(scanFile.name),
        classification: response.data.predicted_class,
        confidenceScore: response.data.confidence ? (parseFloat(response.data.confidence) * 100).toFixed(2) : '0.00',
        confidenceLevel: response.data.confidence >= 0.85 ? 'High' : 
                        response.data.confidence >= 0.70 ? 'Medium' : 'Low',
        analysisReport: generateReport(response.data.predicted_class),
        timestamp: new Date().toISOString(),
        processingTime: `${response.data.processing_time || '—'}ms`,
        aiModelId: await fetchModelId(response.data.predicted_class),
        isPremiumAnalysis: true
      };
    } else {
      // STANDARD MODEL: Binary classification (Normal/Abnormal)
      console.log('Using standard binary classification model...');
      
        // Call the standrad binary model API
        const response = await axios.post(STANDARD_API_URL, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      
        result = {
          scanName: scanFile.name,
          scanType: determineScanType(scanFile.name),
          classification: response.data.predicted_class,
          confidenceScore: response.data.confidence ? (parseFloat(response.data.confidence) * 100).toFixed(2) : '0.00',
          confidenceLevel: response.data.confidence >= 0.85 ? 'High' : 
                          response.data.confidence >= 0.70 ? 'Medium' : 'Low',
          analysisReport: generateReport(response.data.predicted_class),
          timestamp: new Date().toISOString(),
          processingTime: `${response.data.processing_time || '—'}ms`,
          aiModelId: await fetchModelId(response.data.predicted_class),
          isPremiumAnalysis: false
        };
    }

    // If scanId is provided, save analysis to database
    if (scanId) {
      await createScanAnalysis(scanId, {
        classification: result.classification, 
        confidenceScore: parseFloat(result.confidenceScore) || 0,
        analysisReport: result.analysisReport,
        aiModelId: result.aiModelId,
        processingTime: result.processingTime,
        isPremiumAnalysis: result.isPremiumAnalysis || false
      });

      // Update scan status
      await supabase
        .from('scans')
        .update({ status: 'Completed' })
        .eq('id', scanId);
    }

    return result;
  } catch (err) {
    console.error('Error analyzing scan:', err);
    throw new Error('Failed to analyze scan. Please try again.');
  }
};

/**
 * Simulate a response from the standard binary classification model
 * This is used for non-premium users until the actual standard API is implemented
 * @param {File} scanFile - The scan file to analyze
 * @returns {Object} - Simulated API response
 */
function simulateStandardModelResponse(scanFile) {
  // In a real implementation, this would be replaced with an actual API call
  
  console.log('Simulating standard binary classification model response');
  
  // Generate a random classification (70% normal, 30% abnormal)
  const isNormal = Math.random() > 0.3;
  
  // Generate a random confidence score appropriate for the classification
  let confidence;
  if (isNormal) {
    // Normal classifications tend to have higher confidence
    confidence = (Math.random() * 0.15 + 0.75).toFixed(2); // 0.75-0.90
  } else {
    // Abnormal classifications might have more varied confidence
    confidence = (Math.random() * 0.3 + 0.65).toFixed(2); // 0.65-0.95
  }
  
  return {
    predicted_class: isNormal ? 'Normal' : 'Abnormal',
    confidence: parseFloat(confidence),
    processing_time: Math.floor(Math.random() * 500 + 300) // 300-800ms
  };
}

/**
 * Generate a report for standard (binary) classification
 * @param {string} classification - The predicted classification (Normal or Abnormal)
 * @returns {string} - The generated report
 */
function generateStandardReport(classification) {
  if (classification === 'Normal') {
    return 'No abnormalities detected. The scan appears to be normal.';
  } else { // Abnormal
    return 'Potential abnormalities detected. Further examination by a specialist is recommended.';
  }
}

/**
 * Helper function to fetch the AI model ID from the database
 * @param {string} classification - The predicted classification
 * @returns {Promise<string|null>} - Promise that resolves with the model ID
 */
async function fetchModelId(classification) {
  let modelName;
  switch (classification) {
    case 'Standard':
      modelName = 'Binary Classifier';
      break;
    case 'Pneumonia':
      modelName = 'Pneumonia Detection Model';
      break;
    case 'Tuberculosis':
      modelName = 'Tuberculosis Classifier';
      break;
    case 'Abnormal':
      modelName = 'Binary Classifier';
      break;
    default:
      modelName = 'Multi-disease Classifier';
  }

  try {
    const { data, error } = await supabase
      .from('ai_models')
      .select('id')
      .eq('name', modelName)
      .maybeSingle();

    if (error) throw error;
    return data?.id || null;
  } catch (err) {
    console.error('Error fetching model ID:', err);
    return null;
  }
}

/**
 * Generate a human-readable report based on the classification
 * @param {string} classification - The predicted classification
 * @returns {string} - The generated report
 */
function generateReport(classification) {
  switch (classification) {
    case 'Normal':
      return 'No abnormalities detected. The scan appears to be normal. (Premium Analysis)';
    case 'Pneumonia':
      return 'Potential indicators of pneumonia detected. Consultation with a physician is recommended. (Premium Analysis)';
    case 'Tuberculosis':
      return 'Patterns consistent with tuberculosis identified. Immediate medical consultation is advised. (Premium Analysis)';
    default:
      return 'Analysis inconclusive. Please consult with a healthcare professional. (Premium Analysis)';
  }
}

/**
 * Determine the scan type based on the filename
 * @param {string} fileName - The name of the scan file
 * @returns {string} - The determined scan type
 */
function determineScanType(fileName) {
  const lower = fileName.toLowerCase();
  if (lower.includes('mri')) return 'MRI';
  if (lower.includes('ct')) return 'CT Scan';
  if (lower.includes('xray') || lower.includes('x-ray')) return 'X-Ray';
  if (lower.includes('ultrasound')) return 'Ultrasound';
  return 'X-Ray';
}
