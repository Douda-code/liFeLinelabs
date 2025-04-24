import { supabase } from '../lib/supabase'
import { createScanAnalysis } from './scanService'
import axios from 'axios'

const HF_API_URL = 'https://derradjadel-lifeline-labs-ai.hf.space/predict'

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
 * Analyze a scan using the Hugging Face Space API
 * @param {File} scanFile - The scan file to analyze
 * @param {string|null} scanId - Optional scan ID for database updates
 * @returns {Promise} - Promise that resolves with the analysis results
 */
export const analyzeScan = async (scanFile, scanId = null) => {
  try {
    // Prepare form data for the API
    const formData = new FormData();
    formData.append('file', scanFile);

    // Call the Hugging Face Space API
    const response = await axios.post(HF_API_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    // Process the response
    const result = {
      scanName: scanFile.name,
      scanType: determineScanType(scanFile.name),
      classification: response.data.predicted_class,
      confidenceScore: response.data.confidence ? (parseFloat(response.data.confidence) * 100).toFixed(2) : '0.00',
      confidenceLevel: response.data.confidence >= 0.85 ? 'High' : 
                      response.data.confidence >= 0.70 ? 'Medium' : 'Low',
      analysisReport: generateReport(response.data.predicted_class),
      timestamp: new Date().toISOString(),
      processingTime: `${response.data.processing_time || '—'}ms`,
      aiModelId: await fetchModelId(response.data.predicted_class)
    };

    // If scanId is provided, save analysis to database
    if (scanId) {
      await createScanAnalysis(scanId, {
        classification: result.classification,
        confidenceScore: parseFloat(result.confidenceScore) || 0,
        analysisReport: result.analysisReport,
        aiModelId: result.aiModelId,
        processingTime: result.processingTime
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
 * Helper function to fetch the AI model ID from the database
 * @param {string} classification - The predicted classification
 * @returns {Promise<string|null>} - Promise that resolves with the model ID
 */
async function fetchModelId(classification) {
  let modelName;
  switch (classification) {
    case 'Pneumonia':
      modelName = 'Pneumonia Detection Model';
      break;
    case 'Tuberculosis':
      modelName = 'Tuberculosis Classifier';
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
      return 'No abnormalities detected. The scan appears to be normal.';
    case 'Pneumonia':
      return 'Potential indicators of pneumonia detected. Consultation with a physician is recommended.';
    case 'Tuberculosis':
      return 'Patterns consistent with tuberculosis identified. Immediate medical consultation is advised.';
    default:
      return 'Analysis inconclusive. Please consult with a healthcare professional.';
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