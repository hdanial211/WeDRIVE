import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const FROM_EMAIL = "WeDRIVE <noreply@wedrive.website>";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { to_email, customer_name, status, rejection_reason } = await req.json();

    if (!to_email || !status) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: to_email, status" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const loginUrl = "https://wedrive.website/account/pages/login/login.html";
    const profileUrl = "https://wedrive.website/account/pages/complete-profile/complete-profile.html";
    const name = customer_name || "Customer";

    let subject: string;
    let htmlContent: string;

    if (status === "approved") {
      subject = "WeDRIVE - Your Account Has Been Verified!";
      htmlContent = `
<div style="font-family: 'Inter', Arial, sans-serif; font-size: 16px; background-color: #f7f9fb; padding: 40px 20px;">
  <div style="max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden;">
    <div style="background: linear-gradient(135deg, #1E293B, #1D4ED8); padding: 32px; text-align: center;">
      <h1 style="color: #ffffff; font-size: 24px; margin: 0;">WeDRIVE</h1>
      <p style="color: #93C5FD; font-size: 13px; margin-top: 4px;">AI-Powered Car Rental System</p>
    </div>
    <div style="padding: 32px; text-align: center;">
      <table width="56" height="56" cellpadding="0" cellspacing="0" border="0" align="center" style="margin: 0 auto 20px auto;">
        <tr><td align="center" valign="middle" style="width: 56px; height: 56px; border-radius: 50%; background-color: #D1FAE5;">
          <span style="font-size: 28px; color: #059669;">&#10003;</span>
        </td></tr>
      </table>
      <h2 style="color: #1E293B; font-size: 20px; margin-bottom: 16px;">Account Verified!</h2>
      <p style="color: #475569; line-height: 1.7; text-align: left;">Hi ${name},</p>
      <p style="color: #475569; line-height: 1.7; text-align: left;">Great news! Your identity documents have been reviewed and approved. Your WeDRIVE account is now fully verified. You can start booking cars immediately.</p>
      <table cellpadding="0" cellspacing="0" border="0" align="center" style="margin: 28px auto;">
        <tr><td align="center" style="background-color: #0058be; border-radius: 10px;">
          <a href="${loginUrl}" style="display: inline-block; padding: 12px 32px; color: #ffffff; text-decoration: none; font-weight: 700; font-size: 14px;">Login Now</a>
        </td></tr>
      </table>
      <p style="color: #94A3B8; font-size: 13px;">Thank you for choosing WeDRIVE.</p>
    </div>
  </div>
</div>`;
    } else {
      subject = "WeDRIVE - Document Verification Update";
      const reason = rejection_reason || "Documents could not be verified. Please ensure your IC and Driving License are clear and valid.";
      htmlContent = `
<div style="font-family: 'Inter', Arial, sans-serif; font-size: 16px; background-color: #f7f9fb; padding: 40px 20px;">
  <div style="max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden;">
    <div style="background: linear-gradient(135deg, #1E293B, #1D4ED8); padding: 32px; text-align: center;">
      <h1 style="color: #ffffff; font-size: 24px; margin: 0;">WeDRIVE</h1>
      <p style="color: #93C5FD; font-size: 13px; margin-top: 4px;">AI-Powered Car Rental System</p>
    </div>
    <div style="padding: 32px; text-align: center;">
      <table width="56" height="56" cellpadding="0" cellspacing="0" border="0" align="center" style="margin: 0 auto 20px auto;">
        <tr><td align="center" valign="middle" style="width: 56px; height: 56px; border-radius: 50%; background-color: #FEE2E2;">
          <span style="font-size: 28px; color: #DC2626;">&#10007;</span>
        </td></tr>
      </table>
      <h2 style="color: #1E293B; font-size: 20px; margin-bottom: 16px;">Documents Not Approved</h2>
      <p style="color: #475569; line-height: 1.7; text-align: left;">Hi ${name},</p>
      <p style="color: #475569; line-height: 1.7; text-align: left;">We've reviewed your submitted documents and unfortunately, they could not be verified at this time.</p>
      <div style="background: #FEF2F2; border: 1px solid #FECACA; border-radius: 10px; padding: 14px 18px; margin: 16px 0; text-align: left;">
        <p style="color: #991B1B; font-size: 14px; margin: 0;"><strong>Reason:</strong> ${reason}</p>
      </div>
      <p style="color: #475569; line-height: 1.7; text-align: left;">Please log in and re-upload your IC and Driving License documents.</p>
      <table cellpadding="0" cellspacing="0" border="0" align="center" style="margin: 28px auto;">
        <tr><td align="center" style="background-color: #DC2626; border-radius: 10px;">
          <a href="${profileUrl}" style="display: inline-block; padding: 12px 32px; color: #ffffff; text-decoration: none; font-weight: 700; font-size: 14px;">Re-upload Documents</a>
        </td></tr>
      </table>
      <p style="color: #94A3B8; font-size: 13px;">Thank you for your patience.</p>
    </div>
  </div>
</div>`;
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
