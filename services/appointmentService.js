import { supabase, APPOINTMENT_STATUS } from '../lib/supabase'

/**
 * Create an appointment
 * @param {string} patientId - The ID of the patient
 * @param {string} appointmentDate - The date of the appointment
 * @param {string} appointmentTime - The time of the appointment
 * @param {string} reason - The reason for the appointment
 * @returns {Promise} - Promise that resolves with the appointment record
 */
export const createAppointment = async (patientId, appointmentDate, appointmentTime, reason) => {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .insert([
        {
          patient_id: patientId,
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
        *
      `)
      .eq('patient_id', patientId)
      .order('appointment_date', { ascending: true })

    if (error) throw error

    return data
  } catch (error) {
    console.error('Error getting patient appointments:', error)
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
        patient:users!appointments_patient_id_fkey(first_name, last_name)
      `)
      .order('appointment_date', { ascending: true })

    if (error) throw error

    // Format names
    return data.map(appointment => ({
      ...appointment,
      patientName: appointment.patient ? `${appointment.patient.first_name} ${appointment.patient.last_name}` : 'Unknown',
    }))
  } catch (error) {
    console.error('Error getting all appointments:', error)
    throw error
  }
}
