import React from 'react';
import { Home, ArrowLeft } from 'lucide-react';

interface NotFoundViewProps {
  onGoHome: () => void;
}

export const NotFoundView: React.FC<NotFoundViewProps> = ({ onGoHome }) => {
  return (
    <div className="py-24 sm:py-32 bg-black min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto">
        <span className="text-6xl sm:text-8xl font-black text-[#1E6FD9]/30 tracking-tight block">
          404
        </span>
        <h1 className="mt-4 text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Page Not Found
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          The page you are looking for does not exist, has been removed, or is temporarily unavailable.
        </p>

        <div className="mt-8">
          <button
            onClick={onGoHome}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1E6FD9] hover:bg-[#185cb4] text-white font-bold text-sm shadow-lg shadow-[#1E6FD9]/20 transition-all active:scale-95"
          >
            <Home className="w-4 h-4" />
            <span>Return to Home</span>
          </button>
        </div>
      </div>
    </div>
  );
};
