/*
  # Create database triggers

  1. Triggers
    - Update users.updated_at when a user is updated
    - Create audit log when a user signs up (via auth.users)
    - Create audit log when a user signs in (via auth.users)
    - Create notification when a scan analysis is completed
*/

-- Update users.updated_at when a user is updated
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Create audit log when a scan analysis is completed
CREATE OR REPLACE FUNCTION log_scan_analysis_completion()
RETURNS TRIGGER AS $$
DECLARE
  v_patient_id uuid;
  v_scan_type text;
BEGIN
  -- Get patient_id and scan_type
  SELECT s.patient_id, s.scan_type INTO v_patient_id, v_scan_type
  FROM scans s
  WHERE s.id = NEW.scan_id;
  
  -- Create audit log
  PERFORM create_audit_log(
    v_patient_id,
    'Scan Analysis',
    'Scan analysis completed for ' || v_scan_type || ' with classification: ' || NEW.classification,
    NULL,
    NULL
  );
  
  -- Create notification for the patient
  PERFORM create_notification(
    v_patient_id,
    'Scan Analysis Completed',
    'Your ' || v_scan_type || ' scan has been analyzed with a classification of ' || NEW.classification,
    'scan',
    NEW.classification != 'Normal'
  );
  
  -- Update scan status to Completed
  UPDATE scans
  SET status = 'Completed'
  WHERE id = NEW.scan_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER log_scan_analysis_completion
AFTER INSERT ON scan_analyses
FOR EACH ROW
EXECUTE FUNCTION log_scan_analysis_completion();

-- Create audit log when a support ticket is created
CREATE OR REPLACE FUNCTION log_support_ticket_creation()
RETURNS TRIGGER AS $$
BEGIN
  -- Create audit log
  PERFORM create_audit_log(
    NEW.reported_by,
    'Support Ticket',
    'Support ticket created: ' || NEW.subject,
    NULL,
    NULL
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER log_support_ticket_creation
AFTER INSERT ON support_tickets
FOR EACH ROW
EXECUTE FUNCTION log_support_ticket_creation();

-- Create audit log when an appointment is created
CREATE OR REPLACE FUNCTION log_appointment_creation()
RETURNS TRIGGER AS $$
BEGIN
  -- Create audit log
  PERFORM create_audit_log(
    NEW.patient_id,
    'Appointment',
    'Appointment created for ' || NEW.appointment_date || ' at ' || NEW.appointment_time,
    NULL,
    NULL
  );
  
  -- Create notification for the patient
  PERFORM create_notification(
    NEW.patient_id,
    'Appointment Scheduled',
    'You have a new appointment scheduled for ' || NEW.appointment_date || ' at ' || NEW.appointment_time,
    'appointment',
    false
  );
  
  -- Create notification for the physician if assigned
  IF NEW.physician_id IS NOT NULL THEN
    PERFORM create_notification(
      NEW.physician_id,
      'New Appointment',
      'You have a new appointment scheduled for ' || NEW.appointment_date || ' at ' || NEW.appointment_time,
      'appointment',
      false
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER log_appointment_creation
AFTER INSERT ON appointments
FOR EACH ROW
EXECUTE FUNCTION log_appointment_creation();
