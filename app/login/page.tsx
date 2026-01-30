/**
 * Login Page
 * 
 * Allow existing users to log in
 */

import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LoginForm from '@/components/auth/LoginForm';
import LoginPageTracker from '@/components/auth/LoginPageTracker';

export const metadata: Metadata = {
  title: 'Log In',
  description: 'Log in to your Explain My IT account',
};

export default function LoginPage() {
  return (
    <>
      <LoginPageTracker />
      <Header />
      <main className="min-h-screen bg-brand-bg">
        <div className="container-section py-20">
          <div className="max-w-md mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-[36px] font-bold text-brand-navy mb-3">
                Welcome Back
              </h1>
              <p className="text-brand-slate text-[16px]">
                Log in to view your saved snapshots
              </p>
            </div>

            {/* Login Form Card */}
            <div className="bg-white rounded-[16px] border border-brand-border shadow-brand p-8">
              <LoginForm />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
