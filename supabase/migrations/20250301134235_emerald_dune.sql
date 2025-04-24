/*
  # Create scans and scan_analyses tables

  1. New Tables
    - `scans`
      - `id` (uuid, primary key)
      - `patient_id` (uuid, foreign key to users)
      - `scan_type` (text)
      - `file_path` (text)
      - `file_name` (text)
      - `file_size` (bigint)
      - `status` (text)
      - `upload_date` (timestamptz)
    - `scan_analyses`
      - `id` (uuid, primary key)
      - `scan_id` (uuid, foreign key to scans)
      - `classification` (text)
      - `confidence_score` (numeric)
      - `ai_report` (text)
      - `ai_model_id` (uuid, foreign key to ai_models)
      - `processing_time` (text)
      - `created_at` (timestamptz)
  2. Security
    - Enable RLS on both tables
    - Add policies for users to access their own scans
    - Add policies for admins to access all scans
*/

-- Create scans table
CREATE TABLE IF NOT EXISTS scans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES users(id) ON DELETE CASCADE,
  scan_type text NOT NULL,
  file_path text NOT NULL,
  file_name text NOT NULL,
  file_size bigint NOT NULL,
  status text NOT NULL DEFAULT 'Pending',
  upload_date timestamptz DEFAULT now()
);

-- Create scan_analyses table
CREATE TABLE IF NOT EXISTS scan_analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scan_id uuid REFERENCES scans(id) ON DELETE CASCADE,
  classification text NOT NULL,
  confidence_score numeric NOT NULL,
  ai_report text,
  ai_model_id uuid,
  processing_time text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE scan_analyses ENABLE ROW LEVEL SECURITY;

-- Policies for scans
CREATE POLICY "Users can read own scans"
  ON scans
  FOR SELECT
  TO authenticated
  USING (patient_id = auth.uid());

CREATE POLICY "Users can insert own scans"
  ON scans
  FOR INSERT
  TO authenticated
  WITH CHECK (patient_id = auth.uid());

CREATE POLICY "Admins can read all scans"
  ON scans
  FOR SELECT
  TO authenticated
  USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Admins can update all scans"
  ON scans
  FOR UPDATE
  TO authenticated
  USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

-- Policies for scan_analyses
CREATE POLICY "Users can read own scan analyses"
  ON scan_analyses
  FOR SELECT
  TO authenticated
  USING ((SELECT patient_id FROM scans WHERE id = scan_id) = auth.uid());

CREATE POLICY "Admins can read all scan analyses"
  ON scan_analyses
  FOR SELECT
  TO authenticated
  USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Admins can insert scan analyses"
  ON scan_analyses
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Admins can update scan analyses"
  ON scan_analyses
  FOR UPDATE
  TO authenticated
  USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');
