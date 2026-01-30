export interface WaitlistFormData {
  email: string;
  companySize?: string;
  hasIT?: string;
  // Marketing attribution (captured automatically)
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  referrer?: string;
  signupPage?: string;
  signupSource?: string; // e.g., 'free-snapshot', 'waitlist-form', 'account-creation'
}

export interface WaitlistResponse {
  success: boolean;
  message?: string;
  error?: string;
}
