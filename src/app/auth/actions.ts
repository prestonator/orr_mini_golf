'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

function getAuthDetails(formData: FormData) {
  const identityRaw = formData.get('identity')
  const pinRaw = formData.get('pin')
  
  if (typeof identityRaw !== 'string' || typeof pinRaw !== 'string') {
    return { error: 'Identity and PIN must be valid text' }
  }
  
  const identity = identityRaw.trim()
  const pin = pinRaw.trim()
  
  if (!identity) {
    return { error: 'Identity cannot be empty' }
  }
  
  if (!/^\d{4}$/.test(pin)) {
    return { error: 'PIN must be exactly 4 digits' }
  }
  
  const email = identity.includes('@') ? identity : `${identity.toLowerCase().replace(/[^a-z0-9]+/g, '-')}@kiosk.orrgolf.com`
  const password = pin + '00'
  
  return { email, password, identity }
}

export async function signInWithPin(formData: FormData) {
  const supabase = await createClient()
  const details = getAuthDetails(formData)
  if (details.error) return { error: details.error }
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email: details.email!,
    password: details.password!
  })
  
  if (error) {
    return { error: error.message }
  }
  
  if (data.user?.id) {
    await supabase.rpc('create_visit_for_user', { target_user_id: data.user.id })
  }
  
  revalidatePath('/', 'layout')
  redirect('/map')
}

export async function signUpWithPin(formData: FormData) {
  const supabase = await createClient()
  const details = getAuthDetails(formData)
  if (details.error) return { error: details.error }
  
  const fullName = !details.identity!.includes('@') ? details.identity : undefined
  
  const { data, error } = await supabase.auth.signUp({
    email: details.email!,
    password: details.password!,
    options: {
      data: {
        full_name: fullName
      }
    }
  })
  
  if (error) {
    if (error.message.toLowerCase().includes('already registered') || error.message.toLowerCase().includes('already exists')) {
      return { error: 'This name is already registered. Please sign in.' }
    }
    return { error: error.message }
  }
  
  if (data.user?.id) {
    await supabase.rpc('create_visit_for_user', { target_user_id: data.user.id })
  }
  
  revalidatePath('/', 'layout')
  redirect('/map')
}
