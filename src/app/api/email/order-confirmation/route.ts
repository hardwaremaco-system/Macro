// src/app/api/email/order-confirmation/route.ts
import { NextResponse } from 'next/server';
import * as brevo from '@getbrevo/brevo';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../../lib/firebase/client';

export async function POST(request: Request) {
  try {
    const orderData = await request.json();

    // 1. Fetch live Store Settings from your Admin Dashboard
    const settingsRef = doc(db, 'settings', 'store_config');
    const settingsSnap = await getDoc(settingsRef);
    const adminEmail = settingsSnap.exists() ? settingsSnap.data().supportEmail : 'support@macrohardware.com';
    const storeName = settingsSnap.exists() ? settingsSnap.data().storeName : 'Macro Hardware';

    // 2. Initialize Brevo
    if (!process.env.BREVO_API_KEY) {
      throw new Error('Missing BREVO_API_KEY');
    }
    
    // @ts-ignore - Brevo JS SDK typing quirk
    brevo.ApiClient.instance.authentications['api-key'].apiKey = process.env.BREVO_API_KEY;
    const apiInstance = new brevo.TransactionalEmailsApi();

    // 3. Format the Order Items for the Email HTML
    const itemsListHtml = orderData.items.map((item: any) => 
      `<li style="margin-bottom: 8px;"><strong>${item.quantity}x ${item.name}</strong> - UGX ${(item.price * item.quantity).toLocaleString()}</li>`
    ).join('');

    const orderTotal = `UGX ${orderData.totalAmount.toLocaleString()}`;
    const paymentMethod = orderData.paymentMethod.replace(/_/g, ' ').toUpperCase();

    // 4. Build Customer Receipt Email
    const customerEmail = new brevo.SendSmtpEmail();
    customerEmail.subject = `Order Confirmed! - ${storeName}`;
    customerEmail.sender = { name: storeName, email: adminEmail };
    customerEmail.to = [{ email: orderData.customerDetails.email, name: orderData.customerDetails.fullName }];
    customerEmail.htmlContent = `
      <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto; color: #333;">
        <h2 style="color: #1e3a8a;">Thank you for your order, ${orderData.customerDetails.fullName}!</h2>
        <p>Your order (<strong>${orderData.orderId}</strong>) has been securely received and is now pending processing.</p>
        
        <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;">Order Details</h3>
          <ul style="padding-left: 20px;">${itemsListHtml}</ul>
          <h3 style="border-top: 1px solid #e5e7eb; padding-top: 10px; color: #2563eb;">Total to Pay: ${orderTotal}</h3>
        </div>

        <p><strong>Delivery Location:</strong> ${orderData.customerDetails.deliveryLocation}</p>
        <p><strong>Payment Method:</strong> ${paymentMethod}</p>
        
        <p>Our team will contact you shortly at ${orderData.customerDetails.phone} to confirm delivery details.</p>
      </div>
    `;

    // 5. Build Admin Alert Email
    const adminAlertEmail = new brevo.SendSmtpEmail();
    adminAlertEmail.subject = `🚨 NEW ORDER RECEIVED: ${orderTotal}`;
    adminAlertEmail.sender = { name: "Macro System", email: "no-reply@macrohardware.com" };
    adminAlertEmail.to = [{ email: adminEmail, name: "Store Admin" }];
    adminAlertEmail.htmlContent = `
      <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto; color: #333;">
        <h2 style="color: #d97706;">New Order Alert!</h2>
        <p><strong>Customer:</strong> ${orderData.customerDetails.fullName} (${orderData.customerDetails.phone})</p>
        <p><strong>Email:</strong> ${orderData.customerDetails.email}</p>
        <p><strong>Location:</strong> ${orderData.customerDetails.deliveryLocation}</p>
        
        <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Order Value: ${orderTotal}</h3>
          <p><strong>Payment:</strong> ${paymentMethod}</p>
          <ul style="padding-left: 20px;">${itemsListHtml}</ul>
          <p><strong>Customer Notes:</strong> ${orderData.notes || 'None'}</p>
        </div>
        <p>Log into your Admin Dashboard to process this order.</p>
      </div>
    `;

    // 6. Send Both Emails Simultaneously
    await Promise.all([
      apiInstance.sendTransacEmail(customerEmail),
      apiInstance.sendTransacEmail(adminAlertEmail)
    ]);

    return NextResponse.json({ success: true, message: 'Receipts sent successfully.' });
  } catch (error: any) {
    console.error('Email sending failed:', error);
    return NextResponse.json({ error: 'Failed to send emails' }, { status: 500 });
  }
}
