import { supabase } from '../lib/supabase'

/**
 * Get user's subscription status
 * @param {string} userId - The ID of the user
 * @returns {Promise} - Promise that resolves with the subscription status
 */
export const getSubscriptionStatus = async (userId) => {
  try {
    // First check if the user exists
    const { data: user, error: userError } = await supabase.auth.getUser()
    
    if (userError) {
      console.error('Error getting user:', userError)
      throw userError
    }
    
    if (!user) {
      throw new Error('User not found')
    }
    
    // Get user subscription type from users table
    const { data: userData, error: userDataError } = await supabase
      .from('users')
      .select('subscription_type, id')
      .eq('id', userId || user.user.id)
      .maybeSingle()

    if (userDataError) {
      console.error('Error getting user data:', userDataError)
      throw userDataError
    }
    
    // If user data not found, return default
    if (!userData) {
      return {
        type: 'standard',
        subscription: null
      }
    }

    // Get active subscription
    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .maybeSingle()

    if (subError) {
      console.error('Error getting subscription:', subError)
      // Continue even if subscription query fails
    }

    return {
      type: userData.subscription_type || 'standard',
      subscription: subscription
    }
  } catch (error) {
    console.error('Error getting subscription status:', error)
    // Return default values instead of throwing
    return {
      type: 'standard',
      subscription: null,
      error: error.message
    }
  }
}

/**
 * Add payment method
 * @param {string} userId - The ID of the user
 * @param {object} cardDetails - The card details
 * @returns {Promise} - Promise that resolves with the payment method
 */
export const addPaymentMethod = async (userId, cardDetails) => {
  try {
    const { data, error } = await supabase
      .from('payment_methods')
      .insert([{
        user_id: userId,
        card_last4: cardDetails.last4,
        card_brand: cardDetails.brand,
        card_exp_month: cardDetails.exp_month,
        card_exp_year: cardDetails.exp_year,
        is_default: true
      }])
      .select()
      .single()

    if (error) throw error

    return data
  } catch (error) {
    console.error('Error adding payment method:', error)
    throw error
  }
}

/**
 * Update user's subscription
 * @param {string} userId - The ID of the user
 * @param {string} planType - The type of plan
 * @returns {Promise} - Promise that resolves when the subscription is updated
 */
export const updateSubscription = async (userId, planType) => {
  try {
    // Start transaction
    const { data, error } = await supabase.rpc('begin_transaction')

    // Update user's subscription type
    const { error: userError } = await supabase
      .from('users')
      .update({ subscription_type: planType })
      .eq('id', userId)

    if (userError) throw userError

    // Create subscription record
    const { error: subError } = await supabase
      .from('subscriptions')
      .insert([{
        user_id: userId,
        plan_type: planType,
        status: 'active',
        current_period_start: new Date(),
        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
      }])

    if (subError) throw subError

    return { success: true }
  } catch (error) {
    console.error('Error updating subscription:', error)
    throw error
  }
}

/**
 * Check if user has premium access
 * @param {string} userId - The ID of the user
 * @returns {Promise<boolean>} - Promise that resolves with whether user has premium access
 */
export const hasPremiumAccess = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('subscription_type')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Error checking subscription type:', error)
      return false
    }
    
    // Check if user has premium or family subscription
    const isPremium = data?.subscription_type === 'premium' || data?.subscription_type === 'family'
    
    // If not premium by subscription_type, check active subscriptions
    if (!isPremium) {
      const { data: subscriptionData, error: subscriptionError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .maybeSingle()
      
      if (subscriptionError) {
        console.error('Error checking active subscriptions:', subscriptionError)
        return false
      }
      
      // Check if there's an active subscription that hasn't expired
      if (subscriptionData && new Date(subscriptionData.current_period_end) > new Date()) {
        return true
      }
      
      return false
    }

    return isPremium
  } catch (error) {
    console.error('Error checking premium access:', error)
    return false
  }
}
