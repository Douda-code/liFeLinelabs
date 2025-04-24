/*
  # Create appointments and consultations tables

  1. New Tables
    - `appointments`
      - `id` (uuid, primary key)
      - `patient_id` (uuid, foreign key to users)
      - `physician_id` (uuid, foreign key to users)
      - `appointment_date` (date)
      - `appointment_time` (time)
      - `reason` (text)
      - `status` (text)
      - `created_at` (timestamptz)
    - `consultations`
      - `id` (uuid, primary key)
      - `patient_id` (uuid, foreign key to users)
      - `physician_id` (uuid, foreign key to users)
      - `consultation_type` (text)
      - `scheduled_at` (timestamptz)
      - `duration` (integer)
      - `notes` (text)
      - `status` (text)
      - `created_at` (timestamptz)
  2. Security
    - Enable RLS on both tables
    - Add policies for users to access their own appointments/consultations
    - Add policies for physicians to access appointments/consultations where they are the physician
    - Add policies for admins to access all appointments/consultations
*/

-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES users(id) ON DELETE CASCADE,
  physician_id uuid REFERENCES users(id) ON DELETE SET NULL,
  appointment_date date NOT NULL,
  appointment_time time NOT NULL,
  reason text,
  status text NOT NULL DEFAULT 'Scheduled',
  created_at timestamptz DEFAULT now()
);

-- Create consultations table
CREATE TABLE IF NOT EXISTS consultations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES users(id) ON DELETE CASCADE,
  physician_id uuid REFERENCES users(id) ON DELETE SET NULL,
  consultation_type text NOT NULL,
  scheduled_at timestamptz NOT NULL,
  duration integer NOT NULL,
  notes text,
  status text NOT NULL DEFAULT 'Scheduled',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;

-- Policies for appointments
CREATE POLICY "Users can read own appointments"
  ON appointments
  FOR SELECT
  TO authenticated
  USING (patient_id = auth.uid());

CREATE POLICY "Users can insert own appointments"
  ON appointments
  FOR INSERT
  TO authenticated
  WITH CHECK (patient_id = auth.uid());

CREATE POLICY "Physicians can read their appointments"
  ON appointments
  FOR SELECT
  TO authenticated
  USING (physician_id = auth.uid());

CREATE POLICY "Admins can read all appointments"
  ON appointments
  FOR SELECT
  TO authenticated
  USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Admins can update all appointments"
  ON appointments
  FOR UPDATE
  TO authenticated
  USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

-- Policies for consultations
CREATE POLICY "Users can read own consultations"
  ON consultations
  FOR SELECT
  TO authenticated
  USING (patient_id = auth.uid());

CREATE POLICY "Users can insert own consultations"
  ON consultations
  FOR INSERT
  TO authenticated
  WITH CHECK (patient_id = auth.uid());

CREATE POLICY "Physicians can read their consultations"
  ON consultations
  FOR SELECT
  TO authenticated
  USING (physician_id = auth.uid());

CREATE POLICY "Admins can read all consultations"
  ON consultations
  FOR SELECT
  TO authenticated
  USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Admins can update all consultations"
  ON consultations
  FOR UPDATE
  TO authenticated
  USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');
