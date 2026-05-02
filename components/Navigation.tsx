import Link from 'next/link';

export default function Navigation() {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-bold text-indigo-600">
            AuthApp
          </Link>
          <div className="space-x-4">
            <Link href="/" className="text-gray-600 hover:text-gray-900">
              Home
            </Link>
            <Link href="/signup" className="text-gray-600 hover:text-gray-900">
              Sign Up
            </Link>
            <Link href="/login" className="text-gray-600 hover:text-gray-900">
              Log In
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}