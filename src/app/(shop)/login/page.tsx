// src/app/(shop)/login/page.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { Eye, EyeOff, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
// Strict relative paths
import { auth } from '../../../lib/firebase/client';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // UX States
  const [showPassword, setShowPassword] = useState(false);
  const [isResetting, setIsResetting] = useState(false); // Forgot password toggle
  const [toast, setToast] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setToast('Logged in successfully!');

      setTimeout(() => {
        router.push('/');
      }, 1500);

    } catch (err: any) {
      setError('Invalid email or password. Please try again.');
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address to reset your password.');
      return;
    }
    
    setError('');
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setToast('Password reset link sent! Check your inbox.');
      setTimeout(() => {
        setIsResetting(false);
        setToast('');
      }, 3000);
    } catch (err: any) {
      setError('Failed to send reset link. Make sure the email is registered.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 sm:py-24 relative">

      {/* Success Toast Notification */}
      {toast && (
        <div className="fixed top-24 right-4 sm:right-8 z-50 flex items-center bg-green-600 text-white px-5 py-3 rounded-lg shadow-2xl animate-pulse">
          <CheckCircle size={20} className="mr-2" />
          <span className="font-bold text-sm">{toast}</span>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black text-gray-900">
            {isResetting ? 'Reset Password' : 'Welcome Back'}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {isResetting 
              ? 'Enter your email to receive a secure reset link' 
              : 'Sign in to your Macro Hardware account'}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-bold flex items-center mb-6">
            <AlertCircle size={16} className="mr-2 flex-shrink-0" /> {error}
          </div>
        )}

        {isResetting ? (
          /* --- FORGOT PASSWORD FORM --- */
          <form onSubmit={handleResetPassword} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
              <input 
                type="email" 
                required 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-blue-500 focus:border-blue-500" 
                placeholder="name@example.com" 
              />
            </div>

            <button 
              type="submit" 
              disabled={loading || !!toast} 
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 mt-2"
            >
              {loading ? 'Sending Link...' : 'Send Reset Link'}
            </button>

            <button 
              type="button" 
              onClick={() => { setIsResetting(false); setError(''); }}
              className="w-full flex items-center justify-center text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors mt-4"
            >
              <ArrowLeft size={16} className="mr-2" /> Back to Login
            </button>
          </form>
        ) : (
          /* --- NORMAL LOGIN FORM --- */
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
              <input 
                type="email" 
                required 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-blue-500 focus:border-blue-500" 
                placeholder="name@example.com" 
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-bold text-gray-700">Password</label>
                <button 
                  type="button" 
                  onClick={() => { setIsResetting(true); setError(''); }} 
                  className="text-xs font-bold text-blue-600 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  required 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-blue-500 focus:border-blue-500 pr-10" 
                  placeholder="••••••••" 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-blue-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading || !!toast} 
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 mt-2"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        )}

        {/* Hide register link if they are resetting password to keep UI clean */}
        {!isResetting && (
          <div className="mt-6 text-center text-sm text-gray-600 border-t border-gray-100 pt-6">
            Don't have an account?{' '}
            <Link href="/register" className="font-bold text-blue-600 hover:underline">
              Register here
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
