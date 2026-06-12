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
    
    // IMPORTANT: The email here MUST be verified in your Brevo Dashboard!
    const senderEmail = "hardwaremaco@gmail.com"; // Change this if needed
    const senderName = "Macro Hardware";

    // 1. Email to Customer
    const customerPayload = {
      sender: { name: senderName, email: senderEmail },
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
      sender: { name: "Store System", email: senderEmail },
      to: [{ email: "samwelampeire@gmail.com", name: "Admin" }], // Where you want to receive notifications
      subject: `🚨 NEW ORDER RECEIVED - #${orderId.slice(0, 8)}`,
      htmlContent: `
        <h2>New Order Received!</h2>
        <p><strong>Customer:</strong> ${customerDetails.fullName} (${customerDetails.phone})</p>
        <p><strong>Total:</strong> UGX ${totalAmount.toLocaleString()}</p>
        <p>Please log in to the admin panel to process this order.</p>
      `
    };

    // Send emails and CAPTURE the response
    const [customerRes, adminRes] = await Promise.all([
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

    // Parse the JSON responses to check for Brevo errors
    const customerData = await customerRes.json();
    const adminData = await adminRes.json();

    // Log the actual results to Vercel
    console.log("Brevo Customer Response:", customerData);
    console.log("Brevo Admin Response:", adminData);

    // If Brevo didn't return a 200/201 OK status, throw an error to trigger the catch block
    if (!customerRes.ok || !adminRes.ok) {
      throw new Error(`Brevo API Error: ${JSON.stringify(customerData)} | ${JSON.stringify(adminData)}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    // Now the error will properly log in Vercel!
    console.error('Email API critical error:', error);
    return NextResponse.json({ error: 'Failed to send emails' }, { status: 500 });
  }
}
