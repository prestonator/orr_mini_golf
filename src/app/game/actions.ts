'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath, unstable_noStore as noStore } from 'next/cache'
import { cookies } from 'next/headers'
import { verifySessionToken } from '@/utils/auth'

async function getUserId() {
  const cookieStore = await cookies()
  const token = cookieStore.get('orrgolf_auth')?.value
  const payload = token ? await verifySessionToken(token) : null
  return payload?.sub as string | undefined
}

export async function claimPlot(plotId: number) {
  const supabase = await createClient()

  // 1. Get current user
  const userId = await getUserId()
  if (!userId) {
    return { error: 'Not authenticated' }
  }

  // 2. Find an active visit that hasn't claimed a plot yet
  const { data: visits } = await supabase
    .from('visits')
    .select('id')
    .eq('user_id', userId)
    .eq('plot_claimed', false)
    .order('visit_date', { ascending: false })
    .limit(1)

  if (!visits || visits.length === 0) {
    return { error: 'No available claims for this visit. Please check in again to claim another plot.' }
  }

  const visitId = visits[0].id

  // 3. Check if plot is already owned
  const { data: plot } = await supabase
    .from('plots')
    .select('owner_id')
    .eq('id', plotId)
    .single()

  if (plot?.owner_id) {
    return { error: 'Plot is already claimed by someone else.' }
  }

  // 4. Claim the plot
  const { error: plotError } = await supabase
    .from('plots')
    .update({ owner_id: userId, visit_id: visitId, claimed_at: new Date().toISOString() })
    .eq('id', plotId)

  if (plotError) {
    return { error: 'Failed to claim plot.' }
  }

  // 5. Mark visit as claimed
  await supabase
    .from('visits')
    .update({ plot_claimed: true })
    .eq('id', visitId)

  // 6. Increment user tier in profiles
  const { data: profile } = await supabase
    .from('profiles')
    .select('tier')
    .eq('id', userId)
    .single()

  const currentTier = profile?.tier || 0
  await supabase
    .from('profiles')
    .update({ tier: currentTier + 1 })
    .eq('id', userId)

  revalidatePath('/map')
  revalidatePath('/game')
  
  return { success: true, newTier: currentTier + 1 }
}

export async function getMapState() {
  noStore()
  const supabase = await createClient()
  const { data: plots, error } = await supabase
    .from('plots')
    .select('id, owner_id, profiles(full_name, color)')
    .not('owner_id', 'is', null)

  if (error) {
    console.error("Supabase getMapState error:", error)
  }
  
  const userId = await getUserId()
  
  let userTier = 0
  let canClaim = false
  let myProfile = null

  if (userId) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('tier, username, color')
      .eq('id', userId)
      .single()
    if (profile) {
      userTier = profile.tier
      myProfile = { ...profile, full_name: profile.username }
    }

    const { data: visits } = await supabase
      .from('visits')
      .select('id')
      .eq('user_id', userId)
      .eq('plot_claimed', false)
      .limit(1)
    
    canClaim = !!visits && visits.length > 0
  }

  return { plots, currentUserId: userId, userTier, canClaim, myProfile }
}

export async function getUserTier() {
  const userId = await getUserId()
  if (!userId) return 0
  
  const supabase = await createClient()
  const { data: profile } = await supabase
    .from('profiles')
    .select('tier')
    .eq('id', userId)
    .single()
    
  return profile?.tier || 0
}
