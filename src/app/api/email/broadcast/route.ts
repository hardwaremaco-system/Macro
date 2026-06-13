// src/app/api/email/broadcast/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const apiKey = process.env.BREVO_API_KEY;

    if (!apiKey) {
      console.warn("BREVO_API_KEY missing. Skipping email.");
      return NextResponse.json({ error: 'No API Key' }, { status: 500 });
    }

    const { subject, htmlContent, bccList } = data;

    // Use the exact same sender you used for order confirmations
    const senderEmail = "cs@macrohardwarekabale.com"; 
    const senderName = "Macro Hardware";

    // Brevo requires a 'to' address even when using BCC. 
    // We send it to your own support email, and BCC all the customers.
    const payload = {
      sender: { name: senderName, email: senderEmail },
      to: [{ email: senderEmail, name: "Macro Hardware Updates" }],
      // Map the string array of emails into the format Brevo expects: [{email: "user@..."}]
      bcc: bccList.map((email: string) => ({ email })), 
      subject: subject,
      htmlContent: htmlContent
    };

    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: { 
        'api-key': apiKey, 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify(payload)
    });

    const responseData = await res.json();

    if (!res.ok) {
      console.error("Brevo Broadcast Error:", responseData);
      throw new Error(`Brevo API Error: ${JSON.stringify(responseData)}`);
    }

    return NextResponse.json({ success: true, data: responseData });
  } catch (error) {
    console.error('Email API critical error:', error);
    return NextResponse.json({ error: 'Failed to send broadcast' }, { status: 500 });
  }
}
