import Image from "next/image";
import GolfScene from "@/components/GolfScene";

export default function Home() {
  const stack = [
    { name: "Next.js", version: "16.2.6", type: "Framework", icon: "🌐" },
    { name: "React", version: "19.2.4", type: "Core library", icon: "⚛️" },
    { name: "Three.js", version: "^0.184.0", type: "3D Engine", icon: "📐" },
    { name: "@react-three/fiber", version: "^9.6.1", type: "R3F Wrapper", icon: "🌿" },
    { name: "@react-three/drei", version: "^10.7.7", type: "R3F Helpers", icon: "📦" },
    { name: "@react-spring/three", version: "^10.1.0", type: "3D Physics Springs", icon: "💫" },
    { name: "Tailwind CSS", version: "^4.0.0", type: "Styling Engine", icon: "🎨" },
    { name: "TypeScript", version: "^5.0.0", type: "Type Safety", icon: "🛡️" },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 font-sans selection:bg-emerald-500/30 selection:text-emerald-500 flex flex-col">
      {/* Premium Header */}
      <header className="border-b border-zinc-200/80 dark:border-zinc-900 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-xl sticky top-0 z-50 transition-colors">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-linear-to-tr from-emerald-500 to-teal-400 flex items-center justify-center font-black text-white text-base shadow-lg shadow-emerald-500/20">
              O
            </div>
            <span className="text-lg font-bold tracking-tight bg-linear-to-r from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-400 bg-clip-text text-transparent">
              OrrGolf <span className="text-emerald-500 font-medium">3D Suite</span>
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              Fully Configured
            </span>
          </div>
        </div>
      </header>

      {/* Main Page Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-12 flex flex-col gap-12">
        {/* Intro Hero Section */}
        <div className="flex flex-col gap-4 max-w-3xl">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-none bg-linear-to-r from-zinc-950 via-zinc-800 to-zinc-600 dark:from-white dark:via-zinc-100 dark:to-zinc-500 bg-clip-text text-transparent">
            Next.js 3D Sandbox <br className="hidden sm:inline" />
            Initialized Successfully.
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl mt-2">
            Welcome to your fully configured 3D workspace. We have successfully setup 
            <strong className="text-zinc-900 dark:text-white font-semibold"> React 19</strong>, 
            <strong className="text-zinc-900 dark:text-white font-semibold"> Next.js 16 (App Router)</strong>, 
            and your complete 3D graphics stack: 
            <code className="bg-zinc-100 dark:bg-zinc-900 px-1.5 py-0.5 rounded text-sm text-emerald-500 font-semibold mx-1">Three.js</code>, 
            <code className="bg-zinc-100 dark:bg-zinc-900 px-1.5 py-0.5 rounded text-sm text-emerald-500 font-semibold mx-1">React Three Fiber</code>, 
            <code className="bg-zinc-100 dark:bg-zinc-900 px-1.5 py-0.5 rounded text-sm text-emerald-500 font-semibold mx-1">Drei</code>, and 
            <code className="bg-zinc-100 dark:bg-zinc-900 px-1.5 py-0.5 rounded text-sm text-emerald-500 font-semibold mx-1">React Spring</code>.
          </p>
        </div>

        {/* 3D Showcase Component */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
              <span>🎮</span> 3D Scene Verification Preview
            </h2>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 font-mono">
              src/components/GolfScene.tsx
            </p>
          </div>
          <GolfScene />
        </section>

        {/* Tech Stack Cards */}
        <section className="flex flex-col gap-6">
          <div className="flex flex-col gap-1.5">
            <h2 className="text-xl font-bold tracking-tight text-zinc-800 dark:text-zinc-200">
              🛠️ Installed Core Stack & Dependencies
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Verified packages installed and loaded in package.json.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stack.map((pkg) => (
              <div 
                key={pkg.name}
                className="bg-white dark:bg-zinc-900/40 p-5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/60 shadow-xs hover:border-emerald-500/30 hover:shadow-md dark:hover:border-emerald-500/20 transition-all group"
              >
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 flex items-center justify-center text-lg group-hover:scale-110 transition-transform">
                    {pkg.icon}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                    {pkg.type}
                  </span>
                </div>
                <div className="mt-4">
                  <h3 className="font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-500 transition-colors">
                    {pkg.name}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-xs font-mono bg-zinc-100 dark:bg-zinc-800/80 px-2 py-0.5 rounded text-zinc-600 dark:text-zinc-400 border border-zinc-200/30 dark:border-zinc-700/30">
                      {pkg.version}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium">Active</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Development Instructions */}
        <section className="bg-white dark:bg-zinc-900/30 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/60 p-6 md:p-8 flex flex-col gap-6">
          <div className="flex flex-col gap-1.5">
            <h2 className="text-xl font-bold tracking-tight text-zinc-800 dark:text-zinc-200">
              🚀 Next Steps For Your 3D App
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Run local dev tasks and start editing to construct your core business logic.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-3">
              <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-sm flex items-center gap-2">
                <span className="w-5 h-5 rounded bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-xs font-mono font-bold">1</span>
                Start the Local Development Server
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 pl-7 leading-relaxed">
                Fire up the Next.js development server to inspect any modifications locally in real-time.
              </p>
              <div className="pl-7">
                <code className="block bg-zinc-950 text-emerald-400 px-4 py-3 rounded-xl font-mono text-xs border border-zinc-850 shadow-inner select-all">
                  npm run dev
                </code>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-sm flex items-center gap-2">
                <span className="w-5 h-5 rounded bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-xs font-mono font-bold">2</span>
                Run an Initial Production Build
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 pl-7 leading-relaxed">
                Test and verify the production bundle compilation to confirm compilation and tree-shaking stability.
              </p>
              <div className="pl-7">
                <code className="block bg-zinc-950 text-emerald-400 px-4 py-3 rounded-xl font-mono text-xs border border-zinc-850 shadow-inner select-all">
                  npm run build
                </code>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-zinc-200/80 dark:border-zinc-900/60 bg-white/40 dark:bg-zinc-950/40 py-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 dark:text-zinc-400">
          <div>
            Built with 💚 and Advanced Agentic Coding by <span className="font-semibold text-zinc-700 dark:text-zinc-300">Antigravity</span>.
          </div>
          <div className="flex gap-4">
            <a href="https://nextjs.org" target="_blank" className="hover:text-emerald-500 transition-colors">NextJS Docs</a>
            <a href="https://threejs.org" target="_blank" className="hover:text-emerald-500 transition-colors">ThreeJS Docs</a>
            <a href="https://docs.pmnd.rs" target="_blank" className="hover:text-emerald-500 transition-colors">Poimandres Docs</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
