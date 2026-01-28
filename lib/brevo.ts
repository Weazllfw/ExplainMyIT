import type { WaitlistFormData } from '@/types/waitlist';

interface BrevoContact {
  email: string;
  listIds: number[];
  attributes?: Record<string, string | number>;
  updateEnabled?: boolean;
}

/**
 * Calculate lead score based on provided data
 * Score range: 0-100 (higher = more qualified)
 */
function calculateLeadScore(data: WaitlistFormData): number {
  let score = 50; // Base score
  
  // Company size scoring (larger companies = higher score)
  if (data.companySize === '151+') score += 30;
  else if (data.companySize === '51-150') score += 20;
  else if (data.companySize === '11-50') score += 10;
  
  // IT setup scoring (MSP = budget exists)
  if (data.hasIT === 'MSP') score += 15;
  else if (data.hasIT === 'Yes') score += 10;
  
  // Completeness bonus (filled optional fields = more engaged)
  if (data.companySize && data.hasIT) score += 10;
  
  // Source quality bonus
  if (data.utmSource === 'referral') score += 10;
  if (data.referrer?.includes('linkedin')) score += 5;
  
  return Math.min(score, 100);
}

export async function addToWaitlist(
  data: WaitlistFormData
): Promise<{ success: boolean; error?: string }> {
  const apiKey = process.env.BREVO_API_KEY;

  if (!apiKey) {
    console.error('BREVO_API_KEY is not configured');
    return {
      success: false,
      error: 'Email service is not configured',
    };
  }

  // Calculate lead score
  const leadScore = calculateLeadScore(data);
  
  // Prepare enhanced contact data
  const contactData: BrevoContact = {
    email: data.email,
    listIds: [18], // Early Access Waitlist - update this with your actual Brevo list ID
    updateEnabled: true, // Update if contact already exists
    attributes: {
      // Core profile
      COMPANY_SIZE: data.companySize || 'Not provided',
      HAS_IT: data.hasIT || 'Not provided',
      
      // Journey tracking
      SIGNUP_DATE: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
      SIGNUP_SOURCE: data.utmSource || 'direct',
      SIGNUP_PAGE: data.signupPage || 'homepage',
      
      // Lead qualification
      LEAD_SCORE: leadScore,
      LEAD_STATUS: 'new',
      
      // Marketing attribution
      UTM_SOURCE: data.utmSource || '',
      UTM_MEDIUM: data.utmMedium || '',
      UTM_CAMPAIGN: data.utmCampaign || '',
      REFERRER: data.referrer || '',
    },
  }

  try {
    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': apiKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify(contactData),
    });

    // Brevo returns 201 for new contact, 204 for updated contact
    // Both are success cases
    if (response.status === 201 || response.status === 204) {
      return { success: true };
    }

    // Handle duplicate email (already exists)
    if (response.status === 400) {
      const errorData = await response.json();
      if (errorData.code === 'duplicate_parameter') {
        // Treat duplicate as success - user is already on the list
        return { success: true };
      }
    }

    // Other errors
    const errorData = await response.json();
    console.error('Brevo API error:', errorData);
    return {
      success: false,
      error: 'Failed to subscribe. Please try again.',
    };
  } catch (error) {
    console.error('Error connecting to Brevo:', error);
    return {
      success: false,
      error: 'Failed to subscribe. Please try again.',
    };
  }
}
