'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function claimPlot(plotId: number) {
  const supabase = await createClient()

  // 1. Get current user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Not authenticated' }
  }

  // 2. Find an active visit that hasn't claimed a plot yet
  const { data: visits } = await supabase
    .from('visits')
    .select('id')
    .eq('user_id', user.id)
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
    .update({ owner_id: user.id, visit_id: visitId, claimed_at: new Date().toISOString() })
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
    .eq('id', user.id)
    .single()

  const currentTier = profile?.tier || 0
  await supabase
    .from('profiles')
    .update({ tier: currentTier + 1 })
    .eq('id', user.id)

  revalidatePath('/map')
  revalidatePath('/game')
  
  return { success: true, newTier: currentTier + 1 }
}

export async function getMapState() {
  const supabase = await createClient()
  const { data: plots } = await supabase
    .from('plots')
    .select('id, owner_id')
  
  const { data: { user } } = await supabase.auth.getUser()
  
  let userTier = 0
  let canClaim = false

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('tier')
      .eq('id', user.id)
      .single()
    if (profile) userTier = profile.tier

    const { data: visits } = await supabase
      .from('visits')
      .select('id')
      .eq('user_id', user.id)
      .eq('plot_claimed', false)
      .limit(1)
    
    canClaim = visits && visits.length > 0
  }

  return { plots, currentUserId: user?.id, userTier, canClaim }
}

export async function getUserTier() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return 0
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('tier')
    .eq('id', user.id)
    .single()
    
  return profile?.tier || 0
}
