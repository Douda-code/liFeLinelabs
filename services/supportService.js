import { supabase } from '../lib/supabase'

/**
 * Create a support ticket
 * @param {string} subject - The subject of the ticket
 * @param {string} description - The description of the ticket
 * @param {string} reportedBy - The ID of the user who reported the ticket
 * @returns {Promise} - Promise that resolves with the ticket record
 */
export const createSupportTicket = async (subject, description, reportedBy) => {
  try {
    const { data, error } = await supabase
      .from('support_tickets')
      .insert([
        {
          subject,
          description,
          reported_by: reportedBy,
          status: 'Open'
        }
      ])
      .select()
      .single()
    
    if (error) throw error
    
    return data
  } catch (error) {
    console.error('Error creating support ticket:', error)
    throw error
  }
}

/**
 * Get all support tickets for a user
 * @param {string} userId - The ID of the user
 * @returns {Promise} - Promise that resolves with the ticket records
 */
export const getUserSupportTickets = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('support_tickets')
      .select('*')
      .eq('reported_by', userId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    
    return data
  } catch (error) {
    console.error('Error getting user support tickets:', error)
    throw error
  }
}

/**
 * Get a support ticket by ID
 * @param {string} ticketId - The ID of the ticket
 * @returns {Promise} - Promise that resolves with the ticket record
 */
export const getSupportTicketById = async (ticketId) => {
  try {
    const { data, error } = await supabase
      .from('support_tickets')
      .select('*')
      .eq('id', ticketId)
      .single()
    
    if (error) throw error
    
    return data
  } catch (error) {
    console.error('Error getting support ticket by ID:', error)
    throw error
  }
}

/**
 * Update a support ticket
 * @param {string} ticketId - The ID of the ticket
 * @param {object} updates - The updates to apply
 * @returns {Promise} - Promise that resolves when the ticket is updated
 */
export const updateSupportTicket = async (ticketId, updates) => {
  try {
    const { error } = await supabase
      .from('support_tickets')
      .update(updates)
      .eq('id', ticketId)
    
    if (error) throw error
  } catch (error) {
    console.error('Error updating support ticket:', error)
    throw error
  }
}
