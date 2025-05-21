/*
  # Add Lab Schedule Management

  1. New Tables
    - `lab_schedule`
      - `id` (uuid, primary key)
      - `day_of_week` (integer, 0-6 where 0 is Sunday)
      - `is_working_day` (boolean)
      - `start_time` (time)
      - `end_time` (time)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS
    - Add policies for admins to manage schedules
    - Add policies for all users to read schedules
*/

CREATE TABLE IF NOT EXISTS lab_schedule (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  day_of_week integer NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  is_working_day boolean NOT NULL DEFAULT true,
  start_time time NOT NULL DEFAULT '08:00',
  end_time time NOT NULL DEFAULT '17:00',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE lab_schedule ENABLE ROW LEVEL SECURITY;

-- Policy for all users to read schedule
CREATE POLICY "Anyone can read lab schedule"
  ON lab_schedule
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy for admins to manage schedule
CREATE POLICY "Admins can manage lab schedule"
  ON lab_schedule
  FOR ALL
  TO authenticated
  USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin')
  WITH CHECK ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

-- Insert default schedule (Sunday to Thursday, 8 AM to 5 PM)
INSERT INTO lab_schedule (day_of_week, is_working_day, start_time, end_time) VALUES
  (0, true, '08:00', '17:00'),   -- Sunday
  (1, true, '08:00', '17:00'),   -- Monday
  (2, true, '08:00', '17:00'),   -- Tuesday
  (3, true, '08:00', '17:00'),   -- Wednesday
  (4, true, '08:00', '17:00'),   -- Thursday
  (5, false, '08:00', '17:00'),  -- Friday (weekend)
  (6, false, '08:00', '17:00')   -- Saturday (weekend)
ON CONFLICT DO NOTHING;
