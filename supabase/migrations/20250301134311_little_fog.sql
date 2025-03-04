/*
  # Create support tickets, emergency contacts, and emergency protocols tables

  1. New Tables
    - `support_tickets`
      - `id` (uuid, primary key)
      - `subject` (text)
      - `description` (text)
      - `reported_by` (uuid, foreign key to users)
      - `status` (text)
      - `notes` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    - `emergency_contacts`
      - `id` (uuid, primary key)
      - `name` (text)
      - `role` (text)
      - `phone` (text)
      - `email` (text)
      - `created_at` (timestamptz)
    - `emergency_protocols`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `created_at` (timestamptz)
    - `emergency_alerts`
      - `id` (uuid, primary key)
      - `message` (text)
      - `alert_type` (text)
      - `recipients` (text)
      - `sent_by` (uuid, foreign key to users)
      - `created_at` (timestamptz)
  2. Security
    - Enable RLS on all tables
    - Add appropriate policies for each table
*/

-- Create support_tickets table
CREATE TABLE IF NOT EXISTS support_tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject text NOT NULL,
  description text NOT NULL,
  reported_by uuid REFERENCES users(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'Open',
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create emergency_contacts table
CREATE TABLE IF NOT EXISTS emergency_contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create emergency_protocols table
CREATE TABLE IF NOT EXISTS emergency_protocols (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create emergency_alerts table
CREATE TABLE IF NOT EXISTS emergency_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message text NOT NULL,
  alert_type text NOT NULL,
  recipients text NOT NULL,
  sent_by uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_protocols ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_alerts ENABLE ROW LEVEL SECURITY;

-- Policies for support_tickets
CREATE POLICY "Users can read own support tickets"
  ON support_tickets
  FOR SELECT
  TO authenticated
  USING (reported_by = auth.uid());

CREATE POLICY "Users can insert own support tickets"
  ON support_tickets
  FOR INSERT
  TO authenticated
  WITH CHECK (reported_by = auth.uid());

CREATE POLICY "Admins can read all support tickets"
  ON support_tickets
  FOR SELECT
  TO authenticated
  USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Admins can update all support tickets"
  ON support_tickets
  FOR UPDATE
  TO authenticated
  USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

-- Policies for emergency_contacts
CREATE POLICY "Users can read emergency contacts"
  ON emergency_contacts
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can insert emergency contacts"
  ON emergency_contacts
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Admins can update emergency contacts"
  ON emergency_contacts
  FOR UPDATE
  TO authenticated
  USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

-- Policies for emergency_protocols
CREATE POLICY "Users can read emergency protocols"
  ON emergency_protocols
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can insert emergency protocols"
  ON emergency_protocols
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Admins can update emergency protocols"
  ON emergency_protocols
  FOR UPDATE
  TO authenticated
  USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

-- Policies for emergency_alerts
CREATE POLICY "Users can read emergency alerts"
  ON emergency_alerts
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can insert emergency alerts"
  ON emergency_alerts
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

-- Insert default emergency contacts
INSERT INTO emergency_contacts (name, role, phone, email)
VALUES 
  ('Dr. John Smith', 'Chief Medical Officer', '555-123-4567', 'john.smith@example.com'),
  ('Jane Doe', 'Emergency Coordinator', '555-987-6543', 'jane.doe@example.com'),
  ('Robert Johnson', 'Security Officer', '555-456-7890', 'robert.johnson@example.com')
ON CONFLICT DO NOTHING;

-- Insert default emergency protocols
INSERT INTO emergency_protocols (name, description)
VALUES 
  ('System Outage', 'Protocol for handling system outages and ensuring continuity of care.'),
  ('Data Breach', 'Steps to follow in case of a data breach or security incident.'),
  ('Natural Disaster', 'Procedures for maintaining operations during natural disasters.')
ON CONFLICT DO NOTHING;