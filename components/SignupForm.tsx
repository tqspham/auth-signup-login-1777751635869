'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PasswordInput from './PasswordInput';
import FormError from './FormError';
import SuccessMessage from './SuccessMessage';

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
}

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export default function SignupForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
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
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors({
          general: data.message || 'Signup failed',
        });
        setIsLoading(false);
        return;
      }

      setSuccessMessage(data.message || 'Account created successfully!');
      setFormData({
        email: '',
        password: '',
        confirmPassword: '',
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
    formData.confirmPassword &&
    validateEmail(formData.email) &&
    formData.password.length >= 8 &&
    formData.password === formData.confirmPassword &&
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

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
          Confirm Password
        </label>
        <PasswordInput
          value={formData.confirmPassword}
          onChange={value => handleChange({ target: { name: 'confirmPassword', value } } as React.ChangeEvent<HTMLInputElement>)}
          ariaLabel="Confirm password"
          error={errors.confirmPassword}
        />
        {errors.confirmPassword && <FormError message={errors.confirmPassword} />}
      </div>

      <button
        type="submit"
        disabled={!isFormValid}
        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-indigo-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading ? 'Signing up...' : 'Sign Up'}
      </button>
    </form>
  );
}