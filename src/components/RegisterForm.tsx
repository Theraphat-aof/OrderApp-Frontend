'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRegister } from '@/hooks/useAuth';
import { AlertTriangle, Eye, EyeOff } from 'lucide-react';
import Swal from 'sweetalert2';

const registerSchema = z
  .object({
    fullName: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
    agreeToTerms: z.boolean().refine((val) => val === true, {
      message: 'You must agree to the terms and conditions',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

function getPasswordStrength(password: string): number {
  let strength = 0;
  if (password.length >= 8) strength++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
  if (/\d/.test(password)) strength++;
  if (/[^a-zA-Z\d]/.test(password)) strength++;
  return strength;
}
export function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const { mutate: registerUser, isPending, error } = useRegister();
  const password = watch('password');
  const passwordStrength = useMemo(
    () => getPasswordStrength(password || ''),
    [password]
  );

  const onSubmit = (data: RegisterFormData) => {
    registerUser(
      {
        fullName: data.fullName,
        email: data.email,
        password: data.password,
      },
      {
        onSuccess: () => {
          Swal.fire({
            title: 'Registration Successful!',
            text: 'Your account has been created. Please login to continue.',
            icon: 'success',
            confirmButtonText: 'OK',
            confirmButtonColor: '#3085d6',
          }).then((result) => {
            if (result.isConfirmed) {
              router.push('/login');
            }
          });
        },
        onError: (err: any) => {
           Swal.fire({
            title: 'Registration Failed',
            text: err.message || 'Please try again.',
            icon: 'error',
            confirmButtonColor: '#d33',
          });
        }
      }
    );
  };

  const passwordStrengthColor = {
    0: 'bg-red-500',
    1: 'bg-red-500',
    2: 'bg-yellow-500',
    3: 'bg-blue-500',
    4: 'bg-green-500',
  };

  const passwordStrengthLabel = {
    0: 'Weak',
    1: 'Weak',
    2: 'Fair',
    3: 'Good',
    4: 'Strong',
  };

  return (
    <div className="w-full max-w-md space-y-6 animate-fade-in">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl mb-4 shadow-card">
          <span className="text-3xl font-black text-white">OA</span>
        </div>
        <h1 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800 mb-2">
          OrderApp
        </h1>
        <h2 className="text-2xl font-bold text-gray-900">Create Your Account</h2>
        <p className="mt-2 text-gray-600 text-sm">Join us and start ordering amazing products</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 animate-slide-down">
          <div className="flex items-start gap-3">
            <AlertTriangle className="text-red-600 w-5 h-5 flex-shrink-0" />
            <p className="text-red-700 text-sm font-medium">
              {(error as any)?.message || 'Registration failed. Please try again.'}
            </p>
          </div>
        </div>
      )}



      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Full Name
          </label>
          <input
            type="text"
            placeholder="John Doe"
            {...register('fullName')}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white ${
              errors.fullName ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.fullName && (
            <p className="mt-2 text-sm text-red-600 font-medium">{errors.fullName.message}</p>
          )}
        </div>

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
          <div className="relative mb-3">
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
              className="absolute right-4 top-3 text-gray-500 hover:text-gray-700 transition-colors"
            >
              {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
          </div>

          {/* Password Strength Indicator */}
          {password && (
            <div className="space-y-2 mb-3">
              <div className="flex gap-1">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className={`h-2 flex-1 rounded-full transition-colors ${
                      i < passwordStrength
                        ? passwordStrengthColor[passwordStrength as keyof typeof passwordStrengthColor]
                        : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-gray-600 font-medium">
                Password Strength: 
                <span className={`ml-1 font-bold ${
                  passwordStrength === 4 ? 'text-green-600' :
                  passwordStrength === 3 ? 'text-blue-600' :
                  passwordStrength === 2 ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {passwordStrengthLabel[passwordStrength as keyof typeof passwordStrengthLabel]}
                </span>
              </p>
            </div>
          )}

          {errors.password && (
            <p className="mt-2 text-sm text-red-600 font-medium">{errors.password.message}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="••••••••"
              {...register('confirmPassword')}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white ${
                errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-3 text-gray-500 hover:text-gray-700 transition-colors"
            >
              {showConfirmPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-2 text-sm text-red-600 font-medium">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Terms */}
        <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl border border-blue-200">
          <input
            type="checkbox"
            id="agreeToTerms"
            {...register('agreeToTerms')}
            className="h-5 w-5 text-blue-600 border-gray-300 rounded-lg cursor-pointer mt-0.5 accent-blue-600"
          />
          <label htmlFor="agreeToTerms" className="text-sm font-medium text-gray-700 cursor-pointer">
            I agree to the{' '}
            <span className="text-blue-600 hover:text-blue-800 font-bold">
              Terms and Conditions
            </span>
            {' '}and{' '}
            <span className="text-blue-600 hover:text-blue-800 font-bold">
              Privacy Policy
            </span>
          </label>
        </div>
        {errors.agreeToTerms && (
          <p className="text-sm text-red-600 font-medium">{errors.agreeToTerms.message}</p>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg transition-all shadow-card hover:shadow-card-hover transform hover:scale-105 active:scale-95"
        >
          {isPending ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Creating Account...
            </div>
          ) : (
            'Create Account'
          )}
        </button>
      </form>

      {/* Sign In Link */}
      <div className="text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link href="/login" className="text-blue-600 hover:text-blue-800 font-bold transition-colors">
          Sign in here
        </Link>
      </div>
    </div>
  );
}
