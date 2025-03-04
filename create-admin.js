import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env file')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Function to promote a user to admin
async function promoteToAdmin(email) {
  try {
    // First, find the user by email
    const { data: users, error: findError } = await supabase
      .from('users')
      .select('id, email, role')
      .eq('email', email)
      .single()
    
    if (findError) {
      console.error('Error finding user:', findError.message)
      return
    }
    
    if (!users) {
      console.error(`No user found with email: ${email}`)
      return
    }
    
    console.log(`Found user: ${users.email} (current role: ${users.role})`)
    
    // Update the user's role to admin
    const { error: updateError } = await supabase
      .from('users')
      .update({ role: 'admin' })
      .eq('id', users.id)
    
    if (updateError) {
      console.error('Error updating user role:', updateError.message)
      return
    }
    
    console.log(`Successfully promoted ${email} to admin role!`)
  } catch (error) {
    console.error('Unexpected error:', error.message)
  }
}

// Get email from command line arguments
const email = process.argv[2]

if (!email) {
  console.error('Please provide an email address: node create-admin.js user@example.com')
  process.exit(1)
}

promoteToAdmin(email)