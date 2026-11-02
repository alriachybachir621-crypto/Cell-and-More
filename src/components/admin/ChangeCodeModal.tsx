import React, { useState } from 'react';
import { X, KeyRound, Check, AlertCircle, Loader2 } from 'lucide-react';
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { auth } from '@/firebase/config';

interface ChangeCodeModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const ADMIN_EMAIL = 'admin@cellandmore.app';

export const ChangeCodeModal: React.FC<ChangeCodeModalProps> = ({ onClose, onSuccess }) => {
  const [currentCode, setCurrentCode] = useState('');
  const [newCode, setNewCode] = useState('');
  const [confirmNewCode, setConfirmNewCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (newCode.length < 6) {
      setErrorMessage('New access code must be at least 6 characters long.');
      return;
    }

    if (newCode !== confirmNewCode) {
      setErrorMessage('The new access codes do not match.');
      return;
    }

    if (!auth.currentUser) {
      setErrorMessage('You must be logged in to change your code.');
      return;
    }

    setLoading(true);

    try {
      // 1. Re-authenticate user with current code first
      const credential = EmailAuthProvider.credential(ADMIN_EMAIL, currentCode);
      await reauthenticateWithCredential(auth.currentUser, credential);

      // 2. Update password to new code
      await updatePassword(auth.currentUser, newCode);

      onSuccess();
    } catch (err: any) {
      console.error('Password change error:', err);
      if (err?.code === 'auth/wrong-password' || err?.code === 'auth/invalid-credential') {
        setErrorMessage('Current access code is incorrect.');
      } else {
        setErrorMessage(err?.message || 'Failed to update access code. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-3xl p-6 shadow-2xl z-10">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-850 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#1E6FD9]/15 text-[#1E6FD9] flex items-center justify-center">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Change Access Code</h2>
              <p className="text-[11px] text-zinc-400">Update your secret store entry code</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
              Current Access Code *
            </label>
            <input
              type="password"
              value={currentCode}
              onChange={(e) => setCurrentCode(e.target.value)}
              placeholder="••••••••"
              required
              autoFocus
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#1E6FD9] transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
              New Access Code (Min. 6 chars) *
            </label>
            <input
              type="password"
              value={newCode}
              onChange={(e) => setNewCode(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#1E6FD9] transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
              Confirm New Access Code *
            </label>
            <input
              type="password"
              value={confirmNewCode}
              onChange={(e) => setConfirmNewCode(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#1E6FD9] transition-colors"
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !currentCode || !newCode || !confirmNewCode}
              className="px-5 py-2 rounded-xl bg-[#1E6FD9] hover:bg-[#185cb4] disabled:bg-zinc-800 disabled:text-zinc-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-[#1E6FD9]/25"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Update Access Code</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
