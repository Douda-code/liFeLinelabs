/*
  # Fix Premium Access Function

  1. Changes
     - Create a more reliable function to check premium access
     - Properly checks both user subscription_type and active subscriptions
  
  2. Details
     - The function checks if the user has a premium or family subscription type
     - It also verifies if there's an active subscription that hasn't expired
*/

-- Drop the existing function if it exists
DROP FUNCTION IF EXISTS has_premium_access;

-- Create a more reliable function to check premium access
CREATE OR REPLACE FUNCTION has_premium_access(user_id uuid)
RETURNS boolean AS $$
DECLARE
  has_premium boolean;
  subscription_record record;
BEGIN
  -- First check if user has premium or family subscription type
  SELECT 
    subscription_type IN ('premium', 'family') INTO has_premium
  FROM users
  WHERE id = user_id;
  
  -- If already premium by subscription_type, return true
  IF has_premium THEN
    RETURN true;
  END IF;
  
  -- Otherwise check for active subscriptions
  SELECT * INTO subscription_record
  FROM subscriptions
  WHERE user_id = user_id
  AND status = 'active'
  AND current_period_end > now()
  LIMIT 1;
  
  -- Return true if there's an active subscription
  RETURN subscription_record IS NOT NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
