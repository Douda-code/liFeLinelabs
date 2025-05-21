/*
  # Add Premium Analysis Flag to Scan Analyses

  1. Changes
     - Add a boolean column to track which analyses were done with premium models
     - This helps with reporting and displaying the correct model information to users
  
  2. Details
     - The flag indicates whether the analysis was performed using the premium multiclass model
     - Standard analyses use the binary classifier (Normal/Abnormal)
     - Premium analyses use the multiclass classifier (Normal/Pneumonia/Tuberculosis)
*/

-- Add is_premium_analysis column to scan_analyses table
ALTER TABLE scan_analyses ADD COLUMN IF NOT EXISTS is_premium_analysis boolean DEFAULT false;

-- Update existing analyses based on classification
-- Assume any analysis with classification other than 'Normal' or 'Abnormal' was done with premium model
UPDATE scan_analyses
SET is_premium_analysis = true
WHERE classification NOT IN ('Normal', 'Abnormal');
