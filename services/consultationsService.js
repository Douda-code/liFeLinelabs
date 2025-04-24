import { supabase, APPOINTMENT_STATUS } from '../lib/supabase'

/**
 * Create a consultation
 * @param {string} patientId - The ID of the patient
 * @param {string} physicianId - The ID of the physician
 * @param {string} consultationType - The type of consultation
 * @param {string} scheduledAt - The date and time of the consultation
 * @param {number} duration - The duration of the consultation in minutes
 * @param {string} notes - Notes about the consultation
 * @returns {Promise} - Promise that resolves with the consultation record
 */
export const createConsultation = async (patientId, physicianId, consultationType, scheduledAt, duration, notes) => {
  try {
    const { data, error } = await supabase
      .from('consultations')
      .insert([
        {
          patient_id: patientId,
          physician_id: physicianId,
          consultation_type: consultationType,
          scheduled_at: scheduledAt,
          duration,
          notes,
          status: APPOINTMENT_STATUS.SCHEDULED
        }
      ])
      .select()
      .single()

    if (error) throw error

    return data
  } catch (error) {
    console.error('Error creating consultation:', error)
    throw error
  }
}

/**
 * Get all consultations for a patient
 * @param {string} patientId - The ID of the patient
 * @returns {Promise} - Promise that resolves with the consultation records
 */
export const getPatientConsultations = async (patientId) => {
  try {
    const { data, error } = await supabase
      .from('consultations')
      .select(`
        *,
        physician:users!consultations_physician_id_fkey(first_name, last_name)
      `)
      .eq('patient_id', patientId)
      .order('scheduled_at', { ascending: true })

    if (error) throw error

    // Format physician names
    return data.map(consultation => ({
      ...consultation,
      physicianName: consultation.physician ? `Dr. ${consultation.physician.first_name} ${consultation.physician.last_name}` : 'Unassigned'
    }))
  } catch (error) {
    console.error('Error getting patient consultations:', error)
    throw error
  }
}

/**
 * Get all consultations for a physician
 * @param {string} physicianId - The ID of the physician
 * @returns {Promise} - Promise that resolves with the consultation records
 */
export const getPhysicianConsultations = async (physicianId) => {
  try {
    const { data, error } = await supabase
      .from('consultations')
      .select(`
        *,
        patient:users!consultations_patient_id_fkey(first_name, last_name)
      `)
      .eq('physician_id', physicianId)
      .order('scheduled_at', { ascending: true })

    if (error) throw error

    // Format patient names
    return data.map(consultation => ({
      ...consultation,
      patientName: consultation.patient ? `${consultation.patient.first_name} ${consultation.patient.last_name}` : 'Unknown'
    }))
  } catch (error) {
    console.error('Error getting physician consultations:', error)
    throw error
  }
}

/**
 * Update consultation status
 * @param {string} consultationId - The ID of the consultation
 * @param {string} status - The new status
 * @returns {Promise} - Promise that resolves when the consultation is updated
 */
export const updateConsultationStatus = async (consultationId, status) => {
  try {
    const { error } = await supabase
      .from('consultations')
      .update({ status })
      .eq('id', consultationId)

    if (error) throw error
    
    // Create notification for the patient
    const { data: consultation, error: fetchError } = await supabase
      .from('consultations')
      .select(`
        patient_id,
        scheduled_at,
        consultation_type,
        physician:users!consultations_physician_id_fkey(first_name, last_name)
      `)
      .eq('id', consultationId)
      .single()
    
    if (!fetchError && consultation) {
      const physicianName = consultation.physician 
        ? `Dr. ${consultation.physician.first_name} ${consultation.physician.last_name}` 
        : 'your physician'
      
      await supabase.rpc('create_notification', {
        p_user_id: consultation.patient_id,
        p_title: `Consultation ${status}`,
        p_content: `Your ${consultation.consultation_type} consultation with ${physicianName} scheduled for ${new Date(consultation.scheduled_at).toLocaleString()} has been ${status.toLowerCase()}.`,
        p_notification_type: 'consultation',
        p_is_important: status === 'Cancelled'
      })
    }
    
  } catch (error) {
    console.error('Error updating consultation status:', error)
    throw error
  }
}

/**
 * Get all consultations (admin only)
 * @returns {Promise} - Promise that resolves with all consultation records
 */
export const getAllConsultations = async () => {
  try {
    const { data, error } = await supabase
      .from('consultations')
      .select(`
        *,
        patient:users!consultations_patient_id_fkey(first_name, last_name),
        physician:users!consultations_physician_id_fkey(first_name, last_name)
      `)
      .order('scheduled_at', { ascending: true })

    if (error) throw error

    // Format names
    return data.map(consultation => ({
      ...consultation,
      patientName: consultation.patient ? `${consultation.patient.first_name} ${consultation.patient.last_name}` : 'Unknown',
      physicianName: consultation.physician ? `Dr. ${consultation.physician.first_name} ${consultation.physician.last_name}` : 'Unassigned'
    }))
  } catch (error) {
    console.error('Error getting all consultations:', error)
    throw error
  }
}
