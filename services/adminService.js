import { supabase, EVENT_TYPES } from '../lib/supabase'

/**
 * Get all users (admin only)
 * @returns {Promise} - Promise that resolves with all user records
 */
export const getAllUsers = async () => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    
    return data
  } catch (error) {
    console.error('Error getting all users:', error)
    throw error
  }
}

/**
 * Update user profile (admin only)
 * @param {string} userId - The ID of the user
 * @param {object} updates - The updates to apply
 * @returns {Promise} - Promise that resolves when the user is updated
 */
export const updateUser = async (userId, updates) => {
  try {
    const { error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
    
    if (error) throw error
    
    // Create audit log
    await supabase.rpc('create_audit_log', {
      p_user_id: (await supabase.auth.getUser()).data.user?.id,
      p_event_type: EVENT_TYPES.ADMIN_ACTION,
      p_description: `Updated user profile: ${userId}`,
      p_ip_address: null,
      p_user_agent: navigator.userAgent
    })
  } catch (error) {
    console.error('Error updating user:', error)
    throw error
  }
}

/**
 * Get all audit logs (admin only)
 * @returns {Promise} - Promise that resolves with all audit log records
 */
export const getAuditLogs = async () => {
  try {
    const { data, error } = await supabase
      .from('audit_logs')
      .select(`
        *,
        users(first_name, last_name)
      `)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    
    // Format user names
    return data.map(log => ({
      ...log,
      user_name: log.users ? `${log.users.first_name} ${log.users.last_name}` : 'Unknown'
    }))
  } catch (error) {
    console.error('Error getting audit logs:', error)
    throw error
  }
}

/**
 * Get all emergency contacts (admin only)
 * @returns {Promise} - Promise that resolves with all emergency contact records
 */
export const getEmergencyContacts = async () => {
  try {
    const { data, error } = await supabase
      .from('emergency_contacts')
      .select('*')
      .order('name', { ascending: true })
    
    if (error) throw error
    
    return data
  } catch (error) {
    console.error('Error getting emergency contacts:', error)
    throw error
  }
}

/**
 * Create emergency contact (admin only)
 * @param {string} name - The name of the contact
 * @param {string} role - The role of the contact
 * @param {string} phone - The phone number of the contact
 * @param {string} email - The email of the contact
 * @returns {Promise} - Promise that resolves with the contact record
 */
export const createEmergencyContact = async (name, role, phone, email) => {
  try {
    const { data, error } = await supabase
      .from('emergency_contacts')
      .insert([
        {
          name,
          role,
          phone,
          email
        }
      ])
      .select()
      .single()
    
    if (error) throw error
    
    // Create audit log
    await supabase.rpc('create_audit_log', {
      p_user_id: (await supabase.auth.getUser()).data.user?.id,
      p_event_type: EVENT_TYPES.ADMIN_ACTION,
      p_description: `Created emergency contact: ${name}`,
      p_ip_address: null,
      p_user_agent: navigator.userAgent
    })
    
    return data
  } catch (error) {
    console.error('Error creating emergency contact:', error)
    throw error
  }
}

/**
 * Get all emergency protocols (admin only)
 * @returns {Promise} - Promise that resolves with all emergency protocol records
 */
export const getEmergencyProtocols = async () => {
  try {
    const { data, error } = await supabase
      .from('emergency_protocols')
      .select('*')
      .order('name', { ascending: true })
    
    if (error) throw error
    
    return data
  } catch (error) {
    console.error('Error getting emergency protocols:', error)
    throw error
  }
}

/**
 * Create emergency protocol (admin only)
 * @param {string} name - The name of the protocol
 * @param {string} description - The description of the protocol
 * @returns {Promise} - Promise that resolves with the protocol record
 */
export const createEmergencyProtocol = async (name, description) => {
  try {
    const { data, error } = await supabase
      .from('emergency_protocols')
      .insert([
        {
          name,
          description
        }
      ])
      .select()
      .single()
    
    if (error) throw error
    
    // Create audit log
    await supabase.rpc('create_audit_log', {
      p_user_id: (await supabase.auth.getUser()).data.user?.id,
      p_event_type: EVENT_TYPES.ADMIN_ACTION,
      p_description: `Created emergency protocol: ${name}`,
      p_ip_address: null,
      p_user_agent: navigator.userAgent
    })
    
    return data
  } catch (error) {
    console.error('Error creating emergency protocol:', error)
    throw error
  }
}

/**
 * Get all support tickets (admin only)
 * @returns {Promise} - Promise that resolves with all support ticket records
 */
export const getAllSupportTickets = async () => {
  try {
    const { data, error } = await supabase
      .from('support_tickets')
      .select(`
        *,
        users!support_tickets_reported_by_fkey(first_name, last_name)
      `)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    
    // Format user names
    return data.map(ticket => ({
      ...ticket,
      reporter_name: ticket.users ? `${ticket.users.first_name} ${ticket.users.last_name}` : 'Unknown'
    }))
  } catch (error) {
    console.error('Error getting all support tickets:', error)
    throw error
  }
}

/**
 * Update support ticket (admin only)
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
    
    // Create audit log
    await supabase.rpc('create_audit_log', {
      p_user_id: (await supabase.auth.getUser()).data.user?.id,
      p_event_type: EVENT_TYPES.ADMIN_ACTION,
      p_description: `Updated support ticket: ${ticketId}`,
      p_ip_address: null,
      p_user_agent: navigator.userAgent
    })
  } catch (error) {
    console.error('Error updating support ticket:', error)
    throw error
  }
}

/**
 * Create emergency alert (admin only)
 * @param {string} message - The alert message
 * @param {string} alertType - The type of alert
 * @param {string} recipients - The recipients of the alert
 * @returns {Promise} - Promise that resolves with the alert record
 */
export const createEmergencyAlert = async (message, alertType, recipients) => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;
    
    const { data, error } = await supabase
      .from('emergency_alerts')
      .insert([
        {
          message,
          alert_type: alertType,
          recipients,
          sent_by: userId
        }
      ])
      .select()
      .single();
    
    if (error) throw error;
    
    // Create audit log
    await supabase.rpc('create_audit_log', {
      p_user_id: userId,
      p_event_type: EVENT_TYPES.ADMIN_ACTION,
      p_description: `Created emergency alert: ${alertType}`,
      p_ip_address: null,
      p_user_agent: navigator.userAgent
    });
    
    // Create notifications for all users based on recipients
    let userQuery = supabase.from('users').select('id');
    
    if (recipients !== 'All Users') {
      const roleMap = {
        'Patients Only': 'patient',
        'Physicians Only': 'physician',
        'Admins Only': 'admin'
      };
      
      if (roleMap[recipients]) {
        userQuery = userQuery.eq('role', roleMap[recipients]);
      }
    }
    
    const { data: users, error: usersError } = await userQuery;
    
    if (usersError) throw usersError;
    
    // Create a notification for each user
    for (const user of users) {
      await supabase.rpc('create_notification', {
        p_user_id: user.id,
        p_title: `ALERT: ${alertType}`,
        p_content: message,
        p_notification_type: 'system',
        p_is_important: alertType === 'Critical'
      });
    }
    
    return data;
  } catch (error) {
    console.error('Error creating emergency alert:', error);
    throw error;
  }
}

