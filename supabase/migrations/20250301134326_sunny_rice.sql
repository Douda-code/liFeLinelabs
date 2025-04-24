/*
  # Create audit logs table

  1. New Tables
    - `audit_logs`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `event_type` (text)
      - `description` (text)
      - `ip_address` (text)
      - `user_agent` (text)
      - `created_at` (timestamptz)
  2. Security
    - Enable RLS on the table
    - Add policies for admins to read all logs
    - Add function to create audit logs
*/

-- Create audit_logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  event_type text NOT NULL,
  description text NOT NULL,
  ip_address text,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Policies for audit_logs
CREATE POLICY "Admins can read all audit logs"
  ON audit_logs
  FOR SELECT
  TO authenticated
  USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

-- Create function to create audit logs
CREATE OR REPLACE FUNCTION create_audit_log(
  p_user_id uuid,
  p_event_type text,
  p_description text,
  p_ip_address text,
  p_user_agent text
) RETURNS uuid AS $$
DECLARE
  v_log_id uuid;
BEGIN
  INSERT INTO audit_logs (user_id, event_type, description, ip_address, user_agent)
  VALUES (p_user_id, p_event_type, p_description, p_ip_address, p_user_agent)
  RETURNING id INTO v_log_id;
  
  RETURN v_log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to create notification
CREATE OR REPLACE FUNCTION create_notification(
  p_user_id uuid,
  p_title text,
  p_content text,
  p_notification_type text,
  p_is_important boolean DEFAULT false
) RETURNS uuid AS $$
DECLARE
  v_notification_id uuid;
BEGIN
  INSERT INTO notifications (user_id, title, content, notification_type, is_important)
  VALUES (p_user_id, p_title, p_content, p_notification_type, p_is_important)
  RETURNING id INTO v_notification_id;
  
  RETURN v_notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
