/**
 * Reset Password Page
 */

import { Suspense } from 'react';
import ResetPasswordForm from '@/components/auth/ResetPasswordForm';
import ResetPasswordPageTracker from '@/components/auth/ResetPasswordPageTracker';

export const metadata = {
  title: 'Reset Password | Explain My IT',
  description: 'Create a new password for your account',
};

export default function ResetPasswordPage() {
  return (
    <>
      <ResetPasswordPageTracker />
      <div className="min-h-screen bg-brand-bg flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-[32px] font-bold text-brand-navy mb-2">
              Reset Your Password
            </h1>
            <p className="text-brand-slate text-[15px] leading-relaxed">
              Choose a strong password for your account.
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-[16px] shadow-brand-lg p-8 border border-brand-border">
            <Suspense fallback={<div>Loading...</div>}>
              <ResetPasswordForm />
            </Suspense>
          </div>
        </div>
      </div>
    </>
  );
}
