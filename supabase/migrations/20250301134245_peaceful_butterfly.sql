/*
  # Create AI models table

  1. New Tables
    - `ai_models`
      - `id` (uuid, primary key)
      - `name` (text)
      - `version` (text)
      - `accuracy` (numeric)
      - `status` (text)
      - `training_dataset` (text)
      - `description` (text)
      - `created_at` (timestamptz)
      - `last_updated` (timestamptz)
  2. Security
    - Enable RLS on the table
    - Add policies for users to read models
    - Add policies for admins to manage models
*/

CREATE TABLE IF NOT EXISTS ai_models (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  version text NOT NULL,
  accuracy numeric NOT NULL,
  status text NOT NULL DEFAULT 'Active',
  training_dataset text,
  description text,
  created_at timestamptz DEFAULT now(),
  last_updated timestamptz DEFAULT now()
);

ALTER TABLE ai_models ENABLE ROW LEVEL SECURITY;

-- Policies for ai_models
CREATE POLICY "Users can read ai models"
  ON ai_models
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can insert ai models"
  ON ai_models
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Admins can update ai models"
  ON ai_models
  FOR UPDATE
  TO authenticated
  USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

-- Insert default AI models
INSERT INTO ai_models (name, version, accuracy, status, training_dataset, description)
VALUES 
  ('Pneumonia Detection Model', '1.2.3', 92.5, 'Active', 'ChestX-ray14', 'Detects pneumonia in chest X-rays using a convolutional neural network architecture.'),
  ('Tuberculosis Classifier', '2.0.1', 89.7, 'Active', 'TB-Net Dataset', 'Identifies tuberculosis patterns in chest X-rays using a ResNet50 architecture with transfer learning.'),
  ('Multi-disease Classifier', '0.9.5', 85.3, 'Testing', 'Combined Medical Imaging Dataset', 'Experimental model that can detect multiple conditions from various scan types.')
ON CONFLICT DO NOTHING;