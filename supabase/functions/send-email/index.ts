import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const FROM_EMAIL = "WeDRIVE <noreply@wedrive.website>";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function wedriveBrand() {
  return `<div style="background: linear-gradient(135deg, #1E293B, #1D4ED8); padding: 28px 32px; text-align: center;">
    <h1 style="color: #ffffff; font-size: 22px; margin: 0; font-weight: 800; letter-spacing: -0.5px;">WeDRIVE</h1>
    <p style="color: #93C5FD; font-size: 12px; margin-top: 4px;">AI-Powered Car Rental System</p>
  </div>`;
}

function wrapEmail(body: string) {
  return `<div style="font-family: 'Inter', Arial, sans-serif; font-size: 15px; background-color: #f7f9fb; padding: 36px 20px;">
  <div style="max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden;">
    ${wedriveBrand()}
    <div style="padding: 28px 32px;">
      ${body}
    </div>
    <div style="background: #F8FAFC; border-top: 1px solid #E2E8F0; padding: 16px 32px; text-align: center;">
      <p style="color: #94A3B8; font-size: 12px; margin: 0;">WeDRIVE - Smart Car Rental, Melaka &bull; <a href="https://wedrive.website" style="color: #3B82F6;">wedrive.website</a></p>
    </div>
  </div>
</div>`;
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { to_email, customer_name, status, rejection_reason, booking } = body;

    if (!to_email || !status) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: to_email, status" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const loginUrl = "https://wedrive.website/account/pages/login/login.html";
    const profileUrl = "https://wedrive.website/account/pages/complete-profile/complete-profile.html";
    const myBookingsUrl = "https://wedrive.website/customer/pages/my-bookings/my-bookings.html";
    const name = customer_name || "Customer";

    let subject: string;
    let htmlContent: string;

    // ── Booking Confirmation ──────────────────────────────────────────────────
    if (status === "booking_confirmed") {
      const bk = booking || {};
      const isDeposit = bk.payment_type === "deposit";
      const payLabel = isDeposit ? "Deposit Paid" : "Full Payment";
      const amountPaid = isDeposit ? (bk.deposit_amount || 0) : (bk.total || 0);
      const balanceDue = bk.balance_amount || 0;

      subject = `WeDRIVE - Booking Confirmed: #${bk.booking_id || ''}`;
      htmlContent = wrapEmail(`
        <div style="text-align:center;margin-bottom:24px;">
          <div style="width:56px;height:56px;border-radius:50%;background:#D1FAE5;display:flex;align-items:center;justify-content:center;margin:0 auto 12px auto;">
            <span style="font-size:28px;color:#059669;">&#10003;</span>
          </div>
          <h2 style="color:#1E293B;font-size:20px;margin:0 0 6px;">Booking Confirmed!</h2>
          <p style="color:#64748B;font-size:14px;margin:0;">Your car rental is all set.</p>
        </div>
        <p style="color:#475569;line-height:1.7;">Hi ${name},</p>
        <p style="color:#475569;line-height:1.7;">Your booking has been confirmed. Here is your receipt summary:</p>

        <div style="background:#F1F5F9;border-radius:12px;padding:18px;margin:16px 0;">
          <table style="width:100%;border-collapse:collapse;font-size:14px;">
            <tr><td style="padding:5px 0;color:#64748B;">Booking ID</td><td style="font-weight:700;text-align:right;">#${bk.booking_id || '--'}</td></tr>
            <tr><td style="padding:5px 0;color:#64748B;">Vehicle</td><td style="font-weight:700;text-align:right;">${bk.car || '--'}</td></tr>
            <tr><td style="padding:5px 0;color:#64748B;">Pick-up</td><td style="font-weight:700;text-align:right;">${bk.start_date || '--'}</td></tr>
            <tr><td style="padding:5px 0;color:#64748B;">Return</td><td style="font-weight:700;text-align:right;">${bk.end_date || '--'}</td></tr>
            <tr><td style="padding:5px 0;color:#64748B;">Duration</td><td style="font-weight:700;text-align:right;">${bk.days || '--'} day(s)</td></tr>
            <tr><td style="padding:5px 0;color:#64748B;">Payment Type</td><td style="font-weight:700;text-align:right;color:${isDeposit ? '#D97706' : '#059669'};">${payLabel}</td></tr>
            <tr style="border-top:1px solid #E2E8F0;">
              <td style="padding:10px 0 5px;font-weight:700;">Amount Paid (Today)</td>
              <td style="font-weight:800;text-align:right;font-size:16px;color:#1E293B;">RM ${Number(amountPaid).toFixed(2)}</td>
            </tr>
            ${isDeposit && balanceDue > 0 ? `<tr><td style="padding:5px 0;color:#D97706;font-weight:600;">Balance on Pickup</td><td style="font-weight:700;text-align:right;color:#D97706;">RM ${Number(balanceDue).toFixed(2)}</td></tr>` : ''}
          </table>
        </div>

        ${isDeposit ? `<div style="background:#FEF3C7;border:1px solid #FDE68A;border-radius:10px;padding:12px 16px;margin-bottom:16px;">
          <p style="color:#92400E;font-size:13px;margin:0;"><strong>Reminder:</strong> Please bring the remaining balance of <strong>RM ${Number(balanceDue).toFixed(2)}</strong> when you pick up the car.</p>
        </div>` : ''}

        <div style="text-align:center;margin:24px 0;">
          <a href="${myBookingsUrl}" style="display:inline-block;padding:12px 32px;background:#1D4ED8;color:#fff;text-decoration:none;font-weight:700;font-size:14px;border-radius:10px;">View My Bookings</a>
        </div>
        <p style="color:#94A3B8;font-size:13px;text-align:center;">Thank you for choosing WeDRIVE. See you soon!</p>
      `);

    // ── Booking Reminder ──────────────────────────────────────────────────────
    } else if (status === "booking_reminder") {
      const bk = booking || {};
      const isDeposit = bk.payment_type === "deposit";
      const balanceDue = bk.balance_amount || 0;

      subject = `WeDRIVE - Pickup Reminder: Your car is ready tomorrow!`;
      htmlContent = wrapEmail(`
        <div style="text-align:center;margin-bottom:24px;">
          <div style="width:56px;height:56px;border-radius:50%;background:#DBEAFE;display:flex;align-items:center;justify-content:center;margin:0 auto 12px auto;">
            <span style="font-size:28px;">&#128663;</span>
          </div>
          <h2 style="color:#1E293B;font-size:20px;margin:0 0 6px;">Your Trip is Tomorrow!</h2>
          <p style="color:#64748B;font-size:14px;margin:0;">Get ready for your WeDRIVE experience.</p>
        </div>
        <p style="color:#475569;line-height:1.7;">Hi ${name},</p>
        <p style="color:#475569;line-height:1.7;">This is a friendly reminder that your car rental begins <strong>tomorrow</strong>. Here is a quick summary:</p>
        <div style="background:#F1F5F9;border-radius:12px;padding:18px;margin:16px 0;">
          <table style="width:100%;border-collapse:collapse;font-size:14px;">
            <tr><td style="padding:5px 0;color:#64748B;">Booking ID</td><td style="font-weight:700;text-align:right;">#${bk.booking_id || '--'}</td></tr>
            <tr><td style="padding:5px 0;color:#64748B;">Vehicle</td><td style="font-weight:700;text-align:right;">${bk.car || '--'}</td></tr>
            <tr><td style="padding:5px 0;color:#64748B;">Pick-up Date</td><td style="font-weight:700;text-align:right;">${bk.start_date || '--'}</td></tr>
            <tr><td style="padding:5px 0;color:#64748B;">Pick-up Location</td><td style="font-weight:700;text-align:right;">${bk.pickup || 'Melaka Sentral'}</td></tr>
            <tr><td style="padding:5px 0;color:#64748B;">Return Date</td><td style="font-weight:700;text-align:right;">${bk.end_date || '--'}</td></tr>
          </table>
        </div>
        ${isDeposit && balanceDue > 0 ? `<div style="background:#FEF3C7;border:1px solid #FDE68A;border-radius:10px;padding:12px 16px;margin-bottom:16px;">
          <p style="color:#92400E;font-size:13px;margin:0;"><strong>Action Required:</strong> Please bring the remaining balance of <strong>RM ${Number(balanceDue).toFixed(2)}</strong> upon collection.</p>
        </div>` : ''}
        <p style="color:#475569;font-size:14px;">Please ensure you bring your IC and driving licence for verification at pickup.</p>
        <p style="color:#94A3B8;font-size:13px;text-align:center;">Safe travels from the WeDRIVE team!</p>
      `);

    // ── Refund Notification ──────────────────────────────────────────────────
    } else if (status === "refund_processed") {
      const bk = booking || {};
      subject = `WeDRIVE - Refund Processed for Booking #${bk.booking_id || ''}`;
      htmlContent = wrapEmail(`
        <div style="text-align:center;margin-bottom:24px;">
          <div style="width:56px;height:56px;border-radius:50%;background:#D1FAE5;display:flex;align-items:center;justify-content:center;margin:0 auto 12px auto;">
            <span style="font-size:24px;color:#059669;">&#9166;</span>
          </div>
          <h2 style="color:#1E293B;font-size:20px;margin:0 0 6px;">Refund Processed</h2>
        </div>
        <p style="color:#475569;line-height:1.7;">Hi ${name},</p>
        <p style="color:#475569;line-height:1.7;">We have processed your refund for Booking <strong>#${bk.booking_id || '--'}</strong>.</p>
        <div style="background:#F0FDF4;border:1px solid #BBF7D0;border-radius:12px;padding:18px;margin:16px 0;text-align:center;">
          <div style="color:#064E3B;font-size:13px;margin-bottom:6px;">Refund Amount</div>
          <div style="color:#059669;font-size:28px;font-weight:800;">RM ${Number(bk.refund_amount || 0).toFixed(2)}</div>
          <div style="color:#6EE7B7;font-size:12px;margin-top:4px;">${bk.payment_type === 'deposit' ? '50% of deposit paid' : '85% of full payment'}</div>
        </div>
        <p style="color:#475569;font-size:14px;">The refund will be credited to your original payment method within 5-10 business days.</p>
        <p style="color:#94A3B8;font-size:13px;text-align:center;">We hope to see you again soon at WeDRIVE.</p>
      `);

    // ── Document Approved ─────────────────────────────────────────────────────
    } else if (status === "approved") {
      subject = "WeDRIVE - Your Account Has Been Verified!";
      htmlContent = wrapEmail(`
        <div style="text-align:center;margin-bottom:24px;">
          <div style="width:56px;height:56px;border-radius:50%;background:#D1FAE5;display:flex;align-items:center;justify-content:center;margin:0 auto 12px auto;">
            <span style="font-size:28px;color:#059669;">&#10003;</span>
          </div>
          <h2 style="color:#1E293B;font-size:20px;margin:0 0 6px;">Account Verified!</h2>
        </div>
        <p style="color:#475569;line-height:1.7;">Hi ${name},</p>
        <p style="color:#475569;line-height:1.7;">Your identity documents have been reviewed and approved. Your WeDRIVE account is now fully verified and you can start booking cars immediately.</p>
        <div style="text-align:center;margin:24px 0;">
          <a href="${loginUrl}" style="display:inline-block;padding:12px 32px;background:#1D4ED8;color:#fff;text-decoration:none;font-weight:700;font-size:14px;border-radius:10px;">Login Now</a>
        </div>
        <p style="color:#94A3B8;font-size:13px;text-align:center;">Thank you for choosing WeDRIVE.</p>
      `);

    // ── Document Rejected ─────────────────────────────────────────────────────
    } else {
      subject = "WeDRIVE - Document Verification Update";
      const reason = rejection_reason || "Documents could not be verified. Please ensure your IC and Driving License are clear and valid.";
      htmlContent = wrapEmail(`
        <div style="text-align:center;margin-bottom:24px;">
          <div style="width:56px;height:56px;border-radius:50%;background:#FEE2E2;display:flex;align-items:center;justify-content:center;margin:0 auto 12px auto;">
            <span style="font-size:28px;color:#DC2626;">&#10007;</span>
          </div>
          <h2 style="color:#1E293B;font-size:20px;margin:0 0 6px;">Documents Not Approved</h2>
        </div>
        <p style="color:#475569;line-height:1.7;">Hi ${name},</p>
        <p style="color:#475569;line-height:1.7;">We've reviewed your submitted documents and unfortunately they could not be verified at this time.</p>
        <div style="background:#FEF2F2;border:1px solid #FECACA;border-radius:10px;padding:14px 18px;margin:16px 0;">
          <p style="color:#991B1B;font-size:14px;margin:0;"><strong>Reason:</strong> ${reason}</p>
        </div>
        <p style="color:#475569;line-height:1.7;">Please log in and re-upload your IC and Driving License documents.</p>
        <div style="text-align:center;margin:24px 0;">
          <a href="${profileUrl}" style="display:inline-block;padding:12px 32px;background:#DC2626;color:#fff;text-decoration:none;font-weight:700;font-size:14px;border-radius:10px;">Re-upload Documents</a>
        </div>
        <p style="color:#94A3B8;font-size:13px;text-align:center;">Thank you for your patience.</p>
      `);
    }

    // Send via Resend API
    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [to_email],
        subject: subject,
        html: htmlContent,
      }),
    });

    const resendData = await resendRes.json();

    if (!resendRes.ok) {
      console.error("[send-email] Resend error:", resendData);
      return new Response(
        JSON.stringify({ success: false, error: resendData.message || "Email send failed" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("[send-email] Sent", status, "email to", to_email, "id:", resendData.id);
    return new Response(
      JSON.stringify({ success: true, id: resendData.id }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (err) {
    console.error("[send-email] Error:", err);
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
