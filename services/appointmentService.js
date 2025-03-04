import { supabase, APPOINTMENT_STATUS } from '../lib/supabase'

/**
 * Create an appointment
 * @param {string} patientId - The ID of the patient
 * @param {string} physicianId - The ID of the physician (optional)
 * @param {string} appointmentDate - The date of the appointment
 * @param {string} appointmentTime - The time of the appointment
 * @param {string} reason - The reason for the appointment
 * @returns {Promise} - Promise that resolves with the appointment record
 */
export const createAppointment = async (patientId, physicianId, appointmentDate, appointmentTime, reason) => {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .insert([
        {
          patient_id: patientId,
          physician_id: physicianId,
          appointment_date: appointmentDate,
          appointment_time: appointmentTime,
          reason,
          status: APPOINTMENT_STATUS.SCHEDULED
        }
      ])
      .select()
      .single()
    
    if (error) throw error
    
    return data
  } catch (error) {
    console.error('Error creating appointment:', error)
    throw error
  }
}

/**
 * Get all appointments for a patient
 * @param {string} patientId - The ID of the patient
 * @returns {Promise} - Promise that resolves with the appointment records
 */
export const getPatientAppointments = async (patientId) => {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        physician:users!appointments_physician_id_fkey(first_name, last_name)
      `)
      .eq('patient_id', patientId)
      .order('appointment_date', { ascending: true })
    
    if (error) throw error
    
    // Format physician names
    return data.map(appointment => ({
      ...appointment,
      physicianName: appointment.physician ? `Dr. ${appointment.physician.first_name} ${appointment.physician.last_name}` : 'Unassigned'
    }))
  } catch (error) {
    console.error('Error getting patient appointments:', error)
    throw error
  }
}

/**
 * Get all appointments for a physician
 * @param {string} physicianId - The ID of the physician
 * @returns {Promise} - Promise that resolves with the appointment records
 */
export const getPhysicianAppointments = async (physicianId) => {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        patient:users!appointments_patient_id_fkey(first_name, last_name)
      `)
      .eq('physician_id', physicianId)
      .order('appointment_date', { ascending: true })
    
    if (error) throw error
    
    // Format patient names
    return data.map(appointment => ({
      ...appointment,
      patientName: appointment.patient ? `${appointment.patient.first_name} ${appointment.patient.last_name}` : 'Unknown'
    }))
  } catch (error) {
    console.error('Error getting physician appointments:', error)
    throw error
  }
}

/**
 * Update appointment status
 * @param {string} appointmentId - The ID of the appointment
 * @param {string} status - The new status
 * @returns {Promise} - Promise that resolves when the appointment is updated
 */
export const updateAppointmentStatus = async (appointmentId, status) => {
  try {
    const { error } = await supabase
      .from('appointments')
      .update({ status })
      .eq('id', appointmentId)
    
    if (error) throw error
  } catch (error) {
    console.error('Error updating appointment status:', error)
    throw error
  }
}

/**
 * Get all appointments (admin only)
 * @returns {Promise} - Promise that resolves with all appointment records
 */
export const getAllAppointments = async () => {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        patient:users!appointments_patient_id_fkey(first_name, last_name),
        physician:users!appointments_physician_id_fkey(first_name, last_name)
      `)
      .order('appointment_date', { ascending: true })
    
    if (error) throw error
    
    // Format names
    return data.map(appointment => ({
      ...appointment,
      patientName: appointment.patient ? `${appointment.patient.first_name} ${appointment.patient.last_name}` : 'Unknown',
      physicianName: appointment.physician ? `Dr. ${appointment.physician.first_name} ${appointment.physician.last_name}` : 'Unassigned'
    }))
  } catch (error) {
    console.error('Error getting all appointments:', error)
    throw error
  }
}

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

/**
 * Get all physicians
 * @returns {Promise} - Promise that resolves with all physician records
 */
export const getAllPhysicians = async () => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('role', 'physician')
      .order('last_name', { ascending: true })
    
    if (error) throw error
    
    // Format names
    return data.map(physician => ({
      ...physician,
      name: `Dr. ${physician.first_name} ${physician.last_name}`
    }))
  } catch (error) {
    console.error('Error getting all physicians:', error)
    throw error
  }
}