'use client';

import Link from 'next/link';
import Navigation from '@/components/Navigation';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation />
      <main className="flex items-center justify-center min-h-screen px-4">
        <div className="text-center max-w-md">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome</h1>
          <p className="text-gray-600 mb-8">Sign up or log in to get started</p>
          <div className="space-y-4">
            <Link
              href="/signup"
              className="block w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 transition"
            >
              Sign Up
            </Link>
            <Link
              href="/login"
              className="block w-full bg-gray-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-700 transition"
            >
              Log In
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}