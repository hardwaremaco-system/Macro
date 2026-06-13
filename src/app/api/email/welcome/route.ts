// src/app/api/email/welcome/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const apiKey = process.env.BREVO_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ success: false, error: 'No API Key' }, { status: 500 });
    }

    const { name, email } = data;

    // Must be your verified Brevo sender email
    const senderEmail = "cs@macrohardwarekabale.com"; 
    const senderName = "Macro Hardware Support";

    const emailPayload = {
      sender: { name: senderName, email: senderEmail },
      to: [{ email: email, name: name }],
      subject: "Welcome to Macro Hardware! 🎉",
      htmlContent: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f9fafb; padding: 20px; color: #374151; line-height: 1.6;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <div style="background-color: #0f172a; padding: 20px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 900; letter-spacing: 1px;">MACRO HARDWARE</h1>
            </div>
            <div style="padding: 30px;">
              <h2 style="color: #111827; margin-top: 0;">Welcome aboard, ${name}!</h2>
              <p>We are thrilled to have you join Macro Hardware. Your account has been successfully created.</p>
              <p>With your new account, you can now:</p>
              <ul style="padding-left: 20px; color: #4b5563;">
                <li>Checkout faster and track your orders.</li>
                <li>View your complete purchase history.</li>
                <li>Stay updated on exclusive promotions and events.</li>
              </ul>
              <div style="margin-top: 30px; text-align: center;">
                <a href="https://www.macrohardwarekabale.com/login" style="background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; display: inline-block;">Log In to Your Account</a>
              </div>
            </div>
            <div style="background-color: #f3f4f6; padding: 20px; text-align: center; font-size: 12px; color: #6b7280;">
              &copy; ${new Date().getFullYear()} Macro Hardware, Kabale. All rights reserved.
            </div>
          </div>
        </div>
      `
    };

    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: { 'api-key': apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify(emailPayload)
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(JSON.stringify(errorData));
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Welcome Email error:', error);
    return NextResponse.json({ error: 'Failed to send welcome email' }, { status: 500 });
  }
}
