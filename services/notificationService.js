import { supabase, NOTIFICATION_TYPES } from '../lib/supabase'

/**
 * Get all notifications for a user
 * @param {string} userId - The ID of the user
 * @returns {Promise} - Promise that resolves with the notification records
 */
export const getUserNotifications = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    
    return data
  } catch (error) {
    console.error('Error getting user notifications:', error)
    throw error
  }
}

/**
 * Mark a notification as read
 * @param {string} notificationId - The ID of the notification
 * @returns {Promise} - Promise that resolves when the notification is marked as read
 */
export const markNotificationAsRead = async (notificationId) => {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId)
    
    if (error) throw error
  } catch (error) {
    console.error('Error marking notification as read:', error)
    throw error
  }
}

/**
 * Mark a notification as important
 * @param {string} notificationId - The ID of the notification
 * @param {boolean} isImportant - Whether the notification is important
 * @returns {Promise} - Promise that resolves when the notification is marked as important
 */
export const markNotificationAsImportant = async (notificationId, isImportant) => {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ is_important: isImportant })
      .eq('id', notificationId)
    
    if (error) throw error
  } catch (error) {
    console.error('Error marking notification as important:', error)
    throw error
  }
}

/**
 * Create a notification
 * @param {string} userId - The ID of the user
 * @param {string} title - The title of the notification
 * @param {string} content - The content of the notification
 * @param {string} notificationType - The type of notification
 * @param {boolean} isImportant - Whether the notification is important
 * @returns {Promise} - Promise that resolves with the notification record
 */
export const createNotification = async (userId, title, content, notificationType, isImportant = false) => {
  try {
    // Insert directly into notifications table
    const { data, error } = await supabase
      .from('notifications')
      .insert([
        {
          user_id: userId,
          title: title,
          content: content,
          notification_type: notificationType,
          is_important: isImportant,
          is_read: false
        }
      ])
      .select()
    
    if (error) throw error
    
    return data
  } catch (error) {
    console.error('Error creating notification:', error)
    throw error
  }
}

/**
 * Get all announcements
 * @returns {Promise} - Promise that resolves with the announcement records
 */
export const getAnnouncements = async () => {
  try {
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    
    return data
  } catch (error) {
    console.error('Error getting announcements:', error)
    throw error
  }
}

/**
 * Create an announcement (admin only)
 * @param {string} title - The title of the announcement
 * @param {string} content - The content of the announcement
 * @param {string} createdBy - The ID of the admin who created the announcement
 * @returns {Promise} - Promise that resolves with the announcement record
 */
export const createAnnouncement = async (title, content, createdBy) => {
  try {
    const { data, error } = await supabase
      .from('announcements')
      .insert([
        {
          title,
          content,
          created_by: createdBy
        }
      ])
      .select()
      .single()
    
    if (error) throw error
    
    return data
  } catch (error) {
    console.error('Error creating announcement:', error)
    throw error
  }
}

/**
 * Create an emergency alert (admin only)
 * @param {string} message - The alert message
 * @param {string} alertType - The type of alert
 * @param {string} recipients - The recipients of the alert
 * @param {string} sentBy - The ID of the admin who sent the alert
 * @returns {Promise} - Promise that resolves with the alert record
 */
export const createEmergencyAlert = async (message, alertType, recipients, sentBy) => {
  try {
    const { data, error } = await supabase
      .from('emergency_alerts')
      .insert([
        {
          message,
          alert_type: alertType,
          recipients,
          sent_by: sentBy
        }
      ])
      .select()
      .single()
    
    if (error) throw error
    
    return data
  } catch (error) {
    console.error('Error creating emergency alert:', error)
    throw error
  }
}