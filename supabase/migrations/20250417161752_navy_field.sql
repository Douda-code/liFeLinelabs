/*
  # Add Binary Classifier AI Model

  1. Changes
     - Add a new AI model for binary classification (Normal/Abnormal)
     - This model is used for standard users without premium subscription
  
  2. Details
     - The binary classifier provides basic classification capabilities
     - Premium users get access to the more advanced multiclass models
*/

-- Insert the binary classifier model if it doesn't exist
INSERT INTO ai_models (name, version, accuracy, status, training_dataset, description)
VALUES 
  ('Binary Classifier', '1.0.0', 85.3, 'Active', 'ChestX-ray14 Subset', 'Basic binary classifier that detects normal vs. abnormal lung conditions. Used for standard tier users.')
ON CONFLICT (name) DO NOTHING;
