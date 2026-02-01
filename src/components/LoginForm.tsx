'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useLogin } from '@/hooks/useAuth';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const { mutate: login, isPending, error } = useLogin();

  const onSubmit = (data: LoginFormData) => {
    login(data);
  };

  return (
    <div className="w-full max-w-md space-y-8 animate-fade-in">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl mb-4 shadow-card">
          <span className="text-3xl font-black text-white">OA</span>
        </div>
        <h1 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800 mb-2">
          OrderApp
        </h1>
        <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
        <p className="mt-2 text-gray-600 text-sm">Sign in to your account to continue</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 animate-slide-down">
          <div className="flex items-start gap-3">
            <span className="text-red-600 text-xl">⚠️</span>
            <p className="text-red-700 text-sm font-medium">
              {(error as any)?.message || 'Login failed. Please try again.'}
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Email */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Email Address
          </label>
          <input
            type="email"
            placeholder="you@example.com"
            {...register('email')}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.email && (
            <p className="mt-2 text-sm text-red-600 font-medium">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              {...register('password')}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-3 text-gray-500 hover:text-gray-700 text-xl transition-colors"
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
          {errors.password && (
            <p className="mt-2 text-sm text-red-600 font-medium">{errors.password.message}</p>
          )}
        </div>

        {/* Remember Me */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="rememberMe"
            {...register('rememberMe')}
            className="h-5 w-5 text-blue-600 border-gray-300 rounded-lg cursor-pointer accent-blue-600"
          />
          <label htmlFor="rememberMe" className="text-sm font-medium text-gray-700 cursor-pointer">
            Remember me for 30 days
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg transition-all shadow-card hover:shadow-card-hover transform hover:scale-105 active:scale-95"
        >
          {isPending ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Signing in...
            </div>
          ) : (
            'Sign In'
          )}
        </button>
      </form>

      {/* Links */}
      <div className="space-y-3 text-center">
        <Link
          href="#"
          className="block text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
        >
          Forgot password?
        </Link>
        <div className="text-sm text-gray-600">
          Don't have an account?{' '}
          <Link href="/register" className="text-blue-600 hover:text-blue-800 font-bold transition-colors">
            Create one now
          </Link>
        </div>
      </div>

      {/* Social Login */}
      <div className="space-y-4">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="px-3 bg-white text-gray-500 text-xs font-medium">Or sign in with</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            className="px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 font-medium text-sm transition-all flex items-center justify-center gap-2 hover:shadow-card"
          >
            <span className="text-lg">🔵</span>
            Google
          </button>
          <button
            type="button"
            className="px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 font-medium text-sm transition-all flex items-center justify-center gap-2 hover:shadow-card"
          >
            <span className="text-lg">⬛</span>
            GitHub
          </button>
        </div>
      </div>
    </div>
  );
}