/**
 * Get all AI models (admin only)
 * @returns {Promise} - Promise that resolves with all AI model records
 */
export const getAllAIModels = async () => {
  try {
    const { data, error } = await supabase
      .from('ai_models')
      .select('*')
      .order('last_updated', { ascending: false });
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error getting all AI models:', error);
    throw error;
  }
}

/**
 * Update AI model (admin only)
 * @param {string} modelId - The ID of the model
 * @param {object} updates - The updates to apply
 * @returns {Promise} - Promise that resolves when the model is updated
 */
export const updateAIModel = async (modelId, updates) => {
  try {
    // Add last_updated timestamp
    updates.last_updated = new Date().toISOString();
    
    const { error } = await supabase
      .from('ai_models')
      .update(updates)
      .eq('id', modelId);
    
    if (error) throw error;
    
    // Create audit log
    await supabase.rpc('create_audit_log', {
      p_user_id: (await supabase.auth.getUser()).data.user?.id,
      p_event_type: EVENT_TYPES.ADMIN_ACTION,
      p_description: `Updated AI model: ${modelId}`,
      p_ip_address: null,
      p_user_agent: navigator.userAgent
    });
  } catch (error) {
    console.error('Error updating AI model:', error);
    throw error;
  }
}

/**
 * Create AI model (admin only)
 * @param {object} modelData - The model data
 * @returns {Promise} - Promise that resolves with the model record
 */
export const createAIModel = async (modelData) => {
  try {
    const { data, error } = await supabase
      .from('ai_models')
      .insert([modelData])
      .select()
      .single();
    
    if (error) throw error;
    
    // Create audit log
    await supabase.rpc('create_audit_log', {
      p_user_id: (await supabase.auth.getUser()).data.user?.id,
      p_event_type: EVENT_TYPES.ADMIN_ACTION,
      p_description: `Created AI model: ${modelData.name}`,
      p_ip_address: null,
      p_user_agent: navigator.userAgent
    });
    
    return data;
  } catch (error) {
    console.error('Error creating AI model:', error);
    throw error;
  }
}

/**
 * Create announcement (admin only)
 * @param {string} title - The title of the announcement
 * @param {string} content - The content of the announcement
 * @returns {Promise} - Promise that resolves with the announcement record
 */
export const createAnnouncement = async (title, content) => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;
    
    const { data, error } = await supabase
      .from('announcements')
      .insert([
        {
          title,
          content,
          created_by: userId
        }
      ])
      .select()
      .single();
    
    if (error) throw error;
    
    // Create audit log
    await supabase.rpc('create_audit_log', {
      p_user_id: userId,
      p_event_type: EVENT_TYPES.ADMIN_ACTION,
      p_description: `Created announcement: ${title}`,
      p_ip_address: null,
      p_user_agent: navigator.userAgent
    });
    
    // Create notifications for all users
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id');
    
    if (usersError) throw usersError;
    
    // Create a notification for each user
    for (const user of users) {
      await supabase.rpc('create_notification', {
        p_user_id: user.id,
        p_title: `Announcement: ${title}`,
        p_content: content,
        p_notification_type: 'system',
        p_is_important: false
      });
    }
    
    return data;
  } catch (error) {
    console.error('Error creating announcement:', error);
    throw error;
  }
}