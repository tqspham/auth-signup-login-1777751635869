'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

export default function Dashboard() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const storedEmail = localStorage.getItem('userEmail');
    if (storedEmail) {
      setUserEmail(storedEmail);
    }
  }, []);

  const handleLogout = async () => {
    setIsLoading(true);

    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
    } catch (error) {
      // Continue logout even if request fails
    }

    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');

    router.push('/');
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Welcome to Dashboard</h1>

      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6 mb-8">
        <p className="text-gray-600 mb-2">Logged in as:</p>
        <p className="text-lg font-semibold text-gray-900">{userEmail || 'User'}</p>
      </div>

      <p className="text-gray-600 mb-6">
        You have successfully logged in. You can now access your dashboard.
      </p>

      <button
        onClick={handleLogout}
        disabled={isLoading}
        className="flex items-center gap-2 bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        <LogOut size={20} />
        {isLoading ? 'Logging out...' : 'Log Out'}
      </button>
    </div>
  );
}