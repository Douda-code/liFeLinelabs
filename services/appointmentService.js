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
    // First check if the slot is already taken
    const { data: existingSlot, error: checkError } = await supabase
      .from('appointments')
      .select('id')
      .eq('appointment_date', appointmentDate)
      .eq('appointment_time', appointmentTime)
      .limit(1)
    
    if (checkError) throw checkError
    
    // If the slot is already taken, throw an error
    if (existingSlot && existingSlot.length > 0) {
      throw new Error('This time slot has already been booked. Please select another time.')
    }
    
    // If the slot is available, create the appointment
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
    
    // Create notification for the patient
    const { data: appointment, error: fetchError } = await supabase
      .from('appointments')
      .select('patient_id, appointment_date, appointment_time')
      .eq('id', appointmentId)
      .single()
    
    if (!fetchError && appointment) {
      await supabase.rpc('create_notification', {
        p_user_id: appointment.patient_id,
        p_title: `Appointment ${status}`,
        p_content: `Your appointment on ${appointment.appointment_date} at ${appointment.appointment_time} has been ${status.toLowerCase()}.`,
        p_notification_type: 'appointment',
        p_is_important: status === 'Cancelled'
      })
    }
    
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
