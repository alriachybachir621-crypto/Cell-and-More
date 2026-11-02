import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { Loader2 } from 'lucide-react';
import { auth } from '@/firebase/config';
import { checkAdminConfigExists } from '@/services/productService';
import { AdminFirstRunSetup } from './AdminFirstRunSetup';
import { AdminLogin } from './AdminLogin';
import { AdminDashboard } from './AdminDashboard';

interface AdminWrapperProps {
  onExitToStore: () => void;
}

export const AdminWrapper: React.FC<AdminWrapperProps> = ({ onExitToStore }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(auth.currentUser);
  const [configExists, setConfigExists] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  // Inject <meta name="robots" content="noindex, nofollow">
  useEffect(() => {
    let meta = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
    const originalContent = meta?.content;

    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'robots';
      document.head.appendChild(meta);
    }
    meta.content = 'noindex, nofollow';

    return () => {
      if (meta) {
        if (originalContent) {
          meta.content = originalContent;
        } else {
          meta.remove();
        }
      }
    };
  }, []);

  // Listen to Auth State and check admin configuration document
  useEffect(() => {
    const checkConfig = async () => {
      try {
        const exists = await checkAdminConfigExists();
        setConfigExists(exists);
      } catch (err) {
        console.error('Config existence check error:', err);
        // If error thrown or permission denied, assume configured
        setConfigExists(true);
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      checkConfig();
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
        <Loader2 className="w-8 h-8 text-[#1E6FD9] animate-spin mb-3" />
        <p className="text-xs text-zinc-500">Authenticating secure environment...</p>
      </div>
    );
  }

  // 1. If user is signed in, show Admin Dashboard
  if (currentUser) {
    return <AdminDashboard onExitToStore={onExitToStore} />;
  }

  // 2. If config/admin does not exist yet, show FIRST-RUN SETUP
  if (configExists === false) {
    return (
      <AdminFirstRunSetup
        onSetupSuccess={() => {
          setConfigExists(true);
        }}
      />
    );
  }

  // 3. Otherwise, show NORMAL LOGIN (Single Access Code input)
  return (
    <AdminLogin
      onLoginSuccess={() => {
        // Auth state listener handles transition
      }}
    />
  );
};

export default AdminWrapper;
