'use client';

import SignupForm from '@/components/SignupForm';
import Navigation from '@/components/Navigation';

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation />
      <main className="flex items-center justify-center min-h-screen px-4 py-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Sign Up</h1>
            <p className="text-gray-600 mb-6">Create a new account to get started</p>
            <SignupForm />
          </div>
        </div>
      </main>
    </div>
  );
}