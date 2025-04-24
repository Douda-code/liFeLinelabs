import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export const ROLES = {
  PATIENT: 'patient',
  PHYSICIAN: 'physician',
  ADMIN: 'admin'
}

export const SCAN_TYPES = {
  MRI: 'MRI',
  CT_SCAN: 'CT Scan',
  XRAY: 'X-Ray',
  ULTRASOUND: 'Ultrasound'
}

export const SCAN_STATUS = {
  PENDING: 'Pending',
  PROCESSING: 'Processing',
  COMPLETED: 'Completed',
  ERROR: 'Error'
}

export const APPOINTMENT_STATUS = {
  SCHEDULED: 'Scheduled',
  CONFIRMED: 'Confirmed',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled'
}

export const CONSULTATION_TYPES = {
  TEXT: 'text',
  VIDEO: 'video',
  IN_PERSON: 'in-person'
}

export const NOTIFICATION_TYPES = {
  SYSTEM: 'system',
  APPOINTMENT: 'appointment',
  SCAN: 'scan',
  CONSULTATION: 'consultation',
  GENERAL: 'general'
}

export const TICKET_STATUS = {
  OPEN: 'Open',
  PENDING: 'Pending',
  RESOLVED: 'Resolved',
  CLOSED: 'Closed'
}

export const AI_MODEL_STATUS = {
  ACTIVE: 'Active',
  TESTING: 'Testing',
  DEPRECATED: 'Deprecated'
}

export const EVENT_TYPES = {
  LOGIN: 'Login',
  LOGOUT: 'Logout',
  DATA_CHANGE: 'Data Change',
  ERROR: 'Error',
  ADMIN_ACTION: 'Admin Action'
}

export const ALERT_TYPES = {
  INFORMATIONAL: 'Informational',
  WARNING: 'Warning',
  CRITICAL: 'Critical'
}
