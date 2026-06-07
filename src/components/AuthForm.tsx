"use client";

import { useState, useEffect } from "react";
import { signInWithPin, signUpWithPin } from "@/app/auth/actions";
import {
  Pickaxe,
  Tent,
  ChevronLeft,
  Lock,
  UserPlus,
  Users,
  Wheat,
} from "lucide-react";

export function AuthForm({
  errorMessage,
  players = [],
}: {
  errorMessage?: string;
  players?: { id: string; username: string }[];
}) {
  const [view, setView] = useState<'home' | 'signin-list' | 'signin-pin' | 'signup'>('home');
  const [selectedUser, setSelectedUser] = useState<{ id: string; username: string } | null>(null);
  const [identity, setIdentity] = useState("");
  const [pin, setPin] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clearedGlobalError, setClearedGlobalError] = useState(false);

  const displayError = localError || (!clearedGlobalError ? errorMessage : null);

  useEffect(() => {
    if (view !== 'signin-pin' && view !== 'signup') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't capture keyboard input if they are typing in the text input for name
      if (document.activeElement?.tagName === 'INPUT') return;
      
      if (isSubmitting) return;
      if (e.key >= "0" && e.key <= "9") {
        if (pin.length < 4) {
          setPin((prev) => prev + e.key);
        }
      } else if (e.key === "Backspace") {
        setPin((prev) => prev.slice(0, -1));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [view, pin.length, isSubmitting]);

  const handlePinDigit = (digit: string) => {
    setClearedGlobalError(true);
    if (pin.length < 4) {
      setPin((prev) => prev + digit);
    }
  };

  const handleDelete = () => {
    setClearedGlobalError(true);
    setPin((prev) => prev.slice(0, -1));
  };

  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setClearedGlobalError(true);
    if (pin.length !== 4) {
      setLocalError("PIN must be 4 digits");
      return;
    }
    if (!selectedUser) return;
    
    setLocalError(null);
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("identity", selectedUser.username);
    formData.append("pin", pin);

    try {
      const res = await signInWithPin(formData);
      if (res?.error) {
        setLocalError(res.error);
        setPin("");
      }
    } catch (error) {
      setLocalError(error instanceof Error ? error.message : "An unexpected error occurred");
      setPin("");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setClearedGlobalError(true);
    if (!identity.trim()) {
      setLocalError("We need a name for the deed!");
      return;
    }
    if (pin.length !== 4) {
      setLocalError("PIN must be exactly 4 digits");
      return;
    }
    
    setLocalError(null);
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("identity", identity.trim());
    formData.append("pin", pin);

    try {
      const res = await signUpWithPin(formData);
      if (res?.error) {
        setLocalError(res.error);
        setPin("");
      }
    } catch (error) {
      setLocalError(error instanceof Error ? error.message : "An unexpected error occurred");
      setPin("");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetToHome = () => {
    setView('home');
    setSelectedUser(null);
    setPin('');
    setIdentity('');
    setLocalError(null);
    setClearedGlobalError(true);
  };

  const renderPinPad = (onBack: () => void) => (
    <>
      <div className="flex justify-center mb-6 gap-4">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`w-14 h-16 rounded-xl flex items-center justify-center text-3xl font-bold border ${
              pin.length > i
                ? "bg-[#8b3a3a] border-[#5c3a21] text-[#f4ecd8]"
                : "bg-[#fbf8f1] border-[#8c6d46] text-[#4a2e15]"
            } transition-all`}
          >
            {pin.length > i ? "•" : ""}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((digit) => (
          <button
            key={digit}
            type="button"
            disabled={isSubmitting}
            onClick={() => handlePinDigit(digit)}
            className="bg-[#5c3a21] hover:bg-[#4a2e15] disabled:opacity-50 text-[#f4ecd8] font-medium rounded-xl py-6 text-2xl transition-colors border border-[#2c1e16] active:bg-[#2c1e16] active:scale-[0.98] shadow-md"
          >
            {digit}
          </button>
        ))}
        <button
          type="button"
          disabled={isSubmitting}
          onClick={onBack}
          className="bg-[#eaddbd] hover:bg-[#d9c5a0] disabled:opacity-50 text-[#5c3a21] font-medium rounded-xl py-6 text-sm transition-colors border border-[#8c6d46] active:scale-[0.98] shadow-sm uppercase font-serif"
        >
          Back
        </button>
        <button
          type="button"
          disabled={isSubmitting}
          onClick={() => handlePinDigit("0")}
          className="bg-[#5c3a21] hover:bg-[#4a2e15] disabled:opacity-50 text-[#f4ecd8] font-medium rounded-xl py-6 text-2xl transition-colors border border-[#2c1e16] active:bg-[#2c1e16] active:scale-[0.98] shadow-md"
        >
          0
        </button>
        <button
          type="button"
          disabled={isSubmitting}
          onClick={handleDelete}
          className="bg-[#eaddbd] hover:bg-[#d9c5a0] disabled:opacity-50 text-[#5c3a21] font-medium rounded-xl py-6 text-sm transition-colors border border-[#8c6d46] active:scale-[0.98] shadow-sm uppercase font-serif"
        >
          Del
        </button>
      </div>
    </>
  );

  return (
    <>
      <div className="text-center mb-8">
        <div className="flex justify-center mb-2 text-[#5c3a21]">
          <Wheat size={32} className="mr-2" />
          <Pickaxe size={32} className="ml-2" />
        </div>
        <h2 className="text-[#8b3a3a] font-serif font-bold tracking-widest uppercase text-sm mb-1">
          Orr Family Farm
        </h2>
        <h1 className="text-[#4a2e15] font-serif text-4xl font-black uppercase tracking-tighter shadow-sm mb-2">
          Mini Golf
        </h1>
        <div className="inline-block bg-[#8b3a3a] text-[#f4ecd8] px-4 py-1 rounded-sm shadow-md border border-[#5c3a21]">
          <span className="font-serif font-bold text-sm tracking-widest uppercase">1889 Land Rush Edition</span>
        </div>
      </div>

      {/* --- VIEW: HOME --- */}
      {view === 'home' && (
        <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
          <p className="text-center text-[#5c3a21] font-serif italic mb-6">
            Stake your claim on the greens! Are you a returning settler or a new pioneer?
          </p>
          
          <button 
            onClick={() => { setView('signin-list'); setLocalError(null); setClearedGlobalError(true); }}
            className="w-full flex items-center justify-center p-4 bg-[#5c3a21] text-[#f4ecd8] hover:bg-[#4a2e15] transition-colors border-2 border-[#2c1e16] rounded shadow-md group"
          >
            <Users className="mr-3 text-[#d9c5a0] group-hover:scale-110 transition-transform" />
            <span className="font-serif text-lg tracking-wide uppercase font-bold">Find My Claim (Sign In)</span>
          </button>

          <div className="flex items-center justify-center space-x-2 my-2">
            <span className="h-px bg-[#b89b72] w-1/4"></span>
            <span className="text-[#8c6d46] font-serif text-sm uppercase">or</span>
            <span className="h-px bg-[#b89b72] w-1/4"></span>
          </div>

          <button 
            onClick={() => { setView('signup'); setLocalError(null); setClearedGlobalError(true); }}
            className="w-full flex items-center justify-center p-4 bg-[#8b3a3a] text-[#f4ecd8] hover:bg-[#6e2c2c] transition-colors border-2 border-[#4a1a1a] rounded shadow-md group"
          >
            <UserPlus className="mr-3 text-[#f4ecd8] group-hover:scale-110 transition-transform" />
            <span className="font-serif text-lg tracking-wide uppercase font-bold">Stake A Claim (Sign Up)</span>
          </button>
        </div>
      )}

      {/* --- VIEW: SIGN IN (LIST) --- */}
      {view === 'signin-list' && (
        <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between mb-4">
            <button onClick={resetToHome} className="p-2 text-[#5c3a21] hover:bg-[#eaddbd] rounded transition-colors">
              <ChevronLeft />
            </button>
            <h3 className="font-serif font-bold text-xl text-[#4a2e15] uppercase tracking-wider">Settler Registry</h3>
            <div className="w-10"></div> {/* Spacer for centering */}
          </div>
          
          <p className="text-center text-[#8c6d46] text-sm mb-4">Find your name in the land registry below.</p>
          
          <div className="max-h-64 overflow-y-auto border-2 border-[#8c6d46] bg-[#fbf8f1] rounded shadow-inner">
            <ul className="divide-y divide-[#d0b894]">
              {players.map((player) => (
                <li key={player.id}>
                  <button 
                    onClick={() => {
                      setSelectedUser(player);
                      setPin('');
                      setLocalError(null);
                      setView('signin-pin');
                    }}
                    className="w-full text-left p-4 hover:bg-[#eaddbd] text-[#4a2e15] font-serif text-lg font-medium transition-colors flex justify-between items-center group"
                  >
                    {player.username}
                    <Lock size={16} className="text-[#b89b72] group-hover:text-[#5c3a21]" />
                  </button>
                </li>
              ))}
              {players.length === 0 && (
                <li className="p-4 text-center text-[#8c6d46] italic">No claims staked yet.</li>
              )}
            </ul>
          </div>
        </div>
      )}

      {/* --- VIEW: SIGN IN (PIN) --- */}
      {view === 'signin-pin' && (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center mb-2">
            <button onClick={() => { setView('signin-list'); setLocalError(null); setPin(''); }} className="p-2 text-[#5c3a21] hover:bg-[#eaddbd] rounded transition-colors -ml-2">
              <ChevronLeft />
            </button>
          </div>

          <div className="text-center space-y-2">
            <h3 className="font-serif text-[#8b3a3a] font-bold uppercase tracking-widest text-sm">Welcome Back,</h3>
            <p className="font-serif text-[#4a2e15] text-2xl font-black uppercase tracking-tighter">{selectedUser?.username}</p>
          </div>

          <form onSubmit={handleSignInSubmit} className="space-y-6">
            <label className="block text-center text-[#5c3a21] font-serif font-bold uppercase tracking-widest text-sm mb-4">Enter Your 4-Digit PIN</label>
            
            {renderPinPad(() => { setView('signin-list'); setLocalError(null); setPin(''); })}

            {displayError && <p className="text-center text-[#8b3a3a] font-bold text-sm bg-[#f2d5d5] py-2 rounded border border-[#8b3a3a]">{displayError}</p>}

            <button 
              type="submit"
              disabled={pin.length !== 4 || isSubmitting}
              className="w-full py-4 bg-[#5c3a21] text-[#f4ecd8] disabled:bg-[#8c6d46] hover:bg-[#4a2e15] transition-colors border-2 border-[#2c1e16] rounded shadow-md font-serif text-xl tracking-wide uppercase font-bold"
            >
              Unlock Claim
            </button>
          </form>
        </div>
      )}

      {/* --- VIEW: SIGN UP --- */}
      {view === 'signup' && (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center mb-2">
            <button onClick={resetToHome} className="p-2 text-[#5c3a21] hover:bg-[#eaddbd] rounded transition-colors -ml-2">
              <ChevronLeft />
            </button>
          </div>

          <div className="text-center space-y-2">
            <Tent className="mx-auto text-[#8b3a3a] mb-2" size={40} />
            <h3 className="font-serif text-[#4a2e15] text-2xl font-black uppercase tracking-tighter">Stake Your Claim</h3>
            <p className="text-[#8c6d46] text-sm italic">Register for the Land Rush to start puttin'.</p>
          </div>

          <form onSubmit={handleSignUpSubmit} className="space-y-5">
            <div className="space-y-1 mb-4">
              <label className="block text-[#5c3a21] font-serif font-bold uppercase tracking-widest text-xs">Pioneer Name</label>
              <input 
                type="text" 
                value={identity}
                onChange={(e) => {
                  setIdentity(e.target.value);
                  setClearedGlobalError(true);
                  setLocalError(null);
                }}
                disabled={isSubmitting}
                className="w-full p-3 bg-[#fbf8f1] border-2 border-[#8c6d46] rounded text-[#4a2e15] font-serif text-lg focus:outline-none focus:border-[#8b3a3a] focus:ring-1 focus:ring-[#8b3a3a]"
                placeholder="e.g. Wyatt Earp"
                autoFocus
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[#5c3a21] font-serif font-bold uppercase tracking-widest text-xs mb-2">Create 4-Digit PIN</label>
              
              {renderPinPad(resetToHome)}
              
              <p className="text-xs text-center text-[#8c6d46] mt-2">Don't forget it! You'll need it to return.</p>
            </div>

            {displayError && <p className="text-center text-[#8b3a3a] font-bold text-sm bg-[#f2d5d5] py-2 border border-[#8b3a3a] rounded">{displayError}</p>}

            <button 
              type="submit"
              disabled={isSubmitting || pin.length !== 4 || !identity.trim()}
              className="w-full py-4 mt-2 bg-[#8b3a3a] text-[#f4ecd8] disabled:bg-[#8c6d46] hover:bg-[#6e2c2c] transition-colors border-2 border-[#4a1a1a] rounded shadow-md font-serif text-xl tracking-wide uppercase font-bold"
            >
              Register & Play
            </button>
          </form>
        </div>
      )}
    </>
  );
}
