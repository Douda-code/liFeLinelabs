import { supabase } from '../lib/supabase'
import { createScanAnalysis } from './scanService'

/**
 * AI Analysis Service
 * This service provides functions for analyzing medical scans using AI
 */

// Simulated disease classes that our AI can detect
const DISEASE_CLASSES = [
  'Normal',
  'Pneumonia',
  'Tuberculosis'
];

// Simulated confidence thresholds
const CONFIDENCE_THRESHOLDS = {
  HIGH: 0.85,
  MEDIUM: 0.70,
  LOW: 0.50
};

/**
 * Simulates AI analysis of a medical scan
 * In a real application, this would call an AI model API
 * @param {File} scanFile - The scan file to analyze
 * @param {string} scanId - The ID of the scan in the database
 * @returns {Promise} - Promise that resolves with analysis results
 */
export const analyzeScan = async (scanFile, scanId = null) => {
  return new Promise((resolve) => {
    // Simulate processing time
    const processingTime = Math.floor(Math.random() * 2000) + 1000; // 1-3 seconds
    
    setTimeout(async () => {
      // Generate a random classification result
      const classIndex = Math.floor(Math.random() * DISEASE_CLASSES.length);
      const classification = DISEASE_CLASSES[classIndex];
      
      // Generate a random confidence score (between 0.5 and 0.99)
      const confidenceScore = (Math.random() * 0.49 + 0.5).toFixed(2);
      
      // Determine confidence level
      let confidenceLevel;
      if (confidenceScore >= CONFIDENCE_THRESHOLDS.HIGH) {
        confidenceLevel = 'High';
      } else if (confidenceScore >= CONFIDENCE_THRESHOLDS.MEDIUM) {
        confidenceLevel = 'Medium';
      } else {
        confidenceLevel = 'Low';
      }
      
      // Generate analysis report based on classification
      let analysisReport;
      switch (classification) {
        case 'Normal':
          analysisReport = 'No abnormalities detected. The scan appears to be normal.';
          break;
        case 'Pneumonia':
          analysisReport = 'Potential indicators of pneumonia detected. Consultation with a physician is recommended.';
          break;
        case 'Tuberculosis':
          analysisReport = 'Patterns consistent with tuberculosis identified. Immediate medical consultation is advised.';
          break;
        default:
          analysisReport = 'Analysis inconclusive. Please consult with a healthcare professional.';
      }
      
      // Get AI model ID
      let aiModelId = null;
      try {
        if (classification === 'Pneumonia') {
          const { data } = await supabase
            .from('ai_models')
            .select('id')
            .eq('name', 'Pneumonia Detection Model')
            .maybeSingle();
          aiModelId = data?.id;
        } else if (classification === 'Tuberculosis') {
          const { data } = await supabase
            .from('ai_models')
            .select('id')
            .eq('name', 'Tuberculosis Classifier')
            .maybeSingle();
          aiModelId = data?.id;
        } else {
          const { data } = await supabase
            .from('ai_models')
            .select('id')
            .eq('name', 'Multi-disease Classifier')
            .maybeSingle();
          aiModelId = data?.id;
        }
      } catch (error) {
        console.error('Error getting AI model ID:', error);
      }
      
      // Create analysis result object
      const analysisResult = {
        scanName: scanFile.name,
        scanType: determineScanType(scanFile.name),
        classification,
        confidenceScore,
        confidenceLevel,
        analysisReport,
        timestamp: new Date().toISOString(),
        processingTime: `${processingTime}ms`,
        aiModelId
      };
      
      // If scanId is provided, save analysis to database
      if (scanId) {
        try {
          await createScanAnalysis(scanId, {
            classification: analysisResult.classification,
            confidenceScore: analysisResult.confidenceScore,
            analysisReport: analysisResult.analysisReport,
            aiModelId: analysisResult.aiModelId,
            processingTime: analysisResult.processingTime
          });
          
          // Update scan status to completed
          await supabase
            .from('scans')
            .update({ status: 'Completed' })
            .eq('id', scanId);
        } catch (error) {
          console.error('Error saving analysis to database:', error);
        }
      }
      
      resolve(analysisResult);
    }, processingTime);
  });
};

/**
 * Determines the scan type based on the file name
 * @param {string} fileName - The name of the scan file
 * @returns {string} - The determined scan type
 */
const determineScanType = (fileName) => {
  fileName = fileName.toLowerCase();
  
  if (fileName.includes('mri')) return 'MRI';
  if (fileName.includes('ct')) return 'CT Scan';
  if (fileName.includes('xray') || fileName.includes('x-ray')) return 'X-Ray';
  if (fileName.includes('ultrasound')) return 'Ultrasound';
  
  // Default to X-Ray if we can't determine
  return 'X-Ray';
};

/**
 * Validates if a file is a valid medical scan
 * @param {File} file - The file to validate
 * @returns {boolean} - Whether the file is valid
 */
export const isValidScanFile = (file) => {
  // Check file type
  const validTypes = ['image/jpeg', 'image/png', 'image/dicom', 'application/pdf'];
  if (!validTypes.includes(file.type) && !file.type.startsWith('image/')) {
    return false;
  }
  
  // Check file size (max 10MB)
  const maxSize = 10 * 1024 * 1024; // 10MB in bytes
  if (file.size > maxSize) {
    return false;
  }
  
  return true;
};

/**
 * Get all AI models
 * @returns {Promise} - Promise that resolves with all AI models
 */
export const getAIModels = async () => {
  try {
    const { data, error } = await supabase
      .from('ai_models')
      .select('*')
      .order('last_updated', { ascending: false });
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error getting AI models:', error);
    throw error;
  }
};

/**
 * Get AI model by ID
 * @param {string} modelId - The ID of the AI model
 * @returns {Promise} - Promise that resolves with the AI model
 */
export const getAIModelById = async (modelId) => {
  try {
    const { data, error } = await supabase
      .from('ai_models')
      .select('*')
      .eq('id', modelId)
      .single();
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error getting AI model by ID:', error);
    throw error;
  }
};