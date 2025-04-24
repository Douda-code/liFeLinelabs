import { supabase } from '../lib/supabase'

/**
 * Get user's subscription status
 * @param {string} userId - The ID of the user
 * @returns {Promise} - Promise that resolves with the subscription status
 */
export const getSubscriptionStatus = async (userId) => {
  try {
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('subscription_type')
      .eq('id', userId)
      .single()

    if (userError) throw userError

    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .maybeSingle()

    if (subError) throw subError

    return {
      type: user.subscription_type,
      subscription: subscription
    }
  } catch (error) {
    console.error('Error getting subscription status:', error)
    throw error
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
 * @returns {Promise} - Promise that resolves with whether user has premium access
 */
export const hasPremiumAccess = async (userId) => {
  try {
    const { data, error } = await supabase
      .rpc('has_premium_access', { 
        user_id: userId  // Changed from p_user_id to user_id to match the function parameter
      })

    if (error) throw error

    return data
  } catch (error) {
    console.error('Error checking premium access:', error)
    return false
  }
}