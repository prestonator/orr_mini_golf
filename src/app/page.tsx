import { login, signup, signInWithGoogle } from './auth/actions'
import Image from 'next/image'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const resolvedSearchParams = await searchParams
  const errorMessage = resolvedSearchParams?.error

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center p-4 selection:bg-indigo-500/30 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md bg-neutral-900/60 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8 relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-2">
            Welcome to OrrGolf
          </h1>
          <p className="text-sm text-neutral-400">Sign in to start playing</p>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
            {errorMessage}
          </div>
        )}

        <form className="space-y-4 flex flex-col group">
          <div className="space-y-1">
            <label className="text-xs font-medium text-neutral-300 ml-1" htmlFor="fullName">Full Name</label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              placeholder="John Doe"
              className="w-full bg-neutral-950/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-neutral-600"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-neutral-300 ml-1" htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              className="w-full bg-neutral-950/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-neutral-600"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-neutral-300 ml-1" htmlFor="phoneNumber">Phone Number</label>
            <input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              placeholder="+1 234 567 8900"
              className="w-full bg-neutral-950/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-neutral-600"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-neutral-300 ml-1" htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              className="w-full bg-neutral-950/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-neutral-600"
            />
          </div>

          <div className="pt-4 flex gap-3">
            <button
              formAction={login}
              className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-xl px-4 py-3 text-sm transition-colors focus:ring-2 focus:ring-indigo-500/50 focus:outline-none active:scale-[0.98]"
            >
              Log in
            </button>
            <button
              formAction={signup}
              className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-white font-medium rounded-xl px-4 py-3 text-sm transition-colors border border-white/5 focus:ring-2 focus:ring-neutral-500/50 focus:outline-none active:scale-[0.98]"
            >
              Sign up
            </button>
          </div>
        </form>

        <div className="mt-8 relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-neutral-900/60 px-4 text-neutral-400 backdrop-blur-xl">Or continue with</span>
          </div>
        </div>

        <div className="mt-6">
          <form action={signInWithGoogle}>
            <button className="w-full flex items-center justify-center gap-3 bg-white hover:bg-neutral-100 text-black font-medium rounded-xl px-4 py-3 text-sm transition-colors active:scale-[0.98]">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.66 15.63 16.88 16.81 15.69 17.61V20.36H19.26C21.35 18.43 22.56 15.6 22.56 12.25Z" fill="#4285F4"/>
                <path d="M12 23C14.97 23 17.46 22.02 19.26 20.36L15.69 17.61C14.71 18.27 13.46 18.66 12 18.66C9.17 18.66 6.78 16.75 5.92 14.18H2.22V17.06C4.02 20.64 7.7 23 12 23Z" fill="#34A853"/>
                <path d="M5.92 14.18C5.7 13.52 5.57 12.78 5.57 12C5.57 11.22 5.7 10.48 5.92 9.82V6.94H2.22C1.47 8.44 1.05 10.17 1.05 12C1.05 13.83 1.47 15.56 2.22 17.06L5.92 14.18Z" fill="#FBBC05"/>
                <path d="M12 5.34C13.62 5.34 15.07 5.9 16.22 6.99L19.34 3.87C17.46 2.12 14.97 1.05 12 1.05C7.7 1.05 4.02 3.36 2.22 6.94L5.92 9.82C6.78 7.25 9.17 5.34 12 5.34Z" fill="#EA4335"/>
              </svg>
              Google
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}