import React, { useState } from 'react';
import { Lock, KeyRound, Check, AlertCircle, ShieldCheck, Loader2 } from 'lucide-react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebase/config';
import { createAdminConfig, seedInitialProductsIfEmpty } from '@/services/productService';

interface AdminFirstRunSetupProps {
  onSetupSuccess: () => void;
}

const ADMIN_EMAIL = 'admin@cellandmore.app';

export const AdminFirstRunSetup: React.FC<AdminFirstRunSetupProps> = ({ onSetupSuccess }) => {
  const [code, setCode] = useState('');
  const [confirmCode, setConfirmCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (code.length < 6) {
      setError('Access code must be at least 6 characters long.');
      return;
    }

    if (code !== confirmCode) {
      setError('The access codes do not match. Please verify and try again.');
      return;
    }

    setLoading(true);

    try {
      let userCredential;
      try {
        // Attempt to create the owner's Firebase Auth account
        userCredential = await createUserWithEmailAndPassword(auth, ADMIN_EMAIL, code);
      } catch (authErr: any) {
        // If email already in use (e.g. earlier test run without config document), attempt sign in
        if (authErr?.code === 'auth/email-already-in-use') {
          userCredential = await signInWithEmailAndPassword(auth, ADMIN_EMAIL, code);
        } else {
          throw authErr;
        }
      }

      const uid = userCredential.user.uid;

      // Write config/admin containing the new user's uid
      await createAdminConfig(uid, ADMIN_EMAIL);

      // Seed 12 sample products if collection is empty
      await seedInitialProductsIfEmpty();

      onSetupSuccess();
    } catch (err: any) {
      console.error('Setup failed:', err);
      setError(err?.message || 'Failed to complete initial setup. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-2 bg-[#1E6FD9] blur-xl opacity-60"></div>

        {/* Header with Logo */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full overflow-hidden border border-[#1E6FD9]/40 bg-zinc-900 mx-auto mb-4 p-1">
            <img src="/logo-transparent.png" alt="Cell & More" className="w-full h-full object-cover rounded-full" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1E6FD9]/15 text-[#1E6FD9] border border-[#1E6FD9]/30 text-xs font-bold tracking-wider uppercase mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            First-Run Owner Setup
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Set Your Access Code
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-zinc-400 leading-relaxed">
            Welcome to Cell and More. Please configure your master access code. You will use this code to log into your management dashboard.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs flex items-start gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Setup Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
              Create Access Code (Min. 6 chars)
            </label>
            <div className="relative">
              <input
                type="password"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                autoFocus
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#1E6FD9] transition-colors"
              />
              <KeyRound className="w-4 h-4 text-zinc-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
              Confirm Access Code
            </label>
            <div className="relative">
              <input
                type="password"
                value={confirmCode}
                onChange={(e) => setConfirmCode(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#1E6FD9] transition-colors"
              />
              <KeyRound className="w-4 h-4 text-zinc-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-[#1E6FD9] hover:bg-[#185cb4] disabled:bg-zinc-800 disabled:text-zinc-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#1E6FD9]/25 transition-all active:scale-95"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Securing & Initializing Store...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Set Code & Launch Panel</span>
                </>
              )}
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-[11px] text-zinc-600">
          This setup screen only displays once. Keep your access code safe.
        </p>
      </div>
    </div>
  );
};
