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

    const { orderId, customerDetails, totalAmount, items, paymentMethod } = data;

    const senderEmail = "cs@macrohardwarekabale.com"; 
    const senderName = "Macro Hardware Support";
    const shortOrderId = orderId.slice(0, 8).toUpperCase();

    // Generate the HTML table rows for the ordered items
    const itemsHtml = items.map((item: any) => `
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #eaeaea; width: 60px;">
          ${item.image ? `<img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 6px; border: 1px solid #eaeaea;" />` : `<div style="width: 50px; height: 50px; background-color: #f3f4f6; border-radius: 6px; border: 1px solid #eaeaea; text-align: center; line-height: 50px; color: #9ca3af; font-size: 10px;">No Img</div>`}
        </td>
        <td style="padding: 12px 10px; border-bottom: 1px solid #eaeaea;">
          <strong style="color: #111827; font-size: 14px;">${item.name}</strong><br/>
          <span style="color: #6b7280; font-size: 13px;">Qty: ${item.quantity}</span>
        </td>
        <td style="padding: 12px 0; border-bottom: 1px solid #eaeaea; text-align: right; color: #111827; font-weight: bold; font-size: 14px;">
          UGX ${(item.price * item.quantity).toLocaleString()}
        </td>
      </tr>
    `).join('');

    // Common styling wrapper for a clean, modern email layout
    const emailWrapper = (content: string) => `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f9fafb; padding: 20px; color: #374151; line-height: 1.6;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          <div style="background-color: #0f172a; padding: 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 900; letter-spacing: 1px;">MACRO HARDWARE</h1>
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

    // 1. Email to Customer
    const customerPayload = {
      sender: { name: senderName, email: senderEmail },
      to: [{ email: customerDetails.email, name: customerDetails.fullName }],
      subject: `Order Confirmation - #${shortOrderId}`,
      htmlContent: emailWrapper(`
        <h2 style="color: #111827; margin-top: 0;">Thank you for your order, ${customerDetails.fullName}!</h2>
        <p>We have successfully received your order <strong>#${shortOrderId}</strong>. Our team is currently preparing it for dispatch.</p>
        
        <h3 style="color: #111827; margin-top: 30px; border-bottom: 2px solid #f3f4f6; padding-bottom: 8px;">Order Summary</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          ${itemsHtml}
          <tr>
            <td colspan="2" style="padding: 16px 0 0 0; text-align: right; font-weight: bold; color: #6b7280; text-transform: uppercase; font-size: 12px;">Total Amount:</td>
            <td style="padding: 16px 0 0 0; text-align: right; font-weight: 900; color: #2563eb; font-size: 18px;">UGX ${totalAmount.toLocaleString()}</td>
          </tr>
        </table>

        <div style="background-color: #f9fafb; border: 1px solid #eaeaea; border-radius: 6px; padding: 15px; margin-top: 20px;">
          <h4 style="margin: 0 0 10px 0; color: #111827;">Delivery & Payment Info</h4>
          <p style="margin: 0 0 5px 0; font-size: 14px;"><strong>Location:</strong> ${customerDetails.deliveryLocation}</p>
          <p style="margin: 0; font-size: 14px;"><strong>Payment Method:</strong> <span style="text-transform: uppercase;">${paymentMethod?.replace(/_/g, ' ')}</span></p>
        </div>
        
        <p style="margin-top: 30px; font-size: 14px;">If you have any questions, reply directly to this email or call our support line.</p>
      `)
    };

    // 2. Notification to Admin
    const adminPayload = {
      sender: { name: "Store System", email: senderEmail },
      to: [{ email: "hardwaremaco@gmail.com", name: "Admin" }],
      subject: `🚨 NEW ORDER: UGX ${totalAmount.toLocaleString()} - #${shortOrderId}`,
      htmlContent: emailWrapper(`
        <h2 style="color: #111827; margin-top: 0; color: #dc2626;">🚨 New Order Received!</h2>
        
        <div style="background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 6px; padding: 15px; margin-bottom: 20px;">
          <h4 style="margin: 0 0 10px 0; color: #991b1b;">Customer Details</h4>
          <p style="margin: 0 0 5px 0; font-size: 14px;"><strong>Name:</strong> ${customerDetails.fullName}</p>
          <p style="margin: 0 0 5px 0; font-size: 14px;"><strong>Phone:</strong> ${customerDetails.phone}</p>
          <p style="margin: 0 0 5px 0; font-size: 14px;"><strong>Email:</strong> ${customerDetails.email}</p>
          <p style="margin: 0 0 5px 0; font-size: 14px;"><strong>Location:</strong> ${customerDetails.deliveryLocation}</p>
          <p style="margin: 0; font-size: 14px;"><strong>Payment:</strong> <span style="text-transform: uppercase; font-weight: bold;">${paymentMethod?.replace(/_/g, ' ')}</span></p>
        </div>

        <h3 style="color: #111827; border-bottom: 2px solid #f3f4f6; padding-bottom: 8px;">Items Ordered</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          ${itemsHtml}
          <tr>
            <td colspan="2" style="padding: 16px 0 0 0; text-align: right; font-weight: bold; color: #6b7280; text-transform: uppercase; font-size: 12px;">Total Revenue:</td>
            <td style="padding: 16px 0 0 0; text-align: right; font-weight: 900; color: #16a34a; font-size: 18px;">UGX ${totalAmount.toLocaleString()}</td>
          </tr>
        </table>
        
        <div style="text-align: center; margin-top: 30px;">
          <a href="https://www.macrohardwarekabale.com/admin/orders" style="background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; display: inline-block;">Open Admin Panel</a>
        </div>
      `)
    };

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

    const customerData = await customerRes.json();
    const adminData = await adminRes.json();

    console.log("Brevo Customer Response:", customerData);
    console.log("Brevo Admin Response:", adminData);

    if (!customerRes.ok || !adminRes.ok) {
      throw new Error(`Brevo API Error: ${JSON.stringify(customerData)} | ${JSON.stringify(adminData)}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Email API critical error:', error);
    return NextResponse.json({ error: 'Failed to send emails' }, { status: 500 });
  }
}
