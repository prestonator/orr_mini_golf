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
    <div className="min-h-screen bg-[#d9c5a0] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')] mix-blend-multiply pointer-events-none" />

      <div className="relative w-full max-w-md bg-[#f4ecd8] border-[6px] border-double border-[#5c3a21] shadow-2xl rounded-sm p-6 sm:p-8 z-10">
        <AuthForm errorMessage={errorMessage} players={players || []} />
      </div>
    </div>
  )
}