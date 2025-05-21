/*
  # Add Premium Features Flags

  1. New Columns
    - Add columns to track premium features usage
    - This helps with reporting and displaying the correct information to users
  
  2. Details
    - The flags indicate whether certain premium features were used
    - Helps track premium feature usage for analytics
*/

-- Add premium features tracking to scan_analyses
ALTER TABLE scan_analyses ADD COLUMN IF NOT EXISTS pdf_report_generated boolean DEFAULT false;
ALTER TABLE scan_analyses ADD COLUMN IF NOT EXISTS advanced_visualization_used boolean DEFAULT false;

-- Create a table to track premium feature usage
CREATE TABLE IF NOT EXISTS premium_feature_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  feature_name text NOT NULL,
  used_at timestamptz DEFAULT now(),
  metadata jsonb
);

-- Enable RLS
ALTER TABLE premium_feature_usage ENABLE ROW LEVEL SECURITY;

-- Policies for premium_feature_usage
CREATE POLICY "Users can view their own premium feature usage"
  ON premium_feature_usage
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all premium feature usage"
  ON premium_feature_usage
  FOR SELECT
  TO authenticated
  USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

-- Function to log premium feature usage
CREATE OR REPLACE FUNCTION log_premium_feature_usage(
  p_user_id uuid,
  p_feature_name text,
  p_metadata jsonb DEFAULT NULL
) RETURNS uuid AS $$
DECLARE
  v_usage_id uuid;
BEGIN
  INSERT INTO premium_feature_usage (user_id, feature_name, metadata)
  VALUES (p_user_id, p_feature_name, p_metadata)
  RETURNING id INTO v_usage_id;
  
  RETURN v_usage_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
