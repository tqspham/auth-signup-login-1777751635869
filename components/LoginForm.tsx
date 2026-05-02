'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PasswordInput from './PasswordInput';
import FormError from './FormError';
import SuccessMessage from './SuccessMessage';

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

interface FormData {
  email: string;
  password: string;
}

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export default function LoginForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});
    setSuccessMessage('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors({
          general: data.message || 'Login failed',
        });
        setIsLoading(false);
        return;
      }

      setSuccessMessage(data.message || 'Logged in successfully!');
      setFormData({
        email: '',
        password: '',
      });

      setTimeout(() => {
        if (data.token) {
          localStorage.setItem('authToken', data.token);
          localStorage.setItem('userId', data.userId);
        }
        router.push('/dashboard');
      }, 1500);
    } catch (error) {
      setErrors({
        general: 'An error occurred. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid =
    formData.email &&
    formData.password &&
    validateEmail(formData.email) &&
    !isLoading;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors.general && <FormError message={errors.general} />}
      {successMessage && <SuccessMessage message={successMessage} />}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="you@example.com"
          aria-label="Email address"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
          disabled={isLoading}
        />
        {errors.email && <FormError message={errors.email} />}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <PasswordInput
          value={formData.password}
          onChange={value => handleChange({ target: { name: 'password', value } } as React.ChangeEvent<HTMLInputElement>)}
          ariaLabel="Password"
          error={errors.password}
        />
        {errors.password && <FormError message={errors.password} />}
      </div>

      <button
        type="submit"
        disabled={!isFormValid}
        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-indigo-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading ? 'Logging in...' : 'Log In'}
      </button>
    </form>
  );
}