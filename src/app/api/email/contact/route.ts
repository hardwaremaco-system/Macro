// src/app/api/email/contact/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const apiKey = process.env.BREVO_API_KEY;

    if (!apiKey) {
      console.warn("BREVO_API_KEY missing. Skipping email.");
      return NextResponse.json({ success: false, error: 'API Key missing' }, { status: 500 });
    }

    const { name, email, subject, message } = data;

    // Must be your verified Brevo sender email
    const senderEmail = "cs@macrohardwarekabale.com"; 
    const adminEmail = "hardwaremaco@gmail.com"; // Where you receive the messages

    // Common styling wrapper to match your store's branding
    const emailWrapper = (content: string) => `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f9fafb; padding: 20px; color: #374151; line-height: 1.6;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          <div style="background-color: #0f172a; padding: 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 900; letter-spacing: 1px;">MACRO HARDWARE</h1>
          </div>
          <div style="padding: 30px;">
            ${content}
          </div>
          <div style="background-color: #f3f4f6; padding: 20px; text-align: center; font-size: 12px; color: #6b7280;">
            &copy; ${new Date().getFullYear()} Macro Hardware, Kabale. All rights reserved.
          </div>
        </div>
      </div>
    `;

    const adminPayload = {
      sender: { name: "Store System", email: senderEmail },
      to: [{ email: adminEmail, name: "Admin" }],
      // This is the magic line that lets you click "Reply" in Gmail and talk directly to the customer
      replyTo: { email: email.trim(), name: name.trim() }, 
      subject: `New Contact Inquiry: ${subject}`,
      htmlContent: emailWrapper(`
        <h2 style="color: #111827; margin-top: 0; border-bottom: 2px solid #f3f4f6; padding-bottom: 10px;">New Contact Message</h2>
        
        <div style="background-color: #f9fafb; border: 1px solid #eaeaea; border-radius: 6px; padding: 15px; margin-bottom: 25px;">
          <p style="margin: 0 0 8px 0; font-size: 14px;"><strong>From:</strong> ${name}</p>
          <p style="margin: 0 0 8px 0; font-size: 14px;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #2563eb;">${email}</a></p>
          <p style="margin: 0; font-size: 14px;"><strong>Subject:</strong> ${subject}</p>
        </div>

        <h3 style="color: #111827; margin-bottom: 10px; font-size: 16px;">Message:</h3>
        <div style="background-color: #ffffff; border: 1px solid #e5e7eb; border-left: 4px solid #2563eb; padding: 15px; border-radius: 4px; font-size: 15px; white-space: pre-wrap; color: #4b5563;">${message}</div>
        
        <div style="margin-top: 30px; text-align: center;">
          <a href="mailto:${email}" style="background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 6px; font-weight: bold; font-size: 14px; display: inline-block;">Reply to Customer</a>
        </div>
      `)
    };

    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: { 'api-key': apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify(adminPayload)
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error("Brevo Contact Error:", errorData);
      return NextResponse.json({ success: false, error: JSON.stringify(errorData) }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Contact API error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
