/*
  # Add Appointment Time Slots Management

  1. Add time slot tracking to appointments table
    - Add time_slot column to track 15-minute intervals
    - Add unique constraint to prevent double bookings
*/

-- Add time_slot column to appointments table
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS time_slot interval;

-- Add unique constraint to prevent double bookings
ALTER TABLE appointments 
  ADD CONSTRAINT unique_appointment_slot 
  UNIQUE (appointment_date, time_slot);

-- Create function to check if slot is available
CREATE OR REPLACE FUNCTION check_appointment_slot_available(
  p_date date,
  p_time time
) RETURNS boolean AS $$
DECLARE
  v_slot_start time;
  v_slot_end time;
  v_existing_count integer;
BEGIN
  -- Round time to nearest 15-minute slot
  v_slot_start = p_time - INTERVAL '1 minute' * (EXTRACT(MINUTE FROM p_time)::integer % 15);
  v_slot_end = v_slot_start + INTERVAL '15 minutes';
  
  -- Check if slot is already booked
  SELECT COUNT(*)
  INTO v_existing_count
  FROM appointments
  WHERE appointment_date = p_date
    AND time_slot = v_slot_start::interval;
    
  RETURN v_existing_count = 0;
END;
$$ LANGUAGE plpgsql;
