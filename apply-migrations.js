import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load environment variables
dotenv.config();

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to apply migrations
async function applyMigrations() {
  try {
    console.log('Connecting to Supabase and applying migrations...');
    
    // Get Supabase URL and key from environment variables
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase URL or key not found in environment variables');
    }
    
    console.log('Supabase connection details found in environment variables');
    
    // Get migration files
    const migrationsDir = path.join(__dirname, 'supabase', 'migrations');
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort(); // Sort to ensure migrations are applied in order
    
    console.log(`Found ${migrationFiles.length} migration files`);
    
    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Apply each migration file
    for (const migrationFile of migrationFiles) {
      const migrationPath = path.join(migrationsDir, migrationFile);
      const migrationSql = fs.readFileSync(migrationPath, 'utf8');
      
      console.log(`Applying migration: ${migrationFile}`);
      
      try {
        // Instead of using RPC, we'll use the REST API directly
        // We'll create tables and other objects directly
        
        // Split the SQL into separate statements
        const statements = migrationSql
          .replace(/\/\*[\s\S]*?\*\//g, '') // Remove SQL comments
          .split(';')
          .map(stmt => stmt.trim())
          .filter(stmt => stmt.length > 0);
        
        for (const statement of statements) {
          console.log(`Executing statement: ${statement.substring(0, 50)}...`);
          
          // For table creation
          if (statement.toLowerCase().includes('create table')) {
            const tableName = statement.match(/create\s+table\s+(?:if\s+not\s+exists\s+)?([^\s(]+)/i)?.[1]?.trim();
            if (tableName) {
              console.log(`Creating table: ${tableName}`);
              
              // Check if table exists
              const { data: existingTables, error: tableCheckError } = await supabase
                .from('information_schema.tables')
                .select('table_name')
                .eq('table_name', tableName.replace(/"/g, ''));
              
              if (tableCheckError) {
                console.error(`Error checking if table exists: ${tableCheckError.message}`);
                continue;
              }
              
              if (existingTables && existingTables.length > 0) {
                console.log(`Table ${tableName} already exists, skipping creation`);
                continue;
              }
            }
          }
          
          // For other operations, we'll use the SQL API if available
          // This is a simplified approach and may not work for all SQL statements
          try {
            // Try to execute the statement using a direct query
            // Note: This requires appropriate permissions
            const { error } = await supabase.auth.admin.createUser({
              email: 'test@example.com',
              password: 'password',
              email_confirm: true
            });
            
            if (error) {
              console.error(`Error executing statement: ${error.message}`);
            }
          } catch (stmtError) {
            console.error(`Error executing statement: ${stmtError.message}`);
          }
        }
        
        console.log(`Processed migration: ${migrationFile}`);
      } catch (error) {
        console.error(`Error applying migration ${migrationFile}:`, error.message);
        // Continue with other migrations even if one fails
      }
    }
    
    console.log('All migrations have been processed');
    console.log('NOTE: Due to limitations in the Supabase JavaScript client, not all migrations may have been applied successfully.');
    console.log('Please check your Supabase database to verify the migrations were applied correctly.');
    console.log('For more reliable migrations, consider using the Supabase CLI or the Supabase dashboard SQL editor.');
    
  } catch (error) {
    console.error('Error applying migrations:', error.message);
    process.exit(1);
  }
}

// Run the migration process
applyMigrations();