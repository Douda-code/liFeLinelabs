/*
  # Add User Insert Policy

  1. Changes
     - Add policy to allow authenticated users to insert their own data into the users table
     - This enables the registration flow to work properly
  
  2. Security
     - Users can only insert rows where the ID matches their auth.uid()
     - Maintains existing RLS policies
*/


-- Add policy to allow anon users to insert their own data (for initial signup)
CREATE POLICY "Allow anon users to insert own data"
  ON users
  FOR INSERT
  TO anon
  WITH CHECK (auth.uid() = id);
