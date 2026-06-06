'use client'

import { useState } from 'react'
import { sendOtp, verifyOtp, updateProfile } from '@/app/auth/actions'

export function AuthForm({ errorMessage }: { errorMessage?: string }) {
  const [view, setView] = useState<'email' | 'otp' | 'profile'>('email')
  const [email, setEmail] = useState('')
  const [localError, setLocalError] = useState<string | null>(null)
  
  const displayError = localError || errorMessage

  async function handleSendOtp(formData: FormData) {
    setLocalError(null)
    const emailVal = formData.get('email') as string
    if (!emailVal) return
    
    setEmail(emailVal)
    const res = await sendOtp(formData)
    
    if (res?.error) {
      setLocalError(res.error)
    } else if (res?.success) {
      setView('otp')
    }
  }

  async function handleVerifyOtp(formData: FormData) {
    setLocalError(null)
    const res = await verifyOtp(formData)
    
    if (res?.error) {
      setLocalError(res.error)
    } else if (res?.requiresName) {
      setView('profile')
    }
  }

  async function handleUpdateProfile(formData: FormData) {
    setLocalError(null)
    const res = await updateProfile(formData)
    
    if (res?.error) {
      setLocalError(res.error)
    }
  }

  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-2">
          Welcome to OrrGolf
        </h1>
        <p className="text-lg text-neutral-400">
          {view === 'email' ? 'Enter your email to claim your plot' : 
           view === 'otp' ? 'Enter the code sent to your email' : 
           'Complete your profile'}
        </p>
      </div>

      {displayError && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-lg text-center">
          {displayError}
        </div>
      )}

      {view === 'email' && (
        <form action={handleSendOtp} className="space-y-6 flex flex-col group animate-in fade-in zoom-in-95 duration-200">
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-300 ml-1" htmlFor="email">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              className="w-full bg-neutral-950/50 border border-white/10 rounded-xl px-4 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-neutral-600"
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-xl px-4 py-4 text-lg transition-colors focus:ring-2 focus:ring-indigo-500/50 focus:outline-none active:scale-[0.98]"
          >
            Send Login Code
          </button>
        </form>
      )}

      {view === 'otp' && (
        <form action={handleVerifyOtp} className="space-y-6 flex flex-col group animate-in fade-in zoom-in-95 duration-200">
          <input type="hidden" name="email" value={email} />
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-300 ml-1" htmlFor="otp">One-Time Password</label>
            <input
              id="otp"
              name="otp"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete="one-time-code"
              placeholder="000000"
              required
              className="w-full bg-neutral-950/50 border border-white/10 rounded-xl px-4 py-4 text-2xl tracking-widest text-center focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-neutral-600"
            />
          </div>
          
          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={() => setView('email')}
              className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-white font-medium rounded-xl px-4 py-4 text-lg transition-colors border border-white/5 focus:ring-2 focus:ring-neutral-500/50 focus:outline-none active:scale-[0.98]"
            >
              Back
            </button>
            <button
              type="submit"
              className="flex-[2] bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-xl px-4 py-4 text-lg transition-colors focus:ring-2 focus:ring-indigo-500/50 focus:outline-none active:scale-[0.98]"
            >
              Verify Code
            </button>
          </div>
        </form>
      )}

      {view === 'profile' && (
        <form action={handleUpdateProfile} className="space-y-6 flex flex-col group animate-in fade-in zoom-in-95 duration-200">
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-300 ml-1" htmlFor="fullName">Full Name</label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              placeholder="John Doe"
              required
              className="w-full bg-neutral-950/50 border border-white/10 rounded-xl px-4 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-neutral-600"
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-xl px-4 py-4 text-lg transition-colors focus:ring-2 focus:ring-indigo-500/50 focus:outline-none active:scale-[0.98]"
          >
            Complete Profile
          </button>
        </form>
      )}
    </>
  )
}
