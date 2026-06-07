"use client";

import { useState, useEffect } from "react";
import { signInWithPin, signUpWithPin } from "@/app/auth/actions";
import {
  Pickaxe,
  Tent,
  Map,
  ChevronLeft,
  Lock,
  UserPlus,
  Users,
  Wheat,
  Flag,
} from "lucide-react";

export function AuthForm({
  errorMessage,
  players = [],
}: {
  errorMessage?: string;
  players?: { id: string; username: string }[];
}) {
  const [step, setStep] = useState<1 | 2>(1);
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [identity, setIdentity] = useState("");
  const [pin, setPin] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clearedGlobalError, setClearedGlobalError] = useState(false);

  const displayError =
    localError || (!clearedGlobalError ? errorMessage : null);

  useEffect(() => {
    if (step !== 2) return;

    const handleKeyDown = (e: KeyboardEvent) => {
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
  }, [step, pin.length, isSubmitting]);

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setClearedGlobalError(true);
    if (!identity.trim()) {
      setLocalError("Please enter a name or email");
      return;
    }
    setLocalError(null);
    setStep(2);
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setClearedGlobalError(true);
    if (pin.length !== 4) {
      setLocalError("PIN must be 4 digits");
      return;
    }
    setLocalError(null);
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("identity", identity);
    formData.append("pin", pin);

    try {
      let res;
      if (mode === "signin") {
        res = await signInWithPin(formData);
      } else {
        res = await signUpWithPin(formData);
      }

      if (res?.error) {
        setLocalError(res.error);
        setPin("");
      }
    } catch (error) {
      setLocalError(
        error instanceof Error ? error.message : "An unexpected error occurred",
      );
      setPin("");
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <span className="font-serif font-bold text-sm tracking-widest uppercase">
            1889 Land Rush Edition
          </span>
        </div>
        <p className="text-lg text-neutral-400 mt-4">
          {step === 1 ? "Enter your name or email" : "Enter your 4-digit PIN"}
        </p>
      </div>

      {displayError && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-lg text-center">
          {displayError}
        </div>
      )}

      {step === 1 && (
        <form
          onSubmit={handleNext}
          className="space-y-6 flex flex-col group animate-in fade-in zoom-in-95 duration-200"
        >
          <div className="flex bg-neutral-900 rounded-xl p-1 mb-2 border border-white/5">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => setMode("signin")}
              className={`flex-1 py-3 text-sm font-medium rounded-lg transition-all ${
                mode === "signin"
                  ? "bg-neutral-800 text-white shadow-sm"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => setMode("signup")}
              className={`flex-1 py-3 text-sm font-medium rounded-lg transition-all ${
                mode === "signup"
                  ? "bg-neutral-800 text-white shadow-sm"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              Sign Up
            </button>
          </div>

          {mode === "signup" ? (
            <>
              <div className="space-y-2">
                <label
                  className="text-sm font-medium text-neutral-300 ml-1"
                  htmlFor="identity"
                >
                  Name or Email
                </label>
                <input
                  id="identity"
                  type="text"
                  value={identity}
                  onChange={(e) => setIdentity(e.target.value)}
                  placeholder="e.g. John Doe or john@example.com"
                  required
                  disabled={isSubmitting}
                  className="w-full bg-neutral-950/50 border border-white/10 rounded-xl px-4 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-neutral-600 disabled:opacity-50"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-indigo-500 hover:bg-indigo-600 disabled:bg-neutral-800 disabled:text-neutral-500 text-white font-medium rounded-xl px-4 py-4 text-lg transition-colors focus:ring-2 focus:ring-indigo-500/50 focus:outline-none active:scale-[0.98]"
              >
                Continue
              </button>
            </>
          ) : (
            <div className="grid grid-cols-2 gap-3 max-h-[300px] overflow-y-auto">
              {players.map((player) => (
                <button
                  key={player.id}
                  type="button"
                  onClick={() => {
                    setClearedGlobalError(true);
                    setLocalError(null);
                    setIdentity(player.username);
                    setStep(2);
                  }}
                  className="bg-[#fbf8f1] backdrop-blur-md border border-white/10 hover:bg-[#eaddbd] text-[#4a2e15] p-4 rounded-xl text-left transition-colors font-serif"
                >
                  <div className="font-medium truncate">{player.username}</div>
                </button>
              ))}
            </div>
          )}
        </form>
      )}

      {step === 2 && (
        <form
          onSubmit={handleSubmit}
          className="space-y-6 flex flex-col group animate-in fade-in zoom-in-95 duration-200"
        >
          <div className="flex justify-center mb-6 gap-4">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`w-14 h-16 rounded-xl flex items-center justify-center text-3xl font-bold border ${
                  pin.length > i
                    ? "bg-indigo-500/20 border-indigo-500/50 text-white"
                    : "bg-neutral-950/50 border-white/10 text-neutral-600"
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
                className="bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 text-white font-medium rounded-xl py-6 text-2xl transition-colors border border-white/5 active:bg-neutral-700 active:scale-[0.98]"
              >
                {digit}
              </button>
            ))}
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => {
                setStep(1);
                setPin("");
              }}
              className="bg-neutral-900/50 hover:bg-neutral-800 disabled:opacity-50 text-neutral-400 font-medium rounded-xl py-6 text-sm transition-colors border border-transparent active:scale-[0.98]"
            >
              Back
            </button>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handlePinDigit("0")}
              className="bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 text-white font-medium rounded-xl py-6 text-2xl transition-colors border border-white/5 active:bg-neutral-700 active:scale-[0.98]"
            >
              0
            </button>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleDelete}
              className="bg-neutral-900/50 hover:bg-neutral-800 disabled:opacity-50 text-neutral-400 font-medium rounded-xl py-6 text-sm transition-colors border border-transparent active:scale-[0.98]"
            >
              Del
            </button>
          </div>

          <button
            type="submit"
            disabled={pin.length !== 4 || isSubmitting}
            className="w-full bg-indigo-500 disabled:bg-neutral-800 disabled:text-neutral-500 hover:bg-indigo-600 text-white font-medium rounded-xl px-4 py-4 text-lg transition-colors focus:ring-2 focus:ring-indigo-500/50 focus:outline-none active:scale-[0.98]"
          >
            {mode === "signin" ? "Sign In" : "Sign Up"}
          </button>
        </form>
      )}
    </>
  );
}
