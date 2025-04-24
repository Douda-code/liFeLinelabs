import { supabase } from '../lib/supabase'

/**
 * Get a signed URL for a scan image from storage
 * @param {string} filePath - The path of the file in storage
 * @returns {Promise<string>} - Promise that resolves with the signed URL
 */
export const getScanImageUrl = async (filePath) => {
  try {
    const { data, error } = await supabase.storage
      .from('scans')
      .createSignedUrl(filePath, 60) // URL valid for 60 seconds

    if (error) throw error
    return data.signedUrl
  } catch (error) {
    console.error('Error getting scan image URL:', error)
    return null
  }
}

/**
 * Get thumbnail URLs for multiple scans
 * @param {Array} scans - Array of scan objects containing file_path
 * @returns {Promise<Array>} - Promise that resolves with scans array including thumbnail URLs
 */
export const getScanThumbnails = async (scans) => {
  try {
    const scansWithThumbnails = await Promise.all(
      scans.map(async (scan) => {
        let thumbnailUrl = 'https://via.placeholder.com/150'
        
        if (scan.file_path && scan.file_path !== 'placeholder') {
          const url = await getScanImageUrl(scan.file_path)
          if (url) {
            thumbnailUrl = url
          }
        }
        
        return {
          ...scan,
          thumbnailUrl
        }
      })
    )
    
    return scansWithThumbnails
  } catch (error) {
    console.error('Error getting scan thumbnails:', error)
    return scans.map(scan => ({
      ...scan,
      thumbnailUrl: 'https://via.placeholder.com/150'
    }))
  }
}

/**
 * Transform scan data for display
 * @param {Array} scans - Raw scan data from database
 * @returns {Promise<Array>} - Promise that resolves with transformed scan data
 */
export const transformScansForDisplay = async (scans) => {
  try {
    // First get thumbnails
    const scansWithThumbnails = await getScanThumbnails(scans)
    
    // Then transform the data
    return scansWithThumbnails.map(scan => ({
      id: scan.id,
      patientName: scan.patient_name || 'Unknown Patient',
      uploadDate: new Date(scan.upload_date).toLocaleDateString(),
      scanType: scan.scan_type,
      classificationStatus: scan.status,
      confidenceScore: scan.scan_analyses && scan.scan_analyses.length > 0 
        ? scan.scan_analyses[0].confidence_score 
        : 'N/A',
      aiReport: scan.scan_analyses && scan.scan_analyses.length > 0 
        ? scan.scan_analyses[0].ai_report 
        : 'Not analyzed yet',
      thumbnailUrl: scan.thumbnailUrl
    }))
  } catch (error) {
    console.error('Error transforming scans:', error)
    return []
  }
}
