import { NextRequest, NextResponse } from 'next/server';

interface BrevoContact {
  email: string;
  listIds: number[];
  attributes?: Record<string, string | number>;
  updateEnabled?: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const { email, listId, attributes } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'Valid email is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.BREVO_API_KEY;

    if (!apiKey) {
      console.error('BREVO_API_KEY is not configured');
      return NextResponse.json(
        { success: false, error: 'Email service is not configured' },
        { status: 500 }
      );
    }

    // Prepare contact data
    const contactData: BrevoContact = {
      email,
      listIds: [listId || 18], // Default to general list if not specified
      updateEnabled: true,
      attributes: {
        SIGNUP_DATE: new Date().toISOString().split('T')[0],
        ...attributes,
      },
    };

    // Add contact to Brevo
    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contactData),
    });

    if (response.ok) {
      return NextResponse.json({ success: true });
    }

    // Handle existing contact (HTTP 400 with duplicate error)
    if (response.status === 400) {
      const errorData = await response.json();
      if (errorData.code === 'duplicate_parameter') {
        // Contact already exists, update instead
        const updateResponse = await fetch(
          `https://api.brevo.com/v3/contacts/${encodeURIComponent(email)}`,
          {
            method: 'PUT',
            headers: {
              'api-key': apiKey,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              listIds: contactData.listIds,
              attributes: contactData.attributes,
            }),
          }
        );

        if (updateResponse.ok) {
          return NextResponse.json({ success: true });
        }
      }
    }

    const errorData = await response.json();
    console.error('Brevo API error:', errorData);
    return NextResponse.json(
      { success: false, error: 'Failed to add to waitlist' },
      { status: response.status }
    );
  } catch (error: any) {
    console.error('Error adding to Brevo waitlist:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
