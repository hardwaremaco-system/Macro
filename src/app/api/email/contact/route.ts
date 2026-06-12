// src/app/api/email/contact/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const apiKey = process.env.BREVO_API_KEY;

    if (!apiKey) {
      console.warn("BREVO_API_KEY missing. Skipping email.");
      return NextResponse.json({ success: false, error: 'No API Key' }, { status: 500 });
    }

    const { name, email, subject, message } = data;

    // IMPORTANT: Must be your verified Brevo sender email
    const senderEmail = "hardwaremaco@gmail.com"; 

    const adminPayload = {
      sender: { name: "Store System", email: senderEmail },
      to: [{ email: "samwelampeire@gmail.com", name: "Admin" }], // Your admin email
      replyTo: { email: email, name: name }, // Allows you to hit "Reply" and email the customer directly!
      subject: `New Contact Message: ${subject}`,
      htmlContent: `
        <div style="font-family: sans-serif; background-color: #f9fafb; padding: 20px; color: #374151;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <div style="background-color: #0f172a; padding: 20px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 20px;">New Contact Form Submission</h1>
            </div>
            <div style="padding: 30px;">
              <p><strong>From:</strong> ${name} (${email})</p>
              <p><strong>Subject:</strong> ${subject}</p>
              <hr style="border: 0; border-top: 1px solid #eaeaea; margin: 20px 0;" />
              <h3 style="margin-top: 0;">Message:</h3>
              <p style="white-space: pre-wrap; line-height: 1.6; background-color: #f3f4f6; padding: 15px; border-radius: 6px;">${message}</p>
            </div>
          </div>
        </div>
      `
    };

    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: { 'api-key': apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify(adminPayload)
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error("Brevo Contact Error:", errorData);
      throw new Error('Failed to send email via Brevo');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact API critical error:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
