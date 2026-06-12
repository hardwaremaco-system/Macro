// src/app/api/email/contact/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const apiKey = process.env.BREVO_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ success: false, error: 'BREVO_API_KEY is missing' }, { status: 500 });
    }

    const { name, email, subject, message } = data;
    const senderEmail = "hardwaremaco@gmail.com"; // Your verified sender

    const adminPayload = {
      sender: { name: "Store System", email: senderEmail },
      to: [{ email: "samwelampeire@gmail.com", name: "Admin" }],
      // If the email typed in the form is invalid, Brevo will reject this whole block:
      replyTo: { email: email.trim(), name: name.trim() }, 
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
      // Send the EXACT Brevo error back to the frontend
      return NextResponse.json({ success: false, error: JSON.stringify(errorData) }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
