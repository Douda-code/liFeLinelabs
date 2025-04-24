import { supabase, SCAN_TYPES, SCAN_STATUS } from '../lib/supabase'

/**
 * Upload a scan file to storage and create a scan record
 * @param {File} file - The scan file to upload
 * @param {string} scanType - The type of scan (MRI, CT Scan, X-Ray, Ultrasound)
 * @param {string} patientId - The ID of the patient
 * @returns {Promise} - Promise that resolves with the scan record
 */
export const uploadScan = async (file, scanType, patientId) => {
  try {
    // Generate a unique file name
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`
    const filePath = `${patientId}/${fileName}`
    
    // Upload file to storage first
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('scans')
      .upload(filePath, file)
    
    if (uploadError) {
      console.error('Storage upload error:', uploadError)
      throw uploadError
    }
    
    // Create scan record with the actual file path
    const { data: scanData, error: scanError } = await supabase
      .from('scans')
      .insert([
        {
          patient_id: patientId,
          scan_type: scanType,
          file_path: filePath, // Use the actual file path
          file_name: file.name,
          file_size: file.size,
          status: SCAN_STATUS.PENDING
        }
      ])
      .select()
      .single()
    
    if (scanError) throw scanError
    
    return scanData
  } catch (error) {
    console.error('Error uploading scan:', error)
    throw error
  }
}

/**
 * Get all scans for a patient
 * @param {string} patientId - The ID of the patient
 * @returns {Promise} - Promise that resolves with the scan records
 */
export const getPatientScans = async (patientId) => {
  try {
    const { data, error } = await supabase
      .from('scans')
      .select(`
        *,
        scan_analyses(*)
      `)
      .eq('patient_id', patientId)
      .order('upload_date', { ascending: false })
    
    if (error) throw error
    
    return data
  } catch (error) {
    console.error('Error getting patient scans:', error)
    throw error
  }
}

/**
 * Get a scan by ID
 * @param {string} scanId - The ID of the scan
 * @returns {Promise} - Promise that resolves with the scan record
 */
export const getScanById = async (scanId) => {
  try {
    const { data, error } = await supabase
      .from('scans')
      .select(`
        *,
        scan_analyses(*)
      `)
      .eq('id', scanId)
      .single()
    
    if (error) throw error
    
    return data
  } catch (error) {
    console.error('Error getting scan by ID:', error)
    throw error
  }
}

/**
 * Get scan file URL
 * @param {string} filePath - The path of the file in storage
 * @returns {Promise<string>} - Promise that resolves with the file URL
 */
export const getScanFileUrl = async (filePath) => {
  try {
    const { data, error } = await supabase.storage
      .from('scans')
      .createSignedUrl(filePath, 60) // URL valid for 60 seconds
    
    if (error) throw error
    
    return data.signedUrl
  } catch (error) {
    console.error('Error getting scan file URL:', error)
    return null
  }
}

/**
 * Get all scans (admin only)
 * @returns {Promise} - Promise that resolves with all scan records
 */
export const getAllScans = async () => {
  try {
    const { data, error } = await supabase
      .from('scans')
      .select(`
        *,
        scan_analyses(*),
        users!scans_patient_id_fkey(first_name, last_name)
      `)
      .order('upload_date', { ascending: false })
    
    if (error) throw error
    
    // Format the data to include patient name
    return data.map(scan => ({
      ...scan,
      patientName: scan.users ? `${scan.users.first_name} ${scan.users.last_name}` : 'Unknown'
    }))
  } catch (error) {
    console.error('Error getting all scans:', error)
    throw error
  }
}

/**
 * Create a scan analysis
 * @param {string} scanId - The ID of the scan
 * @param {object} analysisData - The analysis data
 * @returns {Promise} - Promise that resolves with the analysis record
 */
export const createScanAnalysis = async (scanId, analysisData) => {
  try {
    const { data, error } = await supabase
      .from('scan_analyses')
      .insert([
        {
          scan_id: scanId,
          classification: analysisData.classification,
          confidence_score: analysisData.confidenceScore,
          ai_report: analysisData.analysisReport,
          ai_model_id: analysisData.aiModelId,
          processing_time: analysisData.processingTime
        }
      ])
      .select()
      .single()
    
    if (error) throw error
    
    return data
  } catch (error) {
    console.error('Error creating scan analysis:', error)
    throw error
  }
}

/**
 * Validates if a file is a valid medical scan
 * @param {File} file - The file to validate
 * @returns {boolean} - Whether the file is valid
 */
export const isValidScanFile = (file) => {
  // Check file type
  const validTypes = ['image/jpeg', 'image/png',  'image/jpg' ];
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
