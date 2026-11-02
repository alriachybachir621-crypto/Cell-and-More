import React, { useState, useEffect } from 'react';
import { Lock, ArrowRight, AlertCircle, Clock, Loader2 } from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebase/config';

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

const ADMIN_EMAIL = 'admin@cellandmore.app';
const LOCK_DURATION_SECONDS = 60;
const MAX_FAILED_ATTEMPTS = 5;

const STORAGE_ATTEMPTS_KEY = 'cm_admin_failed_attempts';
const STORAGE_LOCKOUT_KEY = 'cm_admin_lockout_until';

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess }) => {
  const [accessCode, setAccessCode] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState<number>(0);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(0);

  // Initialize lockout state from localStorage
  useEffect(() => {
    const savedAttempts = parseInt(localStorage.getItem(STORAGE_ATTEMPTS_KEY) || '0', 10);
    const lockoutUntil = parseInt(localStorage.getItem(STORAGE_LOCKOUT_KEY) || '0', 10);
    const now = Date.now();

    if (lockoutUntil > now) {
      const rem = Math.ceil((lockoutUntil - now) / 1000);
      setSecondsRemaining(rem);
      setFailedAttempts(MAX_FAILED_ATTEMPTS);
    } else {
      setFailedAttempts(savedAttempts);
    }
  }, []);

  // Lockout countdown timer
  useEffect(() => {
    if (secondsRemaining <= 0) return;

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          localStorage.removeItem(STORAGE_LOCKOUT_KEY);
          localStorage.removeItem(STORAGE_ATTEMPTS_KEY);
          setFailedAttempts(0);
          setErrorMessage(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsRemaining]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (secondsRemaining > 0 || loading) return;

    setErrorMessage(null);
    setLoading(true);

    try {
      // Use Firebase Auth with fixed hidden email and the user's access code
      await signInWithEmailAndPassword(auth, ADMIN_EMAIL, accessCode);
      // Reset failed attempts on success
      localStorage.removeItem(STORAGE_ATTEMPTS_KEY);
      localStorage.removeItem(STORAGE_LOCKOUT_KEY);
      onLoginSuccess();
    } catch (err: any) {
      console.warn('Login attempt failed:', err?.code);
      const nextAttempts = failedAttempts + 1;
      setFailedAttempts(nextAttempts);
      localStorage.setItem(STORAGE_ATTEMPTS_KEY, nextAttempts.toString());

      if (nextAttempts >= MAX_FAILED_ATTEMPTS) {
        const lockoutUntil = Date.now() + LOCK_DURATION_SECONDS * 1000;
        localStorage.setItem(STORAGE_LOCKOUT_KEY, lockoutUntil.toString());
        setSecondsRemaining(LOCK_DURATION_SECONDS);
        setErrorMessage(`Too many failed attempts. Form locked for ${LOCK_DURATION_SECONDS} seconds.`);
      } else {
        setErrorMessage(`Wrong code. (${MAX_FAILED_ATTEMPTS - nextAttempts} attempt${MAX_FAILED_ATTEMPTS - nextAttempts === 1 ? '' : 's'} remaining)`);
      }
    } finally {
      setLoading(false);
    }
  };

  const isLocked = secondsRemaining > 0;

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
        {/* Subtle accent glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-[#1E6FD9] blur-lg opacity-70"></div>

        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full overflow-hidden border border-[#1E6FD9]/40 bg-zinc-900 mx-auto mb-4 p-1 shadow-lg">
            <img
              src="/logo-transparent.png"
              alt="Cell & More"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <h1 className="text-xl font-black text-white tracking-tight">
            Cell and More Management
          </h1>
          <p className="mt-1 text-xs text-zinc-500">
            Authorized administrator access
          </p>
        </div>

        {/* Error / Lockout notification */}
        {errorMessage && (
          <div
            className={`mb-5 p-3 rounded-xl text-xs flex items-center gap-2 animate-in fade-in ${
              isLocked
                ? 'bg-amber-950/80 border border-amber-800 text-amber-300'
                : 'bg-rose-950/80 border border-rose-800 text-rose-300'
            }`}
          >
            {isLocked ? (
              <Clock className="w-4 h-4 flex-shrink-0 animate-spin text-amber-400" />
            ) : (
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
            )}
            <span className="font-medium">{errorMessage}</span>
          </div>
        )}

        {/* Login Form: ONLY Access code and Enter button */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
              Access Code
            </label>
            <div className="relative">
              <input
                type="password"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                placeholder="Enter access code"
                disabled={isLocked || loading}
                required
                autoFocus
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#1E6FD9] disabled:opacity-50 transition-colors tracking-widest text-center"
              />
              <Lock className="w-4 h-4 text-zinc-600 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLocked || loading || !accessCode.trim()}
            className="w-full py-3.5 rounded-xl bg-[#1E6FD9] hover:bg-[#185cb4] disabled:bg-zinc-800 disabled:text-zinc-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#1E6FD9]/25 transition-all active:scale-95"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Verifying...</span>
              </>
            ) : isLocked ? (
              <>
                <Clock className="w-4 h-4" />
                <span>Locked ({secondsRemaining}s)</span>
              </>
            ) : (
              <>
                <span>Enter</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {isLocked && (
          <p className="mt-4 text-center text-[11px] text-amber-400/80">
            Please wait {secondsRemaining} seconds before trying again.
          </p>
        )}
      </div>
    </div>
  );
};
