// src/app/api/email/order-confirmation/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const apiKey = process.env.BREVO_API_KEY;

    if (!apiKey) {
      console.warn("BREVO_API_KEY missing. Skipping email.");
      return NextResponse.json({ success: true, warning: 'No API Key' });
    }

    const { orderId, customerDetails, totalAmount } = data;
    
    // 1. Email to Customer
    const customerPayload = {
      sender: { name: "Macro Hardware", email: "sales@macrohardware.com" },
      to: [{ email: customerDetails.email, name: customerDetails.fullName }],
      subject: `Order Confirmation - #${orderId.slice(0, 8)}`,
      htmlContent: `
        <h2>Thank you for your order, ${customerDetails.fullName}!</h2>
        <p>We have received your order <strong>#${orderId.slice(0, 8)}</strong> for UGX ${totalAmount.toLocaleString()}.</p>
        <p>We are currently processing it and will contact you shortly regarding delivery.</p>
      `
    };

    // 2. Notification to Admin
    const adminPayload = {
      sender: { name: "Store System", email: "system@macrohardware.com" },
      to: [{ email: "admin@macrohardware.com", name: "Admin" }], // Replace with your actual admin email
      subject: `🚨 NEW ORDER RECEIVED - #${orderId.slice(0, 8)}`,
      htmlContent: `
        <h2>New Order Received!</h2>
        <p><strong>Customer:</strong> ${customerDetails.fullName} (${customerDetails.phone})</p>
        <p><strong>Total:</strong> UGX ${totalAmount.toLocaleString()}</p>
        <p>Please log in to the admin panel to process this order.</p>
      `
    };

    // Send both emails via Brevo REST API
    await Promise.all([
      fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: { 'api-key': apiKey, 'Content-Type': 'application/json' },
        body: JSON.stringify(customerPayload)
      }),
      fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: { 'api-key': apiKey, 'Content-Type': 'application/json' },
        body: JSON.stringify(adminPayload)
      })
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Email error:', error);
    return NextResponse.json({ error: 'Failed to send emails' }, { status: 500 });
  }
}
