import { AuthForm } from '@/components/AuthForm'
import { createClient } from '@/utils/supabase/server'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {

  const resolvedSearchParams = await searchParams
  const errorMessage = resolvedSearchParams?.error

  const supabase = await createClient()
  const { data: players } = await supabase
    .from('profiles')
    .select('id, username')
    .order('username', { ascending: true })

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center p-4 selection:bg-indigo-500/30 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md bg-neutral-900/60 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8 relative z-10">
        <AuthForm errorMessage={errorMessage} players={players || []} />
      </div>
    </div>
  )
}