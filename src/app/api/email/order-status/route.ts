// src/app/api/email/order-status/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const apiKey = process.env.BREVO_API_KEY;

    if (!apiKey) return NextResponse.json({ success: true });

    const { orderId, status, email, name } = data;

    const payload = {
      sender: { name: "Macro Hardware Support", email: "cs@macrohardwarekabale.com" },
      to: [{ email, name }],
      subject: `Order Update - #${orderId.slice(0, 8)}`,
      htmlContent: `
        <h2>Hello ${name},</h2>
        <p>The status of your order <strong>#${orderId.slice(0, 8)}</strong> has been updated to: <strong style="font-size: 18px; color: #2563eb;">${status}</strong>.</p>
        <p>Thank you for shopping with us!</p>
      `
    };

    await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: { 'api-key': apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Email error:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
