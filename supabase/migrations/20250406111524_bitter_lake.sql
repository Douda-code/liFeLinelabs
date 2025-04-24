/*
  # Add subscription and payment tables

  1. New Tables
    - Add subscription_type column to users table
    - Create payment_methods table for storing card info
    - Create subscriptions table for tracking active subscriptions
  
  2. Security
    - Enable RLS
    - Add appropriate policies
    - Secure payment information
*/

-- Add subscription_type to users
ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_type text DEFAULT 'standard';

-- Create payment_methods table
CREATE TABLE IF NOT EXISTS payment_methods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  card_last4 text NOT NULL,
  card_brand text NOT NULL,
  card_exp_month integer NOT NULL,
  card_exp_year integer NOT NULL,
  is_default boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  plan_type text NOT NULL,
  status text NOT NULL,
  current_period_start timestamptz NOT NULL,
  current_period_end timestamptz NOT NULL,
  cancel_at_period_end boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Policies for payment_methods
CREATE POLICY "Users can view own payment methods"
  ON payment_methods
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own payment methods"
  ON payment_methods
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own payment methods"
  ON payment_methods
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own payment methods"
  ON payment_methods
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for subscriptions
CREATE POLICY "Users can view own subscriptions"
  ON subscriptions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own subscriptions"
  ON subscriptions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own subscriptions"
  ON subscriptions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Function to check if user has premium access
CREATE OR REPLACE FUNCTION has_premium_access(user_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM users u 
    LEFT JOIN subscriptions s ON u.id = s.user_id
    WHERE u.id = user_id 
    AND (
      u.subscription_type IN ('premium', 'family') 
      OR (s.status = 'active' AND s.current_period_end > now())
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;