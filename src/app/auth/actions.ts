'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function sendOtp(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string
  
  if (!email) {
    return { error: 'Email is required' }
  }

  const { error } = await supabase.auth.signInWithOtp({ email })
  
  if (error) {
    return { error: error.message }
  }
  
  return { success: true }
}

export async function verifyOtp(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string
  const otp = formData.get('otp') as string
  
  if (!email || !otp) {
    return { error: 'Email and OTP are required' }
  }

  const { data, error } = await supabase.auth.verifyOtp({ 
    email, 
    token: otp, 
    type: 'email' 
  })
  
  if (error) {
    return { error: error.message }
  }
  
  if (data.user?.id) {
    await supabase.rpc('create_visit_for_user', { target_user_id: data.user.id })
  }
  
  const fullName = data.user?.user_metadata?.full_name
  if (!fullName) {
    return { requiresName: true }
  }
  
  revalidatePath('/', 'layout')
  redirect('/map')
}

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  const fullName = formData.get('fullName') as string
  
  if (!fullName) {
    return { error: 'Full name is required' }
  }

  const { error } = await supabase.auth.updateUser({ 
    data: { full_name: fullName } 
  })
  
  if (error) {
    return { error: error.message }
  }
  
  revalidatePath('/', 'layout')
  redirect('/map')
}
