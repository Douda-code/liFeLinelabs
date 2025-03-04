import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase, ROLES } from '../lib/supabase'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const loading = ref(true)
  const error = ref(null)

  const isAuthenticated = computed(() => !!user.value)
  const isAdmin = computed(() => user.value?.role === ROLES.ADMIN)
  const isPhysician = computed(() => user.value?.role === ROLES.PHYSICIAN)
  const isPatient = computed(() => user.value?.role === ROLES.PATIENT)

  async function loadUser() {
    try {
      loading.value = true
      error.value = null
      
      const { data: { user: authUser } } = await supabase.auth.getUser()
      
      if (authUser) {
        // For demo purposes, create a mock user based on email
        if (authUser.email === 'admin@example.com') {
          user.value = {
            id: authUser.id,
            email: authUser.email,
            first_name: 'Admin',
            last_name: 'User',
            name: 'Admin User',
            role: ROLES.ADMIN,
            status: 'Active'
          }
        } else {
          // Try to get user data from the users table
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', authUser.id)
            .maybeSingle() // Use maybeSingle instead of single to avoid 406 error
          
          if (userData) {
            // If user exists in the database, use that data
            user.value = {
              ...userData,
              name: `${userData.first_name} ${userData.last_name}`.trim()
            }
          } else {
            // Fallback to auth metadata if user not in database
            user.value = {
              id: authUser.id,
              email: authUser.email,
              first_name: authUser.user_metadata?.first_name || 'User',
              last_name: authUser.user_metadata?.last_name || '',
              name: `${authUser.user_metadata?.first_name || 'User'} ${authUser.user_metadata?.last_name || ''}`.trim(),
              role: ROLES.PATIENT,
              status: 'Active'
            }
          }
        }
      } else {
        user.value = null
      }
    } catch (err) {
      console.error('Error loading user:', err)
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  // For demo purposes
  function setMockUser(role = 'patient') {
    let mockRole = ROLES.PATIENT
    if (role === 'Admin') mockRole = ROLES.ADMIN
    if (role === 'Physician') mockRole = ROLES.PHYSICIAN
    
    // Use a valid UUID format for mock users
    const mockId = role === 'Admin' 
      ? '00000000-0000-0000-0000-000000000005'  // Admin mock UUID
      : '00000000-0000-0000-0000-000000000001'; // Patient mock UUID
    
    user.value = {
      id: mockId,
      email: role === 'Admin' ? 'admin@example.com' : 'user@example.com',
      first_name: role === 'Admin' ? 'Admin' : 'John',
      last_name: role === 'Admin' ? 'User' : 'Doe',
      name: role === 'Admin' ? 'Admin User' : 'John Doe',
      role: mockRole,
      status: 'Active'
    }
  }

  async function signUp(email, password, userData) {
    try {
      loading.value = true
      error.value = null
      
      // First, create the auth user
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: userData.firstName,
            last_name: userData.lastName
          }
        }
      })

      if (signUpError) throw signUpError

      // If signup is successful, insert user data into users table
      if (data?.user) {
        try {
          const { error: insertError } = await supabase
            .from('users')
            .insert([
              {
                id: data.user.id,
                email: email,
                first_name: userData.firstName,
                last_name: userData.lastName,
                phone: userData.phone || null,
                role: 'patient',
                status: 'Active'
              }
            ])
          
          if (insertError) {
            console.error('Error creating user record:', insertError)
            throw insertError
          }
          
          // Set user data
          user.value = {
            id: data.user.id,
            email: email,
            first_name: userData.firstName,
            last_name: userData.lastName,
            name: `${userData.firstName} ${userData.lastName}`.trim(),
            phone: userData.phone || null,
            role: 'patient',
            status: 'Active'
          }
        } catch (insertErr) {
          console.error('Failed to create user record:', insertErr)
          // Continue even if insert fails, using auth data only
          user.value = {
            id: data.user.id,
            email: email,
            first_name: userData.firstName,
            last_name: userData.lastName,
            name: `${userData.firstName} ${userData.lastName}`.trim(),
            phone: userData.phone || null,
            role: 'patient',
            status: 'Active'
          }
        }
      }

      return { data, error: null }
    } catch (err) {
      console.error('Error signing up:', err)
      error.value = err.message
      return { data: null, error: err }
    } finally {
      loading.value = false
    }
  }

  async function signIn(email, password) {
    try {
      loading.value = true
      error.value = null
      
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (signInError) throw signInError

      if (data?.user) {
        // For demo purposes, create a mock user based on email
        if (email === 'admin@example.com') {
          user.value = {
            id: data.user.id,
            email: data.user.email,
            first_name: 'Admin',
            last_name: 'User',
            name: 'Admin User',
            role: ROLES.ADMIN,
            status: 'Active'
          }
        } else {
          // Try to get user data from the users table
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', data.user.id)
            .maybeSingle() // Use maybeSingle instead of single
          
          if (userData) {
            // If user exists in the database, use that data
            user.value = {
              ...userData,
              name: `${userData.first_name} ${userData.last_name}`.trim()
            }
          } else {
            // Fallback to auth metadata
            user.value = {
              id: data.user.id,
              email: data.user.email,
              first_name: data.user.user_metadata?.first_name || 'User',
              last_name: data.user.user_metadata?.last_name || '',
              name: `${data.user.user_metadata?.first_name || 'User'} ${data.user.user_metadata?.last_name || ''}`.trim(),
              role: ROLES.PATIENT,
              status: 'Active'
            }
          }
        }
      }

      return { data, error: null }
    } catch (err) {
      console.error('Error signing in:', err)
      error.value = err.message
      return { data: null, error: err }
    } finally {
      loading.value = false
    }
  }

  async function signOut() {
    try {
      loading.value = true
      error.value = null
      
      // Create audit log for logout - commented out due to RLS issues
      /*
      if (user.value) {
        try {
          await supabase.rpc('create_audit_log', {
            p_user_id: user.value.id,
            p_event_type: 'Logout',
            p_description: 'User logged out',
            p_ip_address: null,
            p_user_agent: navigator.userAgent
          })
        } catch (logError) {
          console.error('Error creating logout audit log:', logError)
        }
      }
      */
      
      const { error: signOutError } = await supabase.auth.signOut()
      
      if (signOutError) throw signOutError
      
      user.value = null
    } catch (err) {
      console.error('Error signing out:', err)
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  async function updateProfile(updates) {
    try {
      loading.value = true
      error.value = null
      
      // Update user data in the database if the user exists
      if (user.value) {
        const { error: updateDbError } = await supabase
          .from('users')
          .update(updates)
          .eq('id', user.value.id)
        
        if (updateDbError) {
          console.error('Error updating user in database:', updateDbError)
        }
        
        // Update local user data
        user.value = {
          ...user.value,
          ...updates,
          name: `${updates.first_name || user.value.first_name} ${updates.last_name || user.value.last_name}`.trim()
        }
      }
      
      // Update user metadata in auth
      const { error: updateError } = await supabase.auth.updateUser({
        data: updates
      })

      if (updateError) throw updateError

      return { error: null }
    } catch (err) {
      console.error('Error updating profile:', err)
      error.value = err.message
      return { error: err }
    } finally {
      loading.value = false
    }
  }

  // Reset password
  async function resetPassword(email) {
    try {
      loading.value = true
      error.value = null
      
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email)
      
      if (resetError) throw resetError
      
      return { error: null }
    } catch (err) {
      console.error('Error resetting password:', err)
      error.value = err.message
      return { error: err }
    } finally {
      loading.value = false
    }
  }

  // Update password
  async function updatePassword(password) {
    try {
      loading.value = true
      error.value = null
      
      const { error: updateError } = await supabase.auth.updateUser({
        password
      })
      
      if (updateError) throw updateError
      
      return { error: null }
    } catch (err) {
      console.error('Error updating password:', err)
      error.value = err.message
      return { error: err }
    } finally {
      loading.value = false
    }
  }

  // Initialize auth state listener
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN' && session) {
      loadUser()
    } else if (event === 'SIGNED_OUT') {
      user.value = null
    }
  })

  // Initialize user on store creation
  loadUser()

  return {
    user,
    loading,
    error,
    isAuthenticated,
    isAdmin,
    isPhysician,
    isPatient,
    signUp,
    signIn,
    signOut,
    updateProfile,
    resetPassword,
    updatePassword,
    loadUser,
    setMockUser
  }
})