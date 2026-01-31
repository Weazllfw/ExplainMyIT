/**
 * Brevo Email Client
 * 
 * Send transactional emails via Brevo API
 */

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_API_URL = 'https://api.brevo.com/v3';

if (!BREVO_API_KEY) {
  console.warn('BREVO_API_KEY not configured - emails will not be sent');
}

export interface EmailRecipient {
  email: string;
  name?: string;
}

export interface EmailParams {
  [key: string]: string | number | boolean;
}

export interface SendEmailOptions {
  to: EmailRecipient[];
  subject: string;
  htmlContent?: string;
  textContent?: string;
  params?: EmailParams;
  tags?: string[];
  templateId?: number;
}

/**
 * Send transactional email via Brevo
 */
export async function sendEmail(
  options: SendEmailOptions
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  if (!BREVO_API_KEY) {
    console.error('Cannot send email: BREVO_API_KEY not configured');
    return {
      success: false,
      error: 'Email service not configured',
    };
  }

  try {
    const payload: any = {
      sender: {
        name: 'Explain My IT',
        email: 'noreply@explainmyit.com',
      },
      to: options.to,
      subject: options.subject,
      tags: options.tags || ['tier1', 'snapshot-report'],
    };

    // Use template if provided, otherwise use content
    if (options.templateId) {
      payload.templateId = options.templateId;
      payload.params = options.params || {};
    } else {
      // Plain content emails
      if (options.htmlContent) {
        payload.htmlContent = options.htmlContent;
      }
      if (options.textContent) {
        payload.textContent = options.textContent;
      }
    }

    const response = await fetch(`${BREVO_API_URL}/smtp/email`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': BREVO_API_KEY,
        'content-type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Brevo API error:', errorData);
      return {
        success: false,
        error: `Brevo API error: ${errorData.message || response.statusText}`,
      };
    }

    const result = await response.json();
    return {
      success: true,
      messageId: result.messageId,
    };
  } catch (error) {
    console.error('Error sending email via Brevo:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Send email using Brevo template
 */
export async function sendTemplateEmail(
  templateId: number,
  to: EmailRecipient[],
  params: EmailParams,
  tags?: string[]
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  return sendEmail({
    to,
    subject: '', // Template defines subject
    templateId,
    params,
    tags,
  });
}

/**
 * Create contact in Brevo (for list management)
 */
export async function createOrUpdateContact(
  email: string,
  attributes?: Record<string, any>,
  listIds?: number[]
): Promise<{ success: boolean; error?: string }> {
  if (!BREVO_API_KEY) {
    return {
      success: false,
      error: 'Email service not configured',
    };
  }

  try {
    const payload: any = {
      email,
      updateEnabled: true,
    };

    if (attributes) {
      payload.attributes = attributes;
    }

    if (listIds) {
      payload.listIds = listIds;
    }

    const response = await fetch(`${BREVO_API_URL}/contacts`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': BREVO_API_KEY,
        'content-type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    // 201 = created, 204 = updated, both are success
    if (response.status === 201 || response.status === 204) {
      return { success: true };
    }

    // 400 with duplicate_parameter is also success (already exists)
    if (response.status === 400) {
      const errorData = await response.json();
      if (errorData.code === 'duplicate_parameter') {
        return { success: true };
      }
    }

    const errorData = await response.json();
    console.error('Brevo contact error:', errorData);
    return {
      success: false,
      error: errorData.message || 'Failed to create/update contact',
    };
  } catch (error) {
    console.error('Error creating/updating contact:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
