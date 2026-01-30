/**
 * Forgot Password Page
 */

import { Suspense } from 'react';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';
import ForgotPasswordPageTracker from '@/components/auth/ForgotPasswordPageTracker';

export const metadata = {
  title: 'Forgot Password | Explain My IT',
  description: 'Reset your password',
};

export default function ForgotPasswordPage() {
  return (
    <>
      <ForgotPasswordPageTracker />
      <div className="min-h-screen bg-brand-bg flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-[32px] font-bold text-brand-navy mb-2">
              Forgot Password?
            </h1>
            <p className="text-brand-slate text-[15px] leading-relaxed">
              No worries. Enter your email and we'll send you reset instructions.
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-[16px] shadow-brand-lg p-8 border border-brand-border">
            <Suspense fallback={<div>Loading...</div>}>
              <ForgotPasswordForm />
            </Suspense>
          </div>
        </div>
      </div>
    </>
  );
}
