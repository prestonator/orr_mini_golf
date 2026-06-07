'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'
import { createSessionToken } from '@/utils/auth'

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
  
  return { identity, pin }
}

export async function signInWithPin(formData: FormData) {
  const supabase = await createClient()
  const details = getAuthDetails(formData)
  if (details.error) return { error: details.error }
  
  // Find the profile
  const { data: profiles, error: selectError } = await supabase
    .from('profiles')
    .select('id, pin')
    .eq('username', details.identity)
    
  if (selectError) return { error: 'Database error' }
  if (!profiles || profiles.length === 0) return { error: 'Invalid name or PIN' }
  
  const profile = profiles[0]
  if (profile.pin !== details.pin) {
    return { error: 'Invalid name or PIN' }
  }
  
  // Generate token and set cookie
  const token = await createSessionToken(profile.id)
  const cookieStore = await cookies()
  cookieStore.set('orrgolf_auth', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  })
  
  await supabase.rpc('create_visit_for_user', { target_user_id: profile.id })
  
  revalidatePath('/', 'layout')
  redirect('/map')
}

export async function signUpWithPin(formData: FormData) {
  const supabase = await createClient()
  const details = getAuthDetails(formData)
  if (details.error) return { error: details.error }
  
  // Check if username exists
  const { data: existing } = await supabase
    .from('profiles')
    .select('id')
    .eq('username', details.identity)
    
  if (existing && existing.length > 0) {
    return { error: 'This name is already registered. Please sign in.' }
  }
  
  // Insert new profile
  const { data: profiles, error: insertError } = await supabase
    .from('profiles')
    .insert({ username: details.identity, pin: details.pin })
    .select('id')
    
  if (insertError) return { error: insertError.message }
  if (!profiles || profiles.length === 0) return { error: 'Failed to create profile' }
  
  const profileId = profiles[0].id
  
  // Generate token and set cookie
  const token = await createSessionToken(profileId)
  const cookieStore = await cookies()
  cookieStore.set('orrgolf_auth', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  })
  
  await supabase.rpc('create_visit_for_user', { target_user_id: profileId })
  
  revalidatePath('/', 'layout')
  redirect('/map')
}

export async function signOut(error?: string) {
  const cookieStore = await cookies()
  cookieStore.delete('orrgolf_auth')
  revalidatePath('/', 'layout')
  if (error) {
    redirect('/?error=' + encodeURIComponent(error))
  } else {
    redirect('/')
  }
}
